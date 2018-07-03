import { expectInlineStyle } from '../utilities/expect-inline-style';
import { expectInlineTemplate } from '../utilities/expect-inline-template';

/**
 * Unit Test: External Resources
 */
describe( 'External resources', () => {

	describe( 'External HTML template', () => {

		expectInlineTemplate(
			'test/external-resources/packages/library-template-html/dist',
			'library-template-html',
			'src/input/input.component',
			'LibraryInputComponent',
			'<label class="ui-input__container"><svg height="210" width="400"><path d="M150 0 L75 200 L225 200 Z" /></svg><span class="ui-input__label">{{ label }}</span><input class="ui-input__field" #input type="text" [value]="model" (change)="onChange( input.value )"></label>'
		);

	} );

	describe( 'External empty HTML template', () => {

		expectInlineTemplate(
			'test/external-resources/packages/library-template-html-empty/dist',
			'library-template-html-empty',
			'src/input/input.component',
			'LibraryInputComponent',
			''
		);

	} );

	describe( 'External CSS style', () => {

		expectInlineStyle(
			'test/external-resources/packages/library-style-css/dist',
			'library-style-css',
			'src/input/input.component',
			'LibraryInputComponent',
			'ui-input{display:block}.ui-input__container{padding:1rem}.ui-input__label{color:#333;font-size:1.4rem;cursor:pointer}.ui-input__field{border:1px solid #999}'
		);

	} );

	describe( 'External empty CSS style', () => {

		expectInlineStyle(
			'test/external-resources/packages/library-style-css-empty/dist',
			'library-style-css-empty',
			'src/input/input.component',
			'LibraryInputComponent',
			''
		);

	} );

	describe( 'External SASS style', () => {

		expectInlineStyle(
			'test/external-resources/packages/library-style-scss/dist',
			'library-style-scss',
			'src/input/input.component',
			'LibraryInputComponent',
			'ui-input{display:block}.ui-input__container{padding:1rem}.ui-input__label{color:#333;font-size:1.4rem;cursor:pointer}.ui-input__field{border:1px solid #999}'
		);

	} );

	describe( 'External empty SASS style', () => {

		expectInlineStyle(
			'test/external-resources/packages/library-style-scss-empty/dist',
			'library-style-scss-empty',
			'src/input/input.component',
			'LibraryInputComponent',
			''
		);

	} );

} );
