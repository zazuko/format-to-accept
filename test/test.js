/* global describe, it */

const assert = require('assert')
const caseless = require('caseless')
const formatToAccept = require('..')
const express = require('express')
const request = require('supertest')

describe('format-to-accept', () => {
  it('should implement the defined interface', () => {
    assert.equal(typeof formatToAccept, 'function')
  })

  it('should return a new middleware function', () => {
    const middleware = formatToAccept()

    assert.equal(typeof middleware, 'function')
    assert.equal(middleware.length, 3)
  })

  it('should update the accept header', () => {
    let accept

    const app = express()

    app.use(formatToAccept())

    app.use((req, res, next) => {
      accept = caseless(req.headers).get('accept')

      next()
    })

    return request(app)
      .get('/resource?format=ttl')
      .set('accept', '*/*')
      .then(() => {
        assert.equal(accept, 'text/turtle')
      })
  })

  it('should ignore other parameters', () => {
    let accept

    const app = express()

    app.use(formatToAccept())

    app.use((req, res, next) => {
      accept = caseless(req.headers).get('accept')

      next()
    })

    return request(app)
      .get('/resource?mediaType=ttl')
      .set('accept', '*/*')
      .then(() => {
        assert.equal(accept, '*/*')
      })
  })

  it('should update the accept header with an alternative parameter name', () => {
    let accept

    const app = express()

    app.use(formatToAccept({parameter: 'mediaType'}))

    app.use((req, res, next) => {
      accept = caseless(req.headers).get('accept')

      next()
    })

    return request(app)
      .get('/resource?mediaType=ttl')
      .set('accept', '*/*')
      .then(() => {
        assert.equal(accept, 'text/turtle')
      })
  })

  it('should ignore unknown formats', () => {
    let accept

    const app = express()

    app.use(formatToAccept())

    app.use((req, res, next) => {
      accept = caseless(req.headers).get('accept')

      next()
    })

    return request(app)
      .get('/resource?format=cr2')
      .set('accept', '*/*')
      .then(() => {
        assert.equal(accept, '*/*')
      })
  })

  it('should use alternative format map', () => {
    let accept

    const app = express()

    app.use(formatToAccept({formats: {
      cr2: 'image/cr2'
    }}))

    app.use((req, res, next) => {
      accept = caseless(req.headers).get('accept')

      next()
    })

    return request(app)
      .get('/resource?format=cr2')
      .set('accept', '*/*')
      .then(() => {
        assert.equal(accept, 'image/cr2')
      })
  })

  it('should ignore unknown formats in alternative formats map', () => {
    let accept

    const app = express()

    app.use(formatToAccept({formats: {
      ttl: 'text/turtle'
    }}))

    app.use((req, res, next) => {
      accept = caseless(req.headers).get('accept')

      next()
    })

    return request(app)
      .get('/resource?format=cr2')
      .set('accept', '*/*')
      .then(() => {
        assert.equal(accept, '*/*')
      })
  })
})
