const request = require("supertest");
const app = require("../../src/app");
const {StatusCodes} = require('http-status-codes')

let token = '';
let claim;
beforeAll(async () => {
    const {body} = request(app).post('/api/v1/cms/login').send({
        email: 'admin@gmail.com',
        password: 'admin123',
    })

    token = body.token
})

// Testing the get user function
describe('Testing the get user function', async() => {
    const {body: {users}} = await request(app).get('/api/v1/cms/admin/users').set('Authorization', `Bearer ${token}`)
    const user = users.pop();

    it('should return the user', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/admin/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('user', user)
    })

    it('should return a not found error', async() => {
        const response = await request(app)
            .get('/api/v1/cms/admin/users/1')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', `No user with id: 1 found`)
    })
})

// Testing the get claim function
describe('Testing the get claim function', async() => {
    const {body: {claims}} = await request(app).get('/api/v1/cms/admin/claims').set('Authorization', `Bearer ${token}`)
    claim = claims.pop();

    it('should return the claim', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/admin/claims/${claim._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claim', claim);
    })

    it('should return a not found error', async() => {
        const response = await request(app)
            .get('/api/v1/cms/admin/claims/1')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', `No claim with id: 1 found`)
    })
})

// Testing the update claim function
describe('Testing the update claim function', () => {
    it("should return the updated claim", async() => {
        const updatedClaim = {
            ...claim,
            status: 'rejected'
        }

        const response = await request(app)
            .patch(`/api/v1/cms/admin/claims/${claim._id}`)
            .send(updatedClaim)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claim', updatedClaim)
    })

    it('should return a not found error', async() => {
        const updatedClaim = {
            ...claim,
            status: 'rejected'
        }

        const response = await request(app)
            .patch(`/api/v1/cms/admin/claims/1`)
            .send(updatedClaim)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', `No claim with id: ${claim._id} found`)
    })

    it('should return a validation error due to value outside enum', async() => {
        const updatedClaim = {
            ...claim,
            status: 'sent for further investigation'
        }

        const response = await request(app)
            .patch(`/api/v1/cms/admin/claims/${claim._id}`)
            .send(updatedClaim)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })
})