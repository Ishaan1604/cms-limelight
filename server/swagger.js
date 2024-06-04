const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'Claims Management System',
      description: 'A simple system that allows an insurance company to create policy and regulate claims and users to buy policies and make claims'
    },
    host: 'localhost:3000'
  };
  
const outputFile = './swagger-output.json';
const routes = ['./routers/auth', './routers/user', './routers/admin', './routers/policy'];

swaggerAutogen(outputFile, routes, doc);