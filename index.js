const caseless = require('caseless')
const mimeTypes = require('mime-types')

function middleware (options, req, res, next) {
  // ignore request if the defined parameter is not given
  if (!(options.parameter in req.query)) {
    return next()
  }

  const format = req.query[options.parameter]
  let mediaType = null

  // check if there is a custom map otherwise use mime-types module
  if (options.formats) {
    mediaType = format in options.formats ? options.formats[format] : null
  } else {
    mediaType = mimeTypes.lookup(format)
  }

  // ignore if the requested format is unknown
  if (!mediaType) {
    return next()
  }

  // update the accept header
  caseless(req.headers).set('accept', mediaType)

  next()
}

function factory (options) {
  options = options || {}
  options.parameter = options.parameter || 'format'
  options.formats = options.formats || factory.defaultFormats

  return middleware.bind(null, options)
}

module.exports = factory
