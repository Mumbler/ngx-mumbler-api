/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { EMPTY, Observable, Subscriber, throwError } from 'rxjs';
import { Mumble } from './delegation.mumble.class';

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

				// Try to de-serialize the channelMessage
				const channelMessage: Mumble = Mumble.FromJson( event.data );

				// When channelMessage !== null then the de-serialization succeeded (otherwise ignore the message)
				if ( !! channelMessage ) {

					subscriber.next( channelMessage );

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

	public sendMessage( message: Mumble ): Observable< never > {

		if ( !! message ) {

			// Enforce the sender
			message.senderChannelId = this._mumblerId;

			this._socket.send( message.toJson() );

			return EMPTY;

		}

		return throwError( 'No payload to send found' );

	}

}
