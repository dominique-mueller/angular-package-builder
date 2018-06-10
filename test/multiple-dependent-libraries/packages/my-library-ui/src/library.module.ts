import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MyLibraryCoreModule } from '@my-library/core';

import { MyLibraryInputComponent } from './input/input.component';

/**
 * UI Module
 */
@NgModule( {
	declarations: [
		MyLibraryInputComponent
	],
	exports: [
		MyLibraryInputComponent
	],
	imports: [
		CommonModule,
		MyLibraryCoreModule
	]
} )
export class MyLibraryUIModule {}
