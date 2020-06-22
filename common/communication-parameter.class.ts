/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { v4 as uuidv4 } from 'uuid';
import { InjectionToken } from '@angular/core';
import { HexString, UuidHexString } from './common.types';
import { LogLevel } from '../services/common/logger.enum';

export class ExtendedCommunicationParameter {

	private _debugMode: boolean = false;
	private _logLevel: LogLevel = LogLevel.OFF;
	private _serverUrl: string = `https://api.mumbler.eu`;

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

}

export class CommunicationParameter {

	public constructor(
		private readonly _channelId: UuidHexString,
		private readonly _privateKey: HexString,
		private readonly _extendedCommunicationParameter: ExtendedCommunicationParameter = new ExtendedCommunicationParameter()
	){}

	public get channelId(): UuidHexString {

		return this._channelId;

	}

	public get extendedCommunicationParameter(): ExtendedCommunicationParameter {

		return this._extendedCommunicationParameter;

	}

	public get privateKey(): HexString {

		return this._privateKey;

	}

}

export const communicationParameterFactory: ( parameter?: CommunicationParameter )=> CommunicationParameter = ( parameter?: CommunicationParameter ) => {

	// Use provided
	if ( !! parameter ) {

		return parameter;

	}

	// Use default
	return new CommunicationParameter( uuidv4() as unknown as UuidHexString, null, new ExtendedCommunicationParameter() );

};

export const communicationParameterInjectionToken: InjectionToken< CommunicationParameter > =
    new InjectionToken< CommunicationParameter >(
	    'Communication parameter injection token'
    );
