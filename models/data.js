const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\b[A-Z0-9.]+@gmail\.com\b/i.test(v);
            },
            message: props => `${props.value} is not a valid Gmail address!`
        }
    },
    password: {
        type: String,
        required: true
    },
    confirmPass: {
        type: String,
        required: true
    }
});

const Login = mongoose.model('Login', userSchema);

module.exports = Login;
