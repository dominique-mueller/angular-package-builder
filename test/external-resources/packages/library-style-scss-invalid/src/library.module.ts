import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
		CommonModule,
	]
} )
export class LibraryUIModule {}
