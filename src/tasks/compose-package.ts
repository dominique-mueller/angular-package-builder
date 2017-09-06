import { copy } from '../utilities/copy';

export function composePackage(): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		await Promise.all( [

			// Copy bundles
			await copy( 'dist-angular-package-builder/library-bundle-fesm2015/**', 'dist' ),
			await copy( 'dist-angular-package-builder/library-bundle-fesm5/**', 'dist' ),
			await copy( 'dist-angular-package-builder/library-bundle-umd/**', 'dist' ),

			// Copy type definitions and AoT metadata
			await copy( 'dist-angular-package-builder/library-build-es2015/**/*.d.ts', 'dist' ),
			await copy( 'dist-angular-package-builder/library-build-es2015/**/*.metadata.json', 'dist' )

		] );

		resolve();

	} );
}
