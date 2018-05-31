import { NgModule } from '@angular/core';

import { UIFormControlRegistryService } from './form-control-registry/form-control-registry.service';

/**
 * My Library Core Module
 */
@NgModule( {
	providers: [
		UIFormControlRegistryService
	]
} )
export class MyLibraryCoreModule {}
