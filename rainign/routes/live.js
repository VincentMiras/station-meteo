var express = require('express');
const { InfluxDB } = require('@influxdata/influxdb-client');
var router = express.Router();

function sendError(res) {
    return res.status(400).json({
        message: "A query argument is invalid"
    });
}

const url = process.env.INFLUX_DB_URL || 'http://influxdb:8086';
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
    const token = process.env.INFLUX_DB_TOKEN;
    const org = process.env.INFLUX_DB_ORG;
    const bucket = process.env.INFLUX_DB_BUCKET;

    const client = new InfluxDB({ url, token });
    const queryApi = client.getQueryApi(org);

    async function fetchData(capteur) {
        const measurement = capteurMapping[capteur];
        let query;
        if (capteur === 'lat' || capteur === 'long') {
            const field = capteur === 'lat' ? 'latitude' : 'longitude';
            query = `from(bucket: "${bucket}") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "${field}") |> last()`;
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
        return res.status(200).json(data);
    })();
});

module.exports = router;