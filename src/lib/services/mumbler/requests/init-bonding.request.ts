/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest } from './base.request';

export class InitBondingRequest extends BaseRequest {

	public mumblerId: string;

	public constructor( mumblerId: string ) {

		super();
		this.mumblerId = mumblerId;

	}

}
