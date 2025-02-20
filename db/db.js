import { InfluxDB, Point } from '@influxdata/influxdb-client';
import fs from 'fs';
import nmea from 'nmea-simple';

const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim();
const influxDB = new InfluxDB({ url: process.env.INFLUXDB_URL, token: token });

const writeApi = influxDB.getWriteApi(process.env.DOCKER_INFLUXDB_INIT_ORG, process.env.DOCKER_INFLUXDB_INIT_BUCKET);

const gpsFilePath = '/dev/shm/gpsNmea';
const rainFilePath = '/dev/shm/rainCounter.log';

const fileLineCount = {
    gps: 0,
    rain: 0,
    sensor: 0,
    tph: 0
};

const watchFile = (filePath, fileType) => {
    console.log(`Watching file: ${filePath}`);
    fs.watchFile(filePath, { persistent: true, interval: 1000 }, (curr, prev) => {
        console.log(`${fileType} file changed`);
        console.log(`Previous size: ${prev.size}, Current size: ${curr.size}`);
        if (curr.size > fileLineCount[fileType]) {
            const stream = fs.createReadStream(filePath, {
                start: fileLineCount[fileType],
                end: curr.size
            });

            stream.on('data', chunk => {
                const lines = chunk.toString().split('\r\n');
                lines.forEach(line => {
                    try {
                        let point;
                        if (fileType === 'gps') {
                            const packet = nmea.parseNmeaSentence(line);
                            if (["RMC", "GGA", "GSA"].includes(packet.sentenceId)) {
                                point = new Point('gps')
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
                            }
                        } else if (fileType === 'rain') {
                            point = new Point('rain')
                                .timestamp(new Date(line.trim()));
                        }

                        if (point) {
                            writeApi.writePoint(point);
                            console.log(`Data written to DB: ${JSON.stringify(line)}`);
                        }
                    } catch (error) {
                        console.error(`Got bad packet in ${fileType} file:`, line, error);
                        console.log(`Data not written to DB: ${line}`);
                    }
                });
            });

            stream.on('end', () => {
                fileLineCount[fileType] = curr.size;
                console.log(`Updated fileLineCount.${fileType} to ${fileLineCount[fileType]}`);
            });
        }
    });
};

watchFile(gpsFilePath, 'gps');
watchFile(rainFilePath, 'rain');

const closeConnection = () => {
    writeApi.close().then(() => {
        console.log('Connection closed');
    }).catch(e => {
        console.error('Error closing connection', e);
    });
};