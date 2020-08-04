/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { WebSocketResponse } from './web-socket.response';

export class HeartbeatResponse extends WebSocketResponse {

    public heartbeat: number;

}
