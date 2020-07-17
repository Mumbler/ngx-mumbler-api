/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseResponse } from './base.response';
import { EncryptedPayload } from '../../crypto/crypto.service';

export class DelegateToInfoResponse extends BaseResponse {

	public name: EncryptedPayload;
	public public: EncryptedPayload;

}
