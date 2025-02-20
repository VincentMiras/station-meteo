import { InfluxDB, Point } from '@influxdata/influxdb-client';
import fs from 'fs';
import nmea from 'nmea-simple';


const gpsFilePath = '/dev/shm/gpsNmea';
const rainFilePath = '/dev/shm/rainCounter.log';
const sensorFilePath = '/dev/shm/sensors';
const tphFilePath = '/dev/shm/tph.log';

const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim();

const url = process.env.INFLUXDB_URL || 'http://influxdb:8086';//'http://piensg031.ensg.eu:8086';

const client = new InfluxDB({ url, token })

let org = process.env.DOCKER_INFLUXDB_INIT_ORG;
let bucket = process.env.DOCKER_INFLUXDB_INIT_BUCKET;

let writeClient = client.getWriteApi(org, bucket, 'ns')

const fileLineCount = {
    gps: 0,
    rain: 0,
    sensor: 0,
    tph: 0
};



fs.watchFile(gpsFilePath, () => {
    const lines = fs.readFileSync(gpsFilePath, 'utf8').split('\n');
    const linesNumber = lines.length;
    if (linesNumber < fileLineCount.gps) {
        fileLineCount.gps = 0;
    }

    if (linesNumber > fileLineCount.gps) {
        const newLines = lines.slice(fileLineCount.gps, linesNumber);
        console.log(fileLineCount.gps, linesNumber, newLines);
        newLines.forEach(line => {
            try {
                line = line.trim();
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
                    // console.log(`GPS Data written to DB: ${JSON.stringify(packet)}`);
                }
            } catch (error) {
                console.error("Got bad packet:", line, error);
                console.log(`GPS Data not written to DB: ${line}`);
            }
        });
        fileLineCount.gps = linesNumber;
    }
});

fs.watchFile(rainFilePath, () => {
    const lines = fs.readFileSync(rainFilePath, 'utf8').split('\n');
    const linesNumber = lines.length;
    if (linesNumber < fileLineCount.rain) {
        fileLineCount.rain = 0;
    }

    if (linesNumber > fileLineCount.rain) {
        const newLines = lines.slice(fileLineCount.rain, linesNumber);
        console.log(fileLineCount.rain, linesNumber, newLines);
        newLines.forEach(line => {
            try {
                line = line.trim();
                const point = new Point('rain')
                point.timestamp(new Date())
                    .intField('rain', 1);
                writeClient.writePoint(point);
                // console.log(`Rain Data written to DB: ${line}`);
            } catch (error) {
                console.error("Got bad packet:", line, error);
                console.log(`Rain Data not written to DB: ${line}`);
            }
        });
        fileLineCount.rain = linesNumber;
    }
});

fs.watchFile(sensorFilePath, () => {
    const lines = fs.readFileSync(sensorFilePath, 'utf8').split('\n');
    const linesNumber = lines.length;
    if (linesNumber < fileLineCount.sensor) {
        fileLineCount.sensor = 0;
    }

    if (linesNumber > fileLineCount.sensor) {
        const newLines = lines.slice(fileLineCount.sensor, linesNumber);
        console.log(fileLineCount.sensor, linesNumber, newLines);
        newLines.forEach(line => {
            try {
                line = line.trim();
                const data = JSON.parse(line);
                const timestamp = new Date(data.date);
                data.measure.forEach(measurement => {
                    if (!["temperature", "pressure", "humidity"].includes(measurement.name)) {
                        const point = new Point(measurement.name)
                            .timestamp(timestamp)
                            .floatField('value', parseFloat(measurement.value))
                            .tag('unit', measurement.unit);
                        writeClient.writePoint(point);
                        console.log(`Sensor Data written to DB: ${JSON.stringify(measurement)}`);
                    }
                });
            } catch (error) {
                console.error("Got bad packet:", line, error);
                console.log(`Sensor Data not written to DB: ${line}`);
            }
        });
        fileLineCount.sensor = linesNumber;
    }
});

fs.watchFile(tphFilePath, () => {
    const lines = fs.readFileSync(tphFilePath, 'utf8').split('\n');
    const linesNumber = lines.length;
    if (linesNumber < fileLineCount.tph) {
        fileLineCount.tph = 0;
    }

    if (linesNumber > fileLineCount.tph) {
        const newLines = lines.slice(fileLineCount.tph, linesNumber);
        console.log(fileLineCount.tph, linesNumber, newLines);
        newLines.forEach(line => {
            try {
                line = line.trim();
                const data = JSON.parse(line);
                const timestamp = new Date(data.date);
                const tempPoint = new Point('temperature')
                    .timestamp(timestamp)
                    .floatField('value', data.temp)
                    .tag('unit', 'C');
                const hygroPoint = new Point('humidity')
                    .timestamp(timestamp)
                    .floatField('value', data.hygro)
                    .tag('unit', '%');
                const pressPoint = new Point('pressure')
                    .timestamp(timestamp)
                    .floatField('value', data.press)
                    .tag('unit', 'hPa');
                writeClient.writePoint(tempPoint);
                writeClient.writePoint(hygroPoint);
                writeClient.writePoint(pressPoint);
                console.log(`TPH Data written to DB: ${JSON.stringify(data)}`);
            } catch (error) {
                console.error("Got bad packet:", line, error);
                console.log(`TPH Data not written to DB: ${line}`);
            }
        });
        fileLineCount.tph = linesNumber;
    }
});