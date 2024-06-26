const express = require('express');
const app = express();
const fileupload = require('express-fileupload');
require('dotenv').config();
require('express-async-errors')
const cors = require('cors')
const swaggerDocument = require('./swagger-output.json')
const swaggerUi = require('swagger-ui-express')
const {collectDefaultMetrics, httpRequestDurationSeconds, httpRequestCounter} = require('./utils/metrics')

const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const policyRouter = require('./routers/policy')
const adminRouter = require('./routers/admin');

const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found')
const authMiddleware = require('./middleware/authorization')
const authAdmin = require('./middleware/auth-admin');

const expireFn = require('./utils/expire-function');
const expiryNotifFn = require('./utils/expiry-notif-fn');
const expiredNotifFn = require('./utils/expired-notif');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(cors())

app.use(express.json())
app.use(fileupload({}))

collectDefaultMetrics();
app.use((req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer()
    res.on('finish', () => {
        httpRequestCounter.inc({method: req.method, route: req.route ? req.route.path : req.path, status_code: res.statusCode})
        end({method: req.method, route: req.route ? req.route.path : req.path, status_code: res.statusCode})
    })
    next();
})

app.use('/api/v1/cms/auth', authRouter)
app.use('/api/v1/cms/policies', authMiddleware, policyRouter)
app.use('/api/v1/cms/user/:user', authMiddleware, userRouter)
app.use('/api/v1/cms/admin', authMiddleware, authAdmin, adminRouter)

app.use(notFound)
app.use(errorHandler)

// setInterval(expireFn, 3600 * 1000)
// setInterval(expiryNotifFn, 86400 * 1000)
// setInterval(expiredNotifFn, 86400 * 1000)

module.exports = app;