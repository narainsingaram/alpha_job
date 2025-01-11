import React, { useState } from 'react';
import { db } from "../firebase";
import { collection, addDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CreatePosting = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salaryRange: '',
        location: ''
    });
    const navigate = useNavigate();
    const adminMode = Cookies.get('adminMode') === 'true';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!adminMode) {
            alert('You must be logged in as an admin to create a posting.');
            navigate('/');
            return;
        }
        try {
            await addDoc(collection(db, "postings"), {
                ...formData,
                employerId: Cookies.get('employerId')
            });
            alert('Job posting created successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error creating job posting:", error);
        }
    };

    if (!adminMode) {
        return <div>You must be logged in as an admin to create a posting.</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-5xl mb-4 font-bold text-center'>Create Job Posting</h1>
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='title'>
                        Job Title
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='title'
                        name='title'
                        type='text'
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='description'>
                        Job Description
                    </label>
                    <textarea
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='description'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='salaryRange'>
                        Salary Range
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='salaryRange'
                        name='salaryRange'
                        type='text'
                        value={formData.salaryRange}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='location'>
                        Location
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='location'
                        name='location'
                        type='text'
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='flex items-center justify-between'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                    >
                        Create Posting
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePosting;
