/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/

export abstract class AppsMessage {

    public content: string;

    protected constructor( content: string ) {

        this.content = content;

    }

}
