const express = require('express')
const router = express.Router()
const nconf = require('nconf')
const config = nconf.get()
const uuidv1 = require('uuid/v1')
const AWS = require('aws-sdk')
AWS.config.update({
  region: config.AWS_REGION,
  endpoint: config.AWS_ENDPOINT
})
const docClient = new AWS.DynamoDB.DocumentClient()
const table = 'dwbc_mantras'

// CREATE A MANTRA
router.post('/', (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).send('Body is missing')
  var params = {
    TableName: table,
    Item: {
      name: req.body.name,
      mantras_count: parseInt(req.body.mantras_count),
      mantra_id: uuidv1(),
      date_created: new Date().toISOString()
    }
  }

  docClient.put(params, function(err, data) {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
      res.status(500).send({ error: err.toString() })
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2))
      res.send(params.Item)
    }
  })
})

// READ ALL Mantras
router.get('/', (req, res) => {
  var params = {
    TableName: table
  }
  docClient.scan(params, function(err, data) {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
      res.status(500).send({ error: err.toString() })
    } else {
      res.send(data.Items)
    }
  })
})

module.exports = router
