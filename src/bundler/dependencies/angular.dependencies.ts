/**
 * Angular Dependencies
 */
export const angularDependencies: { [ dependency: string ]: string } = {
	'@angular/animations': 'ng.animations',
	'@angular/core': 'ng.core',
	'@angular/common': 'ng.common',
	'@angular/common/http': 'ng.common.http',
	'@angular/cdk': 'ng.cdk',
	'@angular/cdk/a11y': 'ng.cdk.a11y',
	'@angular/cdk/bidi': 'ng.cdk.bidi',
	'@angular/cdk/coercion': 'ng.cdk.coercion',
	'@angular/cdk/collections': 'ng.cdk.collections',
	'@angular/cdk/keycodes': 'ng.cdk.keycodes',
	'@angular/cdk/observers': 'ng.cdk.observers',
	'@angular/cdk/overlay': 'ng.cdk.overlay',
	'@angular/cdk/platform': 'ng.cdk.platform',
	'@angular/cdk/portal': 'ng.cdk.portal',
	'@angular/cdk/rxjs': 'ng.cdk.rxjs',
	'@angular/cdk/scrolling': 'ng.cdk.scrolling',
	'@angular/cdk/stepper': 'ng.cdk.stepper',
	'@angular/cdk/table': 'ng.cdk.table',
	'@angular/forms': 'ng.forms',
	'@angular/http': 'ng.http',
	'@angular/router': 'ng.router',
	'@angular/platform-browser': 'ng.platformBrowser',
	'@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
	'@angular/platform-browser/animations': 'ng.platformBrowser.animations'
};

export function isExternalModule( id: string, parentId: string, isResolved: boolean ): Promise<boolean | void> | boolean | void {

}

export function getDependency(): any {

}
