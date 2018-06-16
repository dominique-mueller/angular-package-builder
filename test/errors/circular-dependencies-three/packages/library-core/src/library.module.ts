import { NgModule } from '@angular/core';

import { LibraryFormControlRegistryService } from '@library-cirulcar-dependencies-three/core/src/form-control-registry/form-control-registry.service';

/**
 * My Library Core Module
 */
@NgModule( {
	providers: [
		LibraryFormControlRegistryService
	]
} )
export class LibraryCoreModule {}
