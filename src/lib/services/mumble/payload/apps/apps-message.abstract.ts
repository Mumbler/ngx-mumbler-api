/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { EncryptedPayload } from '../../../crypto/crypto.service';

export abstract class AppsMessage {

	// TODO: Add custom validation for EncryptedPayload
	public readonly content: EncryptedPayload;

	// TODO: Validation
	public readonly files: Array< EncryptedPayload >;

	protected constructor( content: EncryptedPayload, files: Array<EncryptedPayload> ) {

		this.content = content;
		this.files = files;

	}

}
