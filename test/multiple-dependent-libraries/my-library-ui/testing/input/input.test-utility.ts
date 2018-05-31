import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

/**
 * UI Input Component Test Utilify
 */
export class UIInputComponentTestUtility {

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
