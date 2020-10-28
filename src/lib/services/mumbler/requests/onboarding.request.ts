/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest } from './base.request';

export class OnboardingRequest extends BaseRequest {

    public mumblerId: string;
    public name: string;
    public public: string;

    public constructor( mumblerName: string, publicKey: string, mumblerId: string = undefined ) {

	    super();

        this.name = mumblerName;
        this.public = publicKey;
        this.mumblerId = mumblerId;

    }

}
