const request = require("supertest");
const app = require("../../src/app");
const {StatusCodes} = require('http-status-codes')

let token = '';
beforeAll(async () => {
    const {body} = request(app).post('/api/v1/cms/login').send({
        email: 'admin@gmail.com',
        password: 'admin123',
    })

    token = body.token
})