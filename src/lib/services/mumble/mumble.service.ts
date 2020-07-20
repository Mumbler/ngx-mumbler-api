/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DelegationService } from '../delegation/delegation.service';
import { LoggerService } from '../common/logger.service';
import { CryptoService, EncryptedPayload } from '../crypto/crypto.service';
import { StaticConversion } from '../crypto/static-conversion.class';
import { Mumble } from '../delegation/socket/delegation.mumble.class';
import { MumblerConfigService } from '../config/mumbler-config.service';
import { MumblerService } from '../mumbler/mumbler.service';
import { MumblerId } from '../types/mumbler-id.type';
import { TransmitPayload } from './payload/tranmit.payload';
import { DelegateToInfo } from '../delegation/delegation/delegate-to-info.class';

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

	public createNewMumble( delegateTo: string ): Observable< Mumble > {

		this._loggerService.debug( `Creating new mumble to "${ delegateTo }"`, 'MessagesService' );

	    return of( new Mumble( this._mumblerConfigService.mumblerId, delegateTo ) ).pipe(

	        tap( () => this._loggerService.debug( `Successfully created mumble to "${ delegateTo }"`, 'MessagesService' ) )

		);

	}

	public decryptMumblePayload( mumble: Mumble ): Observable< string > {

		if ( !!! mumble ) {

			return throwError( new Error( 'No channel message to decrypt' ) );

		}

		this._loggerService.debug( `Starting to decrypt mumble payload`, 'MessagesService' );

		return this.unwrapEncryptedPayload( mumble.transmitPayload.payload ).pipe(

		    switchMap( ( unwrappedPayload: EncryptedPayload ) => this._cryptoService.decryptBuffer( unwrappedPayload ) ),

			switchMap( ( payload: ArrayBuffer ) => of( StaticConversion.ConvertBufferToString( payload ) ) )

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

	public sendMessage( mumble: Mumble ): Observable< never > {

	    if ( !!! mumble || !!! mumble.transmitPayload || !!! mumble.transmitPayload.delegateTo || !!! mumble.transmitPayload.payload ) {

	        return throwError( 'mumble not valid' );

		}

	    return this._delegationService.sendMumble( mumble );

	}

	public setMumblePayload( mumble: Mumble, delegateToInfo: DelegateToInfo, payload: string ): Observable< Mumble > {

		if ( !!! mumble || !!! delegateToInfo || !!! payload ) {

			return throwError( 'Mumble is not initialized.' );

		}

		return this._cryptoService.importPublicKey( delegateToInfo.public ).pipe(

			switchMap( ( delegateToKey: CryptoKey ) => this._cryptoService.encryptPayload( delegateToKey, StaticConversion.ConvertStringToBuffer( payload ) ) ),

			switchMap( ( encryptedPayload: EncryptedPayload ) => this.wrapEncryptedPayload( encryptedPayload ) ),

			switchMap( ( wrappedPayload: string ) => {

				mumble.transmitPayload = new TransmitPayload( delegateToInfo.mumblerId, wrappedPayload );

				return of( mumble );

			} )

		);

	}

	public stop(): Observable< never > {

	    return this._delegationService.closeSocket();

	}

	// noinspection JSMethodCanBeStatic
	private unwrapEncryptedPayload( payload: string ): Observable< EncryptedPayload > {

        type RawPayloadContainer = { iv: string, data: string, key: string };

        const raw: RawPayloadContainer = JSON.parse( payload ) as RawPayloadContainer;

        return of( new EncryptedPayload(
        	StaticConversion.ConvertBase64ToBuffer( raw.data ),
        	StaticConversion.ConvertBase64ToBuffer( raw.iv ),
        	StaticConversion.ConvertBase64ToBuffer( raw.key )
        ) );

	}

	// noinspection JSMethodCanBeStatic
	private wrapEncryptedPayload( encryptedPayload: EncryptedPayload ): Observable< string > {

	    const iv: string = StaticConversion.ConvertBufferToBase64( encryptedPayload.iv );
	    const data: string = StaticConversion.ConvertBufferToBase64( encryptedPayload.data );
	    const key: string = StaticConversion.ConvertBufferToBase64( encryptedPayload.key );

	    return of( JSON.stringify(

			{ iv, data, key }

		) );

	}

}
