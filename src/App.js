import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Postings.jsx';
import CreatePosting from './pages/CreatePosting';
import Login from './components/Login';
import BackendPanel from './pages/BackendPanel';
import StudentApplications from './pages/StudentApplications';
import ResumeAnalysis from './pages/ResumeAnalysis';
import Help from './pages/Help.jsx';
import AI from './pages/AI.jsx';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/postings" element={<Home />} />
        <Route path="/create" element={<CreatePosting />} />
        <Route path="/employer-login" element={<Login isEmployer={true} />} />
        <Route path="/student-login" element={<Login isEmployer={false} />} />
        <Route path="/backend" element={<BackendPanel />} />
        <Route path="/applications" element={<StudentApplications />} />
        <Route path="/ai_analysis" element={<ResumeAnalysis />} />
        <Route path="/AI" element={<AI />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
};

export default App;

<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.4.1/flowbite.min.js"></script>
  