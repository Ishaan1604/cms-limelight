const app = require('./app')
require('dotenv').config();
const {startMetricServer} = require('./utils/metrics')
const connectDB = require('./db/connect');

const port = process.env.PORT || 3000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server now listening on port ${port}`));
        startMetricServer();
    } catch (error) {
        console.log(error)
    }
};

start();