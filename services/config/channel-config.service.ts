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
	private readonly _privateKey: HexString;

	public constructor(
		@Inject( communicationParameterInjectionToken ) private readonly _communicationParameter: CommunicationParameter
	) {

	    this._channelId = this._communicationParameter.channelId;
	    this._privateKey = this._communicationParameter.privateKey;

	}

	public get channelId(): UuidHexString {

		return this._channelId;

	}

	public get privateKey(): HexString {

		return this._privateKey;

	}

}
