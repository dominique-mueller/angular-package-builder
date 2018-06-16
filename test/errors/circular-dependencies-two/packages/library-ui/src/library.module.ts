import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LibraryCoreModule } from '@library-cirulcar-dependencies-two/core';

import { LibraryInputComponent } from '@library-cirulcar-dependencies-two/ui/src/input/input.component';

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
