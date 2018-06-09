import { Injectable } from '@angular/core';

/**
 * Form Control Registry Service
 */
@Injectable()
export class MyLibraryFormControlRegistryService {

	/**
	 * Tracking Log
	 */
	private readonly registry: { [ id: string ]: any };

	/**
	 * Constructor
	 */
	constructor() {
		this.registry = {};
	}

	/**
	 * Register new form control
	 *
	 * @param id           ID
	 * @param componentRef Component ref
	 */
	public addFormControl( id: string, componentRef: any ): void {
		this.registry[ id ] = componentRef;
	}

	/**
	 * Unregister form control
	 *
	 * @param id ID
	 */
	public removeFormControl( id: string ): void {
		delete this.registry[ id ];
	}

}
