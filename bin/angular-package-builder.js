#!/usr/bin/env node

'use strict';

const runAngularPackageBuilder = require( '../index.js' ).runAngularPackageBuilder;

// Run
runAngularPackageBuilder()
	.then( () => {
		process.exit( 0 );
	} )
	.catch( () => {
		process.exit( 1 );
	} )
