import { expectPackage } from '../utilities/expect-package';

/**
 * Unit Test: Single Library, with custom paths
 */
describe( 'Single Library, with custom paths', () => {

	expectPackage( {
		packageName: 'library-custom-paths',
		root: 'test/single-library-custom-paths/packages/library',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'components/library.module',
				classNames: [
					'LibraryUIModule'
				],
				hasSourcemap: true
			},
			{
				path: 'components/input/input.component',
				classNames: [
					'LibraryInputComponent'
				],
				hasSourcemap: true
			}
		]
	} );

} );
