import { NgModule } from '@angular/core';

import { UITrackingService } from './tracking/tracking.service';

/**
 * My Library Tracking Module
 */
@NgModule( {
	providers:[
		UITrackingService
	]
} )
export class MyLibraryTrackingModule {}
