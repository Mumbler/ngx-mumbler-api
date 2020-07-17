/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleConfigService } from './src/services/config/module-config.service';
import { MumblerService } from './src/services/mumbler/mumbler.service';
import { CryptoService } from './src/services/crypto/crypto.service';
import { MumbleService } from './src/services/mumble/mumble.service';
import { MumblerConfigService } from './src/services/config/mumbler-config.service';
import { CryptoConfigService } from './src/services/config/crypto-config.service';
import { HttpClientModule } from '@angular/common/http';
import { LoggerService } from './src/services/common/logger.service';
import { DelegationConfigService } from './src/services/config/delegation-config.service';

export const communicationInjectionToken: InjectionToken< MumblerModule > =
    new InjectionToken< MumblerModule >( 'Communication injection token' );


@NgModule( {
	declarations: [],
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		LoggerService,
		ModuleConfigService,
		MumblerConfigService,
		CryptoConfigService,
		DelegationConfigService,
		MumblerService,
		CryptoService,
		MumbleService,
	],
	exports: [
	    HttpClientModule
	]
} )
export class MumblerModule {

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
