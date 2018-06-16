import { By } from '@angular/platform-browser';
import { DebugElement, Injectable } from '@angular/core';

import { LibraryInputComponent } from '@library-inner-cirulcar-dependencies-two/ui';

/**
 * Input Component Test Utility
 */
@Injectable()
export class LibraryInputComponentTestUtility {

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
