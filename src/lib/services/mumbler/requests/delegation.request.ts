/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest }                from './base.request';
import { MumblerId }                  from '../../types/mumbler-id.type';
import { Mumble }                     from '../../delegation/socket/delegation.mumble.class';
import { SerializedEncryptedPayload } from '../../crypto/crypto.service';

export class DelegationRequest extends BaseRequest {

    public authorization: string;
    public delegateTo: MumblerId;
    public files: Array< SerializedEncryptedPayload >;
    public mumblerId: MumblerId;
    public payload: SerializedEncryptedPayload;
    public sent: number;

    /**
     * Serialize the mumble for delegation request
     *
     * FYI: "authorisation" is only required when delegation via WebSocket,
     * otherwise the authorization is handled via request header
     *
     * @param {Mumble} mumble
     * @param {string} authorization
     */
    public constructor( mumble: Mumble, authorization: string = null ) {

        super();

        if ( !! authorization ) {

            this.authorization = authorization;

        }
        this.mumblerId = mumble.mumblerId.mumblerId;
        this.delegateTo = mumble.transmitPayload.delegateTo;
        this.sent = Date.now();
        this.payload = mumble.transmitPayload.payload;
        this.files = mumble.transmitPayload.files;

    }

}
