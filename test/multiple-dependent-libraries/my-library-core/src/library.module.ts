import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MyLibraryUIModule } from '@my-library/ui';

import { UIFormControlRegistryService } from './form-control-registry/form-control-registry.service';

/**
 * My Library Core Module
 */
@NgModule( {
	imports: [
		CommonModule,
		MyLibraryUIModule
	],
	providers: [
		UIFormControlRegistryService
	]
} )
export class MyLibraryCoreModule {}
