import { NgModule } from '@angular/core';

import { LibraryTrackingService } from './tracking/tracking.service';

/**
 * Tracking Module
 */
@NgModule( {
	providers: [
		LibraryTrackingService
	]
} )
export class LibraryTrackingModule {}
