/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleConfigService } from './services/config/module-config.service';
import { CommunicationService } from './services/communication/communication.service';
import { CryptoService } from './services/crypto/crypto.service';
import { MessagesService } from './services/messages/messages.service';
import { CommunicationParameter, communicationParameterFactory, communicationParameterInjectionToken } from './common/communication-parameter.class';
import { ChannelConfigService } from './services/config/channel-config.service';
import { CryptoConfigService } from './services/config/crypto-config.service';

@NgModule( {
	declarations: [],
	imports: [
		CommonModule
	],
	exports: [
		/* TODO: Which service shall be exported? */
	]
} )
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CommunicationModule {

	public static WithParameter( communicationParameter?: CommunicationParameter ): ModuleWithProviders {

		return {

			ngModule: CommunicationModule,
			providers: [
				ModuleConfigService,
				ChannelConfigService,
				CryptoConfigService,
				CommunicationService,
				CryptoService,
				MessagesService,
				{
					provide: communicationParameterInjectionToken,
					// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
					useFactory: () => communicationParameterFactory( communicationParameter ),
				}
			]

		};

	}

}
