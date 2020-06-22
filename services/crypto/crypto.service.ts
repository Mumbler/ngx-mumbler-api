/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable } from '@angular/core';
import { TotpClass } from './totp.class';

@Injectable( {
	providedIn: 'root'
} )
export class CryptoService {

	private readonly _totp: TotpClass;

	public constructor(
	    private readonly _totpKey: CryptoKey
	) {

	    this._totp = new TotpClass( this._totpKey );

	}

	public get totp(): TotpClass {

		return this._totp;

	}

}
