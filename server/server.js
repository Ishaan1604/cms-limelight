const app = require('./app')
require('dotenv').config();
const {startMetricServer, stopMetricServer} = require('./utils/metrics')
const connectDB = require('./db/connect');

const port = process.env.PORT || 3000

let server;
let dbConnection;
const start = async() => {
    try {
        dbConnection =  await connectDB(process.env.MONGO_URI)
        server = app.listen(port, () => console.log(`Server now listening on port ${port}`));
        startMetricServer();
    } catch (error) {
        console.log(error)
    }
};

const stop = async() => {
    if (server) {
        server.close();
    }
    if (dbConnection) {
        await dbConnection.disconnect();
    }
    stopMetricServer();
}

module.exports = {
    start, 
    stop,
}
start();