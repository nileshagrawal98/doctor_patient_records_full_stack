import { useContext, useState } from "react"
import {
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,

} from '@chakra-ui/react'
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
let initData = {
    name: '',
    dob: '',
    illness: '',
    medicines: [],
    doctor_assigned: '',
    gender: '',
    photo: '',
}

export const AddPatient = () => {

    const [form, setForm] = useState(initData);
    const { doctorId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }



    const handleAddPatient = () => {

        if (!form.name || !form.dob || !form.gender || !doctorId) {
            alert('Invalid Opertion (Fill all required fields)')
            return;
        }

        let payload = {
            name: form.name,
            dob: form.dob,
            illness: '',
            medicines: [],
            doctor_assigned: doctorId,
            gender: form.gender,
            photo: ''
        }

        fetch(`http://localhost:3001/patients`, {
            method: 'POST',
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
                    navigate(`/patient_details?id=${data._id}`)
                }
            }).catch(err => { console.log(err.message) });
    }

    return <ModalContent>
        <ModalHeader>Add Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name="name" placeholder='Name' onChange={handleFormChange} />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>D.O.B</FormLabel>
                <Input placeholder='DOB' type="date" name='dob' onChange={handleFormChange} />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>Gender</FormLabel>
                <Select placeholder={"Select Gender"} name='gender' onChange={handleFormChange}>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                </Select>
            </FormControl>
        </ModalBody>

        <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleAddPatient}>
                Save
            </Button>
        </ModalFooter>
    </ModalContent>

}