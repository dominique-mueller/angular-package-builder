import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LibraryCoreModule } from '@library/core';

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
		LibraryCoreModule
	]
} )
export class LibraryUIModule {}
