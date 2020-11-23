/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Observable, of, throwError } from 'rxjs';
import { fromPromise }                from 'rxjs/internal-compatibility';
import { switchMap }                  from 'rxjs/operators';

export class TotpClass {

    public constructor(
        private readonly _totpKey: CryptoKey
    ) {

        // TODO: Validate CryptoKey

    }

    public getToken(): Observable<string> {

        return this.computeTotpToken();

    }

    // noinspection JSMethodCanBeStatic
    /**
     * Converts buffer to hex string by array lookup.
     * According to "jsperf" the fastest implementation (https://jsperf.com/hex-conversion)
     *
     * @param {Uint8Array} buffer
     * @returns {string}
     */
    private buf2hex( buffer: Uint8Array ): string {

        const hexArray: Array<string> = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];

        let s: string = '';

        for ( let i: number = 0; i < buffer.length; i++ ) {

            const code: number = buffer[ i ];

            s += hexArray[ code >>> 4 ];
            s += hexArray[ code & 0x0F ];

        }

        return s;

    }

    /**
     * Computes the TOTP token based on the provided secret
     * TOTP ^= Time-based One-Time-Password (https://en.wikipedia.org/wiki/Time-based_One-time_Password_algorithm)
     *  - tStart ^= T_0
     *  - tDelta ^= T_X
     *
     * @param tStart       The unix time from which to start counting steps (defaults to 1970)
     * @param tDelta       The unix time intervals for which a single token is valid (defaults to 90 seconds)
     *
     * @returns {Observable<string>}
     */
    private computeTotpToken( tStart: number = 0, tDelta: number = 90 ): Observable<string> {

        if ( tStart < 0 || tDelta < 0 ) {

            return null;

        }

        // getTime => milliseconds (but need seconds)
        const tEpoch: number = Math.round( new Date().getTime() / 1000.0 ) - tStart;
        // calculate tCounter
        const tCounter: number = Math.floor( tEpoch / tDelta );
        // left pad the time to 16 hex digits
        const time: string = this.leftPad( `${ parseInt( `${ tCounter }`, 16 ) }`, 16, '0' );
        // get a little utf-8 encoding help
        const encoder: TextEncoder = new TextEncoder();

        // compute the HOTP value with shared secret and current time (range)
        return this.getHmacDigest( encoder.encode( time ) ).pipe(
            switchMap( ( hmac: Uint8Array ) => of( this.buf2hex( hmac ) ) )
        );

    }

    /**
     * Create a hmac base on the SubtleCrypto interface
     * https://caniuse.com/#feat=mdn-api_subtlecrypto
     * TODO: Evaluate if a polyfill is required for very old browsers?
     *
     * @param {Uint8Array} message          The message to compute the hmac of
     * @param {Uint8Array} key              (Optional) The key to use for the hmac. When not provided the member
     *     visible key ("_totpKey") will be used
     * @returns {Observable<Uint8Array>}
     */
    private getHmacDigest( message: Uint8Array, key: Uint8Array = null ): Observable<Uint8Array> {

        if ( !!!window.crypto || !!!window.crypto.subtle ) {

            return throwError( 'SubtleCrypto API not available' );

        }

        const crypto: SubtleCrypto = window.crypto.subtle;

        const hmacKey: Observable<CryptoKey> =
            !!this._totpKey ?
            	of( this._totpKey ) :
            	fromPromise( crypto.importKey( 'raw', key, { name: 'HMAC', hash: 'SHA-512' }, false, [ 'sign' ] ) );

        return hmacKey.pipe(
            switchMap( ( signageKey: CryptoKey ) => fromPromise(
                crypto.sign( 'HMAC', signageKey, message )
            ) ),

            switchMap( ( computedHmac: ArrayBuffer ) => of( new Uint8Array( computedHmac ) ) )
        );

    }

    // noinspection JSMethodCanBeStatic
    /**
     * Prefixes (left-pad) the given string with "pad" characters as long as the required len is not reached.
     *
     * @param {string} str  The string to be padded
     * @param {number} len  The required total length after padding
     * @param {string} pad  The pad character to use
     *
     * @returns {string}    The padded string of length "len"
     */
    private leftPad( str: string, len: number, pad: string ): string {

        // Any padding required on the left side?
        if ( 1 + len >= str.length ) {

            const padPrefix: string = pad.charAt( 0 );

            // Prefix with "n x pad" ( n = 1 + len - str.length )
            str = Array( 1 + len - str.length ).join( padPrefix ) + str;

        }

        return str;

    }

}
