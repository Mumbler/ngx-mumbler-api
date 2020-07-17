/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BasePayload } from './base.payload';
import { MumblerId } from '../../types/mumbler-id.type';

export class TransmitPayload extends BasePayload {

	public delegateTo: MumblerId;
	public payload: string;
	public sent: number;

	public constructor( delegateTo: MumblerId, payload?: string, sent: number = -1 ) {

		super();

		this.delegateTo = delegateTo;
		this.payload = payload;
		this.sent = sent;

	}

}
