import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react";
import { useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

const initForm = {
    email: "",
    password: ""
}

const registerInit = {
    name: "",
    dob: "",
    specialty: "",
    email: "",
    gender: "",
    password: "",
}

export const Login = () => {

    const { token, doctorId, handleTokenChange, handleDoctorIdChange, handleLoginChange } = useContext(AuthContext);
    const [form, setForm] = useState(initForm);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerForm, setRegisterForm] = useState(registerInit);

    const navigate = useNavigate();

    if (token && doctorId) {
        navigate('/');
    }

    const handleUserLogin = () => {
        let payload = {
            email: form.email,
            password: form.password
        }
        fetch('http://localhost:3001/doctors/authenticate', {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "email": form.email,
                "password": form.password
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'failed') {
                    return;
                }
                // handleTokenChange('dummy token');
                // handleDoctorIdChange(data._id);
                handleLoginChange('dummy token', data._id);
                navigate(-1)
            })
    }

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleRegisterFormChange = (e) => {
        setRegisterForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleAddDoctor = () => {

        console.log(registerForm)

        if (!registerForm.name || !registerForm.dob || !registerForm.specialty || !registerForm.email || !registerForm.gender || !registerForm.password) {
            alert('Provide All Details..');
            return;
        }

        fetch('http://localhost:3001/doctors/', {
            method: "POST",
            body: JSON.stringify(registerForm),
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'failed') {
                    alert('Duplicate/Invalid Details')
                    return;
                } else {
                    setShowRegisterModal(false);
                }
            })
    }



    return <Box maxWidth="500px" margin='130px auto' borderWidth="1px" borderRadius="lg" padding='50px'>

        <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Register Doctor</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input name="name" placeholder='Name' value={registerForm.name} onChange={handleRegisterFormChange} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>D.O.B</FormLabel>
                        <Input placeholder='DOB' type="date" value={registerForm.dob} name='dob' onChange={handleRegisterFormChange} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Gender</FormLabel>
                        <Select placeholder={"Select Gender"} value={registerForm.gender} name='gender' onChange={handleRegisterFormChange}>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Speciality</FormLabel>
                        <Input name="specialty" placeholder='Specialty' value={registerForm.specialty} onChange={handleRegisterFormChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" name="email" placeholder='Email' value={registerForm.email} onChange={handleRegisterFormChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" placeholder='Password' value={registerForm.password} type="password" onChange={handleRegisterFormChange} />
                    </FormControl>


                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleAddDoctor}>
                        Register
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <FormControl isRequired>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input
                id='email'
                name='email'
                type="email"
                value={form.email}
                onChange={handleFormChange}
                mb="50px"
            />

            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input
                id='password'
                name='password'
                type="password"
                value={form.password}
                onChange={handleFormChange}
            />

            <Button mt="50px" size="lg" onClick={handleUserLogin}>Login</Button>
        </FormControl>
        <br />
        <div>Register Here: </div>
        <Button size="sm" onClick={() => setShowRegisterModal(true)}>New Account</Button>


    </Box>

}