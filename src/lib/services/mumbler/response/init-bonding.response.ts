/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseResponse } from './base.response';

export class InitBondingResponse extends BaseResponse {

	public token: string;
	public totp: string;

}
