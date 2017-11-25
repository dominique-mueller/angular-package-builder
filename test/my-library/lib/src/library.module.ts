import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LIBInputComponent } from './input/input.component';
import { LIBDataService } from './data/data.service';

/**
 * Notifier module
 */
@NgModule( {
	declarations: [
		LIBInputComponent
	],
	exports: [
		LIBInputComponent
	],
	imports: [
		CommonModule
	],
	providers: [
		LIBDataService
	]
} )
export class LIBModule {}
