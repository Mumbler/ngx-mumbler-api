/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

export abstract class AppsMessage {

    // TODO: Add custom validation for EncryptedPayload
    private readonly _content: string;

    protected constructor( content: string ) {

        this._content = content;

    }

    public get content(): string {

        return this._content;

    }

}
