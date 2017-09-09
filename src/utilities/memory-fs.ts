import * as fs from 'fs';
import * as path from 'path';

import { Volume, createFsFromVolume } from 'memfs';

import { writeFile } from './write-file';

export const memVol = Volume.fromJSON( {}, '/' );
memVol.mkdirpSync( process.cwd() );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-prepared' ) );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-build-es2015' ) );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-build-es5' ) );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-bundle-fesm2015' ) );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-bundle-fesm2015' ) );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-bundle-fesm5' ) );
memVol.mkdirpSync( path.join( process.cwd(), 'dist-angular-package-builder', 'library-bundle-umd' ) );
const memVolFs = createFsFromVolume( memVol );

// Simply map all fs calls to in-memory fs calls
const simpleFsMapping = Object
	.keys( fs )
	.reduce( ( all: any, method: any ) => {
		all[ method ] = memVolFs[ method ];
		return all;
	}, {} );

// Modify the mapping for special cases; in particular:
// - allow real filesystem access when interacting with stuff from the node_modules folder
const modifiedFsMapping = Object.assign( simpleFsMapping, {

	// Used by TypeScript when reading in definition files
	statSync: ( path: string ) => {
		return ( path.indexOf( 'node_modules' ) === -1 )
			? memVolFs.statSync( path )
			: fs.statSync( path );
	},

	// Used by TypeScript when reading in definition files
	readFileSync: ( path: string, options: any ) => {
		return ( path.indexOf( 'node_modules' ) === -1 )
			? memVolFs.readFileSync( path, options )
			: fs.readFileSync( path, options );
	}

} );

export const memFs = Object.assign( modifiedFsMapping, {
	'@global': true // Monkey-patch nested imports as well
} );

export function persistFolder( persistPath: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		console.log();

		const normalizedPersistPath: string = `${ path.normalize( persistPath.replace( path.parse( persistPath ).root, '' ) ) }${ path.sep }`;

		const memVolState: { [ path: string ]: string } = memVol.toJSON();
		const filesToPersist: Array<string> = Object
			.keys( memVolState )
			.filter( ( filePath: string ) => {
				const normalizedFilePath: string = path.normalize( filePath.replace( path.parse( filePath ).root, '' ) );
				return normalizedFilePath.startsWith( normalizedPersistPath );
			} );

		console.log( filesToPersist );

		await Promise.all(
			filesToPersist.map( async( filePath: string ): Promise<string> => {
				const absoluteFilePath: string = path.resolve( filePath );
				await writeFile( filePath, memVolState[ filePath ] );
				return filePath;
			} )
		);

		resolve();

	} );
}
