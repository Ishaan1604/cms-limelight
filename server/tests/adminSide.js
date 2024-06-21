const request = require("supertest");
const app = require("../../src/app");
const {StatusCodes} = require('http-status-codes')

let token = '';
let claim;
let user;
beforeAll(async () => {
    const {body} = request(app).post('/api/v1/cms/login').send({
        email: 'admin@gmail.com',
        password: 'admin123',
    })

    token = body.token
})

// Testing the get all users function
describe('Testing the get all users function', () => {
    it('should return all the users', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/users')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('users')
        user = response.body.users[0];
    })

    it('should return all the users with a t in their name', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/users?userName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('users')
        for (let single_user in response.body.users) {
            expect(single_user.name).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the users with an v in their email', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/users?email=v')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('users')
        for (let single_user in response.body.users) {
            expect(single_user.email).toMatch(/(.*)v(.*)/)
        }
    })

    it('should return all the users sorted by email', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/users?sort=email')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('users')
        for (let i = 1; i <= response.body.users.length; i++ ) {
            expect(response.body.users[i].email).toBeGreaterThan(response.body.users[i - 1].email)
        }
    })

    it('should return the first two users alphabetically', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/users?limit=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('users')
        expect(response.body.users.length).toEqual(2)
        expect(response.body.users[1].name).toBeGreaterThan(response.body.users[0].name)
    })

    it('should return the last users alphabetically', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/users?limit=2&page=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('users')
        expect(response.body.users.length).toEqual(1)
    })
})

// Testing the get user function
describe('Testing the get user function', () => {

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

// Testing the get all claims function
describe('Testing the get all claims function', async() => {
    const {body: {policies}} = await request(app).get('/api/v1/cms/policies').set('Authorization', `Bearer ${token}`)
    const policy = policies.pop();
    it('should return all the claims', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/claims')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        claim = response.body.claims.pop();
    })

    it('should return all the claims with a t in their policyName', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/claims?policyName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.policyName).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the Health policy claims', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/claims?policyType=Health')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.policyType).toBe('Health')
        }
    })

    it('should return all the claims for our test user', async() => {
        const response = await request(app)
            .get(`api/v1/cms/admin/claims?userId=${user._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.userId).toBe(`${user._id}`)
        }
    })

    it('should return all the rejected claims', async() => {
        const response = await request(app)
            .get(`api/v1/cms/admin/claims?status=rejected`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toBe(0)
        // for (let single_claim in response.body.claims) {
        //     expect(single_claim.status).toBe('rejected')
        // }
    })
    
    it('should return all the claims for a policy', async() => {
        const response = await request(app)
            .get(`api/v1/cms/admin/claims?policyId=${policy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.policyId).toBe(`${policy._id}`)
        }
    })

    it('should return all the claims sorted by policyName', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/claims?sort=policyName')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let i = 1; i <= response.body.claims.length; i++ ) {
            expect(response.body.claims[i].policyName).toBeGreaterThan(response.body.claims[i - 1].policyName)
        }
    })

    it('should return the first two claims chronologically', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/claims?limit=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toEqual(2)
        expect(response.body.claims[1].updatedAt).toBeGreaterThan(response.body.claims[0].updatedAt)
    })

    it('should return the last claim choronologically', async() => {
        const response = await request(app)
            .get('api/v1/cms/admin/claims?limit=2&page=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toEqual(1)
    })
})
// Testing the get claim function
describe('Testing the get claim function', () => {

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