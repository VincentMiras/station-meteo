var fs = require('fs');

var express = require('express');
const { InfluxDB } = require('@influxdata/influxdb-client');
var router = express.Router();


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

const valid_Capteur = ['date', 'temperature', 'pressure', 'humidity', 'lux', 'wind_heading', 'wind_speed_avg', 'rain', 'lat', 'long'];


const capteurMapping = {
    date: 'gps',
    temperature: 'temperature',
    pressure: 'pressure',
    humidity: 'humidity',
    lux: 'luminosity',
    wind_heading: 'wind_heading',
    wind_speed_avg: 'wind_speed_avg',
    rain: 'rain',
    lat: 'gps',
    long: 'gps'
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
    long: 'DD'
};



router.get('/:list_capteur?', function (req, res, next) {
    let capteurs = req.params.list_capteur;

    if (!capteurs) {
        capteurs = valid_Capteur.join('-');
    }
    const listC = capteurs.split('-');
    const listCapteur = Array.from(new Set(listC));
    for (let element of listCapteur) {
        if (!valid_Capteur.includes(element)) {
            console.log("Capteur(s) inconnu")
            return sendError(res);
        }
    }

    async function fetchData(capteur) {
        const measurement = capteurMapping[capteur];
        let query;
        if (capteur === 'lat' || capteur === 'long') {
            const field = capteur === 'lat' ? 'latitude' : 'longitude';
            query = `from(bucket: "${bucket}") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "${field}") |> last()`;
        } else if (capteur === 'date') {
            return new Date().toISOString();
        } else {
            query = `from(bucket: "${bucket}") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "value") |> last()`;
        }
        try {
            const data = await queryApi.collectRows(query);
            return data.length > 0 ? data[0]._value : null;
        } catch (error) {
            console.error(`Error fetching data for ${capteur}:`, error);
            return null;
        }
    }

    (async () => {
        const data = {};
        for (let capteur of listCapteur) {
            data[capteur] = await fetchData(capteur);
        }
        const response = {
            id: 31,
            unit: unitMapping,
            data: data
        };
        return res.status(200).json(response);
    })();
});

module.exports = router;