/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable }                                                  from '@angular/core';
import { forkJoin, Observable, of, throwError }                        from 'rxjs';
import { switchMap, tap }                                              from 'rxjs/operators';
import { DelegationService }                                           from '../delegation/delegation.service';
import { LoggerService }                                               from '../common/logger.service';
import { CryptoService, EncryptedPayload, SerializedEncryptedPayload } from '../crypto/crypto.service';
import { StaticConversion }                                            from '../crypto/static-conversion.class';
import { Mumble }                                                      from '../delegation/socket/delegation.mumble.class';
import { MumblerConfigService }                                        from '../config/mumbler-config.service';
import { MumblerService }                                              from '../mumbler/mumbler.service';
import { MumblerId }                                                   from '../types/mumbler-id.type';
import { DelegateToInfo }                                              from '../delegation/delegation/delegate-to-info.class';
import { AppsMessage }                                                 from '../../../apps/apps-message.abstract';

@Injectable( {
    providedIn: 'root'
} )
export class MumbleService {

    public constructor(
        private readonly _cryptoService: CryptoService,
        private readonly _delegationService: DelegationService,
        private readonly _mumblerService: MumblerService,
        private readonly _mumblerConfigService: MumblerConfigService,
        private readonly _loggerService: LoggerService
    ) {}

    public createNewMumble( delegateTo: string, message: AppsMessage, files: Array< Uint8Array > = null ): Observable< Mumble > {

        this._loggerService.debug( `Creating new mumble to "${ delegateTo }"`, 'MessagesService' );

        const mumble: Mumble = new Mumble( this._mumblerConfigService.mumblerId, delegateTo );

        return this.getDelegateToInfo( delegateTo ).pipe(

            tap( ( delegateToInfo: DelegateToInfo ) => {

                // Seems more convenient to add the delegation info to the mumble
                mumble.delegateToInfo = delegateToInfo;

            } ),

            tap( () => this._loggerService.debug( `Successfully created mumble to "${ delegateTo }"`, 'MessagesService' ) ),

            switchMap( () => this.prepareMessage( mumble, message, files ) ),

            tap( () => this._loggerService.debug( `Successfully mumbled payload content (+files) of mumble to "${ delegateTo }"`, 'MessagesService' ) ),

            tap( () => this._loggerService.verbose( `Mumble to "${ delegateTo }" is ready for delegation`, 'MessagesService' ) ),

        );

    }

    public decryptMumbleContent( mumble: Mumble ): Observable< string > {

        if ( !!! mumble ) {

            return throwError( new Error( 'No mumble message to decrypt' ) );

        }

        this._loggerService.debug( `Starting to decrypt mumble content`, 'MessagesService' );

        return of( mumble.transmitPayload.payload ).pipe(

		    switchMap( ( content: SerializedEncryptedPayload ) => this._cryptoService.decryptBuffer( SerializedEncryptedPayload.ConvertToEncryptedPayload( content ) ) ),

            switchMap( ( payload: ArrayBuffer ) => of( StaticConversion.ConvertBufferToString( payload ) ) )

        );

    }

    public decryptMumbleFile( mumble: Mumble, index: number ): Observable< Blob > {

        if ( !!! mumble ) {

            return throwError( new Error( 'No mumble message to decrypt' ) );

        }

        if ( index < 0 || index >= mumble.transmitPayload.files.length ) {

            return throwError( new Error( `File[ ${ index } ] does not exist` ) );

        }

        this._loggerService.debug( `Starting to decrypt mumble content`, 'MessagesService' );

        return of( mumble.transmitPayload.files[ index ] ).pipe(

            switchMap( ( file: SerializedEncryptedPayload ) => this._cryptoService.decryptBuffer( SerializedEncryptedPayload.ConvertToEncryptedPayload( file ) ) ),

            switchMap( ( payload: ArrayBuffer ) => {

                try {

                    const blob: Blob = new Blob( [ payload ] );

                    this._loggerService.debug( `Successfully create blob for file[ ${ index } ] object`, 'MessagesService' );

                    return of( blob );

                } catch ( e ) {

                    this._loggerService.warn( `Unable to create blob from file[ ${ index } ]`, 'MessagesService' );

                }

            } )

        );

    }


    public getDelegateToInfo( delegateTo: MumblerId ): Observable< DelegateToInfo > {

        this._loggerService.debug( `Starting to query delegateTo info`, 'MessagesService' );

        return this._mumblerService.delegateToInfo( delegateTo ).pipe(

            tap( () => this._loggerService.debug( `Successfully queried delegateTo info`, 'MessagesService' ) )

        );

    }

    public listen(): Observable< Mumble > {

        return this._delegationService.openSocket().pipe(

            tap( () => this._loggerService.debug( `Received channel message`, 'MessagesService' ) )

        );

    }

    public sendMumble( mumble: Mumble ): Observable< never > {

	    if (
	        !!! mumble ||
            !!! mumble.transmitPayload ||
            !!! mumble.transmitPayload.delegateTo ||
            !!! mumble.transmitPayload.payload
        ) {

	        return throwError( 'mumble not valid' );

        }

	    return this._delegationService.sendMumble( mumble );

    }

    // public setMumbleContent( mumble: Mumble, delegateToInfo: DelegateToInfo, payload: string, topicId: string = null, index: number = 0 ): Observable< Mumble > {
    //
    // 	if ( !!! mumble || !!! delegateToInfo || !!! payload ) {
    //
    // 		return throwError( 'Mumble is not initialized.' );
    //
    // 	}
    //
    // 	return this._cryptoService.importPublicKey( delegateToInfo.public ).pipe(
    //
    // 		switchMap( ( delegateToKey: CryptoKey ) => this._cryptoService.encryptPayload( delegateToKey, StaticConversion.ConvertStringToBuffer( payload ) ) ),
    //
    // 		switchMap( ( encryptedPayload: EncryptedPayload ) => {
    //
    // 		    // TODO: Implement decision process about sub-class AppsMessage
    // 			mumble.transmitPayload = new TransmitPayload( delegateToInfo.mumblerId, new AppsDakMessage( topicId, encryptedPayload, null, index ) );
    //
    // 			return of( mumble );
    //
    // 		} )
    // 	);
    //
    // }

    public stop(): Observable< never > {

	    return this._delegationService.closeSocket();

    }

    // // noinspection JSMethodCanBeStatic
    // private unwrapEncryptedPayload( payload: string ): Observable< EncryptedPayload > {
    //
    //     type RawPayloadContainer = { iv: string, data: string, key: string };
    //
    //     const raw: RawPayloadContainer = JSON.parse( payload ) as RawPayloadContainer;
    //
    //     return of( new EncryptedPayload(
    //     	StaticConversion.ConvertBase64ToBuffer( raw.data ),
    //     	StaticConversion.ConvertBase64ToBuffer( raw.iv ),
    //     	StaticConversion.ConvertBase64ToBuffer( raw.key )
    //     ) );
    //
    // }
    //
    // // noinspection JSMethodCanBeStatic
    // private wrapEncryptedPayload( encryptedPayload: EncryptedPayload ): Observable< string > {
    //
    //     const iv: string = StaticConversion.ConvertBufferToBase64( encryptedPayload.iv );
    //     const data: string = StaticConversion.ConvertBufferToBase64( encryptedPayload.data );
    //     const key: string = StaticConversion.ConvertBufferToBase64( encryptedPayload.key );
    //
    //     return of( JSON.stringify(
    //
    // 		{ iv, data, key }
    //
    // 	) );
    //
    // }

    private prepareMessage( mumble: Mumble, message: AppsMessage, files: Array< Uint8Array > = null ): Observable< Mumble > {

	    return this._cryptoService.importPublicKey( mumble.delegateToInfo.public ).pipe(

            switchMap( ( cryptoKey: CryptoKey ) => forkJoin( [

                this._cryptoService.encryptPayload( cryptoKey, StaticConversion.ConvertStringToBuffer( JSON.stringify( message ) ) ),

                !! files && files.length > 0 ? of( files ).pipe(

                    switchMap( ( files: Array< Uint8Array > ) => forkJoin( files.map( ( file: Uint8Array ) => this._cryptoService.encryptPayload( cryptoKey, file ) ) ) )

                ) : of( [] )

            ] ) ),

            switchMap( ( encryptedPayload: [ EncryptedPayload, Array< EncryptedPayload > ] ) => {

                mumble.transmitPayload.payload = SerializedEncryptedPayload.ConvertToSerializedEncryptedPayload( encryptedPayload[ 0 ] );

                if ( encryptedPayload[ 1 ].length > 0  ) {

                    mumble.transmitPayload.files = encryptedPayload[ 1 ].map(
                        ( encryptedPayload: EncryptedPayload ) => SerializedEncryptedPayload.ConvertToSerializedEncryptedPayload( encryptedPayload )
                    );

                }

                return of( mumble );

            } )

        );

    }

}
