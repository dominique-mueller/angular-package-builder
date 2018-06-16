import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LibraryCoreModule } from '@library-cirulcar-dependencies-three/core';

import { LibraryInputComponent } from '@library-cirulcar-dependencies-three/ui/src/input/input.component';

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
