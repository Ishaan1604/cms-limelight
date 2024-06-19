const request = require("supertest");
const app = require("../../src/app");
const {StatusCodes} = require('http-status-codes');

let token = '';
let id = '';
beforeAll(async () => {
    const {body} = request(app).post('/api/v1/cms/login').send({
        email: 'admin@gmail.com',
        password: 'admin123',
    })

    token = body.token
})

// Testing the create policy function
describe('test the create policy function', () => {
    it('creates a new policy', async () => {
        const policy = {
            name: 'Example 1',
            policyType: 'Health',
            description: 'Blah blah blah',
            cost: '$200/week for 6 months',
            claimAmount: 100000,
            validity: '0 years,6 months',
        }

        const response = await request(app)
            .post('/api/v1/cms/admin/policies')
            .send(policy)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.CREATED)

        expect(response.body).toHaveProperty('policy')

        expect(response.body.policy).toHaveProperty('_id')
        id = response.body.policy._id
        expect(response.body.policy).toHaveProperty('name', policy.name)
        expect(response.body.policy).toHaveProperty('policyType', policy.policyType)
        expect(response.body.policy).toHaveProperty('description', policy.description)
        expect(response.body.policy).toHaveProperty('cost', policy.cost)
        expect(response.body.policy).toHaveProperty('claimAmount', policy.claimAmount)
        expect(response.body.policy).toHaveProperty('validity', policy.validity)
        expect(response.body.policy).toHaveProperty('active', true)
        expect(response.body.policy).toHaveProperty('claims', 0)
    })

    it('returns a validation error due to a missing value', async () => {
        const policy = {
            name: 'Example 1',
            policyType: 'Health',
            description: 'Blah blah blah',
            claimAmount: 100000,
            validity: '0 years,6 months',
        }

        const response = await request(app)
            .post('/api/v1/cms/admin/policies')
            .send(policy)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })

    it('returns a validation error due to a value outside the enum', async () => {
        const policy = {
            name: 'Example 1',
            policyType: 'Healt',
            description: 'Blah blah blah',
            claimAmount: 100000,
            validity: '0 years,6 months',
        }

        const response = await request(app)
            .post('/api/v1/cms/admin/policies')
            .send(policy)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })
})

// Testing the get policy function
describe('test the get policy function', () => {
    it ('should return the policy', async () => {
        const response = await request(app)
            .get(`/api/v1/cms/policies/${id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policy')

        expect(response.body.policy).toHaveProperty('_id')
        expect(response.body.policy).toHaveProperty('name')
        expect(response.body.policy).toHaveProperty('policyType')
        expect(response.body.policy).toHaveProperty('description')
        expect(response.body.policy).toHaveProperty('cost')
        expect(response.body.policy).toHaveProperty('claimAmount')
        expect(response.body.policy).toHaveProperty('validity')
        expect(response.body.policy).toHaveProperty('active')
        expect(response.body.policy).toHaveProperty('claims')

    })

    it ('should return a not found error', async () => {
        const response = await request(app)
            .get('/api/v1/cms/policies/1')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', 'No policy with id: 1 found')
    })
})

// Testing the update policy function
describe('test the update policy function', () => {
    it('returns the updated policy', async () => {
        const policy = {
            name: 'Example 1',
            policyType: 'Health',
            description: 'Blah blah blah',
            cost: '$200/week for 10 months',
            claimAmount: 100000,
            validity: '0 years,10 months',
        }

        const response = await request(app)
            .patch(`/api/v1/cms/admin/policies/${id}`)
            .send(policy)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policy')

        expect(response.body.policy).toHaveProperty('_id')
        expect(response.body.policy).toHaveProperty('name', policy.name)
        expect(response.body.policy).toHaveProperty('policyType', policy.policyType)
        expect(response.body.policy).toHaveProperty('description', policy.description)
        expect(response.body.policy).toHaveProperty('cost', policy.cost)
        expect(response.body.policy).toHaveProperty('claimAmount', policy.claimAmount)
        expect(response.body.policy).toHaveProperty('validity', policy.validity)
        expect(response.body.policy).toHaveProperty('active', true)
        expect(response.body.policy).toHaveProperty('claims')
    })
    it ('should return a not found error', async () => {
        const response = await request(app)
            .patch('/api/v1/cms/admin/policies/1')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', 'No policy with id: 1 found')
    })
})

// Testing the delete policy function
describe('test the delete policy function', () => {
    it('returns the deleted policy', async () => {

        const response = await request(app)
            .delete(`/api/v1/cms/admin/policies/${id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policy')

        expect(response.body.policy).toHaveProperty('_id')
        expect(response.body.policy).toHaveProperty('name')
        expect(response.body.policy).toHaveProperty('policyType')
        expect(response.body.policy).toHaveProperty('description')
        expect(response.body.policy).toHaveProperty('cost')
        expect(response.body.policy).toHaveProperty('claimAmount')
        expect(response.body.policy).toHaveProperty('validity')
        expect(response.body.policy).toHaveProperty('active')
        expect(response.body.policy).toHaveProperty('claims')
    })
    it ('should return a not found error', async () => {
        const response = await request(app)
            .delete('/api/v1/cms/admin/policies/1')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', 'No policy with id: 1 found')
    })
})