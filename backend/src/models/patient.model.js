const { Schema, model } = require('mongoose');

const patientSchema = new Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
    illness: { type: String },
    medicines: [{ "name": { type: String, required: true }, quantity: { type: Number, required: true } }],
    doctor_assigned: { type: Schema.Types.ObjectId, ref: 'doctor', required: true },
    photo: { type: String },
    gender: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
});

const Patient = model('patient', patientSchema);

module.exports = Patient;