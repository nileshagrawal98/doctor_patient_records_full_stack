const express = require('express');
const app = express();
const connect = require('./config/db');
require('dotenv').config();
const cors = require('cors');

app.use(express.json());

app.use(cors());
const corsOptions = {
    origin: "*"
};

const doctorController = require('./controllers/doctor.controller');
const patientController = require('./controllers/patient.controller');


app.use('/doctors', doctorController);
app.use('/patients', patientController);


const port = process.env.PORT || 3001;

const start = () => {
    app.listen(port, async (req, res) => {
        await connect();

        console.log(`Listening on port ${port}`);
    })
}

module.exports = start;