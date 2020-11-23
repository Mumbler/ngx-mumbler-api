/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { EMPTY, Observable, Subscriber, throwError } from 'rxjs';
import { fromPromise }                               from 'rxjs/internal-compatibility';
import { LoggerService }                             from '../../common/logger.service';
import { MumblerIdPayload }                          from '../../mumble/payload/mumbler-id.payload';
import { DelegationRequest }                         from '../../mumbler/requests/delegation.request';
import { HeartbeatResponse }                         from '../../mumbler/response/heartbeat.response';
import { WebSocketResponse }                         from '../../mumbler/response/web-socket.response';
import { Mumble }                                    from './delegation.mumble.class';

export class DelegationSocket extends Observable< Mumble > {

    private _heartbeatInterval: number;
    private _mumblerId: string;
    private _socket: WebSocket;
    private _timeDeltaBackend: number;

    public constructor( mumblerId: string, totp: string, socketUrl: string, heartbeat: number = 5000 ) {

        super( ( subscriber: Subscriber< Mumble > ) => {

            this._mumblerId = mumblerId;
            this._socket = new WebSocket( socketUrl, [ mumblerId, totp ] );

            this._socket.onclose = ( event: CloseEvent ) => {

                // event.code === 1000 ("Normal closure") => no need for error throwing
                if ( event.code !== 1000 ) {

                    subscriber.error( event );

                }

                // in any case stop heartbeat
                if ( !! this._heartbeatInterval ) {

                    clearInterval( this._heartbeatInterval );
                    this._heartbeatInterval = null;

                }

                subscriber.complete();

            };

            this._socket.onmessage = ( event: MessageEvent ) => {

                try {

                    // Try to de-serialize the mumble (which comes as a blob)
                    const raw: Blob = new Blob( [ event.data ] );

                    fromPromise(
                        raw.text()
                    ).subscribe( ( message: string ) => {

                        const response: WebSocketResponse|Mumble = JSON.parse( message ) as WebSocketResponse|Mumble;

                        if ( !! response && 'success' in response && !! response.success && !! response.event ) {

                            if ( response.event === 'delegation' ) {

                                // actually nothing to do here => success is checked above

                            } else if ( response.event === 'heartbeat' ) {

                                this._timeDeltaBackend = ( response as HeartbeatResponse ).heartbeat;

                            }

                        } else {

                            // Now we can try to parse it into a mumble object (at least the public fields)
                            subscriber.next( response as Mumble );

                        }

                    } );

                } catch ( e ) {

                    subscriber.error( `Unable to de-serialize socket message: "${ LoggerService.ConvertToString( e ) }"` );

                }

            };

            this._socket.onerror = ( event: Event ) => {

                subscriber.error( event );

            };

            this._socket.onopen = () => {

                this._heartbeatInterval = setInterval(
                    () => this.sendHeartbeat(),
                    Math.max( 5000, heartbeat )
                );

            };

        } );

    }

    public get mumblerId(): string {

        return this._mumblerId;

    }

    public get timeDeltaBackend(): number {

        return this._timeDeltaBackend;

    }

    public get state(): number {

        return this._socket.readyState;

    }

    public closeChannel( code?: number, reason?: string ): void {

        this._socket.close( code, reason );

    }

    public sendMessage( authorization: string, mumble: Mumble ): Observable< never > {

        if ( !!mumble ) {

            // Enforce the sender
            mumble.mumblerId = new MumblerIdPayload( this._mumblerId );

            try { // Try to delegate ("send") the mumble

                this._socket.send( JSON.stringify( { event: 'delegation', data: new DelegationRequest( mumble, authorization ) } ) );

            } catch ( e ) {

                console.warn( e );

            }

            return EMPTY;

        }

        return throwError( 'No payload to send found' );

    }

    private sendHeartbeat(): void {

        // Try to delegate ("send") the mumble
        this._socket.send( JSON.stringify( { event: 'heartbeat', data: { heartbeat: Date.now() } } ) );

    }

}
