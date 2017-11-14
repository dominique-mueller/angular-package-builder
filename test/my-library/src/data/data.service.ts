import { Injectable } from '@angular/core';

/**
 * Data service
 */
@Injectable()
export class DataService {

	/**
	 * Data
	 */
	private data: any;

	/**
	 * Constructor
	 */
	constructor() {
		this.data = {};
		window.stuff = this;
	}

	/**
	 * Get data
	 *
	 * @param   key  - Key
	 * @param   data - Data
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
