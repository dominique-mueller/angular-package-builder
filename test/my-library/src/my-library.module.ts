import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputComponent } from './input/input.component';
import { DataService } from './data/data.service';

/**
 * Notifier module
 */
@NgModule( {
	declarations: [
		InputComponent
	],
	exports: [
		InputComponent
	],
	imports: [
		CommonModule
	],
	providers: [
		DataService
	]
} )
export class MyLibraryModule {}
