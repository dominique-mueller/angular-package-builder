import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputComponent } from './components/input.component';
import { StoreService } from './services/store.service';

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
		StoreService
	]
} )
export class TestLibraryModule {}
