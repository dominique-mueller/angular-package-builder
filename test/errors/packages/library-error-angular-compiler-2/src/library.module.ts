import { CommonModule } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';

import { LibraryInputComponent } from './input/input.component';

/**
 * UI Module
 */
@NgModule( {
	declarations: [
		LibraryInputComponent
	],
	exports: [
		LibraryInputComponent
	],
	imports: [
		CommonModule
	],
	providers: [
		{
			provide: LOCALE_ID,
			useFactory: factoryFn
		}
	]
} )
export class LibraryUIModule {}

function factoryFn() {
	return () => 'de-DE';
}
