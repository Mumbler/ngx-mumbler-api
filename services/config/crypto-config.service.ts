/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

import { Inject, Injectable } from '@angular/core';
import { CommunicationParameter, communicationParameterInjectionToken } from '../../common/communication-parameter.class';

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

	public constructor(
		@Inject( communicationParameterInjectionToken ) private readonly _communicationParameter: CommunicationParameter
	){}

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

}
