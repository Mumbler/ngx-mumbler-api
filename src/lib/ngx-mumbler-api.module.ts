/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { CommonModule }             from '@angular/common';
import { HttpClientModule }         from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { LoggerService }            from './services/common/logger.service';
import { WindowService }            from './services/common/window.service';
import { CryptoConfigService }      from './services/config/crypto-config.service';
import { DelegationConfigService }  from './services/config/delegation-config.service';
import { ModuleConfigService }      from './services/config/module-config.service';
import { MumblerConfigService }     from './services/config/mumbler-config.service';
import { CryptoService }            from './services/crypto/crypto.service';
import { MumbleService }            from './services/mumble/mumble.service';
import { MumblerService }           from './services/mumbler/mumbler.service';


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
        CryptoService,
        MumbleService,
        MumblerService,
        WindowService
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

        this._loggerService.debug( `Starting "ngx-mumbler-api" with parameter:`, 'MumblerModule' );
        this._loggerService.verbose( `\tServer url: "${ this._moduleConfigService.serverUrl }"`, 'MumblerModule' );
        this._loggerService.verbose( `\tSocket url: "${ this._moduleConfigService.socketUrl }"`, 'MumblerModule' );
        this._loggerService.verbose( `\tDebug mode: "${ this._moduleConfigService.debugMode ? 'ON' : 'OFF' }"`, 'MumblerModule' );
        this._loggerService.verbose( `\tLog level: "${ this._loggerService.logLevel }"`, 'MumblerModule' );

    }

}
