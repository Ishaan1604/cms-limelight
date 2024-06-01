const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
        unique: true, 
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },
    personType: {
        type: String,
        required: [true, 'Please provide a user type'],
        enum: ['admin', 'user'],
    },
    claims: {
        type: Number,
        default: 0,
    }
})

personSchema.pre('save', async function(next)  {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model('Person', personSchema)