import { Injectable } from '@angular/core';

/**
 * Data service
 */
@Injectable()
export class LIBDataService {

	/**
	 * Data
	 */
	private data: { [ key: string ]: string };

	/**
	 * Constructor
	 */
	constructor() {
		this.data = {};
	}

	/**
	 * Get data
	 *
	 * @param key  - Key
	 * @param data - Data
	 */
	public setData( key: string, data: any ): void {
		this.data[ key ] = data;
	}

	/**
	 * Get data
	 *
	 * @param   key - Key
	 * @returns     - Data
	 */
	public getData( key: string ): any {
		return this.data[ key ];
	}

}
