/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BasePayload } from './base.payload';

export class AuthorisationPayload extends BasePayload {

	public authorization: string;

	public constructor( authorization: string ) {

		super();
		this.authorization = authorization;

	}

}
