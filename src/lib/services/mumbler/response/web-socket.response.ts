/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseResponse } from './base.response';

export type WebSocketResponseEventType = 'delegation' | 'heartbeat' | 'unknown';

export class WebSocketResponse extends BaseResponse {

    public event: WebSocketResponseEventType;

}
