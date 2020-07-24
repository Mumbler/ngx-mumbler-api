/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { EncryptedPayload } from '../lib/services/crypto/crypto.service';

export abstract class AppsMessage {

    // TODO: Add custom validation for EncryptedPayload
    private readonly _content: string;

    private _encryptedContent: EncryptedPayload;
    private _encryptedFiles: Array< EncryptedPayload >;

    // TODO: Validation
    private readonly _files: Array< Uint8Array >;

    protected constructor( content: string, files: Array< Uint8Array > ) {

        this._content = content;
        this._files = files;

    }

    public get content(): string {

        return this._content;

    }

    public get encryptedContent(): EncryptedPayload {

        return this._encryptedContent;

    }

    public set encryptedContent( value: EncryptedPayload ) {

        this._encryptedContent = value;

    }

    public get encryptedFiles(): Array<EncryptedPayload> {

        return this._encryptedFiles;

    }

    public set encryptedFiles( value: Array< EncryptedPayload > ) {

        this._encryptedFiles = value;

    }

    public get files(): Array<Uint8Array> {

        return this._files;

    }

}
