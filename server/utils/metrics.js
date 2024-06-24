const client = require('prom-client');
const app = require('express')();
require('dotenv').config();

const PORT = process.env.METRIC_PORT || 9100

const collectDefaultMetrics = client.collectDefaultMetrics
const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_second',
    help: "Duration of the http request in seconds",
    labelNames: ['method', 'route', 'status_code'],
})

const httpRequestCounter = new client.Counter({
    name: 'http_request_counter',
    help: 'Number of hits each route gets',
    labelNames: ['method', 'route', 'status_code']
})

const dbResponseDurationSeconds = new client.Histogram({
    name: 'db_request_duration_second',
    help: "Duration of the db request in seconds",
    labelNames: ['operation', 'success'],
})

const dbResponseDurationSecondsFn = async(fn, operation) => {
    const end = dbResponseDurationSeconds.startTimer();
    try {
        const result = await fn()
        end({operation, success: true})
        return result
    } catch (error) {
        end({operation, success: false})
        throw error
    }
}

app.get('/metrics', async(req, res) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
})

let server;
const startMetricServer = async() => {
    server = app.listen(PORT, () => {
        console.log(`Metric server started on port ${PORT}`)
    })

}

const stopMetricServer = async() => {
    if (server) server.close();
}

module.exports = {
    startMetricServer,
    collectDefaultMetrics,
    httpRequestCounter,
    httpRequestDurationSeconds,
    dbResponseDurationSecondsFn,
    stopMetricServer,
}
