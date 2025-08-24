import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, getDoc, doc, addDoc } from 'firebase/firestore';
import Spinner from '../components/ModernSpinner';
import Cookies from 'js-cookie';
import InterviewPrepModal from './AI'; // Import the modal component
import { 
  UilSearch, 
  UilMapMarker, 
  UilBuilding, 
  UilClock, 
  UilMoneyBill, 
  UilFileAlt, 
  UilEnvelope, 
  UilGraduationCap,
  UilUser,
  UilCheckCircle,
  UilTimesCircle,
  UilHourglass,
  UilBookmark,
  UilShareAlt,
  UilExternalLinkAlt,
  UilFilter
} from '@iconscout/react-unicons';

const ModernStudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
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

    const filteredAndSortedApplications = applications
        .filter(application => {
            if (!application.postingDetail) return false;
            
            const matchesSearch = 
                (application.postingDetail.title && application.postingDetail.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (application.postingDetail.companyName && application.postingDetail.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (application.postingDetail.location && application.postingDetail.location.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortField === 'date') {
                const dateA = a.postingDetail?.dateAdded?.seconds || 0;
                const dateB = b.postingDetail?.dateAdded?.seconds || 0;
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            if (sortField === 'title') {
                const titleA = a.postingDetail?.title || '';
                const titleB = b.postingDetail?.title || '';
                return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
            }
            if (sortField === 'company') {
                const companyA = a.postingDetail?.companyName || '';
                const companyB = b.postingDetail?.companyName || '';
                return sortOrder === 'asc' ? companyA.localeCompare(companyB) : companyB.localeCompare(companyA);
            }
            if (sortField === 'status') {
                const statusA = a.status || '';
                const statusB = b.status || '';
                return sortOrder === 'asc' ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
            }
            return 0;
        });

    // Status-based styling and icons
    const getStatusConfig = (status) => {
        switch (status) {
            case 'accepted':
                return {
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                    text: "text-emerald-700",
                    badge: "bg-emerald-100 text-emerald-800",
                    icon: <UilCheckCircle className="w-5 h-5 text-emerald-500" />,
                    button: "bg-emerald-600 hover:bg-emerald-700"
                };
            case 'rejected':
                return {
                    bg: "bg-rose-50",
                    border: "border-rose-200",
                    text: "text-rose-700",
                    badge: "bg-rose-100 text-rose-800",
                    icon: <UilTimesCircle className="w-5 h-5 text-rose-500" />,
                    button: "bg-rose-600 hover:bg-rose-700"
                };
            case 'pending':
                return {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-700",
                    badge: "bg-amber-100 text-amber-800",
                    icon: <UilHourglass className="w-5 h-5 text-amber-500" />,
                    button: "bg-blue-600 hover:bg-blue-700"
                };
            default:
                return {
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                    text: "text-gray-700",
                    badge: "bg-gray-100 text-gray-800",
                    icon: <UilBookmark className="w-5 h-5 text-gray-500" />,
                    button: "bg-gray-600 hover:bg-gray-700"
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Loading your applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Applications</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">My Applications</h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Track your job applications and prepare for interviews
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-8 -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-indigo-600">{applications.length}</div>
                        <div className="text-gray-600">Total Applications</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-amber-500">
                            {applications.filter(app => app.status === 'pending').length}
                        </div>
                        <div className="text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-emerald-500">
                            {applications.filter(app => app.status === 'accepted').length}
                        </div>
                        <div className="text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-rose-500">
                            {applications.filter(app => app.status === 'rejected').length}
                        </div>
                        <div className="text-gray-600">Rejected</div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UilSearch className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Search by job title, company, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <UilFilter className="text-gray-500" size={16} />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="title">Sort by Title</option>
                                    <option value="company">Sort by Company</option>
                                    <option value="status">Sort by Status</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                    </svg>
                                </div>
                            </div>

                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications Grid */}
                {filteredAndSortedApplications.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {filteredAndSortedApplications.map((application) => {
                            const statusConfig = getStatusConfig(application.status);
                            
                            return (
                                <div 
                                    key={application.id} 
                                    className={`rounded-2xl border ${statusConfig.border} ${statusConfig.bg} overflow-hidden transition-all duration-300 hover:shadow-xl`}
                                >
                                    {/* Header with Status */}
                                    <div className="p-5 border-b border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {application.postingDetail?.title || "Job Title"}
                                                </h3>
                                                <p className="text-indigo-600 font-medium">
                                                    {application.postingDetail?.companyName || "Company Name"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}>
                                                    {statusConfig.icon}
                                                    <span className="ml-1 capitalize">{application.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Details */}
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            {/* Job Information */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center text-gray-600">
                                                    <UilMapMarker className="mr-2" size={18} />
                                                    <span className="text-sm">
                                                        {application.postingDetail?.location || "Location"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <UilMoneyBill className="mr-2" size={18} />
                                                    <span className="text-sm font-medium">
                                                        {application.postingDetail?.salaryRange || "Salary"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <UilClock className="mr-2" size={18} />
                                                    <span className="text-sm">
                                                        {application.postingDetail?.workHoursWeekly || "Hours"} hrs/week
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <UilBuilding className="mr-2" size={18} />
                                                    <span className="text-sm">
                                                        {application.postingDetail?.jobType || "Job Type"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Application Details */}
                                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                <h4 className="font-semibold text-gray-800 mb-3">Your Application</h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-gray-600">
                                                        <UilUser className="mr-2" size={16} />
                                                        <span className="text-sm">Name: {application.studentName || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <UilGraduationCap className="mr-2" size={16} />
                                                        <span className="text-sm">Grade: {application.grade || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <UilGraduationCap className="mr-2" size={16} />
                                                        <span className="text-sm">GPA: {application.gpa || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Documents */}
                                            <div className="flex flex-wrap gap-3">
                                                <a 
                                                    href={application.resume} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                                >
                                                    <UilFileAlt className="mr-2" size={16} />
                                                    <span className="text-sm">Resume</span>
                                                </a>
                                                <a 
                                                    href={application.coverLetter} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                                >
                                                    <UilEnvelope className="mr-2" size={16} />
                                                    <span className="text-sm">Cover Letter</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-5 border-t border-gray-200 bg-white">
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => setSelectedApplication(application)}
                                                disabled={application.status !== 'pending'}
                                                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium transition-all ${application.status === 'pending' ? statusConfig.button + ' hover:shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}
                                            >
                                                <UilGraduationCap className="mr-2" size={18} />
                                                Prepare for Interview
                                            </button>
                                            
                                            {application.status === 'accepted' && (
                                                <button className="p-2.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                                                    <UilShareAlt size={18} />
                                                </button>
                                            )}
                                            
                                            <button className="p-2.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                                                <UilExternalLinkAlt size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Applications Found</h2>
                            <p className="text-gray-600 mb-6">
                                {searchQuery || filterStatus !== 'all' 
                                    ? "We couldn't find any applications matching your search criteria." 
                                    : "You haven't applied to any jobs yet."}
                            </p>
                            <a 
                                href="/postings" 
                                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Browse Job Postings
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Interview Prep Modal */}
            {selectedApplication && (
                <InterviewPrepModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    );
};

export default ModernStudentApplications;