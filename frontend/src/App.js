import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { PrivateRoute } from './components/PrivateRoute';
import { PatientDetails } from './components/PatientDetails';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path='/patient_details' element={<PrivateRoute> <PatientDetails /> </PrivateRoute>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
