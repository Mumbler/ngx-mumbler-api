/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Inject, Injectable } from '@angular/core';
import { MumblerParameter, mumblerParameterInjectionToken } from '../../common/parameter.class';
import { LogLevel } from './logger.enum';

@Injectable( {
    providedIn: 'root'
} )
export class LoggerService {

    private readonly _logLevel: LogLevel;

    public constructor(
        @Inject( mumblerParameterInjectionToken ) private readonly _communicationParameter: MumblerParameter
    ) {

        this._logLevel = this._communicationParameter.extendedDelegationParameter.logLevel;

    }

    public static ConvertToString( source: unknown ): string {

        if ( typeof source === 'object' ) {

            return JSON.stringify( source );

        } else if ( typeof source === 'string' || typeof  source === 'number' || typeof  source === 'bigint' || typeof source === 'boolean' ) {

            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return `${ source }`;

        } else {

            return '<not convertable>';

        }

    }

    public get logLevel(): LogLevel {

        return this._logLevel;

    }

    public debug( message: string, source?: string ): void {

        this.doLog( LogLevel.DEBUG, message, source );

    }

    public error( message: string, source?: string ): void {

        this.doLog( LogLevel.ERROR, message, source );

    }

    public fatal( message: string, source?: string ): void {

        this.doLog( LogLevel.FATAL, message, source );

    }

    public verbose( message: string, source?: string ): void {

        this.doLog( LogLevel.VERBOSE, message, source );

    }

    public warn( message: string, source?: string ): void {

        this.doLog( LogLevel.WARN, message, source );

    }

    private doLog( type: LogLevel = LogLevel.ALL, message: string = '', source: string = 'Unknown' ): void {

        if ( type >= this._logLevel && type === LogLevel.ALL ) {

            this.printLine( `[${ source }] ${ message }`, 'color: #000000' );

        } else if ( type >= this._logLevel && type === LogLevel.DEBUG ) {

            this.printLine( `[${ source }] ${ message }`, 'color: #00CC00' );

        } else if ( type >= this._logLevel && type === LogLevel.VERBOSE ) {

            this.printLine( `[${ source }] ${ message }`, 'color: #0080FF' );

        } else if ( type >= this._logLevel && type === LogLevel.WARN ) {

            this.printLine( `[${ source }] ${ message }`, 'color: #FF9933' );

        } else if ( type >= this._logLevel && type === LogLevel.ERROR ) {

            this.printLine( `[${ source }] ${ message }`, 'color: #FF3333' );

        } else if ( type >= this._logLevel && type === LogLevel.FATAL ) {

            this.printLine( `[${ source }] ${ message }`, 'color: #FF3399' );

        }

    }

    // noinspection JSMethodCanBeStatic
    private printLine( text: string = '', color: string = 'color: #000000' ): void {

	    console.log( `%c${ text }`, color );

    }

}
