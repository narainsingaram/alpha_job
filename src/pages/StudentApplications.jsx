import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, getDoc, doc, addDoc } from 'firebase/firestore';
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
    const [showForm, setShowForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
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
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md max-w-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-red-800">Error</h3>
                            <p className="text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    My Applications
                </span>
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 text-gray-700 bg-white border-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Search applications by title, company, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            {/* Applications Grid */}
            {filteredApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-200 rounded-2xl p-4">
                    {filteredApplications.map((application) => {
                        // Determine status-based styling
                        const statusColors = {
                            accepted: {
                                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                                border: "border-emerald-200 dark:border-emerald-800",
                                text: "text-emerald-700 dark:text-emerald-400",
                                badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200",
                                button: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                            },
                            rejected: {
                                bg: "bg-rose-50 dark:bg-rose-900/20",
                                border: "border-rose-200 dark:border-rose-800",
                                text: "text-rose-700 dark:text-rose-400",
                                badge: "bg-rose-100 text-rose-800 dark:bg-rose-800 dark:text-rose-200",
                                button: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                            },
                            pending: {
                                bg: "bg-amber-50 dark:bg-amber-900/20",
                                border: "border-amber-200 dark:border-amber-800",
                                text: "text-amber-700 dark:text-amber-400",
                                badge: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200",
                                button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                            }
                        };
                        
                        const statusStyle = statusColors[application.status] || statusColors.pending;
                        
                        return (
                            <div 
                                key={application.id} 
                                className={`group relative overflow-hidden rounded-2xl border ${statusStyle.border} ${statusStyle.bg} transition-all duration-300 hover:shadow-xl`}
                            >
                                {application.postingDetail && (
                                    <>
                                        {/* Company Logo/Banner */}
                                        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-black opacity-10"></div>
                                            <svg className="w-20 h-20 text-white/90" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="56" height="56" rx="10" fill="white"/>
                                                <path d="M20.2819 26.7478C20.1304 26.5495 19.9068 26.4194 19.6599 26.386C19.4131 26.3527 19.1631 26.4188 18.9647 26.5698C18.848 26.6622 18.7538 26.78 18.6894 26.9144L10.6019 43.1439C10.4874 43.3739 10.4686 43.6401 10.5496 43.884C10.6307 44.1279 10.805 44.3295 11.0342 44.4446C11.1681 44.5126 11.3163 44.5478 11.4664 44.5473H22.7343C22.9148 44.5519 23.0927 44.5037 23.2462 44.4084C23.3998 44.3132 23.5223 44.1751 23.5988 44.011C26.0307 38.9724 24.5566 31.3118 20.2819 26.7478Z" fill="url(#paint0_linear_2204_541)"/>
                                                <path d="M28.2171 11.9791C26.201 15.0912 25.026 18.6755 24.8074 22.3805C24.5889 26.0854 25.3342 29.7837 26.9704 33.1126L32.403 44.0113C32.4833 44.1724 32.6067 44.3079 32.7593 44.4026C32.912 44.4973 33.088 44.5475 33.2675 44.5476H44.5331C44.6602 44.5479 44.7861 44.523 44.9035 44.4743C45.0209 44.4257 45.1276 44.3543 45.2175 44.2642C45.3073 44.1741 45.3785 44.067 45.427 43.9492C45.4755 43.8314 45.5003 43.7052 45.5 43.5777C45.5001 43.4274 45.4659 43.2791 45.3999 43.1441L29.8619 11.9746C29.7881 11.8184 29.6717 11.6864 29.5261 11.594C29.3805 11.5016 29.2118 11.4525 29.0395 11.4525C28.8672 11.4525 28.6984 11.5016 28.5529 11.594C28.4073 11.6864 28.2908 11.8184 28.2171 11.9746V11.9791Z" fill="#2684FF"/>
                                                <defs>
                                                <linearGradient id="paint0_linear_2204_541" x1="24.734" y1="29.2284" x2="16.1543" y2="44.0429" gradientUnits="userSpaceOnUse">
                                                <stop offset="0%" stopColor="#0052CC"/>
                                                <stop offset="0.92" stopColor="#2684FF"/>
                                                </linearGradient>
                                                </defs>
                                            </svg>
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-5">
                                            {/* Company & Job Title */}
                                            <span className="text-md font-bold uppercase text-gray-600 mb-2">{application.postingDetail.companyName}</span>

                                            <div className="mb-4">
                                                <h3 className={`text-xl font-bold ${statusStyle.text}`}>
                                                    {application.postingDetail.title} 
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {application.postingDetail.location}
                                                </p>
                                            </div>
                                            
                                            {/* Status Messages */}
                                            {application.status === 'accepted' && (
                                                <div className="bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 mb-4">
                                                    <p className="text-emerald-800 dark:text-emerald-300 font-medium flex items-center">
                                                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Congratulations! You've been accepted.
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {application.status === 'rejected' && (
                                                <div className="bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 rounded-lg p-3 mb-4">
                                                    <p className="text-rose-800 dark:text-rose-300 font-medium flex items-center">
                                                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        We're sorry, your application was not selected.
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Application Details */}
                                            <div className="space-y-3 text-sm">
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Student:</span>
                                                    <span className="col-span-2 text-gray-900 dark:text-gray-200">{application.studentName}</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Grade:</span>
                                                    <span className="col-span-2 text-gray-900 dark:text-gray-200">{application.grade}</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="text-gray-600 dark:text-gray-400 font-medium">GPA:</span>
                                                    <span className="col-span-2 text-gray-900 dark:text-gray-200">{application.gpa}</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Salary:</span>
                                                    <span className="col-span-2 text-gray-900 dark:text-gray-200">{application.postingDetail.salaryRange}</span>
                                                </div>
                                                
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Description:</p>
                                                    <p className="text-gray-800 dark:text-gray-300 line-clamp-3">{application.postingDetail.description}</p>
                                                </div>
                                                
                                                <div className="flex space-x-4 mt-3">
                                                    <a 
                                                        href={application.resume} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Resume
                                                    </a>
                                                    
                                                    <a 
                                                        href={application.coverLetter} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        Cover Letter
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Button */}
                                        {application.status === 'pending' && (
                                            <div className="px-6 pb-6">
                                                <button
                                                    onClick={() => setSelectedApplication(application)}
                                                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${statusStyle.button} focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center`}
                                                >
                                                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    Prepare for Interview
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <svg className="w-16 h-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No applications found</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        We couldn't find any applications matching your search criteria. Try adjusting your search or apply for some jobs!
                    </p>
                </div>
            )}
            
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
