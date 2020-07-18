/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { StaticConversion } from './static-conversion.class';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

export class PemParser {

	private readonly _data: Uint8Array;
	private readonly _type: 'spki' | 'pkcs8' | 'raw';

	public constructor( keyData: string ) {

	    if ( !!! keyData || keyData.length === 0 ) {

	        throw Error( 'PemCryptoKeyClass: No key data given' );

		}

	    if ( keyData.includes( '-----BEGIN RSA PRIVATE KEY-----' ) ) {

	        this._type = 'pkcs8';

		} else if ( keyData.includes( '-----BEGIN PUBLIC KEY-----' ) ) {

			this._type = 'spki';

		} else {

	        this._type = 'raw';

		}

	    const stripped: string = keyData
			.replace( '-----BEGIN PUBLIC KEY-----', '' )
			.replace( '-----END PUBLIC KEY-----', '' )
			.replace( '-----BEGIN RSA PRIVATE KEY-----', '' )
			.replace( '-----END RSA PRIVATE KEY-----', '' )
			.replace( new RegExp( '\r?\n', 'g' ), '' )
			.trim();

	    this._data = StaticConversion.ConvertBase64ToBuffer( stripped );

	}

	public static AddStartLine( publicKey: string ): string {

		return `-----BEGIN PUBLIC KEY-----\n${ publicKey }\n-----END PUBLIC KEY-----`;

	}

	public get data(): Uint8Array {

		return this._data;

	}

	public get type(): 'spki' | 'pkcs8' | 'raw' {

		return this._type;

	}

	public getCryptoKey(
	    algorithm: RsaHashedImportParams,
		keyUsages: Array< KeyUsage >
	): Observable< CryptoKey > {

	    return fromPromise(
	        crypto.subtle.importKey(
	            this._type,
				this._data,
				algorithm,
				false,
				keyUsages
			)
		);

	}

}
