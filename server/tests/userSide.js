const request = require("supertest");
const app = require("../../src/app");
const mime = require('mime-type')
const {StatusCodes} = require('http-status-codes')
const fs = require('fs')

let token = '';
let user;
let policy;
let userPolicy;
beforeAll(async () => {
    const {body} = request(app).post('/api/v1/cms/login').send({
        email: 'user@gmail.com',
        password: 'userNew123',
    })

    token = body.token
    user = body.person
})

// Testing the update user function
describe('Testing the update user function', () => {
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
        expect(response.body.person).toHaveProperty('name', user.name)
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password')
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
        expect(response.body.person).toHaveProperty('name', user.name)
        expect(response.body.person).toHaveProperty('email', user.email)
        expect(response.body.person).toHaveProperty('password')
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

// Testing the add policy function
describe('Testing the add policy function', async () => {
    const {body: {policies}} = await request(app).get('/api/v1/cms/policies').set('Authorization', `Bearer ${token}`)
    policy = policies.pop();

    it ('should create a new user policy', async () => {
        const response = await request(app)
            .post(`/api/v1/cms/user/user/${policy._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(StatusCodes.OK)

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
    })

    it('should return all the user policies with a t in their policyName', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myPolicies?policyName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy in response.body.myPolicies) {
            expect(single_policy.policyName).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the user Health policy', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myPolicies?policyType=Health')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy in response.body.myPolicies) {
            expect(single_policy.policyType).toBe('Health')
        }
    })

    it('should return all the expired user policies', async() => {
        const response = await request(app)
            .get(`api/v1/cms/user/user/myPolicies?expired=true`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy in response.body.myPolicies) {
            expect(single_policy.expired).toBe('true')
        }
    })

    it('should return all the user policies for a particular policy', async() => {
        const response = await request(app)
            .get(`api/v1/cms/user/user/myPolicies?policyId=${policy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let single_policy in response.body.myPolicies) {
            expect(single_policy.policyId).toBe(`${policy._id}`)
        }
    })

    it('should return all the user policies sorted by policyName', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myPolicies?sort=policyName')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        for (let i = 1; i <= response.body.myPolicies.length; i++ ) {
            expect(response.body.myPolicies[i].policyName).toBeGreaterThan(response.body.myPolicies[i - 1].policyName)
        }
    })

    it('should return the first two user policies validity wise', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myPolicies?limit=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('myPolicies')
        expect(response.body.myPolicies.length).toEqual(2)
        expect(response.body.myPolicies[1].validity).toBeGreaterThan(response.body.myPolicies[0].validity)
    })

    it('should return the last user policy validity wise', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myPolicies?limit=2&page=2')
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

        expect(response.body).toHaveProperty('msg', `No policy with id: 1 for user: ${user.name}`)
    })
})
// Testing the make claim function
describe('Testing the make claim function', () => {
    it('should create a new claim',  async () => {
        const document = await fs.readFile('./dummy-file.pdf', 'utf-8');
        const claim = {
            policyName: userPolicy.policyName,
            policyType: userPolicy.policyType, 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) / 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .send(claim)
        
        const {body: {person: user_after}} = request(app).post('/api/v1/cms/login').send({
            email: 'user@gmail.com',
            password: 'userNew123',
        })

        const {body: {policy: policy_after}} = await request(app)
            .get(`/api/v1/cms/policies/${policy._id}`)
            .set('Authorization', `Bearer ${token}`)

        const {body: {myPolicy: userPolicy_after}} = await request(app)
            .get(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
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
        expect(response.body.claim).toHaveProperty('document', document)

        expect(policy_after.claims).toBe(policy.claims + 1)
        expect(user_after.claims).toBe(user.claims + 1)
        expect(Number(userPolicy_after.amountRemaining)).toBe(Number(userPolicy.amountRemaining) * 9 / 10)


    })
    it('should return a bad request error for the wrong file type', async () => {
        const document = await fs.readFile('./LLD_Lumiq_Project.docx', 'utf-8');
        const mimeType = mime.lookup('docx');
        const claim = {
            policyName: userPolicy.policyName,
            policyType: userPolicy.policyType, 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) / 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .send(claim)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)

        expect(response.body).toHaveProperty('msg', `${mimeType.split('/')[1]} unsupported. Kindly enter a pdf, png/jpeg, or mp4`)
    })
    it('should return a bad request error due to too high claim amount', async () => {
        const document = await fs.readFile('./dummy-file.pdf', 'utf-8');
        const claim = {
            policyName: userPolicy.policyName,
            policyType: userPolicy.policyType, 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) + 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .send(claim)

        expect(response.status).toBe(StatusCodes.BAD_REQUEST)

        expect(response.body).toHaveProperty('msg', 'Claim amount exceeds amount left in policy. Kindly change')
    })
    it('should return a validation error due to a missing value',  async () => {
        const document = await fs.readFile('./dummy-file.pdf', 'utf-8');
        const claim = {
            policyName: userPolicy.policyName,
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) + 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .send(claim)

        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })
    it('should return a validation error due to value outside enum',  async () => {
        const document = await fs.readFile('./dummy-file.pdf', 'utf-8');
        const claim = {
            policyName: userPolicy.policyName,
            policyType: 'Heal', 
            description: 'died',
            claimAmount: Number(userPolicy.amountRemaining) + 10,
            document,
        }

        const response = await request(app)
            .post(`/api/v1/cms/user/user/myPolicies/${userPolicy._id}`)
            .send(claim)

        expect(response.status).toBe(400)

        expect(response.body).toHaveProperty('msg')
    })
})

// Testing the get all user claims function
describe('Testing the get all user claims function', () => {
    it('should return all the user claims', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myClaims')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        claim = response.body.claims.pop();
    })

    it('should return all the user claims with a t in their policyName', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myClaims?policyName=t')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.policyName).toMatch(/(.*)t(.*)/)
        }
    })

    it('should return all the user Health policy claims', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myClaims?policyType=Health')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.policyType).toBe('Health')
        }
    })

    it('should return all the rejected user claims', async() => {
        const response = await request(app)
            .get(`api/v1/cms/user/user/myClaims?status=rejected`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.status).toBe('rejected')
        }
    })

    it('should return all the user claims for a particular policy', async() => {
        const response = await request(app)
            .get(`api/v1/cms/user/user/myClaims?policyId=${policy._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let single_claim in response.body.claims) {
            expect(single_claim.policyId).toBe(`${policy._id}`)
        }
    })

    it('should return all the user claims sorted by policyName', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myClaims?sort=policyName')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        for (let i = 1; i <= response.body.claims.length; i++ ) {
            expect(response.body.claims[i].policyName).toBeGreaterThan(response.body.claims[i - 1].policyName)
        }
    })

    it('should return the first two user claims chronologically', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myClaims?limit=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toEqual(2)
        expect(response.body.claims[1].updatedAt).toBeGreaterThan(response.body.claims[0].updatedAt)
    })

    it('should return the last user claim choronologically', async() => {
        const response = await request(app)
            .get('api/v1/cms/user/user/myClaims?limit=2&page=2')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.OK)

        expect(response.body).toHaveProperty('claims')
        expect(response.body.claims.length).toEqual(1)
    })
})