/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { Inject, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleConfigService } from './services/config/module-config.service';
import { CommunicationService } from './services/communication/communication.service';
import { CryptoService } from './services/crypto/crypto.service';
import { MessagesService } from './services/messages/messages.service';
import { ChannelConfigService } from './services/config/channel-config.service';
import { CryptoConfigService } from './services/config/crypto-config.service';
import { HttpClientModule } from '@angular/common/http';
import { LoggerService } from './services/common/logger.service';

export const communicationInjectionToken: InjectionToken< CommunicationModule > =
    new InjectionToken< CommunicationModule >( 'Communication injection token' );


@NgModule( {
	declarations: [],
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		LoggerService,
		ModuleConfigService,
		ChannelConfigService,
		CryptoConfigService,
		CommunicationService,
		CryptoService,
		MessagesService,
	],
	exports: [
		/* TODO: Which service shall be exported? */
	]
} )
export class CommunicationModule {

	public constructor(
		private readonly _loggerService: LoggerService,
		private readonly _moduleConfigService: ModuleConfigService
	) {

		this._loggerService.debug( `Starting CommunicationModule with parameter:`, 'CommunicationModule' );
		this._loggerService.verbose( `\tServer url: "${ this._moduleConfigService.serverUrl }"`, 'CommunicationModule' );
		this._loggerService.verbose( `\tDebug mode: "${ this._moduleConfigService.debugMode ? 'ON' : 'OFF' }"`, 'CommunicationModule' );
		this._loggerService.verbose( `\tLog level: "${ this._loggerService.logLevel }"`, 'CommunicationModule' );

	}

}
