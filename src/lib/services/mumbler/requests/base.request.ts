/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
export class BaseRequest {

	public readonly time: number = Date.now();
	public readonly version: number;

	public constructor( version: number = 1 ) {

		this.version = version;

	}

}
