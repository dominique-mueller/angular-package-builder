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
			useFactory: () => {
				return 'de-DE';
			}
		}
	]
} )
export class LibraryUIModule {}
