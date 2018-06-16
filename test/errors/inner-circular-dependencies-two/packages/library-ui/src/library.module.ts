import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LibraryCoreModule } from '@library-inner-circular-dependencies-two/core';

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
