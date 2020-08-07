/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { BaseRequest } from './base.request';
import { MumblerId }   from '../../types/mumbler-id.type';

export class CommenceBondingRequest extends BaseRequest {

    public bondingToken: string;
    public bondingTotp: string;
    public mumblerId: MumblerId;

    public constructor( bondingToken: string, bondingTotp: string, mumblerId: string ) {

        super();
        this.bondingToken = bondingToken;
        this.bondingTotp = bondingTotp;
        this.mumblerId = mumblerId;

    }

}
