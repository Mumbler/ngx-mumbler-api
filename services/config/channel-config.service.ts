/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { HexString, UuidHexString } from '../../common/common.types';
import { Inject, Injectable } from '@angular/core';
import { CommunicationParameter, communicationParameterInjectionToken } from '../../common/communication-parameter.class';

@Injectable( {
	providedIn: 'root'
} )
export class ChannelConfigService {

	private readonly _channelId: UuidHexString;

	public constructor(
		@Inject( communicationParameterInjectionToken ) private readonly _communicationParameter: CommunicationParameter
	) {

	    this._channelId = this._communicationParameter.channelId;

	}

	public get channelId(): UuidHexString {

		return this._channelId;

	}

}
