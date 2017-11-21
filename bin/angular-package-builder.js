#!/usr/bin/env node

'use strict';

const runAngularPackageBuilder = require( '../index.js' ).runAngularPackageBuilder;
const yargs = require( 'yargs' );

/**
 * List of available CLI parameters (all optional):
 */
const cliParameters = yargs

	// Configuration param, containing URL to configuration file ('.angular-package.json')
	.option( 'config', {
		alias: 'c',
		coerce: ( value ) => {
			return typeof value === 'string' ? value : value[ 0 ];
		},
		describe: 'Path to the Angular Package config file (".angular-package.json" by default)',
		type: 'string'
	} )

	// Debug mode flag
	.option( 'debug', {
		alias: [ 'd', 'ddd', 'verbose' ],
		describe: 'Debug mode',
		type: 'boolean',
		boolean: true
	} )

	.alias( 'help', 'h' )
	.alias( 'version', 'v' )
	.strict( true )
	.argv;

// Run
runAngularPackageBuilder( cliParameters.config, cliParameters.debug )
	.then( () => {
		process.exit( 0 );
	} )
	.catch( () => {
		process.exit( 1 );
	} );
