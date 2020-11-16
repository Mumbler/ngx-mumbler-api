/***********************************************
********* Copyright mumbler gmbh 2020 **********
************* All rights reserved **************
************************************************/
import { Injectable } from '@angular/core';

function windowRef(): Window {

    return window;

}

@Injectable()
export class WindowService {

    public get nativeWindow(): Window {

        return windowRef();

    }

}
