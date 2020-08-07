# NgxMumblerApi

Reference implementation of a client module using the mumbler system.

## Requirements

You'll need Angular's core files in version 10 and the typescript library in (at least) version 2, e.g.:

```json
{
    "dependencies": {
        "@angular/common": "^10.0.4",
        "@angular/core": "^10.0.4",
        "tslib": "^2.0.0"
    }
}
``` 

The "tslib" is pulled automatically via npm.

In case of Angular's version: A minor version should work as well but may require some minor adaptions.

## Installation

Simply put the "ngx-mumbler-api" to your "dependencies" section within your package.json and run ```npm install```.

## Usage

The mumbler system basically knows four operations, on-boarding, bonding, sending and receiving. 
Each operation is described below including a code example. The used "Mumble(r)Service" must be 
included in your controller/service constructor, like:

````typescript
public constructor(
    private readonly _mumblerService: MumblerService,
    private readonly _mumbleService: MumbleService
) {}
````

__All subsequent examples uses those one or both of these injected services.__

FYI Service distinction:

* MumblerService: Access to methods used to interact with the mumbler system, like on-boarding & bonding
* MumbleService: Access to methods used to interact with a single mumble message including sending a mumble

### On-Boarding

In order to signup "on-boarding" your client application to the mumbler system, run the following code:

````typescript
this._mumblerService.onboarding( mumblerNick ).subscribe( { complete: () => {

    // handle the complete case

} } );
````  

The ```mumblerNick``` can be chosen freely and may be already used by someone else. The nick name does **not** identify 
a mumbler account rather than help the user recognize its contacts more easily.

### Bonding

To allow another mumbler account to exchange information with your account the two mumbler accounts must be bonded.
The bonding process is a multi-stage procedure. Start the procedure by creating bonding information, like:

```typescript
this._mumblerService.initBonding().pipe(

    tap( ( response: BondingParameterModel ) => {

        console.log( StaticConversion.ConvertBufferToString( response.token ) );
        console.log( StaticConversion.ConvertBufferToBase64( response.totp ) );

    } )

).subscribe();
```

After the bonding initialization is successful, you'll receive two buffers, a bonding token, and a bonding key. 
Both can be easily converted into various string-based formats (e.g. Hex or Base64) using the ```StaticConversion``` class
of the ngx-mumbler-api module.

In order to proceed with the bonding process you'll need to share those two information with your other mumbler user, e.g. via 
QR-code. Please be aware, that a bonding request is not valid indefinitely.

After sharing the two information a bonding can commence (on the bonding target):

```typescript
this._mumblerService.commenceBonding( token, totp ).pipe(

    tap( ( mumblerId: string ) => {

        console.log( `Bonded with ${ mumblerId }` );

    } )

).subscribe();
```

A successful bonding returns the ```mumblerId``` of the bonded account. After this step the two mumblers 
(you and your bonding partner instance) can exchange information.

FYI: Successful bonding is always bi-directional (two-way): When you bond with another mumbler account and this 
account commences the bonding process you'll be bi-directional bonded! A separate vice-versa bonding process is **not** required. 

### Sending

Prerequisite: To send a mumble to another mumbler you'll need to be bonded with the recipient mumbler account.

A mumble can hold two types of communication data, simple text (a string) and one or multiple binary blobs (files).

A complete example of creating and sending a mumble:

````typescript
this._mumbleService.createNewMumble( 
    recipientMumblerId,     /* Recipients mumblerId (must be bonded) */ 
    content,                /* Your app based content, e.g. Text or Control-Command */
    files                   /* A list of Blobs, e.g. Image file */
).pipe(

    switchMap( ( mumble: Mumble ) => this._mumbleService.sendMumble( mumble ) )

).subscribe( {
    complete: () => {

        // Sending completed

    }
} );
````

#### Mumble Content

The content accepted by a mumbler must inherit from the abstract class ``AppsMessage``. You can extend this base "content" class
as you like but keep in mind, all additional fields must be serializable via JSON. An example of a content class:

````typescript
import { AppsMessage } from 'ngx-mumbler-api';

export class VeryCoolAppMessage extends AppsMessage {

    public coolInfo1: number;
    public coolInfo2: string;

    /**
     * Initializes a new VeryCoolAppMessage class
     *
     * @param {number} coolInfo1            Optional: Something you need for your app (WON'T BE NOT ENCRPYTED)
     * @param {string} content              Mandatory: Contains the mandatory mumbled content (WILL BE MUMBLED => ENCRYPTED)
     * @param {string} coolInfo2            Optional: Something you need for your app (WON'T BE NOT ENCRPYTED)
     */
    public constructor(
        coolInfo1: number,
        coolInfo2: string,
        content: string
    ) {

        super( content );   // <= This content string will be automatically encrypted before sending and decrypted on receiveing

        this.coolInfo1 = coolInfo1;
        this.coolInfo2 = coolInfo2;

    }

}
```` 

The above example extends the basic ```AppsMessage``` with two additional fields ("coolInfo1" and "coolInfo2"). Those fields
won't be mumbled (encrypted) on transport. But those can be necessary for your implementation, 
eg. to associate mumbles within a thread.  

#### Mumble File(s)

A mumble can contain 0-n files in the form of Uint8Array(s). The ``createNewMumble`` method optionally accepts an array
of Uint8Array-encoded binary blobs. There are lots of implementations on how to convert a (Dom-) File to a UInt8Array out there.
The ``StaticConversion`` class provides mechanisms to help you convert a File/Blob into a Uint8Array:

````typescript
private files: Array< Uint8Array > = new Array< Uint8Array >();

/*
...
*/

// "FileList" provided by, e.g.: 
// <input #file type="file" (change)="addFiles( file.files )" ... />
public addFiles( files: FileList ): void {

        const observables: Array< Observable< Uint8Array > > = [];

        for ( let i: number = 0; i<files.length; i++ ) {

            observables.push( StaticConversion.ConvertFileToBuffer( files.item( i ) ) );

        }

        forkJoin( ...observables ).pipe(

            tap( ( results: Array< Uint8Array > ) => {

                this.files.push( ...results );  // <= No contain all files as Uint8Array(s)

            } )

        ).subscribe();

    }
```` 

### Receiving

In order to receive mumbles you need to listen to the mumbler delegation service. When listening to the mumbler delegation service
a WebSocket connection is opened, and a observable is returned. When a mumble is delegated into your mumbler account
the observable will emit a next event in which you can store/process the mumble. The following example is a simple
receiving-observable-pipeline: 

````typescript
this._mumbleService.listen().pipe(      // <= Only emits on new mumble delegation (or on error)

    switchMap( ( mumble: Mumble ) => forkJoin( [

        this._mumbleService.decryptMumbleContent( mumble ),     // <= decrypt content (e.g. "VeryCoolAppMessage")
        // eslint-disable-next-line @typescript-eslint/typedef
        ...mumble.transmitPayload.files.map( ( value, index ) => this._mumbleService.decryptMumbleFile( mumble, index ) )

    ] ) ),

    switchMap( ( content: [string, ...Array< Blob > ] ) => of( JSON.parse( content[ 0 ] ) as VeryCoolAppMessage ) ),

).subscribe();
```` 

First the `listen()` method is called which emits on delegation with a mumble object.
The mumble is still encrypted. To decrypt the content you have to call `decryptMumbleContent`. In order to decrypt
the file(s) as well you'll need to call `decryptMumbleFile` providing the index of the file you want to decrypt.

Finally, the decrypted content can now be casted into your custom "VeryCoolAppMessage" object.

# About

Mumbler was born as an idealist idea to apply the principals of the "Briefgeheimnis" to the digital age. 
We are very low on budget and are currently solely founded through and legally constituted 
within the austrian-based startup company mumbler gmbh.

Further we're currently in the progress of setting up a Indiegogo campaign to help found the infrastructure costs. 
In the meantime it would be great if you could support our efforts by 
[donating a couple of euros](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EZ2DJPABLJS6J).

## Support

Please support the project with your coding-, design-, brain-time and/or spread the word.

Of course **operating the infrastructure is a big issue** as well. 
It would be great if you could support us by donating a couple of euros:

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EZ2DJPABLJS6J)

**Thank you very much and we'll hope you’re as excited as we are on the idea of bringing back the “Briefgeheimnis” 
to the digital age.**

## Code of conduct

Lust but not least please read the [COC.md](COC.md) file for details on our code of conduct. Contributing to the
mumbler initiative you implicitly agree to our code of conduct and the mumbler intention.

# Further information

The module follows the idea of the mumble initiative and utilizes its specifications. 

## Mumbler Initiative - The idea

The goal of the Mumbler initiative is to resurrect the german law concept of the 
“[Briefgeheimnis](https://de.wikipedia.org/wiki/Briefgeheimnis)” which translates to 
[secrecy of correspondence](https://en.wikipedia.org/wiki/Secrecy_of_correspondence) and is the basis for
privacy of correspondence. For centuries opening and/or reading a correspondence which was intended for 
someone else was a criminal act, often punished by jail time. The french King Louis XV even declared the death 
penalty on breaking the "Briefgeheimnis" (with his edict on 25. Sep 1742).

Today it is a well-known fact that all digital correspondence is stored somewhere and 
is read, analyzed, profiled and last but not least profited off by many parties.

The Mumbler initiative is convinced that it should be of paramount importance to keep the 
information where it belongs:
 
**Only in the hands of the communication parties themselves.**

The Mumbler initiative was created to achieve exactly that. Analog letters have/had the "Briefgeheimnis", 
digital correspondence have Mumbler.

Further information can be found at [mumbler initiative](https://github.com/mumbler)

## Mumbler Initiative - Initiator

Mumbler was created and is currently operated by:

```
mumbler gmbh
Jakob-Haringer-Str. 1
5020 Salzburg

hello@mumbler.eu
```
