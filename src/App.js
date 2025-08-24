import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/ModernNavBar';
import Home from './pages/ModernPostings.jsx';
import CreatePosting from './pages/CreatePosting';
import Login from './components/ModernLogin';
import BackendPanel from './pages/ModernBackendPanel';
import StudentApplications from './pages/ModernStudentApplications';
import ResumeAnalysis from './pages/ModernResumeAnalysis';
import Help from './pages/Help.jsx';
import AI from './pages/AI.jsx';
import MockInterview from './pages/MockInterview.jsx';

const App = () => {
  const location = useLocation();
  const hideNavBarPaths = ['/help', '/employer-login', '/student-login'];

  return (
    <>
      {!hideNavBarPaths.includes(location.pathname) && <NavBar />}
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
        <Route path="/interview-prep" element={<MockInterview />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.4.1/flowbite.min.js"></script>