/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable }                           from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap }           from 'rxjs/operators';
import { LoggerService }                        from '../common/logger.service';
import { fromPromise }                          from 'rxjs/internal-compatibility';
import { StaticConversion }                     from './static-conversion.class';
import { CryptoConfigService }                  from '../config/crypto-config.service';
import { TotpClass }                            from './totp.class';

export type CryptoKeyPairString = { publicKey: string, privateKey: string };

enum CryptoKeyType {

    unknown,
    pkcs8,
    totp

}

export class EncryptedPayload {

    public data: Uint8Array;
    public iv: Uint8Array;
    public key: Uint8Array;

    public constructor( data: Uint8Array, iv: Uint8Array, key: Uint8Array ) {

        this.data = data;
        this.iv = iv;
        this.key = key;

    }

    public static IsValid( payload: EncryptedPayload ): boolean {

        return !! payload &&
            !! payload.iv && payload.iv.byteLength > 0 &&
            !! payload.key && payload.key.byteLength > 0 &&
            !! payload.data && payload.data.byteLength > 0
        ;

    }

}

export class SerializedEncryptedPayload {

    public data: string;
    public iv: string;
    public key: string;

    public constructor( data: string, iv: string, key: string ) {

        this.data = data;
        this.iv = iv;
        this.key = key;

    }

    public static ConvertToEncryptedPayload( serialized: SerializedEncryptedPayload ): EncryptedPayload {

        return new EncryptedPayload(
            StaticConversion.ConvertBase64ToBuffer( serialized.data ),
            StaticConversion.ConvertBase64ToBuffer( serialized.iv ),
            StaticConversion.ConvertBase64ToBuffer( serialized.key )
        );

    }

    public static ConvertToSerializedEncryptedPayload( encryptedPayload: EncryptedPayload ): SerializedEncryptedPayload {

        return new SerializedEncryptedPayload(
            StaticConversion.ConvertBufferToBase64( encryptedPayload.data ),
            StaticConversion.ConvertBufferToBase64( encryptedPayload.iv ),
            StaticConversion.ConvertBufferToBase64( encryptedPayload.key )
        );

    }

}

@Injectable( {
    providedIn: 'root'
} )
export class CryptoService {

    private _privateKey: CryptoKey;
    private readonly _subtle: SubtleCrypto;

    public constructor(
        private readonly _loggerService: LoggerService,
        private readonly _cryptoConfigService: CryptoConfigService
    ) {

        if ( !!!window.crypto || !!!window.crypto.subtle ) {

            this._loggerService.fatal( `FATAL: Crypto interface not supported, aborting`, 'CryptoService' );
            throw new Error( 'FATAL: Crypto interface not supported, aborting' );

        }

        // Shortcut
        this._subtle = window.crypto.subtle;

    }

    public computeTotp(): Observable<string> {

        return this.getCryptoKey( CryptoKeyType.totp ).pipe(
            switchMap( ( totpKey: CryptoKey ) => new TotpClass( totpKey ).getToken() ),

            tap( () => this._loggerService.debug( `Successfully created totp`, 'CryptoService' ) )
        );

    }

    public decrypt( data: ArrayBuffer | Uint8Array ): Observable<ArrayBuffer> {

        return this.getCryptoKey( CryptoKeyType.pkcs8 ).pipe(
            switchMap( ( privateKey: CryptoKey ) => fromPromise(
                this._subtle.decrypt(
                    { name: this._cryptoConfigService.asynchronousAlgorithm },
                    privateKey,
                    data
                )
            ) ),

            tap( () => this._loggerService.debug( `Successfully decrypted data buffer`, 'CryptoService' ) )
        );

    }

    public decryptBuffer( encryptedPayload: EncryptedPayload ): Observable<Uint8Array> {

        const importSynchronousKey: ( keyData: ArrayBuffer )=> Observable<CryptoKey> = ( keyData: ArrayBuffer ) => {

            return fromPromise(
                this._subtle.importKey(
                    'raw',
                    keyData,
                    {
                        name: this._cryptoConfigService.synchronousAlgorithm,
                        length: this._cryptoConfigService.synchronousLength
                    },
                    false,
                    [ 'decrypt' ]
                )
            );

        };

        return this.decrypt( encryptedPayload.key ).pipe(
            switchMap( ( keyData: ArrayBuffer ) => importSynchronousKey( keyData ) ),

            switchMap( ( cryptoKey: CryptoKey ) => fromPromise(
                this._subtle.decrypt(
                    { name: this._cryptoConfigService.synchronousAlgorithm, iv: encryptedPayload.iv },
                    cryptoKey,
                    encryptedPayload.data
                )
            ) ),

            switchMap( ( buffer: ArrayBuffer ) => of( new Uint8Array( buffer ) ) ),

            tap( () => this._loggerService.debug( `Successfully decrypted payload buffer`, 'CryptoService' ) )
        );

    }

    public encrypt( recipientPublicKey: CryptoKey, payload: ArrayBuffer | Uint8Array ): Observable<Uint8Array> {

        return fromPromise(
            this._subtle.encrypt(
                { name: this._cryptoConfigService.asynchronousAlgorithm },
                recipientPublicKey,
                payload
            )
        ).pipe(
            switchMap( ( buffer: ArrayBuffer ) => of( new Uint8Array( buffer ) ) ),

            tap( () => this._loggerService.debug( `Successfully encrypted data buffer`, 'CryptoService' ) )
        );

    }

    public encryptPayload( recipientPublicKey: CryptoKey, payload: Uint8Array ): Observable<EncryptedPayload> {

        // TODO: Implement payload splitting for payload > e.g. 512KB

        const encryptSynchronous: ( iv: Uint8Array, key: CryptoKey )=> Observable<Uint8Array> = ( iv: Uint8Array, key: CryptoKey ) => {

            return fromPromise(
                this._subtle.encrypt(
                    {
                        name: this._cryptoConfigService.synchronousAlgorithm,
                        iv: iv
                    },
                    key,
                    payload
                )
            ).pipe(
                switchMap( ( buffer: ArrayBuffer ) => of( new Uint8Array( buffer ) ) )
            );

        };

        const encryptAsync: ( synchronousKey: CryptoKey )=> Observable<Uint8Array> = ( synchronousKey: CryptoKey ) => {

            return fromPromise(
                this._subtle.exportKey(
                    'raw',
                    synchronousKey
                )
            ).pipe(
                switchMap( ( keyData: ArrayBuffer ) => this.encrypt( recipientPublicKey, keyData ) )
            );

        };

        return forkJoin( [

            fromPromise(
                this._subtle.generateKey(
                    {
                        name: this._cryptoConfigService.synchronousAlgorithm,
                        length: this._cryptoConfigService.synchronousLength
                    },
                    true,
                    [ 'encrypt', 'decrypt' ]
                )
            ),
            of( this.randomBytes( 16 ) )

        ] ).pipe(
            switchMap( ( input: [ CryptoKey, Uint8Array ] ) => forkJoin( [

                encryptSynchronous( input[ 1 ], input[ 0 ] ),
                encryptAsync( input[ 0 ] ),
                of( input[ 1 ] )

            ] ) ),

            switchMap( ( input: [ Uint8Array, Uint8Array, Uint8Array ] ) => of( new EncryptedPayload( input[ 0 ], input[ 2 ], input[ 1 ] ) ) ),

            tap( () => this._loggerService.debug( `Successfully encrypted payload buffer`, 'CryptoService' ) )
        );

    }

    public exportKeys( keys: CryptoKeyPair ): Observable<CryptoKeyPairString> {

        return forkJoin(
            [
                fromPromise(
                    this._subtle.exportKey( 'pkcs8', keys.privateKey )
                ),
                fromPromise(
                    this._subtle.exportKey( 'spki', keys.publicKey )
                )
            ]
        ).pipe(
            switchMap( ( result: [ ArrayBuffer, ArrayBuffer ] ) => of( {

                privateKey: StaticConversion.ConvertBufferToBase64( new Uint8Array( result[ 0 ] ) ),
                publicKey: StaticConversion.ConvertBufferToBase64( new Uint8Array( result[ 1 ] ) )

            } ) )
        );

    }

    public generateKeys(): Observable<CryptoKeyPair> {

        const algorithm: RsaHashedKeyGenParams = {
            name: this._cryptoConfigService.asynchronousAlgorithm,
            hash: this._cryptoConfigService.hashAlgorithm,
            modulusLength: this._cryptoConfigService.asynchronousLength,
            publicExponent: this._cryptoConfigService.asynchronousPublicExponent
        };

        return fromPromise(
            this._subtle.generateKey(
                algorithm,
                true,
                [ 'encrypt', 'decrypt' ]
            )
        ).pipe(
            tap( ( keys: CryptoKeyPair ) => this._loggerService.debug(
                `Successfully created new CryptoKeys "${ keys.publicKey.type }" and "${ keys.privateKey.type }"`,
                'CryptoService' )
            )
        );

    }

    public importBondingTotpKey( key: string | Uint8Array ): Observable<CryptoKey> {

        return fromPromise(
            this._subtle.importKey(
                'raw',
                typeof key === 'string' ? StaticConversion.ConvertStringToBuffer( key ) : key,
                { name: this._cryptoConfigService.totpAlgorithm, hash: this._cryptoConfigService.hashAlgorithm },
                false,
                [ 'sign' ]
            )
        ).pipe(
            tap( () => this._loggerService.debug( `Successfully imported bonding totp key`, 'CryptoService' ) )
        );

    }

    public importPublicKey( keyData: ArrayBuffer ): Observable<CryptoKey> {

        return fromPromise(
            this._subtle.importKey(
                'spki',
                keyData,
                {
                    name: this._cryptoConfigService.asynchronousAlgorithm,
                    hash: this._cryptoConfigService.hashAlgorithm
                },
                false,
                [ 'encrypt' ]
            )
        ).pipe(
            tap( () => this._loggerService.debug( `Successfully imported public key`, 'CryptoService' ) )
        );

    }

    public randomBytes( bytes: number ): Uint8Array {

        const maxEntropy: number = 16;

        if ( bytes % maxEntropy !== 0 ) {

            if ( bytes < maxEntropy ) {

                console.warn( `Requested buffer length too small... adjusting to min size ${ maxEntropy }` );
                bytes = maxEntropy;

            } else {

                console.warn( `Buffer length must be modulo ${ maxEntropy }... cutting of` );
                bytes -= bytes % maxEntropy;

            }

        }

        const length: number = bytes > maxEntropy ? Math.ceil( bytes / maxEntropy ) : 1;
        const randomBuffer: Uint8Array = new Uint8Array( length * maxEntropy );

        for ( let index: number = 0; index < length; index++ ) {

            const randomBytes: Uint8Array = new Uint8Array( maxEntropy );

            crypto.getRandomValues( randomBytes );

            randomBuffer.set( randomBytes, index * maxEntropy );

        }

        return randomBuffer;

    }

    private getCryptoKey( type: CryptoKeyType ): Observable<CryptoKey> {

        let result: Observable<CryptoKey> = null;

        if ( CryptoKeyType.pkcs8 === type ) {

            result = !!this._privateKey ?
                of( this._privateKey ) :
                this.loadCryptoKey( this._cryptoConfigService.privateKey, type )
            ;

        } else if ( CryptoKeyType.totp === type ) {

            result = this.loadCryptoKey( this._cryptoConfigService.totpKey, type );

        } else {

            return throwError( 'Unknown CryptoKeyType' );

        }

        return result.pipe(
            tap( ( cryptoKey: CryptoKey ) => {

                // Only hold the private key... totp will change frequently
                if ( CryptoKeyType.pkcs8 === type ) {

                    this._privateKey = cryptoKey;

                }

            } )
        );

    }

    private loadCryptoKey( keyData: Uint8Array, type: CryptoKeyType ): Observable<CryptoKey> {

        let importKey: Observable<CryptoKey> = null;

        if ( type === CryptoKeyType.pkcs8 ) {

            importKey = fromPromise(
                this._subtle.importKey(
                    'pkcs8',
                    keyData,
                    {
                        name: this._cryptoConfigService.asynchronousAlgorithm,
                        hash: this._cryptoConfigService.hashAlgorithm
                    },
                    false,
                    [ 'decrypt' ]
                )
            );

        } else if ( type === CryptoKeyType.totp ) {

            if ( !!!this._cryptoConfigService.totpKey ) {

                // Create on fresh => need for initial authentication
                importKey = fromPromise(
                    this._subtle.generateKey(
                        {
                            name: this._cryptoConfigService.totpAlgorithm,
                            hash: this._cryptoConfigService.hashAlgorithm
                        },
                        false,
                        [ 'sign' ]
                    )
                );

            } else {

                importKey = this.decrypt( this._cryptoConfigService.totpKey ).pipe(
                    switchMap( ( totpKeyData: ArrayBuffer ) => fromPromise(
                        this._subtle.importKey(
                            'raw',
                            totpKeyData,
                            {
                                name: this._cryptoConfigService.totpAlgorithm,
                                hash: this._cryptoConfigService.hashAlgorithm
                            },
                            false,
                            [ 'sign' ]
                        )
                    ) )
                );

            }

        } else {

            return throwError( 'Error during CryptoKey import: CryptoKeyType undefined.' );

        }

        return importKey.pipe(
            tap( ( key: CryptoKey ) => this._loggerService.debug( `Successfully imported CryptoKey "${ key.type }"`, 'CryptoService' ) ),

            catchError( ( err: Error ) => {

                this._loggerService.error( `Unable to import CryptoKey "${ type }"`, 'CryptoService' );
                return throwError( err );

            } )
        );

    }

}
