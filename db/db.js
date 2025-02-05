const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const fs = require('fs')

const token = fs.readFileSync(process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE, 'utf8').trim()

const influxDB = new InfluxDB({url: process.env.INFLUXDB_URL, token: token})

const writeApi = influxDB.getWriteApi(process.env.DOCKER_INFLUXDB_INIT_ORG, process.env.DOCKER_INFLUXDB_INIT_BUCKET)


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
