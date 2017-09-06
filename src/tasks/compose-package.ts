import { copy } from '../utilities/copy';

export function composePackage(): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		await copy( 'dist-angular-package-builder/library-bundle-es2015/**', 'dist' );
		await copy( 'dist-angular-package-builder/library-bundle-es5/**', 'dist' );
		await copy( 'dist-angular-package-builder/library-bundle-umd/**', 'dist' );

		await copy( 'dist-angular-package-builder/library-build-2015/**/*.d.ts', 'dist' );
		await copy( 'dist-angular-package-builder/library-build-2015/**/*.metadata.json', 'dist' );

	} );
}
