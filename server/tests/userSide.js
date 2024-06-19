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