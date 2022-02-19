import { Avatar, Button, IconButton, Input, InputGroup, InputRightAddon, InputRightElement, Select, Table, TableCaption, Tbody, Td, Th, Thead, Tr, Modal, ModalOverlay } from "@chakra-ui/react";
import dobToAge from "dob-to-age";
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { PaginateBox } from "./PaginateBox";
import './home.css';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { AddPatient } from './AddPatient';


export const Home = () => {

    const [patientsData, setPatientsData] = useState([]);
    const [totalPages, setTotalPages] = useState(10);
    const [patientSearchInput, setPatientSearchInput] = useState('');
    const [firstRender, setFirstRender] = useState(true);
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);

    const search = useLocation().search;
    const page = Number(new URLSearchParams(search).get('page')) || 1;
    const limit = Number(new URLSearchParams(search).get('limit')) || 10;
    const gender = new URLSearchParams(search).get('gender');
    const sort = new URLSearchParams(search).get('sort');
    const name = new URLSearchParams(search).get('name');

    const { token, doctorId } = useContext(AuthContext);


    const navigate = useNavigate();

    const getQuery = (indexedPage = page) => {
        let query = `?page=${indexedPage}&limit=${limit}${gender ? `&gender=${gender}` : ''}${sort ? `&sort=${sort}` : ''}${name ? `&name=${name}` : ''}`;

        return query;
    }

    const getPatientData = () => {

        let fetchUrl = `http://localhost:3001/patients/records?page=${page}&limit=${limit}&doctor_assigned=${doctorId}${gender ? `&gender=${gender}` : ''}${sort ? `&sort=${sort}` : ''}${name ? `&name=${name}` : ''}`



        fetch(`${fetchUrl}`)
            .then(res => res.json())
            .then(data => {
                setPatientsData(data.patients);
                setTotalPages(data.totalPages);
            })
            .catch(err => console.log(err.message));
    }


    const handleFilterChange = (e) => {
        let navigateUrl = `/?page=${1}&limit=${limit}&gender=${e.target.value}${sort ? `&sort=${sort}` : ''}${name ? `&name=${name}` : ''}`;

        navigate(navigateUrl);
    }

    const handleSortChange = (e) => {
        let navigateUrl = `/?page=${1}&limit=${limit}${gender ? `&gender=${gender}` : ''}&sort=${e.target.value}${name ? `&name=${name}` : ''}`;

        navigate(navigateUrl);
    }

    const handlePatientSearch = () => {
        // setPatientSearchInput(e.target.value);
        let patientName = patientSearchInput;

        if (patientName.length > 0 && patientName.length < 3) {
            return;
        }

        let searchDebounceTimer;
        searchDebounceTimer = setTimeout(function () {
            clearTimeout(searchDebounceTimer);
            navigate(`?name=${patientName}&sort=&gender=`)
        }, 300);

    }

    useEffect(() => {
        if (doctorId) {
            getPatientData();
        }
    }, [page, gender, sort, name, doctorId]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false)
        } else {
            handlePatientSearch();
        }
    }, [patientSearchInput]);

    const closeAddPatientModal = () => {
        setShowAddPatientModal(false);
    }


    return !doctorId ? <h1>Loading...</h1> : <div className="home-container">

        <Modal isOpen={showAddPatientModal} onClose={closeAddPatientModal}>
            <ModalOverlay />
            <AddPatient />
        </Modal>

        <div className="filter-sort-container">

            <span>Filter: </span>
            <Select placeholder={gender ? gender : "No Filtering"} width="30%" maxWidth="400px" onChange={handleFilterChange}>
                <option value=''>No Filtering</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Others</option>
            </Select>


            <span>Sort: </span>
            <Select placeholder={sort ? sort : "No Sorting"} width="30%" maxWidth="400px" onChange={handleSortChange}>
                <option value=''>No sorting</option>
                <option value='dob'>Age</option>
                <option value='name'>Name</option>
            </Select>

            <span>Search: </span>
            <InputGroup width="40%" maxWidth="400px" >
                <Input placeholder="Enter patient's name (Min 3 letters)" value={patientSearchInput} onChange={(e) => setPatientSearchInput(e.target.value)} />
                {
                    patientSearchInput && <InputRightElement>
                        <SmallCloseIcon cursor="pointer" onClick={() => setPatientSearchInput('')} />
                    </InputRightElement>

                }

            </InputGroup>

            <span> <Button onClick={() => setShowAddPatientModal(true)}>Add New Patient</Button> </span>

        </div>

        <Table variant='simple'>
            <TableCaption placement="top" >Patients Data</TableCaption>

            <Thead>
                <Tr>
                    <Th>Photo</Th>
                    <Th>Name</Th>
                    <Th>Age</Th>
                    <Th>Gender</Th>
                    <Th>Medicines</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    patientsData.length === 0 ? <Tr><Td>No Data Found</Td></Tr> :
                        patientsData.map(patient => <Tr key={patient._id} className="patient-table-row" onClick={() => navigate(`/patient_details?id=${patient._id}`)}>
                            <Td><Avatar src={''} name={patient.name} /></Td>
                            <Td>{patient.name}</Td>
                            <Td>{dobToAge(patient.dob)}</Td>
                            <Td>{patient.gender}</Td>
                            <Td>{patient.medicines.reduce(
                                (acc, medicine) => acc + Number(medicine.quantity), 0)
                            }</Td>
                        </Tr>)
                }
            </Tbody>

        </Table>

        <div className="pagination-container">

            {+page !== 1 && <PaginateBox text='prev' link={getQuery(page - 1)} />}

            {
                [...Array(totalPages)].map((e, i) => <PaginateBox key={i} text={i + 1} link={getQuery(i + 1)} />)
            }

            {+page !== +totalPages && <PaginateBox text='next' link={getQuery(page + 1)} />}


        </div>
    </div>

}