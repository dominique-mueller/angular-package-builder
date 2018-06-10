import { By } from '@angular/platform-browser';
import { DebugElement, Injectable } from '@angular/core';

/**
 * Input Component Test Utility
 */
@Injectable()
export class MyLibraryInputComponentTestUtility {

	/**
	 * Get input element from the given input component elemnet
	 *
	 * @param   element Input component element
	 * @returns         Input element
 	 */
	public static getInputElement( element: DebugElement ): DebugElement {
		return element.query( By.css( 'ui-input__input' ) );
	}

}
