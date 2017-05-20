# format-to-accept

Express middleware to translate a query parameter to an accept header.
This is useful if you implement content negotiation (which you should do!), but also want to provide downloads in
different formats for the browser.
This middleware will change the `accept` header to the media type defined in mime types or a formats map.
For example, a link like this:

```
    http://example.org/resource?format=json
```

Will be translated to an `accept: application/json` header. 

## Usage

The module returns a factory, which generates a new middleware:

```
const express = require('express')
const formatToAccept = require('format-to-accept')

const app = express()

app.use(formatToAccept())

app.use((req, res, next) => {
  ...
})
```

The factory also accepts a options object, with the following properties:
 
- `parameter`: The name of the query parameter (default: `format`)
- `formats`: An object map, with the format as key and the media type as value.
  If it's not given, the [mime-types](https://www.npmjs.com/package/mime-types) module is used.
