// Import and run Angular Pacakge Builder
const angularPackageBuilder = require( './dist/index' );
angularPackageBuilder.main()
    .then( () => {
        // Do nothing
    } )
    .catch( () => {
        // Do nothing
    } );
