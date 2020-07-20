/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Inject, Injectable } from '@angular/core';
import { MumblerParameter, mumblerParameterInjectionToken } from '../../common/parameter.class';

@Injectable( {
	providedIn: 'root'
} )
export class MumblerConfigService {

	public constructor(
		@Inject( mumblerParameterInjectionToken ) private readonly _mumblerParameter: MumblerParameter
	) {}

	public get mumblerId(): string {

		return this._mumblerParameter.mumblerId;

	}

	public set mumblerId( value: string ) {

	    this._mumblerParameter.mumblerId = value;

	}

}
