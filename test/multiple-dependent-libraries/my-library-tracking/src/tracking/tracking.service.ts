import { Injectable } from '@angular/core';

/**
 * Tracking Service
 */
@Injectable()
export class MyLibraryTrackingService {

	/**
	 * Track page
	 *
	 * @param url Page URL
	 */
	public trackPage( url: string ): void {
		console.log( `VISITED PAGE: "${ url }"` );
	}

}
