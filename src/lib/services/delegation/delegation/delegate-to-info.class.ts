/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { MumblerId } from '../../types/mumbler-id.type';

export class DelegateToInfo {

	public mumblerId: MumblerId;
	public name: string;
	public public: ArrayBuffer;

	public constructor( mumblerId: string, name: string, publicKey: ArrayBuffer ) {

	    this.mumblerId = mumblerId;
		this.name = name;
		this.public = publicKey;

	}

}
