const request = require("supertest");
const app = require('../app')
const {StatusCodes} = require('http-status-codes');
const {describe, it, beforeAll, expect, afterAll} = require("@jest/globals");
const { start, stop } = require("../server");

let token = '';
let id = '';
beforeAll(async () => {
    await start();
    const response = await request(app).post('/api/v1/cms/auth/login').send({
        email: 'admin@gmail.com',
        password: 'admin123',
    })

    token = response.body.token
})

beforeEach(() => console.log(`Running ${expect.getState().currentTestName}`))

afterEach(() => console.log(`Finished ${expect.getState().currentTestName}`))

afterAll(async() => {
    await stop();
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

        const policy2 = {
            name: 'Example 1',
            policyType: 'Life',
            description: 'Blah blah blah',
            cost: '$200/week for 6 months',
            claimAmount: 100000,
            validity: '0 years,10 months',
            active: 'false',
        }

        const policy3 = {
            name: 'txamplt 1',
            policyType: 'Auto',
            description: 'Blah blah blah',
            cost: '$200/week for 6 months',
            claimAmount: 100000,
            validity: '0 years,11 months',
        }

        await request(app)
            .post('/api/v1/cms/admin/policies')
            .send(policy2)
            .set('Authorization', `Bearer ${token}`)

        await request(app)
            .post('/api/v1/cms/admin/policies')
            .send(policy3)
            .set('Authorization', `Bearer ${token}`)
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

// Testing the get all policy function
describe('Testing the get all  policy function', () => {
    it('should get all policy', async() => {
        const response = await request(app)
            .get('/api/v1/cms/policies')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
    })

    it('should return all the policies with a t in their policyName', async() => {
        const response = await request(app)
            .get('/api/v1/cms/policies?policyName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
        for (let single_policy of response.body.policies) {
            expect(single_policy.name).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the Health policy', async() => {
        const response = await request(app)
            .get('/api/v1/cms/policies?policyType=Health')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
        for (let single_policy of response.body.policies) {
            expect(single_policy.policyType).toBe('Health')
        }
    })

    it('should return all the expired policies', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/policies?active=false`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
        for (let single_policy of response.body.policies) {
            expect(single_policy.active).toBe(false)
        }
    })

    it('should return all the policies sorted by policyType', async() => {
        const response = await request(app)
            .get('/api/v1/cms/policies?sort=policyType&active=true false')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
        for (let i = 1; i < response.body.policies.length; i++ ) {
            expect(response.body.policies[i].policyType > response.body.policies[i - 1].policyType).toBe(true)
        }
    })

    it('should return the first two policies alphabetically', async() => {
        const response = await request(app)
            .get('/api/v1/cms/policies?limit=2&active=true false')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
        expect(response.body.policies.length).toEqual(2)
        expect(response.body.policies[1].name >= response.body.policies[0].name).toBe(true)
    })

    it('should return the last policy alphabetically', async() => {
        const response = await request(app)
            .get('/api/v1/cms/policies?limit=2&page=2&active=true false')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('policies')
        expect(response.body.policies.length).toEqual(1)
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

        expect(response.body).toHaveProperty('msg', 'No item found with id : 1')
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

        expect(response.body).toHaveProperty('msg', 'No item found with id : 1')
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


        const policy1 = {
            name: 'Example 1',
            policyType: 'Health',
            description: 'Blah blah blah',
            cost: '$200/week for 6 months',
            claimAmount: 100000,
            validity: '0 years,6 months',
        }


        await request(app)
            .post('/api/v1/cms/admin/policies')
            .send(policy1)
            .set('Authorization', `Bearer ${token}`)
    })
    it ('should return a not found error', async () => {
        const response = await request(app)
            .delete('/api/v1/cms/admin/policies/1')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', 'No item found with id : 1')
    })
})