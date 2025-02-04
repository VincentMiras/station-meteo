import {InfluxDB, Point} from '@influxdata/influxdb-client'

const influxDB = new InfluxDB({url: 'YOUR_URL', token: 'YOUR_API_TOKEN'})

const writeApi = influxDB.getWriteApi('YOUR_ORG', 'YOUR_BUCKET')