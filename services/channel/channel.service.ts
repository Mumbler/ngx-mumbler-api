/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable } from '@angular/core';
import { ModuleConfigService } from '../config/module-config.service';
import { ChannelConfigService } from '../config/channel-config.service';

@Injectable( {
	providedIn: 'root'
} )
export class ChannelService {

	private readonly _webSocket: WebSocket;

	public constructor(
		private readonly _moduleConfigService: ModuleConfigService,
		private readonly _channelConfigService: ChannelConfigService
	) {

	    this._webSocket = new WebSocket( this._moduleConfigService.serverUrl );

	}


}
