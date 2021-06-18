const express = require('express');
var bodyParser = require('body-parser');
var getDistance = require('./controller/get-distance');
var app = express();

  // parse application/json
  app.use(bodyParser.json());                        

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

app.post('/get-driver', (req, res) => {
    if(!(req.body && req.body.latitude && req.body.longitude)) {
        res.send({
            status: 'error',
            code: 400,
            data: 'Please enter proper req body'
        })
        return;
    } 
    let data = req.body;
    const userLat = data.latitude;
    const userLong = data.longitude;
    let selectedDriver = getDistance.getDistance(userLat, userLong);
    res.send(selectedDriver);
})

app.listen(3000, () => {
    console.log('listening to port 3000')
})
