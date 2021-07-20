let constats = require('../constants/app.constants');

module.exports.getDistance = function (userLatitude, userLongitude) {
    var geo = require('node-geo-distance');

    var coord1 = {
        latitude: userLatitude,
        longitude: userLongitude
    }

    let driverCoordinates = getDriverCoordinates();
    let nearByDrivers = [];
    let farDrivers = [];
    console.log(driverCoordinates);
    driverCoordinates.filter(driver => Math.abs(driver.latitude - userLatitude) < 1 && Math.abs(driver.longitude - userLongitude) < 1)
        .forEach(validDriver => {
            let coord2 = {
                latitude: validDriver.latitude,
                longitude: validDriver.longitude
            }
            let dist = geo.vincentySync(coord1, coord2);
            if (dist < constats.constats.NEARBY) {
                nearByDrivers.push(validDriver)
            } else {
                farDrivers.push({driver: validDriver, distance: dist});
            }
        })
        let selecteDriver = {};

    console.log('nearbyDrivers::::',nearByDrivers)
    if(nearByDrivers.length > 0) {
        let maxTime = 0;
        
        nearByDrivers.forEach(obj => {
            let t = getTimeSinceLastRide(obj.lastRide);
            if(t > maxTime) {
                maxTime = t;
                selecteDriver = obj;
            }
        })
    } else if(farDrivers.length > 0) {
        let distance = 0;
        farDrivers.forEach(driver => {
            if(distance == 0) {
                distance = driver.distance;
                selecteDriver = driver;
            }
            else if(driver.distance < distance) {
                distance = driver.distance;
                selecteDriver = driver;
            }
        })
    } else {
        return null;
    }
    return selecteDriver;
}

function getDriverCoordinates() {
    return constats.constats.DRIVER_COORDINATES;
}

function getTimeSinceLastRide(lastRideTime) {
    return new Date() - new Date(lastRideTime);
}
