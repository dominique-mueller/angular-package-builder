/**
 * Angular dependencies
 *
 * - Includes primary, secondary and testing entry points
 * - Inspired by: https://github.com/angular/angular/tree/master/packages
 */
export const angularDependencies: { [ dependency: string ]: string } = {

	// Animations
	'@angular/animations': 'ng.animations',

	// Core
	'@angular/core': 'ng.core',
	'@angular/core/testing': 'ng.core.testing',

	// Common
	'@angular/common': 'ng.common',
	'@angular/common/testing': 'ng.common.testing',
	'@angular/common/http': 'ng.common.http',
	'@angular/common/http/testing': 'ng.common.http.testing',

	// Forms
	'@angular/forms': 'ng.forms',

	// Http
	'@angular/http': 'ng.http',
	'@angular/http/testing': 'ng.http.testing',

	// Router
	'@angular/router': 'ng.router',
	'@angular/router/testing': 'ng.router.testing',

	// Platforms
	'@angular/platform-browser': 'ng.platformBrowser',
	'@angular/platform-browser/testing': 'ng.platformBrowser.testing',
	'@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
	'@angular/platform-server': 'ng.platformServer',
	'@angular/platform-server/testing': 'ng.platformServer.testing',
	'@angular/platform-browser-dynamic/testing': 'ng.platformBrowserDynamic.testing',
	'@angular/platform-browser/animations': 'ng.platformBrowser.animations'

};
