/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BasePayload } from './base.payload';
import { MumblerId }   from '../../types/mumbler-id.type';

export class MumblerIdPayload extends BasePayload {

    public mumblerId: MumblerId;

    public constructor( mumblerId: MumblerId ) {

        super();
        this.mumblerId = mumblerId;

    }

}
