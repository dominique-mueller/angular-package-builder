import { NgModule } from '@angular/core';

import { LibraryFormControlRegistryService } from './form-control-registry/form-control-registry.service';

/**
 * My Library Core Module
 */
@NgModule( {
	providers: [
		LibraryFormControlRegistryService
	]
} )
export class LibraryCoreModule {}
