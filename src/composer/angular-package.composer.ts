import { posix as path } from 'path';

import { writeFile } from '../utilities/write-file';
import { copyFiles } from '../utilities/copy-files';
import { AngularPackage } from '../angular-package';
import { readFile } from '../utilities/read-file';
import { getFileNameByPackageName } from '../utilities/get-file-name-by-package-name';
import { deleteFolder } from '../utilities/delete-folder';
import { AngularPackageLogger } from '../logger/angular-package-logger';

export class AngularPackageComposer {

	public readonly angularPackage: AngularPackage;

	constructor( angularPackage: AngularPackage ) {
		this.angularPackage = angularPackage;
	}

	public async compose(): Promise<void> {

		// Copy build
		AngularPackageLogger.log( {
			message: 'Copy build files',
            progress: .1
        } );
		await this.copyBuildFiles();

		AngularPackageLogger.log( {
			message: 'Copy bundles',
            progress: .4
        } );
		await this.copyBundleFiles();

		AngularPackageLogger.log( {
			message: 'Copy typings',
            progress: .7
        } );
		await this.copyTypingFiles();

		AngularPackageLogger.log( {
			message: 'Copy metadata files',
            progress: .8
        } );
		await this.copyMetadataFiles();

		// Create package.json files with entry properties
		AngularPackageLogger.log( {
			message: 'Add package.json file',
            progress: .9
        } );
		this.angularPackage.isPrimary
			? this.createPackageJsonForPrimaryEntry()
			: this.createPackageJsonForSecondaryEntry();

	}

	private async copyBuildFiles(): Promise<void> {
		await Promise.all( [
			copyFiles(
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'esm2015', '**', '*.js?(.map)' ),
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'esm2015' )
			),
			copyFiles(
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'esm5', '**', '*.js?(.map)' ),
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'esm5' )
			)
		] );
	}

	private async copyBundleFiles(): Promise<void> {
		await Promise.all( [
			copyFiles(
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'fesm2015', '**', '*.js?(.map)' ),
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'fesm2015' )
			),
			copyFiles(
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'fesm5', '**', '*.js?(.map)' ),
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'fesm5' )
			),
			copyFiles(
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'bundles', '**', '*.js?(.map)' ),
				path.join( this.angularPackage.root, this.angularPackage.outDir, 'bundles' )
			)
		] );
	}

	private async copyTypingFiles(): Promise<void> {
		await copyFiles(
			path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'esm2015', '**', '*.d.ts' ),
			path.join( this.angularPackage.root, this.angularPackage.outDir )
		);
	}

	private async copyMetadataFiles(): Promise<void> {
		await copyFiles(
			path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'esm2015', '**', '*.metadata.json' ),
			path.join( this.angularPackage.root, this.angularPackage.outDir )
		);
	}

	private async cleanupTemporaryOutputFolder(): Promise<void> {
        await deleteFolder( path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp' ) );
	}

	private async createPackageJsonForPrimaryEntry(): Promise<void> {

		// Read package.json file
		const packageJsonPath: string = path.join( this.angularPackage.root, 'package.json' );
		const packageJson: any = await readFile( packageJsonPath );

		// Add entry properties
		const packageJsonWithEntryProperties: any = {
			...packageJson,
			...this.createEntryProperties()
		};

		// Write package.json file
		const packageJsonPathOut: string = path.join( this.angularPackage.root, this.angularPackage.outDir, 'package.json' );
		await writeFile( packageJsonPathOut, packageJsonWithEntryProperties );

	}

	private async createPackageJsonForSecondaryEntry(): Promise<void> {

		// Create package.json from entry properties only
		const packageJsonWithEntryProperties: any = this.createEntryProperties();

		// Write package.json file
		const packageJsonPathOut: string = path.join( this.angularPackage.root, this.angularPackage.outDir, 'package.json' );
		await writeFile( packageJsonPathOut, packageJsonWithEntryProperties );

	}

	private createEntryProperties(): any {
		const fileName: string = getFileNameByPackageName( this.angularPackage.packageName );
		return {

			// Name
			name: this.angularPackage.packageName,

			// Modules
			module: `esm5/${fileName}.js`,
			es2015: `esm2015/${fileName}.js`,
			esm5: `esm5/${fileName}.js`,
			esm2015: `esm2015/${fileName}.js`,
			fesm5: `fesm5/${fileName}.js`,
			fesm2015: `fesm2015/${fileName}.js`,
			main: `bundles/${fileName}.umd.js`,
			typings: `${fileName}.d.ts`

		};
	}

}
