/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { v4 as uuidV4 } from 'uuid';
import { InjectionToken } from '@angular/core';
import { LogLevel } from '../services/common/logger.enum';
import { environment } from '../../../../../environments/environment';
import { MumblerId } from '../services/types/mumbler-id.type';

export class ExtendedCommunicationParameter {

	private _debugMode: boolean = false;
	private _logLevel: LogLevel = LogLevel.OFF;
	private _serverUrl: string = `${ environment.backend }`;
	private _socketUrl: string = `${ environment.socket }`;

	public get debugMode(): boolean {

		return this._debugMode;

	}

	public set debugMode( value: boolean ) {

		this._debugMode = value;

	}

	public get logLevel(): LogLevel {

		return this._logLevel;

	}

	public set logLevel( value: LogLevel ) {

		this._logLevel = value;

	}

	public get serverUrl(): string {

		return this._serverUrl;

	}

	public set serverUrl( value: string ) {

		this._serverUrl = value;

	}

	public get socketUrl(): string {

		return this._socketUrl;

	}

	public set socketUrl( value: string ) {

		this._socketUrl = value;

	}

}

export class CryptoCommunicationParameter {

	private _privateKey: Uint8Array;
	private _totpKey: Uint8Array;

	public get privateKey(): Uint8Array {

		return this._privateKey;

	}

	public set privateKey( value: Uint8Array ) {

		this._privateKey = value;

	}

	public get totpKey(): Uint8Array {

		return this._totpKey;

	}

	public set totpKey( value: Uint8Array ) {

		this._totpKey = value;

	}

}

export class MumblerParameter {

	public constructor(
		private _mumblerId: MumblerId = uuidV4(),
		private readonly _cryptoCommunicationParameter: CryptoCommunicationParameter = new CryptoCommunicationParameter(),
		private readonly _extendedCommunicationParameter: ExtendedCommunicationParameter = new ExtendedCommunicationParameter()
	){}

	public get mumblerId(): MumblerId {

		return this._mumblerId;

	}

	public set mumblerId( value: MumblerId ) {

		this._mumblerId = value;

	}

	public get crpytoCommunicationParameter(): CryptoCommunicationParameter {

		return this._cryptoCommunicationParameter;

	}

	public get extendedDelegationParameter(): ExtendedCommunicationParameter {

		return this._extendedCommunicationParameter;

	}

}

export const mumblerParameterFactory: ( parameter?: MumblerParameter )=> MumblerParameter = ( parameter?: MumblerParameter ) => {

	// Use provided
	if ( !! parameter ) {

		return parameter;

	}

	// Use default
	return new MumblerParameter( uuidV4(), null, new ExtendedCommunicationParameter() );

};

export const mumblerParameterInjectionToken: InjectionToken< MumblerParameter > =
    new InjectionToken< MumblerParameter >(
	    'Communication parameter injection token'
    );
