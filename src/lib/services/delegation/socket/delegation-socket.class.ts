/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { EMPTY, Observable, Subscriber, throwError } from 'rxjs';
import { Mumble } from './delegation.mumble.class';
import { MumblerIdPayload } from '../../mumble/payload/mumbler-id.payload';

export class DelegationSocket extends Observable< Mumble > {

	private _mumblerId: string;
	private _socket: WebSocket;

	public constructor( socketId: string, totp: string, socketUrl: string ) {

		super( ( subscriber: Subscriber< Mumble > ) => {

			this._mumblerId = socketId;
			this._socket = new WebSocket( socketUrl,  [ socketId, totp ] );

			this._socket.onclose = ( event: CloseEvent ) => {

				// event.code === 1000 ("Normal closure") => no need for error throwing
				if ( event.code !== 1000 ) {

					subscriber.error( event );

				}

				subscriber.complete();

			};

			this._socket.onmessage = ( event: MessageEvent ) => {

				try {

				    // Try to de-serialize the mumble
					// TODO: Implement de-serialization?
					subscriber.next( event.data as Mumble );

				} catch ( e ) {

					subscriber.error( `Unable to de-serialize mumble` );

				}

			};

			this._socket.onerror = ( event: Event ) => {

				subscriber.error( event );

			};

		} );

	}

	public get mumblerId(): string {

		return this._mumblerId;

	}

	public closeChannel( code?: number, reason?: string ): void {

		this._socket.close( code, reason );

	}

	public sendMessage( mumble: Mumble ): Observable< never > {

		if ( !! mumble ) {

			// Enforce the sender
			mumble.mumblerId = new MumblerIdPayload( this._mumblerId );

			// Try to delegate ("send") the mumble
			this._socket.send( JSON.stringify( mumble ) );

			return EMPTY;

		}

		return throwError( 'No payload to send found' );

	}

}
