import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState();
    const [doctorId, setDoctorId] = useState();

    let localToken = (localStorage.getItem('token'));
    let localDoctorId = (localStorage.getItem('doctorId'));

    if (localToken && localDoctorId && !token && !doctorId) {
        setToken(localToken);
        setDoctorId(localDoctorId);
    }

    const handleTokenChange = (value) => {
        setToken(value);
        localStorage.setItem('token', value);
    }

    const handleDoctorIdChange = (value) => {
        setDoctorId(value);
        localStorage.setItem('doctorId', value);
    }

    const handleLoginChange = (token, id) => {
        setDoctorId(id);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('doctorId', id);
    }

    return <AuthContext.Provider value={{ token, doctorId, handleTokenChange, handleLoginChange, handleDoctorIdChange }}>{children}</AuthContext.Provider>

}