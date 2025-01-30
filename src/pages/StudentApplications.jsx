import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import InterviewPrepModal from './AI'; // Import the modal component

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        gpa: '',
        resume: null,
        coverLetter: null
    });
    const [showForm, setShowForm] = useState(null); // Added
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null); // Added
    const [searchQuery, setSearchQuery] = useState(''); // Added
    const studentId = Cookies.get('studentId');

    useEffect(() => {
        if (!studentId) {
            setError('You must be logged in as a student to view your applications.');
            return;
        }

        setLoading(true);
        const q = query(collection(db, "applications"), where("studentId", "==", studentId));
        const unsub = onSnapshot(q, async (snapshot) => {
            let list = [];
            const postingIds = [];

            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
                postingIds.push(doc.data().postingId);
            });

            // Fetch posting details
            const postingDetails = await Promise.all(
                postingIds.map(async (postingId) => {
                    const postingDoc = await getDoc(doc(db, "postings", postingId));
                    if (postingDoc.exists) {
                        return { id: postingId, ...postingDoc.data() };
                    } else {
                        return null;
                    }
                })
            );

            // Merge posting details with applications
            list.forEach(application => {
                const postingDetail = postingDetails.find(posting => posting.id === application.postingId);
                if (postingDetail) {
                    application.postingDetail = postingDetail;
                }
            });

            setApplications(list);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            setError(error.message);
            setLoading(false);
        });

        return () => {
            unsub();
        };
    }, [studentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const studentId = Cookies.get('studentId');
        if (!studentId) {
            alert('You must be logged in as a student to apply for a job.');
            return;
        }
        try {
            await addDoc(collection(db, "applications"), {
                postingId: showForm,
                studentId,
                studentName: formData.name,
                grade: formData.grade,
                gpa: formData.gpa,
                resume: formData.resume.name,
                coverLetter: formData.coverLetter.name,
                status: 'pending' // Set initial status to pending
            });
            alert('Application submitted successfully!');
            setShowForm(null);
            setFormData({
                name: '',
                grade: '',
                gpa: '',
                resume: null,
                coverLetter: null
            });
        } catch (error) {
            console.error("Error submitting application:", error);
            alert('Failed to submit application.');
        }
    };

    const filteredApplications = applications.filter(application =>
        application.postingDetail && (
            (application.postingDetail.title && application.postingDetail.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (application.postingDetail.description && application.postingDetail.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (application.postingDetail.location && application.postingDetail.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (application.studentName && application.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-5xl mb-4 font-bold text-center'>My Applications</h1>
            <form className="flex items-center max-w-lg mx-auto mb-4">
                <label htmlFor="voice-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="voice-search"
                        className="bg-gray-50 mr-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    Search
                </button>
            </form>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8 rounded-2xl'>
                {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                        <div key={application.id} className={`p-4 rounded-2xl shadow-lg ${application.status === 'accepted' ? 'bg-emerald-50' : application.status === 'rejected' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                            {application.postingDetail && (
                                <>
                                    <h2 className={`text-2xl font-semibold ${application.status === 'accepted' ? 'text-green-500' : application.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {application.postingDetail.title}
                                    </h2>
                                    {application.status === 'accepted' && <p className="bg-green-200 text-green-800 text-lg font-bold px-3 py-2 rounded-xl">Congratulations! You have been accepted to {application.postingDetail.title}.</p>}
                                    {application.status === 'rejected' && <p className="bg-red-200 text-rose-800 text-lg font-bold px-3 py-2 rounded-xl">We are sorry to inform you that your application to {application.postingDetail.title} has been rejected.</p>}
                                    <heading className="font-extrabold text-center text-xl bg-blue-300 px-3 py-1 rounded-3xl">Your Information</heading>
                                    <br></br>
                                    <br></br>
                                    <p><strong>Student Name:</strong> {application.studentName}</p>
                                    <p><strong>Grade:</strong> {application.grade}</p>
                                    <p><strong>GPA:</strong> {application.gpa}</p>
                                    <p><strong>Resume:</strong> <a href={application.resume} target="_blank">Preview</a></p>
                                    <p><strong>Cover Letter:</strong> <a href={application.coverLetter} target="_blank">Preview</a></p>
                                    <br></br>
                                    <heading className="font-extrabold text-center text-xl bg-blue-300 px-3 py-1 rounded-3xl">Job Information</heading>
                                    <br></br>
                                    <br></br>
                                    <p><strong>Salary Range:</strong> {application.postingDetail.salaryRange}</p>
                                    <p><strong>Location:</strong> {application.postingDetail.location}</p>
                                    <p><strong>Description:</strong> {application.postingDetail.description}</p>
                                    <p><strong>Status:</strong> {application.status === 'pending' ? 'Pending' : application.status === 'accepted' ? 'Accepted' : application.status === 'rejected' ? 'Rejected' : 'N/A'}</p>
                                    {application.status === 'pending' && (
                                        <button
                                            onClick={() => setSelectedApplication(application)}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                                        >
                                            Prepare for Interview
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className='p-4 border rounded-lg shadow-md'>
                        <h2 className='text-2xl font-semibold'>No applications found</h2>
                    </div>
                )}
            </div>
            {selectedApplication && (
                <InterviewPrepModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    );
};

export default StudentApplications;
