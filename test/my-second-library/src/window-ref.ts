import { Injectable } from '@angular/core';

@Injectable()
export class WindowRef {

    public readonly nativeWindow: Window;

    constructor() {
        this.nativeWindow = window;
    }

}
