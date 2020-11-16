/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable, isDevMode }                       from '@angular/core';
import { EMPTY, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap }             from 'rxjs/operators';
import { LoggerService }                               from '../common/logger.service';
import { WindowService }                               from '../common/window.service';
import { ModuleConfigService }                         from '../config/module-config.service';
import { MumblerConfigService }                        from '../config/mumbler-config.service';
import { CryptoService }                               from '../crypto/crypto.service';
import { MumblerService }                              from '../mumbler/mumbler.service';
import { DelegationSocket }                            from './socket/delegation-socket.class';
import { Mumble }                                      from './socket/delegation.mumble.class';

@Injectable( {
    providedIn: 'root'
} )
export class DelegationService {

    private readonly _sockets: Array< DelegationSocket > = new Array< DelegationSocket >();

    public constructor(
        private readonly _cryptoService: CryptoService,
        private readonly _loggerService: LoggerService,
	    private readonly _moduleConfigService: ModuleConfigService,
        private readonly _mumblerConfigService: MumblerConfigService,
        private readonly _mumblerService: MumblerService,
        private readonly _windowService: WindowService
    ) {

        this._windowService.nativeWindow.addEventListener( 'offline', ( /*event: Event*/ ) => {

            forkJoin( this._sockets.map( ( socket: DelegationSocket ) => this.closeSocket( socket.mumblerId ) ) ).pipe(

                map( ( closedSockets: Array< boolean > ) => closedSockets.reduce(  ( previousValue: boolean, currentValue: boolean ) => previousValue === currentValue && !!! currentValue  ) ),

                tap( ( result: boolean ) => {

                    // All sockets should be closed (and therefore removed from the list)
                    if ( !!! result || this._sockets.length > 0 ) {

                        this._loggerService.warn( 'Offline mode detected... Not all sockets could be closed cleanly.', 'DelegationService' );

                    }

                    this._loggerService.verbose( 'Offline mode detected... All sockets were closed. When online, please re-connect using "listen()"' );

                } )

            );

        } );

    }

    public closeSocket( socketId: string = this._mumblerConfigService.mumblerId ): Observable< boolean > {

	    const socket: DelegationSocket | undefined = this._sockets.find( ( findSocket: DelegationSocket ) => findSocket.mumblerId === socketId );

	    if ( isDevMode() ) {

	        this._loggerService.debug( `Closing socket for "${ !! socket ? socket.mumblerId : '<none>' }"` );

        }

        if ( !! socket ) {

            if ( socket.state !== WebSocket.CLOSED ) {

                // Close the socket
                socket.closeChannel( 1000, 'Closed by client' );

            }

            // Remove the socket
            this._sockets.splice( this._sockets.indexOf( socket ), 1 );

            // Signal all good (nothing abnormal)
            return of( true );

        }

        return of( false );

    }

    public openSocket( socketId: string = this._mumblerConfigService.mumblerId ): Observable< Mumble > {

        // First try to close the socket... maybe still open (at least perform some internal cleanup)
        return this.closeSocket( socketId ).pipe(

            switchMap( () => this._cryptoService.computeTotp() ),

            switchMap( ( totp: string ) => {

                const channel: DelegationSocket = new DelegationSocket( socketId, totp, `${ this._moduleConfigService.socketUrl }` );

                this._sockets.push( channel );

                return channel;

            } ),

            tap( () => this._loggerService.debug( `Received mumble`, 'DelegationService' ) ),

            catchError( ( err: unknown ) => {

                if ( err instanceof CloseEvent ) {

                    this._loggerService.warn( `Received close reason "${ err.reason } (${ err.code })" from socket`, 'DelegationService' );

                } else {

                    // TODO: Handle type "err" correctly
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
                    this._loggerService.warn( `Received error "${ err }" from socket`, 'DelegationService' );

                }

                // Finalize the pipeline
                return EMPTY;

            } )

        );

    }

    public sendMumble( mumble: Mumble ): Observable< never > {

        if ( !! mumble.transmitPayload.payload ) {

            const delegationSocket: DelegationSocket | undefined = this._sockets.find( ( findSocket: DelegationSocket ) => findSocket.mumblerId === this._mumblerConfigService.mumblerId );

            if ( !! delegationSocket ) {

                return this._cryptoService.computeTotp().pipe(

                    switchMap( ( authorization: string ) => delegationSocket.sendMessage( authorization, mumble ) )

                );

            }

            // Fallback (no socket available): Send via HTTP-POST
            return this._mumblerService.sendMumbleViaPost( mumble );

        }

        return throwError( 'Unable to init delegation, payload not encrypted' );

    }

}
