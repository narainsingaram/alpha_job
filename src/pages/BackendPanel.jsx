import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import withAdminAuth from '../utils/hoc/withAdminAuth.js';

const BackendPanel = () => {
    const [postings, setPostings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postingIds, setPostingIds] = useState([]); // This will hold the posting IDs
    const employerId = Cookies.get('employerId');

    useEffect(() => {
        if (!employerId) {
            setError('You must be logged in as an employer to view the backend panel.');
            return;
        }

        setLoading(true);
        const postingsQuery = query(collection(db, "postings"), where("employerId", "==", employerId));
        const applicationsQuery = query(collection(db, "applications"));

        const unsubPostings = onSnapshot(postingsQuery, (snapshot) => {
            let list = [];
            let postingIdsList = []; // Temporary array to store posting IDs
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
                postingIdsList.push(doc.id); // Collect the posting IDs
            });
            setPostings(list);
            setPostingIds(postingIdsList); // Set the posting IDs state
            setLoading(false);
        }, (error) => {
            console.error("Error fetching postings:", error);
            setError(error.message);
            setLoading(false);
        });

        const unsubApplications = onSnapshot(applicationsQuery, (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setApplications(list);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            setError(error.message);
            setLoading(false);
        });

        return () => {
            unsubPostings();
            unsubApplications();
        };
    }, [employerId]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this posting?")) {
            try {
                await deleteDoc(doc(db, "postings", id));
                setPostings(postings.filter((posting) => posting.id !== id));
                setPostingIds(postingIds.filter((postingId) => postingId !== id)); // Remove from postingIds
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await updateDoc(doc(db, "postings", id), updatedData);
            setPostings(postings.map(posting => posting.id === id ? { ...posting, ...updatedData } : posting));
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdateApplicationStatus = async (id, status) => {
        try {
            await updateDoc(doc(db, "applications", id), { status });
            setApplications(applications.map(application => application.id === id ? { ...application, status } : application));
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-5xl mb-4 font-bold text-center'>Backend Panel (Update Postings)</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8 rounded-2xl'>
                {postings.length > 0 ? (
                    postings.map((posting) => (
                        <div key={posting.id} className='p-4 border rounded-lg shadow-md'>
                            <h2 className='text-2xl font-semibold'>{posting.title}</h2>
                            <p>{posting.description}</p>
                            <p>Salary Range: {posting.salaryRange}</p>
                            <p>Location: {posting.location}</p>
                            <button
                                className='mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700'
                                onClick={() => handleDelete(posting.id)}
                            >
                                Delete
                            </button>
                            <button
                                className='mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                                onClick={() => handleUpdate(posting.id, { description: "Updated description" })}
                            >
                                Update
                            </button>
                        </div>
                    ))
                ) : (
                    <div className='p-4 border rounded-lg shadow-md'>
                        <h2 className='text-2xl font-semibold'>No postings found</h2>
                    </div>
                )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8 rounded-2xl'>
                {applications.length > 0 ? (
                    applications.filter(application => postingIds.includes(application.postingId)) // Filter applications based on postingId
                        .map((application) => (
                            <div key={application.postingId} className='p-4 border rounded-lg shadow-md'>
                                <p><strong>Student Name:</strong> {application.studentName || 'N/A'}</p>
                                <p><strong>Grade:</strong> {application.grade || 'N/A'}</p>
                                <p><strong>GPA:</strong> {application.gpa || 'N/A'}</p>
                                <p><strong>Resume:</strong> {application.resume || 'N/A'}</p>
                                <p><strong>Cover Letter:</strong> {application.coverLetter || 'N/A'}</p>
                                <p><strong>Posting Title:</strong> {application.postingDetail?.title || 'N/A'}</p>
                                <p><strong>Status:</strong> {application.status || 'Pending'}</p>
                                {application.status !== 'accepted' && (
                                    <button
                                        className='mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700'
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                                    >
                                        Accept
                                    </button>
                                )}
                                {application.status !== 'rejected' && (
                                    <button
                                        className='mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700'
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                )}
                                {application.status !== 'pending' && (
                                    <button
                                        className='mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700'
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'pending')}
                                    >
                                        Reset Status
                                    </button>
                                )}
                            </div>
                        ))
                ) : (
                    <div className='p-4 border rounded-lg shadow-md'>
                        <h2 className='text-2xl font-semibold'>No applications found</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAdminAuth(BackendPanel);
