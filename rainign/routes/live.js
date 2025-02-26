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

const valid_Capteur = ['temperature', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg', 'rain', 'lat', 'lon'];

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

const decimalPlaces = {
    temperature: 2,
    pressure: 2,
    humidity: 2,
    rain: 2,
    lux: 2,
    wind_heading: 0,
    wind_speed_avg: 0,
    lat: 2,
    lon: 3
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
        if (capteur === 'lat' || capteur === 'lon') {
            const field = capteur === 'lat' ? 'latitude' : 'longitude';
            query = `from(bucket: "${bucket}") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "${field}") |> last()`;
        } else {
            query = `from(bucket: "${bucket}") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "value") |> last()`;
        }
        try {
            const data = await queryApi.collectRows(query);
            return data.length > 0 ? parseFloat(data[0]._value.toFixed(decimalPlaces[capteur])) : null;
        } catch (error) {
            console.error(`Error fetching data for ${capteur}:`, error);
            return null;
        }
    }

    (async () => {
        const data = {};
        for (let capteur of listCapteur) {
            if (capteur === 'rain') {
                data[capteur] = await fetchData(capteur) * 0.328;
            } else {
                data[capteur] = await fetchData(capteur);
            }
            data[capteur] = await fetchData(capteur);
        }
        const filteredUnitMapping = {};
        for (let capteur of listCapteur) {
            filteredUnitMapping[capteur] = unitMapping[capteur];
        }

        const response = {
            id: 31,
            unit: filteredUnitMapping,
            data: {
                date: new Date().toISOString(),
                ...data
            }
        };
        return res.status(200).json(response);
    })();
});

module.exports = router;