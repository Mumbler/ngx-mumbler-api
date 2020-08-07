/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseResponse } from './base.response';
import { SerializedEncryptedPayload } from '../../crypto/crypto.service';

export class DelegateToInfoResponse extends BaseResponse {

	public name: SerializedEncryptedPayload;
	public public: string;

}
