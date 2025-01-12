import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const NavBar = () => {
  const navigate = useNavigate();
  const [adminMode, setAdminMode] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const isAdmin = Cookies.get('adminMode') === 'true';
    const employerId = Cookies.get('employerId');
    const studentId = Cookies.get('studentId');

    setAdminMode(isAdmin);
    setIsEmployer(!!employerId);
    setIsStudent(!!studentId);
  }, []);

  const handleAdminLogin = () => {
    document.getElementById('admin_modal').showModal();
  };

  const handleLogout = () => {
    Cookies.remove('adminMode');
    Cookies.remove('employerId');
    Cookies.remove('studentId');
    setAdminMode(false);
    setIsEmployer(false);
    setIsStudent(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AlphaJob</span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/help" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Info</a>
            </li>
            <li>
              <a href="/postings" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Postings</a>
            </li>
            {isStudent && (
              <li>
                <a href="/applications" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">My Applications</a>
              </li>
            )}
            {adminMode && (
              <>
                <li>
                  <a href="/backend" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Backend Panel (Update Postings)</a>
                </li>
                <li>
                  <a href="/create" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Create Posting</a>
                </li>
                <li>
                  <a href="/records" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Recorded Applications</a>
                </li>
              </>
            )}
            {!isEmployer && !isStudent && (
              <>
                <li>
                  <a href="/student-login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Student Login</a>
                </li>
                <li>
                  <a href="/employer-login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Employer Login</a>
                </li>
              </>
            )}
            {(isEmployer || isStudent || adminMode) && (
              <li>
                <button onClick={handleLogout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <dialog id="admin_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Admin Mode Settings</h3>
          <div className='mb-6 mt-2'>
            <input
              className='input input-bordered bg-white w-full mb-2'
              placeholder='Enter admin name...'
              type='text'
              id="adminName"
            />
            <input
              className='input input-bordered bg-white w-full mb-2'
              placeholder='Enter secret code...'
              type='password'
              id="secretCode"
            />
            <br></br>
            <button
              className='btn btn-primary w-full'
              onClick={() => {
                const adminName = document.getElementById('adminName').value;
                const secretCode = document.getElementById('secretCode').value;
                const admins = [
                  { name: 'Shourya Sinha', code: '1234' },
                  { name: 'Narain Singaram', code: '1234' },
                  { name: 'Mithran Prakash', code: '1234' },
                  { name: 'Alex Johnson', code: '1234' },
                  { name: 'Sarah Williams', code: '1234' },
                  { name: 'Michael Chen', code: '1234' },
                  { name: 'Emma Rodriguez', code: '1234' },
                  { name: 'James Wilson', code: '1234' },
                  { name: 'Olivia Garcia', code: '1234' },
                  { name: 'William Taylor', code: '1234' },
                  { name: 'Sophia Lee', code: '1234' },
                  { name: 'Lucas Brown', code: '1234' },
                  { name: 'Isabella Martinez', code: '1234' }
                ];
                const admin = admins.find(a => a.name === adminName && a.code === secretCode);
                if (admin) {
                  Cookies.set('adminMode', 'true', { expires: 7 });
                  setAdminMode(true);
                  document.getElementById('admin_modal').close();
                } else {
                  alert('Invalid admin credentials.');
                }
              }}
            >
              Activate Admin Mode
            </button>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleLogout}>Close & Deactivate Admin Mode</button>
            </form>
          </div>
        </div>
      </dialog>
    </nav>
  );
};

export default NavBar;
