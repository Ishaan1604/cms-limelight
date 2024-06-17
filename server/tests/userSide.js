const request = require("supertest");
const app = require("../../src/app");
const {StatusCodes} = require('http-status-codes')

let token = '';
beforeAll(async () => {
    const {body} = request(app).post('/api/v1/cms/login').send({
        email: 'user@gmail.com',
        password: 'userNew123',
    })

    token = body.token
})

// Testing the update user function
describe('Testing the update user function', async () => {
    it('should return an user with the updated email', async () => {
        const user = {
            name: 'user',
            email: 'userNew@gmail.com',
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(user)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('person')

        expect(response.body.person).toHaveProperty('_id')
        expect(response.body.person).toHaveProperty('name')
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password', user.password)
        expect(response.body.person).toHaveProperty('personType', 'user')

    });

    it('should return an user with the updated name', async () => {
        const user = {
            email: 'user@gmail.com',
            name: 'userNew'
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(user)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('person')

        expect(response.body.person).toHaveProperty('_id')
        expect(response.body.person).toHaveProperty('name')
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password', user.password)
        expect(response.body.person).toHaveProperty('personType', 'user')

    });
    
    
    it('should throw a validation error due to repeated value', async () => {
        const user = {
            name: 'user',
            email: 'user1@gmail.com',
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(user)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('msg')
    });

    it('should throw a validation error due to missing value', async () => {
        const user = {
            name: 'user',
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(user)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('msg')
    });

})