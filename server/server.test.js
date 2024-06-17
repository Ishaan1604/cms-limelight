const request = require("supertest");
const app = require("../../src/app");
const {StatusCodes} = require('http-status-codes')

// Testing the registration function
describe('Testing the registration function', () => {
    it('should create an admin', async () => {
        const admin = {
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'admin123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(admin)

        expect(response.status).toBe(StatusCodes.CREATED)

        expect(response.body).toHaveProperty('person')
        expect(response.body).toHaveProperty('token')


        expect(response.body.person).toHaveProperty('_id')
        expect(response.body.person).toHaveProperty('name', admin.name)
        expect(response.body.person).toHaveProperty('email', admin.email)
        expect(response.body.person).toHaveProperty('password', admin.password)
        expect(response.body.person).toHaveProperty('personType', 'admin')

    });

    it('should create an user', async () => {
        const user = {
            name: 'user',
            email: 'user@gmail.com',
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.CREATED)

        expect(response.body).toHaveProperty('person')
        expect(response.body).toHaveProperty('token')


        expect(response.body.person).toHaveProperty('_id')
        expect(response.body.person).toHaveProperty('name', user.name)
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password', user.password)
        expect(response.body.person).toHaveProperty('personType', 'user')

    });
    
    it('should return a unique token', async () => {
        const user1 = {
            name: 'user1',
            email: 'user1@gmail.com',
            password: 'user123'
        };

        const user2 = {
            name: 'user2',
            email: 'user2@gmail.com',
            password: 'user123'
        };

        const response1 = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user1)

        const response2 = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user2)

        expect(response1.body.token).not.toEqual(response2.body.token)
    });

    it('should throw a validation error due to repeated value', async () => {
        const user = {
            name: 'user',
            email: 'user@gmail.com',
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('msg')
    });

    it('should throw a validation error due to missing value', async () => {
        const user = {
            name: 'user',
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('msg')
    });

})

// Testing the login function
describe('Testing the login function', () => {
    it('should return an user', async () => {
        const user = {
            email: 'user@gmail.com',
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('person')
        expect(response.body).toHaveProperty('token')


        expect(response.body.person).toHaveProperty('_id')
        expect(response.body.person).toHaveProperty('name')
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password', user.password)
        expect(response.body.person).toHaveProperty('personType', 'user')

    });
    
    
    it('should throw a bad request error due to missing value', async () => {
        const user = {
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        expect(response.body).toHaveProperty('msg', 'Please provide an email and password')
    });

    it('should throw a bad request error due to incorrect email', async () => {
        const user = {
            email: 'userWrong@gmail.com',
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        expect(response.body).toHaveProperty('msg', 'Incorrect email, please try again')
    });

    it('should throw a bad request error due to incorrect password', async () => {
        const user = {
            email: 'user@gmail.com',
            password: 'userWrong123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        expect(response.body).toHaveProperty('msg', 'Incorrect password, please try again')
    });

})

// Testing the reset password function
describe('Testing the reset password function', () => {
    it('should return an user with the updated password', async () => {
        const user = {
            email: 'user@gmail.com',
            password: 'userNew123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('person')

        expect(response.body.person).toHaveProperty('_id')
        expect(response.body.person).toHaveProperty('name')
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password', user.password)
        expect(response.body.person).toHaveProperty('personType', 'user')

    });
    
    
    it('should throw a bad request error due to missing value', async () => {
        const user = {
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        expect(response.body).toHaveProperty('msg', 'Please provide an email and password')
    });

    it('should throw a bad request error due to incorrect email', async () => {
        const user = {
            email: 'userWrong@gmail.com',
            password: 'user123'
        };

        const response = await request(app)
            .post('/api/v1/cms/auth/register')
            .send(user)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        expect(response.body).toHaveProperty('msg', 'Incorrect email, please try again')
    });

})

// Testing the get all user policy function