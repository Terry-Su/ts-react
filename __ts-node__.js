const { resolve } = require( 'path' )
require( 'ts-node' ).register( { files: true, project: resolve( __dirname, '__ts-node-tsconfig__.json' ) } )