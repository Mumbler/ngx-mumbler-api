/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { MumblerIdPayload } from '../../mumble/payload/mumbler-id.payload';
import { TransmitPayload } from '../../mumble/payload/transmit.payload';


export class Mumble {

	public mumblerId: MumblerIdPayload;
	public transmitPayload: TransmitPayload;

	public constructor( mumblerId: string, delegateTo: string ) {

		this.mumblerId = new MumblerIdPayload( mumblerId );
		this.transmitPayload = new TransmitPayload( delegateTo );

	}



	// public static FromJson( data: unknown ): Mumble | null {
	//
	// 	if (
	// 		!! data && data instanceof Object &&
	//         data.hasOwnProperty( 'payload' ) &&
	//         data.hasOwnProperty( 'recipientChannelId' ) &&
	//         data.hasOwnProperty( 'senderChannelId' ) &&
	//         data.hasOwnProperty( 'sent' )
	// 	) {
	//
	// 		try {
	//
	// 			const channelMessage: Mumble = new Mumble();
	//
	// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 			channelMessage.payload = data[ 'payload' ];
	// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 			channelMessage.recipientChannelId = data[ 'recipientChannelId' ];
	// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 			channelMessage.senderChannelId = data[ 'senderChannelId' ];
	// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 			channelMessage.sent = data[ 'sent' ];
	//
	// 			return channelMessage;
	//
	// 		} catch ( e ) {
	//
	// 			return null;
	//
	// 		}
	//
	// 	}
	//
	// 	return null;
	//
	// }
	//
	// public toJson(): string {
	//
	// 	return JSON.stringify( {
	// 		payload: this.payload,
	// 		recipientChannelId: this.recipientChannelId,
	// 		senderChannelId: this.senderChannelId,
	// 		sent: this.sent
	// 	} );
	//
	// }
	//
	// public toString(): string {
	//
	// 	return `channel message from "${ this.senderChannelId }" to "${ this.recipientChannelId }" sent on "${ this.sent }"`;
	//
	// }

}
