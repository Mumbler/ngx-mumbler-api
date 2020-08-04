/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { HexString }                  from '../../common/conversion.class';
import { Observable, of, throwError } from 'rxjs';
import { fromPromise }                from 'rxjs/internal-compatibility';
import { switchMap }                  from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StaticConversion {

    public static ConvertBase64ToBuffer( base64: string ): Uint8Array {

        /*
         * Based on the work of https://github.com/niklasvh/base64-arraybuffer
         * licensed under MIT License
         */

        const len: number = base64.length;
        let padding: number = 0;

        if ( base64[ len - 1 ] === '=' && base64[ len - 2 ] === '=' ) {

            padding = 2;

        } else if ( base64[ len - 1 ] === '=' ) {

            padding = 1;

        }

        const b64Chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const lookup: Uint8Array = new Uint8Array( 256 );

        for ( let i: number = 0; i < b64Chars.length; i++ ) {

            lookup[ b64Chars.charCodeAt( i ) ] = i;

        }

        const bufferLength: number = len * .75 - padding;
        const bytes: Uint8Array = new Uint8Array( new ArrayBuffer( bufferLength ) );

        let byteIndex: number = 0;

        for ( let i: number = 0; i < len; i += 4 ) {

            const b64Enc1: number = lookup[ base64.charCodeAt( i ) ];
            const b64Enc2: number = lookup[ base64.charCodeAt( i + 1 ) ];
            const b64Enc3: number = lookup[ base64.charCodeAt( i + 2 ) ];
            const b64Enc4: number = lookup[ base64.charCodeAt( i + 3 ) ];

            bytes[ byteIndex++ ] = b64Enc1 << 2 | b64Enc2 >> 4;
            bytes[ byteIndex++ ] = ( b64Enc2 & 15 ) << 4 | b64Enc3 >> 2;
            bytes[ byteIndex++ ] = ( b64Enc3 & 3 ) << 6 | b64Enc4 & 63;

        }

        return bytes;

    }

    public static ConvertBase64ToString( base64: string ): string {

        try {

            // "atob" could throw an Exception, e.g. on bad/corrupted input
            return atob( base64 );

        } catch ( e ) {

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error( `Unable to convert base64 to string with error: "${ e.toString() }"` );

        }

    }

    public static ConvertBufferToBase64( buffer: ArrayBuffer | Uint8Array ): string {

        const viewer: Uint8Array = buffer instanceof ArrayBuffer ? new Uint8Array( buffer ) : buffer;

        /*
         * Based on the work of https://github.com/niklasvh/base64-arraybuffer
         * licensed under MIT License
         */

        const b64Chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        let base64: string = '';

        for ( let i: number = 0; i < viewer.length; i += 3 ) {

            base64 += b64Chars[ viewer[ i ] >> 2 ];
            base64 += b64Chars[ ( viewer[ i ] & 3 ) << 4 | viewer[ i + 1 ] >> 4 ];
            base64 += b64Chars[ ( viewer[ i + 1 ] & 15 ) << 2 | viewer[ i + 2 ] >> 6 ];
            base64 += b64Chars[ viewer[ i + 2 ] & 63 ];

        }

        if ( viewer.length % 3 === 2 ) {

            base64 = base64.substring( 0, base64.length - 1 ) + '=';

        } else if ( viewer.length % 3 === 1 ) {

            base64 = base64.substring( 0, base64.length - 2 ) + '==';

        }

        return base64;

    }

    public static ConvertBufferToString( buffer: ArrayBuffer | Uint8Array ): string {

        const viewer: ArrayBuffer = buffer instanceof ArrayBuffer ? new Uint8Array( buffer ) : buffer;
        let value: string = '';

        for ( let i: number = 0; i < viewer.byteLength; i++ ) {

            value += String.fromCharCode( viewer[ i ] );

        }

        return value;

    }

    public static ConvertFileToBuffer( file: File ): Observable< Uint8Array > {

        if ( !!! file ) {

            return throwError( 'ConvertFileToBuffer: File parameter missing' );

        }

        return fromPromise(

            file.arrayBuffer()

        ).pipe(

            switchMap( ( buffer: ArrayBuffer ) => of( new Uint8Array( buffer ) ) )

        );

    }

    public static ConvertHexStringToBuffer( raw: HexString ): Uint8Array {

        const buffer: Uint8Array = new Uint8Array( new ArrayBuffer( raw.length ) );

        for ( let i: number = 0; i < raw.length; i++ ) {

            buffer[ i ] = Math.abs( Number.parseInt( raw[ i ], 16 ) );

        }

        return buffer;

    }

    public static ConvertJsonToBuffer( json: {} ): Uint8Array {

        try {

            return StaticConversion.ConvertStringToBuffer( JSON.stringify( json ) );

        } catch ( e ) {

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error( `Unable to convert json to buffer: "${ e.toString() }"` );

        }

    }

    public static ConvertStringToBase64( value: string ): string {

        try {

            // "btoa" could throw an Exception on UTF-16 (unicode) character input
            return btoa( value );

        } catch ( e ) {

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error( `Unable to convert string to base64: "${ e.toString() }"` );

        }

    }

    public static ConvertStringToBuffer( raw: string ): Uint8Array {

        const buffer: Uint8Array = new Uint8Array( new ArrayBuffer( raw.length ) );

        for ( let i: number = 0; i < raw.length; i++ ) {

            buffer[ i ] = raw.charCodeAt( i );

        }

        return buffer;

    }

}
