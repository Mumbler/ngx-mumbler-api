/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { MumblerId }                  from '../../types/mumbler-id.type';
import { SerializedEncryptedPayload } from '../../crypto/crypto.service';

export class TransmitPayload {

    public delegateTo: MumblerId;
    public files: Array< SerializedEncryptedPayload >;
    public payload: SerializedEncryptedPayload;
    public sent: number;

    public constructor( delegateTo: MumblerId, payload: SerializedEncryptedPayload = null, files: Array< SerializedEncryptedPayload > = [], sent: number = -1 ) {

        this.delegateTo = delegateTo;
        this.files = files;
        this.payload = payload;
        this.sent = sent;

    }

}
