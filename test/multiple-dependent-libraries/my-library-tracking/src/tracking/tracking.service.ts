import { Injectable } from '@angular/core';

/**
 * UI Tracking Service
 */
@Injectable()
export class UITrackingService {

	/**
	 * Track page
	 *
	 * @param url Page URL
	 */
	public trackPage( url: string ): void {
		console.log( `VISITED PAGE: "${ url }"` );
	}

}
