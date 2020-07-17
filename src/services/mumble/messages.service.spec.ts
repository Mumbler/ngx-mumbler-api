/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { TestBed } from '@angular/core/testing';

import { MumbleService } from './mumble.service';

describe( 'MessagesService', () => {

	let service: MumbleService;

	beforeEach( () => {

		TestBed.configureTestingModule( {} );
		service = TestBed.inject( MumbleService );

	} );

	it( 'should be created', () => {

		expect( service ).toBeTruthy();

	} );

} );
