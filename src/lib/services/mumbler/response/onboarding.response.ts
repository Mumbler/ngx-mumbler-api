/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseResponse } from './base.response';

export class OnboardingResponse extends BaseResponse {

    public mumblerId: string;
	public totpKey: string;

}
