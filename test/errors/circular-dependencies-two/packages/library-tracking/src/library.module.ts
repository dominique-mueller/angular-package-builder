import { NgModule } from '@angular/core';

import { LibraryTrackingService } from '@library-cirulcar-dependencies-two/tracking/src/tracking/tracking.service';

/**
 * Tracking Module
 */
@NgModule( {
	providers: [
		LibraryTrackingService
	]
} )
export class LibraryTrackingModule {}
