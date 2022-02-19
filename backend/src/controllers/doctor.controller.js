const express = require('express');
const Doctor = require('../models/doctor.model');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const doctors = await Doctor.find({}).lean().exec();

        res.status(200).send(doctors);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }

});

router.get('/details/:id', async (req, res) => {

    try {
        const doctor = await Doctor.findById(req.params.id).lean().exec();

        res.status(200).send(doctor);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }

});

router.get('/authenticate', async (req, res) => {

    try {

        const doctor = await Doctor.findOne({ email: req.headers.email, password: req.headers.password }, { password: 0 }).lean().exec();

        if (!doctor) {
            return res.status(401).send({ status: 'failed', message: 'Invalid Login Credentials' })
        }

        res.status(200).send(doctor);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }

});


router.post('/', async (req, res) => {

    try {
        if (!req.body.name.trim() || !req.body.dob.trim() || !req.body.specialty.trim() || !req.body.email.trim() || !req.body.gender.trim() || !req.body.password) {
            return res.status(400).send({ status: 'failed', message: 'Required details not provided' });
        }

        let doctor = await Doctor.find({ email: req.body.email }).lean().exec();

        console.log(doctor)


        if (doctor.length !== 0) {
            return res.status(400).send({ status: 'failed', message: 'Email already exists' });
        }

        doctor = await Doctor.create(req.body);

        res.status(201).send(doctor);

    } catch (err) {
        res.status(500).send({ status: 'failed', message: err.message });
    }

})


module.exports = router;