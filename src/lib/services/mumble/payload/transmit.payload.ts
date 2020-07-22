/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { MumblerId } from '../../types/mumbler-id.type';
import { AppsMessage } from './apps/apps-message.abstract';

export class TransmitPayload {

	public delegateTo: MumblerId;
	public delegated: number;
	public payload: AppsMessage;

	public constructor( delegateTo: MumblerId, payload?: AppsMessage, delegated: number = -1 ) {

		this.delegateTo = delegateTo;
		this.payload = payload;
		this.delegated = delegated;

	}

}
