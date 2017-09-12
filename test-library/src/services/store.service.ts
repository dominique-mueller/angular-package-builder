import { Injectable } from '@angular/core';

/**
 * Store service
 */
@Injectable()
export class StoreService {

	/**
	 * Fetched flag
	 */
	public isFetched: boolean;

	/**
	 * Data
	 */
	private data: TestInterface;

	/**
	 * Constructor
	 */
	constructor() {
		this.isFetched = false;
		this.data = {};
		this.fetchData();
	}

	/**
	 * Fetch data
	 */
	private fetchData(): void {
		this.data = {
			test: 'what'
		};
	}

	/**
	 * Get data
	 *
	 * @param   path - Path to data set
	 * @returns      - Data set
	 */
	public getData( path: string ): any {
		return this.data[ path ];
	}

}
