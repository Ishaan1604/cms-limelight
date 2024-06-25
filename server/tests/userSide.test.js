const request = require("supertest");
const app = require('../app')
const {StatusCodes} = require('http-status-codes')
const fs = require('fs')
const path = require('path')
const {describe, it, beforeAll, beforeEach, expect} = require("@jest/globals");
const { start, stop } = require("../server");

let token = '';
let user = {
    email: 'user@gmail.com',
    password: 'userNew123',
}
let policy;
let userPolicy;
let userPolicies;

beforeAll(async() => await start())
beforeEach(async () => {
    const {body} = await request(app).post('/api/v1/cms/auth/login').send({...user})
    token = body.token
    user = {name: body.person.name, email: body.person.email, password: 'userNew123', claims: body.person.claims}
    console.log(`Running ${expect.getState().currentTestName}`)
})

afterEach(() => console.log(`Finished ${expect.getState().currentTestName}`))

afterAll(async() => {
    await stop();
})

// Testing the update user function
describe('Testing the update user function', () => {
    it('should return an user with the updated email', async () => {
        const person = {
            name: 'user',
            email: 'userNew@gmail.com',
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(person)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('user')

        expect(response.body.user).toHaveProperty('_id')
        expect(response.body.user).toHaveProperty('name', person.name)
        expect(response.body.user).toHaveProperty('email', person.email)
        expect(response.body.user).toHaveProperty('password')
        expect(response.body.user).toHaveProperty('personType', 'user')
        user.email = person.email

    });

    it('should return an user with the updated name', async () => {
        const person = {
            email: 'userNew@gmail.com',
            name: 'userNew'
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(person)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('user')

        expect(response.body.user).toHaveProperty('_id')
        expect(response.body.user).toHaveProperty('name', person.name)
        expect(response.body.user).toHaveProperty('email', person.email)
        expect(response.body.user).toHaveProperty('password')
        expect(response.body.user).toHaveProperty('personType', 'user')
        user.name = response.body.user.name

    });
    
    
    it('should throw a validation error due to repeated value', async () => {
        const user = {
            name: 'userNew',
            email: 'user1t@gmail.com',
        };

        const response = await request(app)
            .patch('/api/v1/cms/user/user/updateUser')
            .send(user)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('msg')
    });
})

// Testing the add policy function
describe('Testing the add policy function', () => {
    
    it ('should create a new user policy', async () => {
        const {body: {policies}} = await request(app).get('/api/v1/cms/policies?active=true false').set('Authorization', `Bearer ${token}`)
        policy = policies.pop();
        const response = await request(app)
            .post(`/api/v1/cms/user/user/${policy._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.CREATED)

        expect(response.body).toHaveProperty('myPolicy');

        expect(response.body.myPolicy).toHaveProperty('_id')
        expect(response.body.myPolicy).toHaveProperty('policyId', policy._id)
        expect(response.body.myPolicy).toHaveProperty('userId')
        expect(response.body.myPolicy).toHaveProperty('policyName', policy.name)
        expect(response.body.myPolicy).toHaveProperty('policyType', policy.policyType)
        expect(response.body.myPolicy).toHaveProperty('amountRemaining', policy.claimAmount)
        expect(response.body.myPolicy).toHaveProperty('validity')
        expect(response.body.myPolicy).toHaveProperty('expired', false)

        userPolicy = response.body.myPolicy;
        await request(app)
            .post(`/api/v1/cms/user/user/${policies[0]._id}`)
            .set('Authorization', `Bearer ${token}`)

        await request(app)
            .post(`/api/v1/cms/user/user/${policies[1]._id}`)
            .set('Authorization', `Bearer ${token}`)
    })
})

// Testing the get all user policy function
describe('Testing the get all user policy function', () => {
    it('should get all user policy', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        userPolicies = response.body.myPolicies;
    })

    it('should return all the user policies with a t in their policyName', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies?policyName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy of response.body.myPolicies) {
            expect(single_policy.policyName).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the user Health policy', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies?policyType=Health')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy of response.body.myPolicies) {
            expect(single_policy.policyType).toBe('Health')
        }
    })

    it('should return all the expired user policies', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/user/user/myPolicies?expired=true`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        expect(response.body.myPolicies.length).toBe(0)
        // for (let single_policy in response.body.myPolicies) {
        //     expect(single_policy.expired).toBe('true')
        // }
    })

    it('should return all the user policies for a particular policy', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/user/user/myPolicies?policyId=${policy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy of response.body.myPolicies) {
            expect(single_policy.policyId).toBe(`${policy._id}`)
        }
    })

    it('should return all the user policies sorted by policyName', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies?sort=policyName')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let i = 1; i < response.body.myPolicies.length; i++ ) {
            expect(response.body.myPolicies[i].policyName >= response.body.myPolicies[i - 1].policyName).toBe(true)
        }
    })

    it('should return the first two user policies validity wise', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies?limit=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        expect(response.body.myPolicies.length).toEqual(2)
        expect(response.body.myPolicies[1].validity >= response.body.myPolicies[0].validity).toBe(true)
    })

    it('should return the last user policy validity wise', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies?limit=2&page=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        expect(response.body.myPolicies.length).toEqual(1)
    })
})

// Testing the get user policy function
describe('Testing the get user policy function', () => {
    it('should return the user policy', async () => {
        const response = await request(app)
            .get(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicy', userPolicy)
    })

    it('should return a not found error', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myPolicies/1')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND)

        expect(response.body).toHaveProperty('msg', `No item found with id : 1`)
    })
})
// Testing the make claim function
describe('Testing the make claim function', () => {
    it('should create a new claim',  async () => {
        const filePath = path.join(__dirname, 'dummy_file.pdf')
        const document = await fs.readFile(filePath, 'utf-8', (err, data) => {if (err) throw err});
        const claim = {
            policyName: userPolicy.policyName,
            policyType: userPolicy.policyType, 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) / 10,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .field('policyName', userPolicy.policyName)
            .field('policyType', userPolicy.policyType)
            .field('description', "died")
            .field('claimAmount', Number(userPolicy.amountRemaining) / 10)
            .attach("file", filePath, 'dummy_file.pdf')
            .set('Authorization', `Bearer ${token}`)
        
        const {body: {person: user_after}} = await request(app).post('/api/v1/cms/auth/login').send({...user})

        const {body: {policy: policy_after}} = await request(app)
            .get(`/api/v1/cms/policies/${policy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.CREATED)

        expect(response.body).toHaveProperty('claim')

        expect(response.body.claim).toHaveProperty('_id')
        expect(response.body.claim).toHaveProperty('userId')
        expect(response.body.claim).toHaveProperty('policyId', userPolicy._id)
        expect(response.body.claim).toHaveProperty('policyName', claim.policyName)
        expect(response.body.claim).toHaveProperty('policyType', claim.policyType)
        expect(response.body.claim).toHaveProperty('description', claim.description)
        expect(response.body.claim).toHaveProperty('claimAmount', claim.claimAmount)
        expect(response.body.claim).toHaveProperty('status', 'pending')
        expect(response.body.claim).toHaveProperty('document')

        expect(policy_after.claims).toBe(policy.claims + 1)
        expect(user_after.claims).toBe(user.claims + 1)

        const claim2 = {
            policyName: userPolicies[1].policyName,
            policyType: userPolicies[1].policyType, 
            description: 'died',
            claimAmount: Number(userPolicies[1].amountRemaining) / 10,
            document,
        }

        const claim3 = {
            policyName: userPolicies[2].policyName,
            policyType: userPolicies[2].policyType, 
            description: 'died',
            claimAmount: Number(userPolicies[2].amountRemaining) / 10,
            document,
        }

        await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicies[1]._id}`)
            .field('policyName', userPolicies[1].policyName)
            .field('policyType', userPolicies[1].policyType)
            .field('description', "died")
            .field('claimAmount', Number(userPolicies[1].amountRemaining) / 10)
            .attach("file", filePath, 'dummy_file.pdf')
            .set('Authorization', `Bearer ${token}`)

        await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicies[2]._id}`)
            .field('policyName', userPolicies[2].policyName)
            .field('policyType', userPolicies[2].policyType)
            .field('description', "died")
            .field('claimAmount', Number(userPolicies[2].amountRemaining) / 10)
            .attach("file", filePath, 'dummy_file.pdf')
            .set('Authorization', `Bearer ${token}`)


    })
    it('should return a bad request error for the wrong file type', async () => {
        const filePath = path.join(__dirname, 'LLD_Lumiq_Project.docx')
        const document = await fs.readFile(filePath, 'utf-8', (err, data) => {if (err) throw err});
        const claim = {
            policyName: userPolicy.policyName,
            policyType: userPolicy.policyType, 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) / 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .field('policyName', userPolicy.policyName)
            .field('policyType', userPolicy.policyType)
            .field('description', "died")
            .field('claimAmount', Number(userPolicy.amountRemaining) / 10)
            .attach("file", filePath, 'LLD_Lumiq_Project.docx')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE)

        expect(response.body).toHaveProperty('msg')
    })
    it('should return a bad request error due to too high claim amount', async () => {
        const filePath = path.join(__dirname, 'dummy_file.pdf')
        const document = await fs.readFile(filePath, 'utf-8', (err, data) => {if (err) throw err});
        const claim = {
            policyName: userPolicy.policyName,
            policyType: userPolicy.policyType, 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) + 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .field('policyName', userPolicy.policyName)
            .field('policyType', userPolicy.policyType)
            .field('description', "died")
            .field('claimAmount', Number(userPolicy.amountRemaining) + 10)
            .attach("file", filePath, 'dummy_file.pdf')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)

        expect(response.body).toHaveProperty('msg', 'Claim amount exceeds amount left in policy. Kindly change')
    })
    it('should return a validation error due to a missing value',  async () => {
        const filePath = path.join(__dirname, 'dummy_file.pdf')
        const document = await fs.readFile(filePath, 'utf-8', (err, data) => {if (err) throw err});
        const claim = {
            policyName: userPolicy.policyName,
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) + 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .field('policyName', userPolicy.policyName)
            .field('description', "died")
            .field('claimAmount', Number(userPolicy.amountRemaining) / 10)
            .attach("file", filePath, 'dummy_file.pdf')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })
    it('should return a validation error due to value outside enum',  async () => {
        const filePath = path.join(__dirname, 'dummy_file.pdf')
        const document = await fs.readFile(filePath, 'utf-8', (err, data) => {if (err) throw err});
        const claim = {
            policyName: userPolicy.policyName,
            policyType: 'Heal', 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) + 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .field('policyName', userPolicy.policyName)
            .field('policyType', 'Heal')
            .field('description', "died")
            .field('claimAmount', Number(userPolicy.amountRemaining) / 10)
            .attach("file", filePath, 'dummy_file.pdf')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })
})

// Testing the get all user claims function
describe('Testing the get all user claims function', () => {
    it('should return all the user claims', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myClaims')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        claim = response.body.claims.pop();
    })

    it('should return all the user claims with a t in their policyName', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myClaims?policyName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim of response.body.claims) {
            expect(single_claim.policyName).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the user Health policy claims', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myClaims?policyType=Health')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim of response.body.claims) {
            expect(single_claim.policyType).toBe('Health')
        }
    })

    it('should return all the rejected user claims', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/user/user/myClaims?status=rejected`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim of response.body.claims) {
            expect(single_claim.status).toBe('rejected')
        }
    })

    it('should return all the user claims for a particular policy', async() => {
        const response = await request(app)
            .get(`/api/v1/cms/user/user/myClaims?policyId=${policy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim of response.body.claims) {
            expect(single_claim.policyId).toBe(`${policy._id}`)
        }
    })

    it('should return all the user claims sorted by policyName', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myClaims?sort=policyName')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let i = 1; i < response.body.claims.length; i++ ) {
            expect(response.body.claims[i].policyName >= response.body.claims[i - 1].policyName).toBe(true)
        }
    })

    it('should return the first two user claims chronologically', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myClaims?limit=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toEqual(2)
        expect(response.body.claims[1].updatedAt >= response.body.claims[0].updatedAt).toBe(true)
    })

    it('should return the last user claim choronologically', async() => {
        const response = await request(app)
            .get('/api/v1/cms/user/user/myClaims?limit=2&page=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toEqual(1)
    })
})