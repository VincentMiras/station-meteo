import { InfluxDB, Point } from '@influxdata/influxdb-client'
import fs from 'fs'
import Watcher from 'watcher'
import nmea from 'nmea-simple'



// const writeApi = influxDB.getWriteApi(process.env.DOCKER_INFLUXDB_INIT_ORG, process.env.DOCKER_INFLUXDB_INIT_BUCKET)



// /////////////////////////////////////////////////////////////////CHEMIN D'ACCES AUX FICHIERS LOCAUX/////////////////////////////////////////////////////////////
// const gps = new Watcher('/home/ibhou/Documents/station-meteo/rasp/dev/shm/gpsNmea');
// const rain = new Watcher('/dev/shm/rainCounter.log');
// const sensor = new Watcher('/dev/shm/sensors');
// const tph = new Watcher('/dev/shm/tph.log');


/////////////////////////////////////////////////////////////////CHEMIN D'ACCES AUX FICHIERS RASP/////////////////////////////////////////////////////////////
const gps = new Watcher('/dev/shm/gpsNmea');
const gpsFilePath = '/dev/shm/gpsNmea';
const rain = new Watcher('/dev/shm/rainCounter.log');
const sensor = new Watcher('/dev/shm/sensors');
const tph = new Watcher('/dev/shm/tph.log');
var tmp_data = {}

/////////////////////////////////////////////////////////////////PARAMETRES DB/////////////////////////////////////////////////////////////

const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim();

const url = process.env.INFLUXDB_URL || 'http://piensg031.ensg.eu:8086';

const client = new InfluxDB({ url, token })

let org = process.env.DOCKER_INFLUXDB_INIT_ORG;
let bucket = process.env.DOCKER_INFLUXDB_INIT_BUCKET;

let writeClient = client.getWriteApi(org, bucket, 'ns')



const fileLineCount = {
    gps: 0,
    rain: 0,
    sensor: 0,
    tph: 0
}

fs.watchFile(gpsFilePath, (curr, prev) => {
    if (curr.size > lastFileSize) {
        const stream = fs.createReadStream(gpsFilePath, {
            start: lastFileSize,
            end: curr.size
        });

        stream.on('data', chunk => {
            const lines = chunk.toString().split('\r\n');
            lines.forEach(line => {
                try {
                    const packet = nmea.parseNmeaSentence(line);

                    if (["RMC", "GGA", "GSA"].includes(packet.sentenceId)) {
                        const point = new Point('gps')
                            .tag('sentenceId', packet.sentenceId)
                            .timestamp(new Date());

                        if (packet.sentenceId === "RMC" && packet.status === "valid") {
                            point.floatField('latitude', packet.latitude)
                                .floatField('longitude', packet.longitude);
                        }

                        if (packet.sentenceId === "GGA" && packet.fixType !== "none") {
                            point.floatField('latitude', packet.latitude)
                                .floatField('longitude', packet.longitude);
                        }

                        if (packet.sentenceId === "GSA") {
                            point.intField('satellites', packet.satellites.length);
                        }
                        writeClient.writePoint(point);
                        console.log(`Data written to DB: ${JSON.stringify(packet)}`);
                    }
                } catch (error) {
                    console.error("Got bad packet:", line, error);
                    console.log(`Data not written to DB: ${line}`);
                }
            });
        });

        stream.on('end', () => {
            lastFileSize = curr.size;
        });
    }
});

sensor.on('change', filePath => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Problème de lecture:', err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            jsonData.measure.forEach(element => {
                tmp_data[element["name"]] = element["value"];
            });
        }
        catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });

});



const writeData = async (data) => {
    const point = new Point('weather')
        .tag('location', data.location)
        .floatField('temperature', data.temperature)
        .floatField('humidity', data.humidity)
        .timestamp(new Date(data.timestamp))

    writeApi.writePoint(point)
    writeApi.flush()
}



const closeConnection = () => {
    writeApi.close().then(() => {
        console.log('Connection closed')
    }).catch(e => {
        console.error('Error closing connection', e)
    })
}


const sampleData = {
    location: 'office',
    temperature: 22.5,
    humidity: 60,
    timestamp: Date.now()
}


// writeData(sampleData).then(() => {
//     closeConnection()
// }).catch(e => {
//     console.error('Error writing data', e)
// })

