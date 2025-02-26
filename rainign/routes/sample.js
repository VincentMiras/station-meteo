var express = require('express');
var router = express.Router();
const { InfluxDB } = require('@influxdata/influxdb-client');
var fs = require('fs');

//20210907T1430Z
function isValidUTC(string) {
    const timestamp = Date.parse(string);
    return !isNaN(timestamp) && string.endsWith('Z');
}

function sendError(res) {
    return res.status(400).json({
        message: "A query argument is invalid"
    });
}

const url = process.env.INFLUXDB_URL || 'http://piensg031.ensg.eu:8086';
const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim();
const org = process.env.DOCKER_INFLUXDB_INIT_ORG || 'docs';
const bucket = process.env.DOCKER_INFLUXDB_INIT_BUCKET || 'meteo';

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

const valid_Capteur = ['temperature', 'pressure', 'humidity', 'lux', 'wind_heading', 'wind_speed_avg', 'rain', 'lat', 'lon'];

const capteurMapping = {
    temperature: 'temperature',
    pressure: 'pressure',
    humidity: 'humidity',
    lux: 'luminosity',
    wind_heading: 'wind_heading',
    wind_speed_avg: 'wind_speed_avg',
    rain: 'rain',
    lat: 'gps',
    lon: 'gps'
};

const unitMapping = {
    temperature: 'C',
    pressure: 'hP',
    humidity: '%',
    rain: 'mm/m2',
    lux: 'Lux',
    wind_heading: '°',
    wind_speed_avg: 'km/h',
    lat: 'DD',
    lon: 'DD'
};

router.get('/:start/:end?/:list_capteur?', async function (req, res, next) {
    const startDate = req.params.start;
    const endDate = req.params.end || new Date().toISOString();
    const capteurs = req.params.list_capteur;

    if (!startDate || !isValidUTC(startDate) || !isValidUTC(endDate)) {
        return sendError(res);
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = (end - start) / (1000 * 60 * 60);

    if (start > end) {
        return sendError(res);
    }

    let aggregationPeriod = '15s';
    if (duration <= 1) {
        aggregationPeriod = '1m';
    } else if (duration <= 24) {
        aggregationPeriod = '1h';
    } else if (duration <= 168) {
        aggregationPeriod = '6h';
    };

    let listCapteur = valid_Capteur;
    if (capteurs) {
        const listC = capteurs.split('-');
        listCapteur = Array.from(new Set(listC));
        for (let element of listCapteur) {
            if (!valid_Capteur.includes(element)) {
                return sendError(res);
            }
        }
    }

    async function fetchData(capteur) {
        const measurement = capteurMapping[capteur];
        let query;
        if (capteur === 'lat' || capteur === 'lon') {
            const field = capteur === 'lat' ? 'latitude' : 'longitude';
            query = `from(bucket: "${bucket}") 
            |> range(start: ${startDate}, stop: ${endDate}) 
            |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "${field}")
            |> aggregateWindow(every: ${aggregationPeriod}, fn: mean, createEmpty: false)`;
        } else {
            query = `from(bucket: "${bucket}") 
            |> range(start: ${startDate}, stop: ${endDate}) 
            |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "value")
            |> aggregateWindow(every: ${aggregationPeriod}, fn: mean, createEmpty: false)`;
        }
        try {
            const data = await queryApi.collectRows(query);
            return data.reduce((acc, row) => {
                if (!acc[row._time]) {
                    acc[row._time] = {};
                }
                acc[row._time][capteur] = row._value;
                return acc;
            }, {});
        } catch (error) {
            console.error(`Error fetching data for ${capteur}:`, error);
            return null;
        }
    }

    const data = {};
    for (let capteur of listCapteur) {
        const capteurData = await fetchData(capteur);
        for (let time in capteurData) {
            if (!data[time]) {
                data[time] = {};
            }
            data[time][capteur] = capteurData[time][capteur];
        }
    }

    const usedUnits = {};
    for (let capteur of listCapteur) {
        usedUnits[capteur] = unitMapping[capteur];
    }

    const response = {
        id: 31,
        unit: usedUnits,
        data: data
    };

    return res.status(200).json(response);
});

module.exports = router;