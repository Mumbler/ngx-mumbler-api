/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
/* eslint-disable @typescript-eslint/member-ordering,@typescript-eslint/adjacent-overload-signatures */

import { Injectable } from '@angular/core';

export class CryptoConfig {

	// region *** MEMBERS (PRIVATE) ***

	// Common
	private _hashAlgorithm: string = 'SHA-512';

	// Derive specific
	private _deriveAlgorithm: string = 'PBKDF2';
	private _deriveIterations: number = 4294967296;    // 2 ^ 32

	// Synchronous encryption specific
	private _synchronousAlgorithm: string = 'AES-CBC';
	private _synchronousLength: number = 256;

	// Asynchronous encryption specific
	private _asynchronousAlgorithm: string = 'RSA-OAEP';
	private _asynchronousLength: number = 4096;
	private _asynchronousPublicExponent: Uint8Array = new Uint8Array( [ 1, 0, 1 ] );

	// endregion

	// region *** GETTER (PUBLIC) ***

	public get deriveAlgorithm(): string {

		return this._deriveAlgorithm;

	}

	public get deriveIterations(): number {

		return this._deriveIterations;

	}

	public get hashAlgorithm(): string {

		return this._hashAlgorithm;

	}

	public get synchronousAlgorithm(): string {

		return this._synchronousAlgorithm;

	}

	public get synchronousLength(): number {

		return this._synchronousLength;

	}

	public get asynchronousAlgorithm(): string {

		return this._asynchronousAlgorithm;

	}

	public get asynchronousLength(): number {

		return this._asynchronousLength;

	}

	public get asynchronousPublicExponent(): Uint8Array {

		return this._asynchronousPublicExponent;

	}

	// endregion

}

@Injectable( {
	providedIn: 'root'
} )
export class ConfigService {

	// region *** MEMBER (PRIVATE) ***

	/* Common */
	private _debug: boolean = false;

	/* Backend specific */
	private _serverUrl: string = 'https://api.mumbler.eu';

	/* Crypto specific */
	private _crypto: CryptoConfig = new CryptoConfig();

	// endregion


	// region *** GETTER (PUBLIC) ***

	public get debug(): boolean {

		return this._debug;

	}

	public get serverUrl(): string {

		return this._serverUrl;

	}

	public get crypto(): CryptoConfig {

		return this._crypto;

	}

	// endregion


	// region *** SETTER (PUBLIC) ***

	public set debug( value: boolean ) {

		this._debug = value;

	}

	// endregion

}
