const express = require('express');
const router = express.Router();

const Patient = require('../models/patient.model');

router.get('/all', async (req, res) => {

    try {
        const patients = await Patient.find({}).lean().exec();

        res.status(200).send(patients);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }
});

router.get('/detail', async (req, res) => {

    const id = req.query.id;

    console.log(id)

    try {
        const patients = await Patient.findById(id, { password: 0 }).lean().exec();


        return res.status(200).send(patients);

    } catch (err) {
        return res.status(500).send({ status: 'failed', message: err.message });
    }
});

router.get('/records', async (req, res) => {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const doctorId = req.query.doctor_assigned;
    const gender = req.query.gender;
    const sort = req.query.sort;
    const name = req.query.name;

    const nameRegex = new RegExp(`.*${name}.*`);
    const offset = (page - 1) * limit;


    try {

        if (!doctorId || !doctorId.trim()) {
            return res.status(400).send({ status: 'failed', message: 'Doctor id not provided' });
        }

        let patients;
        let totalPages;

        if (gender && name) {
            totalPages = Math.ceil(await Patient.find({ doctor_assigned: doctorId, gender: gender, name: { $regex: nameRegex, $options: "i" } }).countDocuments() / limit);
        } else if (gender) {
            totalPages = Math.ceil(await Patient.find({ doctor_assigned: doctorId, gender: gender }).countDocuments() / limit);
        } else if (name) {
            totalPages = Math.ceil(await Patient.find({ doctor_assigned: doctorId, name: { $regex: nameRegex, $options: "i" } }).countDocuments() / limit);
        } else {
            totalPages = Math.ceil(await Patient.find({ doctor_assigned: doctorId }).countDocuments() / limit);
        }

        if (gender && sort && name) {

            patients = await Patient.find({ doctor_assigned: doctorId, gender: gender, name: { $regex: nameRegex, $options: "i" } }).skip(offset).limit(limit).sort({ [sort]: 1 }).lean().exec();

        } else if (gender && name) {

            patients = await Patient.find({ doctor_assigned: doctorId, gender: gender, name: { $regex: nameRegex, $options: "i" } }).skip(offset).limit(limit).lean().exec();

        } else if (sort && name) {
            patients = await Patient.find({ doctor_assigned: doctorId, name: { $regex: nameRegex, $options: "i" } }).skip(offset).limit(limit).sort({ [sort]: 1 }).lean().exec();
        } else if (gender && sort) {
            patients = await Patient.find({ doctor_assigned: doctorId, gender: gender }).skip(offset).limit(limit).sort({ [sort]: 1 }).lean().exec();
        } else if (name) {
            patients = await Patient.find({ doctor_assigned: doctorId, name: { $regex: nameRegex, $options: "i" } }).skip(offset).limit(limit).lean().exec();
        } else if (gender) {
            patients = await Patient.find({ doctor_assigned: doctorId, gender: gender }).skip(offset).limit(limit).lean().exec();
        } else if (sort) {
            patients = await Patient.find({ doctor_assigned: doctorId }).skip(offset).limit(limit).sort({ [sort]: 1 }).lean().exec();
        } else {
            patients = await Patient.find({ doctor_assigned: doctorId }).skip(offset).limit(limit).lean().exec();
        }


        res.status(200).send({ patients, totalPages });

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {

        if (!req.body.name.trim() || !req.body.dob.trim() || !req.body.gender.trim() || !req.body.doctor_assigned) {
            return res.status(400).send({ status: 'failed', message: 'Required details not provided' });
        }

        const patient = await Patient.create(req.body);

        res.status(201).send(patient);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }
});

router.patch('/', async (req, res) => {
    try {

        console.log('request', req.body)

        if (!req.body.name || !req.body.dob || !req.body.gender
        ) {
            return res.status(400).send({ status: 'failed', message: 'Required details not provided' });
        }

        console.log('here')

        const patient = await Patient.findByIdAndUpdate(req.body._id, req.body).lean().exec();

        console.log(patient)

        res.status(201).send(patient);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }
});


module.exports = router;