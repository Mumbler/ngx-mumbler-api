/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest } from './base.request';

export class OnboardingRequest extends BaseRequest {

	public name: string;
	public public: string;

	public constructor( mumblerName: string, publicKey: string ) {

	    super();

		this.name = mumblerName;
		this.public = publicKey;

	}

}
