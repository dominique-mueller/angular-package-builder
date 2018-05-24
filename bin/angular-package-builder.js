#!/usr/bin/env node

'use strict';

const runAngularPackageBuilder = require( '../index.js' ).runAngularPackageBuilder;

const cliParameters = process.argv;
const angularPackageJsonFiles = cliParameters.slice( 2 );

// Run
runAngularPackageBuilder( angularPackageJsonFiles )
	.then( () => {
		process.exit( 0 );
	} )
	.catch( () => {
		process.exit( 1 );
	} );
