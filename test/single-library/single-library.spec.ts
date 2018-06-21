import { expectPackage } from '../utilities/expect-package';

/**
 * Unit Test: Single Library
 */
describe( 'Single Library', () => {

	expectPackage( {
		packageName: 'library',
		root: 'test/single-library/packages/library',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'LibraryUIModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/input/input.component',
				classNames: [
					'LibraryInputComponent'
				],
				hasSourcemap: true
			}
		]
	} );

} );
