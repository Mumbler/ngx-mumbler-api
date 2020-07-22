/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { AppsMessage } from '../apps-message.abstract';
import { EncryptedPayload } from '../../../../crypto/crypto.service';

export class AppsDakMessage extends AppsMessage {

	/**
     * Initializes a new AppsDakMessage object
     *
     * @param {string} _topicId                      Optional: For this use-case important
     * @param {EncryptedPayload} content            Mandatory: Contains the mumbled content
     * @param {Array<EncryptedPayload>} files       Mandatory: Contains the mumbled file(s)
     * @param {number} _index                        Optional: For this use-case important (=> FYI: maybe possible to track single message <[ not the content/file(s)! ]>)
     * @param {number} _senderTime                   Optional: For this use-case important (=> FYI: maybe possible to track single message <[ not the content/file(s)! ]>)
     */
	public constructor(
		private readonly _topicId: string,
		content: EncryptedPayload,
		files: Array< EncryptedPayload > = null,
		private _index: number = 0,
		private _senderTime: number = Date.now()
	) {

		super( content, files );

	}


	public get index(): number {

		return this._index;

	}

	public set index( value: number ) {

		this._index = value;

	}

	public get senderTime(): number {

		return this._senderTime;

	}

	public set senderTime( value: number ) {

		this._senderTime = value;

	}

	public get topicId(): string {

		return this._topicId;

	}

}
