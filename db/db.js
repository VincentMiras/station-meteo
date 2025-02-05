import { InfluxDB, Point } from '@influxdata/influxdb-client'
import fs from 'fs'
import Watcher from 'watcher'
import nmea from 'nmea-simple'

const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim()

const influxDB = new InfluxDB({url: process.env.INFLUXDB_URL, token: token})

const writeApi = influxDB.getWriteApi(process.env.DOCKER_INFLUXDB_INIT_ORG, process.env.DOCKER_INFLUXDB_INIT_BUCKET)

// const gps = new Watcher ( '/dev/shm/gpsNmea' );
const gps = new Watcher ( '/home/ibhou/Documents/station-meteo/rasp/dev/shm/gpsNmea');
const rain = new Watcher ( '/dev/shm/rainCounter.log' );
const sensor = new Watcher ( '/dev/shm/sensors' );
const tph = new Watcher ( '/dev/shm/tph.log' );

var tmp_data={}

sensor.on('change', filePath => {
    fs.readFile(filePath,(err, data) => {
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


gps.on('change', filePath => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Problème de lecture:', err);
            return;
        }
        const lines = data.split('\r\n');
        lines.forEach(line => {
            try {
                const packet = nmea.parseNmeaSentence(line);

                if (packet.sentenceId === "RMC" && packet.status === "valid") {
                    console.log("Got location via RMC packet:", packet.latitude, packet.longitude);
                }

                if (packet.sentenceId === "GGA" && packet.fixType !== "none") {
                    console.log("Got location via GGA packet:", packet.latitude, packet.longitude);
                }

                if (packet.sentenceId === "GSA") {
                    console.log("There are " + packet.satellites.length + " satellites in view.");
                }
            } catch (error) {
                console.error("Got bad packet:", line, error);
            }
        });
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

module.exports = { writeData, closeConnection }

const sampleData = {
    location: 'office',
    temperature: 22.5,
    humidity: 60,
    timestamp: Date.now()
}

writeData(sampleData).then(() => {
    closeConnection()
}).catch(e => {
    console.error('Error writing data', e)
})