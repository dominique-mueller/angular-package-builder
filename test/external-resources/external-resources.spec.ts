import { runAngularPackageBuilder } from '../../index';
import { expectInlineStyle } from '../utilities/expect-inline-style';
import { expectInlineTemplate } from '../utilities/expect-inline-template';

/**
 * Unit Test: External Resources
 */
describe( 'External Resources', () => {

	describe( '(template)', () => {

		beforeAll( async() => {
			await runAngularPackageBuilder( [
				'test/external-resources/packages/library-template-html/.angular-package.json',
			] );
		} );

		expectInlineTemplate(
			'test/external-resources/packages/library-template-html/dist',
			'library-template-html',
			'src/input/input.component',
			'LibraryInputComponent',
			'<label class="ui-input__container"><span class="ui-input__label">{{ label }}</span><input #input (change)="onChange( input.value )" [value]="model" class="ui-input__field"></label>'
		);

	} );

	describe( '(empty template)', () => {

		beforeAll( async() => {
			await runAngularPackageBuilder( [
				'test/external-resources/packages/library-template-html-empty/.angular-package.json',
			] );
		} );

		expectInlineTemplate(
			'test/external-resources/packages/library-template-html-empty/dist',
			'library-template-html-empty',
			'src/input/input.component',
			'LibraryInputComponent',
			''
		);

	} );

	describe( '(CSS style)', () => {

		beforeAll( async() => {
			await runAngularPackageBuilder( [
				'test/external-resources/packages/library-style-css/.angular-package.json',
			] );
		} );

		expectInlineStyle(
			'test/external-resources/packages/library-style-css/dist',
			'library-style-css',
			'src/input/input.component',
			'LibraryInputComponent',
			'ui-input{display:block}.ui-input__container{padding:1rem}.ui-input__label{color:#333;font-size:1.4rem;cursor:pointer}.ui-input__field{border:1px solid #999}'
		);

	} );

	describe( '(empty CSS style)', () => {

		beforeAll( async() => {
			await runAngularPackageBuilder( [
				'test/external-resources/packages/library-style-css-empty/.angular-package.json',
			] );
		} );

		expectInlineStyle(
			'test/external-resources/packages/library-style-css-empty/dist',
			'library-style-css-empty',
			'src/input/input.component',
			'LibraryInputComponent',
			''
		);

	} );

	describe( '(SASS style)', () => {

		beforeAll( async() => {
			await runAngularPackageBuilder( [
				'test/external-resources/packages/library-style-scss/.angular-package.json',
			] );
		} );

		expectInlineStyle(
			'test/external-resources/packages/library-style-scss/dist',
			'library-style-scss',
			'src/input/input.component',
			'LibraryInputComponent',
			'ui-input{display:block}.ui-input__container{padding:1rem}.ui-input__label{color:#333;font-size:1.4rem;cursor:pointer}.ui-input__field{border:1px solid #999}'
		);

	} );

	describe( '(empty SASS style)', () => {

		beforeAll( async() => {
			await runAngularPackageBuilder( [
				'test/external-resources/packages/library-style-scss-empty/.angular-package.json',
			] );
		} );

		expectInlineStyle(
			'test/external-resources/packages/library-style-scss-empty/dist',
			'library-style-scss-empty',
			'src/input/input.component',
			'LibraryInputComponent',
			''
		);

	} );

} );
