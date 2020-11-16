/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { MumblerId }    from '../../types/mumbler-id.type';
import { BaseResponse } from './base.response';

export class AssociatedMumblersResponse extends BaseResponse {

    public group: Array< MumblerId >;

}
