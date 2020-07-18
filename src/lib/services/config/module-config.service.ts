/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { Inject, Injectable } from '@angular/core';
import { MumblerParameter, mumblerParameterInjectionToken } from '../../common/parameter.class';

@Injectable( {
	providedIn: 'root'
} )
export class ModuleConfigService {

	/* Common */
	private readonly _debugMode: boolean;

	/* Backend specific */
	private readonly _serverUrl: string;
	private readonly _socketUrl: string;

	public constructor(
	    @Inject( mumblerParameterInjectionToken ) private readonly _communicationParameter: MumblerParameter
	) {

	    this._debugMode = this._communicationParameter.extendedDelegationParameter.debugMode;
	    this._serverUrl = this._communicationParameter.extendedDelegationParameter.serverUrl;
	    this._socketUrl = this._communicationParameter.extendedDelegationParameter.socketUrl;

	}

	public get debugMode(): boolean {

		return this._debugMode;

	}

	public get serverUrl(): string {

		return this._serverUrl;

	}

	public get socketUrl(): string {

		return this._socketUrl;

	}

}
