/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { Inject, Injectable } from '@angular/core';
import { MumblerParameter, mumblerParameterInjectionToken } from '../../common/parameter.class';

@Injectable( {
	providedIn: 'root'
} )
export class CryptoConfigService {

	// Asynchronous encryption specific
	private _asynchronousAlgorithm: string = 'RSA-OAEP';
	private _asynchronousLength: number = 4096;
	private _asynchronousPublicExponent: Uint8Array = new Uint8Array( [ 1, 0, 1 ] );


	// Derive specific
	private _deriveAlgorithm: string = 'PBKDF2';
	private _deriveIterations: number = 4294967296;    // 2 ^ 32

	// Hash
	private _hashAlgorithm: string = 'SHA-512';

	// Synchronous encryption specific
	private _synchronousAlgorithm: string = 'AES-CBC';
	private _synchronousLength: number = 256;

	// TOTP HMAC Algorithm name
	private _totpAlgorithm: string = 'HMAC';

	public constructor(
		@Inject( mumblerParameterInjectionToken ) private readonly _communicationParameter: MumblerParameter
	) {}

	public get asynchronousAlgorithm(): string {

		return this._asynchronousAlgorithm;

	}

	public get asynchronousLength(): number {

		return this._asynchronousLength;

	}

	public get asynchronousPublicExponent(): Uint8Array {

		return this._asynchronousPublicExponent;

	}

	public get deriveAlgorithm(): string {

		return this._deriveAlgorithm;

	}

	public get deriveIterations(): number {

		return this._deriveIterations;

	}

	public get hashAlgorithm(): string {

		return this._hashAlgorithm;

	}

	public get privateKey(): Uint8Array {

		return this._communicationParameter.crpytoCommunicationParameter.privateKey;

	}

	public set privateKey( value: Uint8Array ) {

		this._communicationParameter.crpytoCommunicationParameter.privateKey = value;

	}

	public get synchronousAlgorithm(): string {

		return this._synchronousAlgorithm;

	}

	public get synchronousLength(): number {

		return this._synchronousLength;

	}


	public get totpKey(): Uint8Array {

		return this._communicationParameter.crpytoCommunicationParameter.totpKey;

	}

	public set totpKey( value: Uint8Array ) {

		this._communicationParameter.crpytoCommunicationParameter.totpKey = value;

	}

	public get totpAlgorithm(): string {

		return this._totpAlgorithm;

	}

}
