import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import studentsData from '../students.json';
import employersData from '../employers.json';

const Login = ({ isEmployer }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [students, setStudents] = useState([]);
    const [employers, setEmployers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setStudents(studentsData);
        setEmployers(employersData);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (isEmployer) {
            const employer = employers.find(emp => emp.name === email && emp.password === password);
            if (employer) {
                Cookies.set('employerId', employer.id);
                Cookies.set('adminMode', 'true', { expires: 7 });
                navigate('/');
            } else {
                alert('Invalid employer credentials.');
            }
            return;
        }

        const student = students.find(s => s.name === email && s.password === password);
        if (student) {
            Cookies.set('studentId', student.id);
            navigate('/');
        } else {
            alert('Invalid student credentials.');
        }
    };

    return (
        <div className='p-4'>
            <h1 className='text-5xl mb-4 font-bold text-center'>{isEmployer ? 'Employer Login' : 'Student Login'}</h1>
            <form onSubmit={handleLogin}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                        {isEmployer ? 'Name' : 'Name'}
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='email'
                        name='email'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                        Password
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='password'
                        name='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='flex items-center justify-between'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
