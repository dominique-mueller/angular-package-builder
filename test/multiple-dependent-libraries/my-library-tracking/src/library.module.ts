import { NgModule } from '@angular/core';

import { MyLibraryTrackingService } from './tracking/tracking.service';

/**
 * Tracking Module
 */
@NgModule( {
	providers: [
		MyLibraryTrackingService
	]
} )
export class MyLibraryTrackingModule {}
