import * as proxyquire from 'proxyquire';

import MemoryFileSystem from '../memory-file-system/memory-file-system';

/**
 * Dynamically import a module, use memory file system if it exists (else we use the original fs)
 *
 * @param   module - Module to import, either name or path
 * @returns
 */
export async function importWithFs( module: string ): Promise<any> {
	return MemoryFileSystem.isActive
		? proxyquire( module, {
			fs: MemoryFileSystem.fs // Mock the file system
		} )
		: import( module );
}
