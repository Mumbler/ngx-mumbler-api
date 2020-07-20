/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
export abstract class BasePayload {

	public time: number;
	public version: number;

	protected constructor( time: number = Date.now(), version: number = 1 ) {

		this.time = time;
		this.version = version;

	}

}
