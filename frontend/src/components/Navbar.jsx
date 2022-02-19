import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './navbar.css'

export const Navbar = () => {

    const { token, doctorId, handleTokenChange, handleDoctorIdChange, handleLoginChange } = useContext(AuthContext);
    const [doctorName, setDoctorName] = useState('Kelcie Gerlack');
    const [doctorImage, setDoctorImage] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJUSURBVDjLpVPfa1JRHP/Ma15JRQ3dsEAfBkoOIXqoJ3uqaOwhAgObQXuwnvw/Yhuh+LCnyNfe9jisEYI1RuFQGxv5stCciTKHzTnn7r19v8ccq1wvHTgc7j3fz6/vOWdM0zT8z9D/+WNjYyN1cnLyuN/v62kFrWIeHx/z+joUCj0aSVAoFKwEeGmz2UKyfBE9AkFVIfyRS7vdhnR6JUxffxPk8/l7DHY4HFdMJhN2vlbB6qqqQdVUItKgEFmv1xsdgYpX3G63+NHtHqFP4M+FHBGop/PO3WkRYyQBZzQYDGi32wNlRYF/6ppQ136pc7PPdcDMCoG4iA+FrRfyn2hVhDrvuWbu/9vBoFeaKGaCqcB1oT50oZ3TA93QwZBAkLCyMsjesOzg1X4C6pm6kRGG4MPDLkpftvCjvY/xcSe2y1tomto4dHeEu1QqpdVqtVa1Wn2+ubm5JAjYGoO5gaurbyHLBszNPUGn08Hkt0lcWnNiff09IpEI7ckgAnsul1sol8vOUwd8CnSZ0Grt4eHsLBYWX5CTbbhcLgQCAQYhHo9jd3dXsVgsb2Kx2DQRPBs6+JjNZm8Ui0WYzWaRLXjrNoqFPMLhMN1COw4ODtBoNJBMJrt6vT5EJR2r1SoLgmg0ejORSMxUKpUlIhA3au3DO24r5ufnwbeTB0fS6XSyJEnL/E19OBo7+xr9fv9Vr9ebDgaDl2lIRqMR9XodpVJJZPd4PJiYmOBe7ZGYLpPJfP+NwOfzSZQ5QIrLROAkkMRH3Ww2n7IgvRVWvkCRFepFgxw9+AkiS4SDy9ee+AAAAABJRU5ErkJggg==");

    const handleLogout = () => {
        handleLoginChange('', '')
    }

    const fetchDoctorDetails = () => {
        fetch(`http://localhost:3001/doctors/details/${doctorId}`)
            .then(res => res.json())
            .then(data => {
                setDoctorName(data.name);
                setDoctorImage(data.photo);
            })
            .catch(err => console.log(err.message));
    }

    useEffect(() => {
        console.log(doctorId)
        if (doctorId) {
            fetchDoctorDetails();
        }
    }, [doctorId])

    return <div className="navbar-container">
        <Link to='/'>Home</Link>
        {
            token ? <Menu>
                <MenuButton >
                    <Avatar src={doctorImage} name={doctorName} size='sm' mr='10px' />
                    {doctorName}
                </MenuButton>
                <MenuList color='#000' fontSize='14px'>
                    <MenuItem onClick={handleLogout} >Logout</MenuItem>
                </MenuList>
            </Menu> : <Link to='/login'>Login</Link>
        }

    </div>
}