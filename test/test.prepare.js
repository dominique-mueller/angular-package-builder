// Import and run Angular Pacakge Builder
const runAngularPackageBuilder = require( '../dist/index' ).runAngularPackageBuilder;
runAngularPackageBuilder()
    .then( () => {
        // Do nothing
    } )
    .catch( () => {
        console.error( error );
    } );
