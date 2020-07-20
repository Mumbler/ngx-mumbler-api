/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { Inject, Injectable } from '@angular/core';
import { CommunicationParameter, communicationParameterInjectionToken } from '../../common/communication-parameter.class';

@Injectable( {
	providedIn: 'root'
} )
export class ModuleConfigService {

	/* Common */
	private readonly _debugMode: boolean;

	/* Backend specific */
	private readonly _serverUrl: string;

	public constructor(
	    @Inject( communicationParameterInjectionToken ) private readonly _communicationParameter: CommunicationParameter
	) {

	    this._debugMode = this._communicationParameter.extendedCommunicationParameter.debugMode;
	    this._serverUrl = this._communicationParameter.extendedCommunicationParameter.serverUrl;

	}

	public get debugMode(): boolean {

		return this._debugMode;

	}

	public get serverUrl(): string {

		return this._serverUrl;

	}

}
