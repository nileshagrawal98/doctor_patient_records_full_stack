import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

const initForm = {
    email: "",
    password: ""
}

export const Login = () => {

    const { token, doctorId, handleTokenChange, handleDoctorIdChange, handleLoginChange } = useContext(AuthContext);
    const [form, setForm] = useState(initForm);


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



    return <Box maxWidth="500px" margin='130px auto' borderWidth="1px" borderRadius="lg" padding='50px'>
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
    </Box>

}