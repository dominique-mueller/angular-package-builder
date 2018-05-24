import { posix as path } from 'path';

export const distFolderPath: string = path.join( __dirname, '..', 'my-library', 'dist' );
export const importPath: string = path.join( '..', 'my-library', 'dist' );

export const angularMetadataVersions: { [ angularVersion: number ]: number } = {
    4: 3,
    5: 4
};
