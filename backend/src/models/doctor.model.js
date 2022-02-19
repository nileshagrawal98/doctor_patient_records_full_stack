const { Schema, model } = require('mongoose');

const doctorSchema = new Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
    specialty: { type: String, required: true },
    photo: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    password: { type: String, required: true }

}, {
    timestamps: true,
    versionKey: false
});

const Doctor = model('doctor', doctorSchema);

module.exports = Doctor;

