'use strict';

// *****************************************************************************
//  Dependencies
// *****************************************************************************

// Node Modules
var fs = require( 'fs' );
var path = require( 'path' );
var util = require( 'util' );

// External Modules
var _ = require( 'lodash' );
var moment = require( 'moment' );
var winston = require( 'winston' );

// Local Variables
var logger;
var logsDir = path.normalize( __dirname + '/../../../logs/' );
if ( !fs.existsSync( logsDir ) ) {
    fs.mkdirSync( logsDir );
}

// *****************************************************************************
//  Module Interface
// *****************************************************************************

module.exports = {
  getLogger:  getLogger,
  initialize: initialize
};

// *****************************************************************************
//  Interface Functions
// *****************************************************************************

function getLogger() {
  return logger;
}

function initialize() {
  logger = new ( winston.Logger )( {
    transports: [
      new ( winston.transports.Console )( {
        name: 'all-console',
        handleExceptions: true,
        level: 'silly',
        formatter: formatter,
        humanReadableUnhandledException: true
      } ),
      new ( winston.transports.File )( {
        name: 'all-file',
        filename: logsDir + 'all.log',
        level: 'silly',
        maxsize: 5242880, //5MB
        maxFiles: 5,
        json: false,
        formatter: formatter
      } ),
      new ( winston.transports.File )( {
        name: 'error-file',
        handleExceptions: true,
        filename: logsDir + 'errors.log',
        level: 'error',
        maxsize: 5242880, //5MB
        maxFiles: 5,
        json: false,
        formatter: formatter
      } )
    ]
  } );

  logger.stream = {
    write: function( message, encoding ) {
      logger.info( message );
    }
  };
}

// *****************************************************************************
//  Private Functions
// *****************************************************************************

function formatter( data ) {
  var message = moment().format() + ' : ' +
                winston.config.colorize( data.level ) + ' : ';

  var isNotAnError = _.isEmpty( data.meta.stack );
  if ( isNotAnError ) {
    var output = message + data.message;
    if ( !_.isEmpty( data.meta ) ) {
      output += ' ' + util.inspect( data.meta, { depth: null } );
    }
    return output;
  } else {
    if ( data.meta.isBackendError ) {
      var errorToLog = {
        error: data.meta,
        stack: data.meta.stack.split( '\n' )
      };
      return message + util.inspect( errorToLog, { depth: null } );
    } else {
      return message + data.meta.stack;
    }
  }
}
