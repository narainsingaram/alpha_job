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
    const [rememberMe, setRememberMe] = useState(false);
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
                if (rememberMe) {
                    Cookies.set('rememberMe', 'true', { expires: 7 });
                }
                navigate('/');
            } else {
                alert('Invalid employer credentials.');
            }
            return;
        }

        const student = students.find(s => s.name === email && s.password === password);
        if (student) {
            Cookies.set('studentId', student.id);
            if (rememberMe) {
                Cookies.set('rememberMe', 'true', { expires: 7 });
            }
            navigate('/');
        } else {
            alert('Invalid student credentials.');
        }
    };

    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                    <div className="hidden lg:relative lg:block lg:p-12">
                        <a className="block text-white" href="/">
                            <span className="sr-only">Home</span>
                            <svg
                                className="h-8 sm:h-10"
                                viewBox="0 0 28 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3847 21.8155 11.163 20.3431 12.5555C18.8707 13.948 18 15.8495 18 17.8462V24H9.39V17.8462C9.39 15.8495 8.51929 13.948 7.04687 12.5555C5.57445 11.163 3.63424 10.3847 1.61 10.3847H0.41ZM13.695 22.7692C14.9508 22.7692 16.1554 22.2923 17.0444 21.4355C17.9335 20.5786 18.439 19.416 18.439 18.1923C18.439 16.9686 17.9335 15.806 17.0444 14.9492C16.1554 14.0923 14.9508 13.6154 13.695 13.6154C12.4392 13.6154 11.2346 14.0923 10.3456 14.9492C9.45652 15.806 8.95105 16.9686 8.95105 18.1923C8.95105 19.416 9.45652 20.5786 10.3456 21.4355C11.2346 22.2923 12.4392 22.7692 13.695 22.7692Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Welcome Back!
                        </h2>
                        <p className="mt-4 leading-relaxed text-white/90">
                            AlphaJob is your gateway to exciting career opportunities. Get ready to explore and connect with top employers!
                        </p>
                    </div>
                </section>
                <main
                    aria-label="Main"
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 xl:col-span-6"
                >
                    <div className="max-w-2xl lg:max-w-4xl w-full">
                        <div className="relative -mt-16 block lg:hidden">
                            <a
                                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl sm:h-20 sm:w-20"
                                href="/"
                            >
                                <span className="sr-only">Home</span>
                                <svg
                                    className="h-8 sm:h-10"
                                    viewBox="0 0 28 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3847 21.8155 11.163 20.3431 12.5555C18.8707 13.948 18 15.8495 18 17.8462V24H9.39V17.8462C9.39 15.8495 8.51929 13.948 7.04687 12.5555C5.57445 11.163 3.63424 10.3847 1.61 10.3847H0.41ZM13.695 22.7692C14.9508 22.7692 16.1554 22.2923 17.0444 21.4355C17.9335 20.5786 18.439 19.416 18.439 18.1923C18.439 16.9686 17.9335 15.806 17.0444 14.9492C16.1554 14.0923 14.9508 13.6154 13.695 13.6154C12.4392 13.6154 11.2346 14.0923 10.3456 14.9492C9.45652 15.806 8.95105 16.9686 8.95105 18.1923C8.95105 19.416 9.45652 20.5786 10.3456 21.4355C11.2346 22.2923 12.4392 22.7692 13.695 22.7692Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </a>
                        </div>
                        <div className="bg-white p-12 rounded-lg shadow-lg">
                            <h1 className="text-3xl font-bold text-blue-600 sm:text-4xl md:text-5xl text-center">
                                {isEmployer ? 'Employer Login' : 'Student Login'}
                            </h1>
                            <form onSubmit={handleLogin} className="mt-8 grid grid-cols-6 gap-6">
                                <div className="col-span-6">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="email"
                                    >
                                        {isEmployer ? 'Name' : 'Name'}
                                    </label>
                                    <input
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-6 flex items-center">
                                    <input
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                        Remember Me
                                    </label>
                                </div>
                                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                    <button
                                        className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                        type="submit"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                            <p className="mt-4 text-center text-sm text-gray-500">
                                Contact your school facilitator for Login information.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default Login;