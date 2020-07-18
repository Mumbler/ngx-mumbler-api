/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest } from './base.request';
import { MumblerId } from '../../types/mumbler-id.type';
import { Mumble } from '../../delegation/socket/delegation.mumble.class';

export class DelegationRequest extends BaseRequest {

	public delegateTo: MumblerId;
	public mumblerId: MumblerId;
	public payload: string;
	public sent: number;

	public constructor( mumble: Mumble ) {

		super();

		this.mumblerId = mumble.mumblerId.mumblerId;
		this.delegateTo = mumble.transmitPayload.delegateTo;
		this.payload = mumble.transmitPayload.payload;

	}

}
