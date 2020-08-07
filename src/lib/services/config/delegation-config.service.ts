/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Inject, Injectable } from '@angular/core';
import { MumblerParameter, mumblerParameterInjectionToken } from '../../common/parameter.class';

@Injectable()
export class DelegationConfigService {

	public constructor(
		@Inject( mumblerParameterInjectionToken ) private readonly _delegationParameter: MumblerParameter
	) {}

	public get serverUrl(): string {

	    return this._delegationParameter.extendedDelegationParameter.serverUrl;

	}

}
