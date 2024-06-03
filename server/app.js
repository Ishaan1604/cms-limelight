const express = require('express');
const connectDB = require('./db/connect');
const app = express();
const fileupload = require('express-fileupload');
require('dotenv').config();
require('express-async-errors')
const cors = require('cors')
const swaggerSpecs = require('./swaggerSpec')
const swaggerUi = require('swagger-ui-express')

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
app.use(cors())

app.use(express.json())
app.use(fileupload({}))

app.use('/api/v1/cms/auth', authRouter)
app.use('/api/v1/cms/policies', authMiddleware, policyRouter)
app.use('/api/v1/cms/user/:user', authMiddleware, userRouter)
app.use('/api/v1/cms/admin', authMiddleware, authAdmin, adminRouter)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server now listening on port ${port}`));
    } catch (error) {
        console.log(error)
    }
};

start();
// setInterval(expireFn, 3600 * 1000)
// setInterval(expiryNotifFn, 86400 * 1000)
// setInterval(expiredNotifFn, 86400 * 1000)