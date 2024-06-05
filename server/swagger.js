const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
    info: {
      title: 'Claims Management System',
      description: 'A simple system that allows an insurance company to create policy and regulate claims and users to buy policies and make claims'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Main claims management server'
        }
    ],
    tags: [
        {
            name: 'Auth',
            description: 'Contains all the authentication pages'
        },
        {
            name: 'Admin',
            description: 'Contains all the admin pages'
        },
        {
            name: 'Policy',
            description: 'Contains all the policy pages'
        },
        {
            name: 'User',
            description: 'Contains all the user pages'
        }
    ],
    components: {
        schemas: {
            Person: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                    },
                    name: {
                        type: 'string'
                    },
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    password: {
                        type: 'string',
                    },
                    personType: {
                        type: 'string',
                        enum: ['user', 'admin']
                    },
                    claims: {
                        type: 'number',
                        description: 'The number of claims this user has'
                    },
                    createdAt: {
                        type: 'date',
                        description: 'The day the account was created'
                    },
                    updatedAt: {
                        type: 'date',
                        description: 'The last time the account was updated'
                    },
                    __v: {
                        type: 'number'
                    }
                }
            },
            jwtToken: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                    }
                }
            },
            Policy: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                    },
                    name: {
                        type: 'string'
                    },
                    policyType: {
                        type: 'string',
                        enum: ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']
                    },
                    description: {
                        type: 'string',
                    },
                    cost: {
                        type: 'string',
                    },
                    claimAmount: {
                        type: 'number',
                        description: 'The total amount of money that can be claimed against this policy'
                    },
                    validity: {
                        type: 'string',
                        description: 'The length of time this policy lasts'
                    },
                    active: {
                        type: 'boolean'
                    },
                    claims: {
                        type: 'number',
                        description: 'The number of claims this policy has'
                    },
                    createdAt: {
                        type: 'date',
                        description: 'The day the policy was created'
                    },
                    updatedAt: {
                        type: 'date',
                        description: 'The last time the policy was updated'
                    },
                    __v: {
                        type: 'number'
                    }
                }
            },
            Claim: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                    },
                    userId: {
                        type: 'string',
                    },
                    policyId: {
                        type: 'string',
                    },
                    policyName: {
                        type: 'string'
                    },
                    policyType: {
                        type: 'string',
                        enum: ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']
                    },
                    description: {
                        type: 'string',
                    },
                    claimAmount: {
                        type: 'number',
                        description: 'The amount the claim is for'
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'rejected', 'approved']
                    },
                    document: {
                        type: 'buffer',
                        description: 'The evidence for the claim'
                    },
                    createdAt: {
                        type: 'date',
                        description: 'The day the claim was created'
                    },
                    updatedAt: {
                        type: 'date',
                        description: 'The last time the claim was updated'
                    },
                    __v: {
                        type: 'number'
                    }
                }
            },
            UserPolicy: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                    },
                    userId: {
                        type: 'string',
                    },
                    policyId: {
                        type: 'string',
                    },
                    policyName: {
                        type: 'string'
                    },
                    policyType: {
                        type: 'string',
                        enum: ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']
                    },
                    amountRemaining: {
                        type: 'number',
                        description: 'The amount remaining on this particular policy for this particular user'
                    },
                    validity: {
                        type: 'date',
                        description: 'The date till which this policy is active'
                    },
                    expired: {
                        type: 'boolean',
                    },
                    createdAt: {
                        type: 'date',
                        description: 'The day the claim was created'
                    },
                    updatedAt: {
                        type: 'date',
                        description: 'The last time the claim was updated'
                    },
                    __v: {
                        type: 'number'
                    }
                }
            },
        }
    }
  };
  
const outputFile = './swagger-output.json';
const routes = ['./app'];

swaggerAutogen(outputFile, routes, doc);