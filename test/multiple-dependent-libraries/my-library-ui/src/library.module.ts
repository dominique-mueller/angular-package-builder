import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UIInputComponent } from './input/input.component';

/**
 * My Library UI Module
 */
@NgModule( {
	declarations: [
		UIInputComponent
	],
	exports: [
		UIInputComponent
	],
	imports: [
		CommonModule
	]
} )
export class MyLibraryUIModule {}
