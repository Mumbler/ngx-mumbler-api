/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest } from './base.request';

export class OnboardingRequest extends BaseRequest {

	public mumblerName: string;
	public publicKey: string;

	public constructor( mumblerName: string, publicKey: string ) {

	    super();

		this.mumblerName = mumblerName;
		this.publicKey = publicKey;

	}

}
