/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders }              from '@angular/common/http';
import { Injectable }                                                     from '@angular/core';
import { EMPTY, forkJoin, Observable, of, Subscriber, throwError }        from 'rxjs';
import { map, switchMap, tap }                                            from 'rxjs/operators';
import { LoggerService }                                                  from '../common/logger.service';
import { CryptoConfigService }                                            from '../config/crypto-config.service';
import { DelegationConfigService }                                        from '../config/delegation-config.service';
import { ModuleConfigService }                                            from '../config/module-config.service';
import { MumblerConfigService }                                           from '../config/mumbler-config.service';
import { CryptoKeyPairString, CryptoService, SerializedEncryptedPayload } from '../crypto/crypto.service';
import { StaticConversion }                                               from '../crypto/static-conversion.class';
import { TotpClass }                                                      from '../crypto/totp.class';
import { DelegateToInfo }                                                 from '../delegation/delegation/delegate-to-info.class';
import { Mumble }                                                         from '../delegation/socket/delegation.mumble.class';
import { MumblerId }                                                      from '../types/mumbler-id.type';
import { BondingParameterModel }                                          from './model/bonding-parameter.model';
import { BaseRequest }                                                    from './requests/base.request';
import { CommenceBondingRequest }                                         from './requests/commence-bonding.request';
import { DelegationRequest }                                              from './requests/delegation.request';
import { OnboardingRequest }                                              from './requests/onboarding.request';
import { AssociatedMumblersResponse }                                     from './response/associated-mumblers.response';
import { BaseResponse }                                                   from './response/base.response';
import { CommenceBondingResponse }                                        from './response/commence-bonding.response';
import { DelegateToInfoResponse }                                         from './response/delegate-to-info.response';
import { DelegationResponse }                                             from './response/delegation.response';
import { InitBondingResponse }                                            from './response/init-bonding.response';
import { OnboardingResponse }                                             from './response/onboarding.response';

@Injectable( {
    providedIn: 'root'
} )
export class MumblerService {

    public constructor(
	    private readonly _moduleConfigService: ModuleConfigService,
	    private readonly _communicationConfigService: DelegationConfigService,
        private readonly _cryptoService: CryptoService,
        private readonly _cryptoConfigService: CryptoConfigService,
        private readonly _mumblerConfigService: MumblerConfigService,
        private readonly _loggerService: LoggerService,
        private readonly _httpClient: HttpClient
    ) {}

    public associatedMumblerIds(): Observable< Array< MumblerId > > {

        this._loggerService.debug( `Querying associated mumblers for "${ this._mumblerConfigService.mumblerId }"`, 'MumblerService' );

        return this.get< AssociatedMumblersResponse >( `mumbler/${ this._mumblerConfigService.mumblerId }/associatedMumblers` ).pipe(

            tap( () => this._loggerService.debug( `Successfully queried associated info`, 'MumblerService' ) ),

            map( ( response: AssociatedMumblersResponse ) => {

                if ( !! response.success ) {

                    return response.group;

                }

                return [];

            } ),

            tap( () => this._loggerService.debug( `Decrypted delegation info`, 'MumblerService' ) )

        );

    }

    public commenceBonding( bondingToken: string, totpKey: Uint8Array ): Observable< MumblerId > {

        this._loggerService.debug( `Commencing bonding process for "${ this._mumblerConfigService.mumblerId }"`, 'MumblerService' );

        return this._cryptoService.importBondingTotpKey( totpKey ).pipe(

            tap( () => this._loggerService.debug( 'Bonding totp imported successfully', 'MumblerService' ) ),

            switchMap( ( key: CryptoKey ) => new TotpClass( key ).getToken() ),

            tap( () => this._loggerService.debug( 'Bonding totp computation successfully', 'MumblerService' ) ),

            switchMap( ( totpToken: string ) => this.post< CommenceBondingRequest, CommenceBondingResponse >(
                `bonding/delegation/challenge`,
                new CommenceBondingRequest( bondingToken, totpToken, this._mumblerConfigService.mumblerId )
            ) ),

            tap( ( response: CommenceBondingResponse ) => this._loggerService.debug( `Got bonding challenge response with success "${ response.success }"`, 'MumblerService' ) ),

            switchMap( ( response: CommenceBondingResponse ) => this._cryptoService.decrypt( StaticConversion.ConvertBase64ToBuffer( response.mumblerId ) ) ),

            tap( () => this._loggerService.debug( 'Decrypted bonded mumblerId', 'MumblerService' ) ),

            switchMap( ( mumblerId: ArrayBuffer ) => of( StaticConversion.ConvertBufferToString( mumblerId ) ) ),

            tap( ( mumblerId: string ) => this._loggerService.debug( `Now bonded to "${ mumblerId }"`, 'MumblerService' ) )

        );

    }

    public delegateToInfo( delegateTo: MumblerId ): Observable< DelegateToInfo > {

        this._loggerService.debug( `Querying delegation info for "${ this._mumblerConfigService.mumblerId }" => "${ delegateTo }"`, 'MumblerService' );

        return this.get< DelegateToInfoResponse >( `mumbler/${ this._mumblerConfigService.mumblerId }/delegateInfo/${ delegateTo }` ).pipe(

		    tap( () => this._loggerService.debug( `Successfully queried delegation info`, 'MumblerService' ) ),

            switchMap( ( response: DelegateToInfoResponse ) => forkJoin( [

                this._cryptoService.decryptBuffer( SerializedEncryptedPayload.ConvertToEncryptedPayload( response.name ) ),
                this._cryptoService.decryptBuffer( SerializedEncryptedPayload.ConvertToEncryptedPayload( response.public ) )

            ] ) ),

            tap( () => this._loggerService.debug( `Decrypted delegation info`, 'MumblerService' ) ),

            switchMap( ( decrypted: [ Uint8Array, Uint8Array ] ) => of( new DelegateToInfo(
                delegateTo,
                StaticConversion.ConvertBufferToString( decrypted[ 0 ] ),
                decrypted[ 1 ]
            ) ) )

        );

    }

    public initBonding(): Observable< BondingParameterModel > {

        this._loggerService.debug( `Initialized bonding process for "${ this._mumblerConfigService.mumblerId }"`, 'MumblerService' );

	    return this.get< InitBondingResponse >( `bonding/delegation/new/${ this._mumblerConfigService.mumblerId }` ).pipe(

	        tap( ( response: InitBondingResponse ) => this._loggerService.debug( `Got init bonding response with success "${ response.success }"`, 'MumblerService' ) ),

	        switchMap( ( response: InitBondingResponse ) => forkJoin( [

	            this._cryptoService.decrypt( StaticConversion.ConvertBase64ToBuffer( response.token ) ),
	            this._cryptoService.decrypt( StaticConversion.ConvertBase64ToBuffer( response.totp ) )

            ] ) ),

            tap( () => this._loggerService.debug( `Successfully decrypted bonding parameter`, 'MumblerService' ) ),

            switchMap( ( bondingParameter: [ Uint8Array, Uint8Array ] ) => of( new BondingParameterModel( bondingParameter[ 0 ], bondingParameter[ 1 ] ) ) )

        );

    }

    public onboarding( mumbleName: string, mumblerId: string = undefined ): Observable< never > {

        if (
            !! this._mumblerConfigService.mumblerId && this._mumblerConfigService.mumblerId.length > 0 &&
            !! this._cryptoConfigService.totpKey && this._cryptoConfigService.totpKey.byteLength > 0
        ) {

            return throwError( 'Already on-boarded' );

        }

        this._loggerService.debug( `Started on-boarding process`, 'MumblerService' );

        return this._cryptoService.generateKeys().pipe(

            tap( () => this._loggerService.debug( `Created new set of crypto keys`, 'MumblerService' ) ),

            switchMap( ( keyPair: CryptoKeyPair ) => this._cryptoService.exportKeys( keyPair ) ),

            tap( () => this._loggerService.debug( `Exported set of crypto keys`, 'MumblerService' ) ),

            switchMap( ( keyPair: CryptoKeyPairString ) => {

                // Store the private key within crypto config service
                this._cryptoConfigService.privateKey = StaticConversion.ConvertBase64ToBuffer( keyPair.privateKey );

                return this.post< OnboardingRequest, OnboardingResponse >( 'on-boarding/register/client', new OnboardingRequest(
                    mumbleName,
                    keyPair.publicKey,
                    mumblerId
                ) );

            } ),

            tap( () => this._loggerService.debug( `On-boarding response received`, 'MumblerService' ) ),

            tap( ( response: OnboardingResponse ) => {

                // Store the newly created mumblerId
                this._mumblerConfigService.mumblerId = response.mumblerId;

                // Store the according transport authorization key
                this._cryptoConfigService.totpKey = StaticConversion.ConvertBase64ToBuffer( response.totp );

            } ),

            tap( () => this._loggerService.debug( `On-boarding process completed`, 'MumblerService' ) ),

            switchMap( () => EMPTY )
        );

    }

    public sendMumbleViaPost( mumble: Mumble ): Observable< never > {

        return this.post< DelegationRequest, DelegationResponse >( 'delegation', new DelegationRequest( mumble ) ).pipe(

            // TODO: Implement!
            tap( ( res: DelegationResponse ) => console.log( res ) ),

            switchMap( () => EMPTY )

        );

    }

    private get< Res extends BaseResponse >( path: string ): Observable< Res > {

        return new Observable< Res >( ( subscriber: Subscriber< Res > ) => {

            this._loggerService.debug( `Started "get" operation against "${ path }"`, 'MumblerService' );

            this._cryptoService.computeTotp().pipe(

                switchMap( ( authorization: string ) => this._httpClient.get< Res >(

                    `${ this._communicationConfigService.serverUrl }${ path }`,
                    {
                        headers: new HttpHeaders( {
                            'authorization': `${ authorization }`
                        } ),
                        responseType: 'json',
                        reportProgress: true,
                        observe: 'events',
                        withCredentials: ! this._moduleConfigService.debugMode
                    }

                ) )

            ).subscribe(

                ( event: HttpEvent< Res > ) => {

                    this._loggerService.debug( `Received event type "${ event.type }" during GET operation`, 'MumblerService' );

                    if ( event.type === HttpEventType.Response && event.body.success ) {

                        subscriber.next( event.body );

                    } else if ( event.type === HttpEventType.Response && !! event.body.success ) {

                        throw new Error( `Error occurred: "${ event.body.details } (${ event.body.code })"` );

                    }

                    // TODO: May be interact with other HttpEvent types => e.g. progress or error handling in upload...

                },
                ( error: Error ) => {

                    subscriber.error( error );

                    return EMPTY;

                },
                () => subscriber.complete()

            );

        } );

    }

    private post< Req extends BaseRequest, Res extends BaseResponse >( path: string, payload: Req ): Observable< Res > {

	    return new Observable< Res >( ( subscriber: Subscriber< Res > ) => {

            this._loggerService.debug( `Started "post" operation against "${ path }"`, 'MumblerService' );

            this._cryptoService.computeTotp().pipe(

                switchMap( ( authorization: string ) =>

                    this._httpClient.post< Res >(

                        `${ this._communicationConfigService.serverUrl }${ path }`,
                        payload,
                        {
                            headers: new HttpHeaders( {
                                'authorization': `${ authorization }`
                            } ),
                            responseType: 'json',
                            reportProgress: true,
                            observe: 'events',
                            withCredentials: ! this._moduleConfigService.debugMode
                        }
                    )
                )

            ).subscribe(

                ( event: HttpEvent< Res > ) => {

                    this._loggerService.debug( `Received event type "${ event.type }" during POST operation`, 'MumblerService' );

                    if ( event.type === HttpEventType.Response && event.body.success ) {

                        subscriber.next( event.body );

                    } else if ( event.type === HttpEventType.Response && !! event.body.success ) {

                        throw new Error( `Error occurred : "${ event.body.details } (${ event.body.code })"` );

                    }

                    // TODO: May be interact with other HttpEvent types => e.g. progress or error handling in upload...

                },
                ( error: Error ) => {

                    subscriber.error( error );

                    return EMPTY;

                },
                () => subscriber.complete()

            );

        } );

    }

}
