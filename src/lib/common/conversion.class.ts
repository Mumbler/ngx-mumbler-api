/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
export type Hex = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type HexString = Array<Hex>;
export type UuidHexString = Array<Hex & '-'>;

export const convertStringToUuidHexString: ( uuid: string )=> UuidHexString = ( uuid: string ) => {

    if ( !!!uuid ) {

        return null;

    }

    const uuidHexString: UuidHexString = new Array<Hex & '-'>();
    const test: string = uuid.toLocaleUpperCase();

    const base: Array<string> = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '-' ];

    for ( let index: number = 0; index < test.length; index++ ) {

        if ( base.includes( test.charAt( index ) ) ) {

            uuidHexString.push( test.charAt( index ) as never );

        }

    }

    return uuidHexString;

};

export const convertStringToHexString: ( hex: string )=> HexString = ( hex: string ) => {

    if ( !!!hex ) {

        return null;

    }

    const hexString: HexString = new Array<Hex>();
    const test: string = hex.toLocaleUpperCase();

    const base: Array<string> = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];

    for ( let index: number = 0; index < test.length; index++ ) {

        if ( base.includes( test.charAt( index ) ) ) {

            hexString.push( test.charAt( index ) as never );

        }

    }

    return hexString;

};
