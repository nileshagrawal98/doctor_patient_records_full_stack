import { Avatar, Button, Divider, Heading, IconButton, Image, ListItem, Modal, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, UnorderedList } from "@chakra-ui/react";
import dobToAge from "dob-to-age";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './patientDetails.css'
import {
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
} from '@chakra-ui/react'
import { AuthContext } from "../context/AuthContext";
import { DeleteIcon } from "@chakra-ui/icons";

export const PatientDetails = () => {

    const search = useLocation().search;
    const patientId = new URLSearchParams(search).get('id') || '';

    const [patientData, setPatientData] = useState();
    const [form, setForm] = useState({});
    const [medicinesData, setMedicinesData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMedicineModal, setShowMedicineModal] = useState(false);

    const [forceRender, setForceRender] = useState(0);

    const { doctorId } = useContext(AuthContext);
    const navigate = useNavigate();



    const getPatientDetails = () => {
        fetch(`http://localhost:3001/patients/detail?id=${patientId}`)
            .then(res => res.json())
            .then((data) => {
                setPatientData(data)
                setForm(data)
                setMedicinesData(data.medicines)
            })
            .catch(err => console.log(err.message));
    }

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleMedicineNameChange = (e) => {
        console.log(e.target.value)
        let temp = medicinesData;
        temp[+e.target.name].name = e.target.value;
        console.log(temp, medicinesData[+e.target.name].name)
        setMedicinesData([...temp]);
        setForceRender(prev => prev + 1);
    }

    const handleMedicineQuantityChange = (e) => {
        console.log(e)
        let temp = medicinesData;
        temp[+e.target.name].quantity = +e.target.value;
        console.log(temp, medicinesData[+e.target.name].quantity)
        setMedicinesData([...temp]);
        setForceRender(prev => prev + 1);
    }

    const handleMedicineEdit = () => {
        console.log('medData', medicinesData)

        let payload = {
            _id: form._id,
            medicines: medicinesData,
            name: form.name,
            dob: form.dob,
            gender: form.gender,
        }

        fetch(`http://localhost:3001/patients`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'failed') {
                    console.log('failed');
                    return;
                } else {
                    getPatientDetails();
                    setShowMedicineModal(false);
                }
            }).catch(err => { console.log(err.message) });

    }


    const handleEditPatient = () => {

        if (!form.name || !form.dob || !form.gender || !doctorId) {
            alert('Invalid Opertion (Fill all required fields)')
            return;
        }

        let payload = {
            _id: form._id,
            name: form.name,
            dob: form.dob,
            illness: form.illness,
            gender: form.gender,
        }

        fetch(`http://localhost:3001/patients`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'failed') {
                    console.log('failed');
                    return;
                } else {
                    getPatientDetails();
                    setShowEditModal(false)
                }
            }).catch(err => { console.log(err.message) });
    }

    const handleAddMedicine = () => {
        let temp = medicinesData;
        setMedicinesData([...temp, {}]);
        setForceRender(prev => prev + 1);
    }

    const handleRemoveMedicine = (id) => {
        let temp = medicinesData;
        temp = temp.filter(medicine => medicine._id !== id);
        setMedicinesData([...temp]);
        setForceRender(prev => prev + 1);
    }




    useEffect(() => {
        getPatientDetails();
    }, []);

    return !patientData ? <h1>Invalid Patient Id</h1> : <div className="patient-details-container">

        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Patient</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input name="name" placeholder='Name' value={form.name} onChange={handleFormChange} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>D.O.B</FormLabel>
                        <Input placeholder='DOB' type="date" value={form.dob} name='dob' onChange={handleFormChange} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Gender</FormLabel>
                        <Select placeholder={"Select Gender"} value={form.gender} name='gender' onChange={handleFormChange}>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleEditPatient}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Modal isOpen={showMedicineModal} onClose={() => setShowMedicineModal(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Medicines</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    {
                        medicinesData.length !== 0 && medicinesData.map((medicine, i) => <FormControl key={i} display='flex' mb="4px">
                            <Input name={i} placeholder='Name' value={medicine.name} onChange={handleMedicineNameChange} mr="4px" />
                            <Input type="number" name={i} placeholder='Quantity' value={medicine.quantity} onChange={handleMedicineQuantityChange} mr="4px" />
                            <IconButton onClick={() => handleRemoveMedicine(medicine._id)}
                                colorScheme='red'
                                aria-label='Remove'
                                size='md'
                                icon={<DeleteIcon />}
                            />
                        </FormControl>)
                    }


                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleAddMedicine}>
                        Add Medicine
                    </Button>
                    <Button colorScheme='blue' mr={3} onClick={handleMedicineEdit}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <div className="patient-basic-details-container">
            <Avatar
                borderRadius='full'
                boxSize='150px'
                src={patientData.photo}
                alt={patientData.name}
            />
            <Heading as='h1' >{patientData.name}</Heading>
            <Heading size='sm'>Gender: {patientData.gender}</Heading>
            <Heading size='sm'>Age: {dobToAge(patientData.dob)}</Heading>
            <Button onClick={() => setShowEditModal(true)}>Edit Details</Button>
        </div>


        <Divider mb="50px" />

        <div className="patient-medicines-container">
            <div>

                <Heading size='md' mt='100px' mr="50px" display='inline'>Medicines Prescribed</Heading>
                <Button onClick={() => setShowMedicineModal(true)}>Change Medicines</Button>
            </div>

            <UnorderedList className='medicine-list'>
                {patientData.medicines && patientData.medicines.map((medicine) => <ListItem key={medicine._id}>{medicine.name} - {medicine.quantity}</ListItem>)}
            </UnorderedList>
        </div>

    </div>

}