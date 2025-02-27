import { InfluxDB, Point } from '@influxdata/influxdb-client';
import fs from 'fs';
import nmea from 'nmea-simple';

const gpsFilePath = '/dev/shm/gpsNmea';
const rainFilePath = '/dev/shm/rainCounter.log';
const sensorFilePath = '/dev/shm/sensors';
const tphFilePath = '/dev/shm/tph.log';

const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim();
const url = process.env.INFLUXDB_URL || 'http://piensg031.ensg.eu:8086';

const client = new InfluxDB({ url, token });

let org = process.env.DOCKER_INFLUXDB_INIT_ORG;
let bucket = process.env.DOCKER_INFLUXDB_INIT_BUCKET;

let writeClient = client.getWriteApi(org, bucket, 'ns');

const readAndWriteFile = (filePath, processLine) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }
        const lines = data.split('\n');
        lines.forEach(line => {
            try {
                line = line.trim();
                if (line) {
                    processLine(line);
                }
            } catch (error) {
                console.error(`Got bad packet in file ${filePath}:`, line, error);
            }
        });
    });
};

const processGpsLine = (line) => {
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
        console.log(`GPS Data written to DB: ${JSON.stringify(packet)}`);
    }
};

const processRainLine = (line) => {
    const point = new Point('rain')
        .timestamp(new Date())
        .intField('value', 1);
    writeClient.writePoint(point);
    console.log(`Rain Data written to DB: ${line}`);
};

const processSensorLine = (line) => {
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
};

const processTphLine = (line) => {
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
};

fs.watchFile(rainFilePath, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        console.log(`Rain file changed: ${rainFilePath}`);
        readAndWriteFile(rainFilePath, processRainLine);
    }
});

setInterval(() => {
    readAndWriteFile(gpsFilePath, processGpsLine);
    readAndWriteFile(sensorFilePath, processSensorLine);
    readAndWriteFile(tphFilePath, processTphLine);
}, 15000);