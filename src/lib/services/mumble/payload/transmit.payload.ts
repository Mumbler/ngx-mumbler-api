/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { MumblerId }                  from '../../types/mumbler-id.type';
import { SerializedEncryptedPayload } from '../../crypto/crypto.service';

export class TransmitPayload {

    public delegateTo: MumblerId;
    public delegated: number;
    public files: Array< SerializedEncryptedPayload >;
    public payload: SerializedEncryptedPayload;

    public constructor( delegateTo: MumblerId, payload: SerializedEncryptedPayload = null, files: Array< SerializedEncryptedPayload > = null, delegated: number = -1 ) {

        this.delegateTo = delegateTo;
        this.delegated = delegated;
        this.files = files;
        this.payload = payload;

    }

}
