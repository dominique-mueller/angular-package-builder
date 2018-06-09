import { NgModule } from '@angular/core';

import { MyLibraryFormControlRegistryService } from './form-control-registry/form-control-registry.service';

/**
 * My Library Core Module
 */
@NgModule( {
	providers: [
		MyLibraryFormControlRegistryService
	]
} )
export class MyLibraryCoreModule {}
