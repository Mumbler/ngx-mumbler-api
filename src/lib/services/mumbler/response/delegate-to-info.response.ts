/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { SerializedEncryptedPayload } from '../../crypto/crypto.service';
import { BaseResponse }               from './base.response';

export class DelegateToInfoResponse extends BaseResponse {

    public name: SerializedEncryptedPayload;
    public public: SerializedEncryptedPayload;

}
