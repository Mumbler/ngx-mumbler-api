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
export class MessagesService {

	public constructor(
		private readonly _moduleConfigService: ModuleConfigService,
		private readonly _channelConfigService: ChannelConfigService,
	) {

		console.log( 'Hallo Welt' );
		console.log( this._moduleConfigService.debugMode, this._moduleConfigService.debugMode );
		console.log( this._channelConfigService.channelId );

	}

}
