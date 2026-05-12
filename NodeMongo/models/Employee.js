const mongoose = require('mongoose');   

const employeeSchema = new mongoose.Schema({
    //name,email,phone,city
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        default: false
    },
    city: {
        type: String,
        // required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);