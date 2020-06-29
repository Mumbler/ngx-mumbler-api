/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { CryptoKeyPairString, CryptoService, EncryptedPayload } from './crypto.service';
import {
	CommunicationParameter,
	communicationParameterInjectionToken,
	CryptoCommunicationParameter,
	ExtendedCommunicationParameter
} from '../../common/communication-parameter.class';
import { AppService } from '../../../../app.service';
import { convertStringToUuidHexString } from '../../common/common.types';
import { switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable, of } from 'rxjs';
import { LogLevel } from '../common/logger.enum';
import { TestBed } from '@angular/core/testing';

describe( 'CryptoService', () => {

	let privateKey: CryptoKey = null;
	let publicKey: CryptoKey = null;
	let communicationParameter: CommunicationParameter = null;
	let service: CryptoService = null;

	const factory: ( appService: AppService )=> Observable< CommunicationParameter > = ( appService: AppService ) => {

		const extConfig: ExtendedCommunicationParameter = new ExtendedCommunicationParameter();

		extConfig.logLevel = appService.logLevel;
		extConfig.debugMode = appService.debugMode;

		//         const pem: PemParser = new PemParser( `-----BEGIN RSA PRIVATE KEY-----
		// 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
		// -----END RSA PRIVATE KEY-----` );

		const algorithm: RsaHashedKeyGenParams = {
			name: 'RSA-OAEP',
			hash: 'SHA-512',
			modulusLength: 4096,
			publicExponent: new Uint8Array( [ 1, 0, 1 ] )
		};

		return fromPromise(

			crypto.subtle.generateKey(
				algorithm,
				true,
				[ 'encrypt', 'decrypt' ]
			)

		).pipe(

			tap( ( keys: CryptoKeyPair ) => {

				privateKey = keys.privateKey;
				publicKey = keys.publicKey;

			} ),

			switchMap( ( keys: CryptoKeyPair ) => fromPromise(

				crypto.subtle.exportKey( 'pkcs8', keys.privateKey )

			) ),

			switchMap( ( key: ArrayBuffer ) => {

				const cryptoConfig: CryptoCommunicationParameter = new CryptoCommunicationParameter();

				cryptoConfig.privateKey = new Uint8Array( key );
				cryptoConfig.totpKey = crypto.getRandomValues( new Uint8Array( 256 ) );

				return of( cryptoConfig );

			} ),

			switchMap( ( cryptoConfig: CryptoCommunicationParameter ) => of(

				new CommunicationParameter(

					convertStringToUuidHexString( appService.channelId ),
					cryptoConfig,
					extConfig

				)

			) ),

			tap( () => console.debug( 'Init CommunicationParameter done' ) )

		);

	};

	beforeAll( ( done: DoneFn ) => {

	    const appService: AppService = new AppService();

	    appService.logLevel = LogLevel.ALL;
	    appService.debugMode = true;
	    appService.channelId = '123';

	    factory( appService ).subscribe( ( config: CommunicationParameter ) => {

	        communicationParameter = config;
	        done();

		} );

	} );

	beforeEach( () => {

		TestBed.configureTestingModule( {
			providers: [
				{
					provide: communicationParameterInjectionToken,
					deps: [
						AppService
					],
					useValue: communicationParameter
				}
			]
		} );

		service = TestBed.inject( CryptoService );

	} );

	it( 'should be created', () => {

		return expect( service ).toBeTruthy();

	} );

	it( 'should have private key', () => {

	    return expect( privateKey ).toBeDefined();

	} );

	it( 'should have public key', () => {

	    return expect( publicKey ).toBeDefined();

	} );

	it( 'should create smallest possible random bytes buffer', () => {

	    const buffer: Uint8Array = service.randomBytes( 16 );

	    expect( buffer ).toBeDefined();
	    expect( buffer.length ).toBeDefined();
	    expect( buffer.length ).toBe( 16 );

	} );

	it( 'should create big random bytes buffer', () => {

		const buffer: Uint8Array = service.randomBytes( 1024 * 1024 * 10 );    // 10 MB

		expect( buffer ).toBeDefined();
		expect( buffer.length ).toBeDefined();
		expect( buffer.length ).toBe( 1024 * 1024 * 10 );

	} );

	it( 'should create entropy aware small random bytes buffer', () => {

		const buffer: Uint8Array = service.randomBytes( 120 );    // illegal amount of bytes

		expect( buffer ).toBeDefined();
		expect( buffer.length ).toBeDefined();
		expect( buffer.length ).toBe( 112 );     // => should be truncated to 112 bytes

	} );


	it( 'should create entropy (too small) aware random bytes buffer', () => {

		const buffer: Uint8Array = service.randomBytes( 15 );    // illegal amount of bytes

		expect( buffer ).toBeDefined();
		expect( buffer.length ).toBeDefined();
		expect( buffer.length ).toBe( 16 );     // => should be expanded to 16 bytes

	} );

	it( 'should decrypt an buffer', ( done: DoneFn ) => {

	    const payload: Uint8Array = new Uint8Array( 256 );

	    crypto.getRandomValues( payload );

	    fromPromise(

	        crypto.subtle.encrypt(
				{ name: 'RSA-OAEP' } as RsaOaepParams,
				publicKey,
				payload
			)

		).pipe(

			tap( ( encrypted: ArrayBuffer ) => expect( encrypted ).toBeDefined() ),

			switchMap( ( encrypted: ArrayBuffer ) => service.decrypt( encrypted ) ),

			tap( ( decrypted: ArrayBuffer ) =>  expect( decrypted ).toBeDefined() ),

			tap( ( decrypted: ArrayBuffer ) =>  expect( new Uint8Array( decrypted ) ).toEqual( payload ) ),

		).subscribe( done );

	} );

	it( 'should encrypt an buffer', ( done: DoneFn ) => {

		const payload: Uint8Array = new Uint8Array( 256 );

		crypto.getRandomValues( payload );

		service.encrypt( publicKey, payload ).pipe(

			tap( ( encrypted: ArrayBuffer ) => expect( encrypted ).toBeDefined() ),

			switchMap( ( encrypted: ArrayBuffer ) => fromPromise(

			    crypto.subtle.decrypt(
					{ name: 'RSA-OAEP' } as RsaOaepParams,
					privateKey,
					encrypted
				)

			) ),

			tap( ( decrypted: ArrayBuffer ) =>  expect( decrypted ).toBeDefined() ),

			tap( ( decrypted: ArrayBuffer ) =>  expect( new Uint8Array( decrypted ) ).toEqual( payload ) ),

		).subscribe( done );

	} );

	it( 'should generate crypto keys', ( done: DoneFn ) => {

	    service.generateKeys().pipe(

	        switchMap( ( keys: CryptoKeyPair ) => fromPromise( Promise.all( [

				expect( keys ).toBeDefined(),
				expect( keys.privateKey ).toBeDefined(),
				expect( keys.privateKey ).toBeDefined()

			] ) ) ),

		).subscribe( done );

	} );

	it( 'should generate crypto keys and export private key', ( done: DoneFn ) => {

	    service.generateKeys().pipe(

	        switchMap( ( cryptoKeys: CryptoKeyPair ) => service.exportKeys( cryptoKeys ) ),

			switchMap( ( exportedKeys: CryptoKeyPairString ) => fromPromise( Promise.all( [

				expect( exportedKeys ).toBeDefined(),
				expect( exportedKeys.privateKey ).toBeDefined(),
				expect( exportedKeys.publicKey ).toBeDefined()

			] ) ) )

		).subscribe( done );

	} );

	it( 'should encrypt a payload', ( done: DoneFn ) => {

		const payload: Uint8Array = service.randomBytes( 1024 * 1024 );  // 1 MB

		service.encryptPayload( publicKey, payload ).pipe(

			tap( ( encryptedPayload: EncryptedPayload ) => {

				expect( encryptedPayload ).toBeDefined();
				expect( encryptedPayload.iv ).toBeDefined();
				expect( encryptedPayload.key ).toBeDefined();
				expect( encryptedPayload.data ).toBeDefined();

			} ),

			switchMap( ( encryptedPayload: EncryptedPayload ) => service.decryptBuffer( encryptedPayload ) ),

			tap( ( decrypted: Uint8Array ) => {

				expect( decrypted ).toBeDefined();
				expect( decrypted ).toEqual( payload );

			} )

		).subscribe( done );

	} );

} );
