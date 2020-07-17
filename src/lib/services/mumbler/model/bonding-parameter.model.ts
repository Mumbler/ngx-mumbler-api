/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

export class BondingParameterModel {

	public token: Uint8Array;
	public totp: Uint8Array;

	public constructor( token: Uint8Array, totp: Uint8Array ) {

		this.token = token;
		this.totp = totp;

	}

}
