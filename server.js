const express = require('express')
const app = express()
const nconf = require('nconf')
const bodyParser = require('body-parser')
const cors = require('cors')

nconf
  .argv()
  .env('__')
  .file({ file: './config.json' })

app.use(bodyParser.json())
app.use(cors())

app.get('/_health', function(req, res) {
  res.json('Karmapachenno')
})

app.use('/api/v1', require('./lib/routes'))

app.use((req, res, next) => {
  console.info(`${new Date().toString()} => ${req.originalUrl}`, req.body)
  res.status(404).send('STOP! You are hitting the wrong endpoint. Try again!')
})

let listener = app.listen(process.env.PORT || 8080, () =>
  console.info('Server has started on port ' + listener.address().port)
)
