/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable }                    from '@angular/core';
import { ModuleConfigService }           from '../config/module-config.service';
import { MumblerConfigService }          from '../config/mumbler-config.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { CryptoService }                 from '../crypto/crypto.service';
import { catchError, switchMap, tap }    from 'rxjs/operators';
import { LoggerService }                 from '../common/logger.service';
import { DelegationSocket }              from './socket/delegation-socket.class';
import { Mumble }                        from './socket/delegation.mumble.class';
import { MumblerService }                from '../mumbler/mumbler.service';

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
        private readonly _mumblerService: MumblerService
    ) {}

    public closeSocket( socketId: string = this._mumblerConfigService.mumblerId ): Observable< never > {

	    const socket: DelegationSocket | undefined = this._sockets.find( ( findSocket: DelegationSocket ) => findSocket.mumblerId === socketId );

        if ( !! socket ) {

		    // Close the socket
            socket.closeChannel( 1000, 'Closed by client' );

            // Remove the socket
            this._sockets.splice( this._sockets.indexOf( socket ), 1 );

            // Signal all good (nothing abnormal)
            return EMPTY;

        }

        return throwError( 'Unable to close unknown socket' );

    }

    public openSocket( socketId: string = this._mumblerConfigService.mumblerId ): Observable< Mumble > {

	    return this._cryptoService.computeTotp().pipe(

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

			        console.log( err );

                    // TODO: Handle type "err" correctly
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
                    this._loggerService.warn( `Received error "${ err }" from socket`, 'DelegationService' );

                }

                return throwError( 'Unable to open socket' );

            } )

        );

    }

    public sendMumble( mumble: Mumble ): Observable< never > {

        if ( !! mumble.transmitPayload.payload ) {

            const delegationSocket: DelegationSocket | undefined = this._sockets.find( ( findSocket: DelegationSocket ) => findSocket.mumblerId === this._mumblerConfigService.mumblerId );

            if ( !! delegationSocket ) {

                return delegationSocket.sendMessage( mumble );

            }

            // Fallback (no socket available): Send via HTTP-POST
            return this._mumblerService.sendMumbleViaPost( mumble );

        }

        return throwError( 'Unable to init delegation, payload not encrypted' );

    }

}
