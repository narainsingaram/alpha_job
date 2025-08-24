import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '../components/ModernSpinner';
import Cookies from 'js-cookie';
import withAdminAuth from '../utils/hoc/withAdminAuth.js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { 
  UilSearch, 
  UilFilter, 
  UilSort, 
  UilPlus, 
  UilEdit, 
  UilTrash, 
  UilEye,
  UilCheck,
  UilTimes,
  UilClock,
  UilUser,
  UilGraduationCap,
  UilMapMarker,
  UilBuilding,
  UilMoneyBill,
  UilFileAlt,
  UilEnvelope,
  UilCalendarAlt,
  UilAnalysis,
  UilBookmark,
  UilShareAlt,
  UilExternalLinkAlt
} from '@iconscout/react-unicons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ModernBackendPanel = () => {
    const [postings, setPostings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postingIds, setPostingIds] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [alert, setAlert] = useState(null);
    const [editingPosting, setEditingPosting] = useState(null);
    const [postingSearchQuery, setPostingSearchQuery] = useState('');
    const [postingSortField, setPostingSortField] = useState('');
    const [postingSortOrder, setPostingSortOrder] = useState('asc');
    const [applicationSearchQuery, setApplicationSearchQuery] = useState('');
    const [applicationSortField, setApplicationSortField] = useState('');
    const [applicationSortOrder, setApplicationSortOrder] = useState('asc');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPostingData, setNewPostingData] = useState({
        title: '',
        description: '',
        salaryRange: '',
        location: '',
        field: '',
        deadline: '',
        jobType: '',
        companyName: '',
        contactEmail: '',
        contactPhone: ''
    });
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
            let postingIdsList = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
                postingIdsList.push(doc.id);
            });
            setPostings(list);
            setPostingIds(postingIdsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching postings:", error);
            setError(error.message);
            setLoading(false);
        });

        const unsubApplications = onSnapshot(applicationsQuery, async (snapshot) => {
            let list = [];
            const postingIdsInSnapshot = [];
            
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
                postingIdsInSnapshot.push(doc.data().postingId);
            });
            
            // Fetch posting details for applications
            const postingDetails = await Promise.all(
                postingIdsInSnapshot.map(async (postingId) => {
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
                const postingDetail = postingDetails.find(posting => posting && posting.id === application.postingId);
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
            unsubPostings();
            unsubApplications();
        };
    }, [employerId]);

    const handleUpdateApplicationStatus = async (id, status) => {
        try {
            await updateDoc(doc(db, "applications", id), { status });
            setApplications(applications.map(application => 
                application.id === id ? { ...application, status } : application
            ));
            if (selectedApplication?.id === id) {
                setSelectedApplication({ ...selectedApplication, status });
            }
            setAlert({ type: "success", message: `Application status updated to ${status}` });
        } catch (err) {
            setAlert({ type: "error", message: "Failed to update application status" });
        }
    };

    const closeModal = () => {
        setSelectedApplication(null);
        setAlert(null);
        setEditingPosting(null);
    };

    const handleEditPosting = (posting) => {
        setEditingPosting(posting);
    };

    const handlePostingChange = (e) => {
        const { name, value } = e.target;
        setEditingPosting({
            ...editingPosting,
            [name]: value
        });
    };

    const handleNewPostingChange = (e) => {
        const { name, value } = e.target;
        setNewPostingData({
            ...newPostingData,
            [name]: value
        });
    };

    const handleUpdatePosting = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "postings", editingPosting.id), {
                title: editingPosting.title,
                description: editingPosting.description,
                salaryRange: editingPosting.salaryRange,
                location: editingPosting.location,
                field: editingPosting.field,
                deadline: editingPosting.deadline,
                jobType: editingPosting.jobType,
                companyName: editingPosting.companyName,
                contactEmail: editingPosting.contactEmail,
                contactPhone: editingPosting.contactPhone
            });
            setPostings(postings.map(posting => posting.id === editingPosting.id ? editingPosting : posting));
            setEditingPosting(null);
            setAlert({ type: "success", message: "Posting updated successfully" });
        } catch (err) {
            setAlert({ type: "error", message: "Failed to update posting" });
        }
    };

    const handleCreatePosting = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "postings"), {
                ...newPostingData,
                employerId,
                dateAdded: serverTimestamp()
            });
            setNewPostingData({
                title: '',
                description: '',
                salaryRange: '',
                location: '',
                field: '',
                deadline: '',
                jobType: '',
                companyName: '',
                contactEmail: '',
                contactPhone: ''
            });
            setShowCreateForm(false);
            setAlert({ type: "success", message: "Posting created successfully" });
        } catch (err) {
            setAlert({ type: "error", message: "Failed to create posting" });
        }
    };

    const filteredPostings = postings
        .filter(posting =>
            posting.title.toLowerCase().includes(postingSearchQuery.toLowerCase()) ||
            posting.description.toLowerCase().includes(postingSearchQuery.toLowerCase()) ||
            posting.location.toLowerCase().includes(postingSearchQuery.toLowerCase()) ||
            posting.companyName.toLowerCase().includes(postingSearchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (postingSortField === 'title') {
                return postingSortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            }
            if (postingSortField === 'salaryRange') {
                return postingSortOrder === 'asc' ? a.salaryRange.localeCompare(b.salaryRange) : b.salaryRange.localeCompare(a.salaryRange);
            }
            if (postingSortField === 'location') {
                return postingSortOrder === 'asc' ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location);
            }
            if (postingSortField === 'date') {
                const dateA = a.dateAdded?.seconds || 0;
                const dateB = b.dateAdded?.seconds || 0;
                return postingSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });

    const filteredApplications = applications
        .filter(application =>
            (application.studentName && application.studentName.toLowerCase().includes(applicationSearchQuery.toLowerCase())) ||
            (application.grade && application.grade.toLowerCase().includes(applicationSearchQuery.toLowerCase())) ||
            (application.status && application.status.toLowerCase().includes(applicationSearchQuery.toLowerCase())) ||
            (application.postingDetail && application.postingDetail.title && application.postingDetail.title.toLowerCase().includes(applicationSearchQuery.toLowerCase()))
        )
        .filter(application => postingIds.includes(application.postingId))
        .sort((a, b) => {
            if (applicationSortField === 'studentName') {
                return applicationSortOrder === 'asc' ? a.studentName.localeCompare(b.studentName) : b.studentName.localeCompare(a.studentName);
            }
            if (applicationSortField === 'grade') {
                return applicationSortOrder === 'asc' ? a.grade.localeCompare(b.grade) : b.grade.localeCompare(a.grade);
            }
            if (applicationSortField === 'status') {
                return applicationSortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
            }
            if (applicationSortField === 'date') {
                const dateA = a.dateAdded?.seconds || 0;
                const dateB = b.dateAdded?.seconds || 0;
                return applicationSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });

    const statusDistributionData = {
        labels: ['Accepted', 'Pending', 'Rejected'],
        datasets: [
            {
                label: 'Status Distribution',
                data: ['accepted', 'pending', 'rejected'].map(status =>
                    applications.filter(app => app.status === status).length
                ),
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            },
        ],
    };

    const postingsData = {
        labels: ['Postings'],
        datasets: [
            {
                label: 'Number of Postings',
                data: [postings.length],
                backgroundColor: ['#8B5CF6'],
            },
        ],
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <UilCheck className="mr-1 h-3 w-3" /> Accepted
                </span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <UilTimes className="mr-1 h-3 w-3" /> Rejected
                </span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <UilClock className="mr-1 h-3 w-3" /> Pending
                </span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <UilBookmark className="mr-1 h-3 w-3" /> {status}
                </span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
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
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
                            <p className="text-xl text-indigo-100">Manage your job postings and applications</p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="mt-6 md:mt-0 flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            <UilPlus className="mr-2" size={20} />
                            Create New Posting
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-8 -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-indigo-600">{postings.length}</div>
                        <div className="text-gray-600">Active Postings</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-blue-500">
                            {applications.filter(app => postingIds.includes(app.postingId)).length}
                        </div>
                        <div className="text-gray-600">Total Applications</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-500">
                            {applications.filter(app => app.status === 'accepted').length}
                        </div>
                        <div className="text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-amber-500">
                            {applications.filter(app => app.status === 'pending').length}
                        </div>
                        <div className="text-gray-600">Pending Review</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <UilAnalysis className="mr-2 text-indigo-600" size={20} />
                            Job Postings Overview
                        </h2>
                        <div className="h-64">
                            <Bar 
                                data={postingsData} 
                                options={{ 
                                    maintainAspectRatio: false, 
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <UilAnalysis className="mr-2 text-indigo-600" size={20} />
                            Application Status Distribution
                        </h2>
                        <div className="h-64">
                            <Pie 
                                data={statusDistributionData} 
                                options={{ 
                                    maintainAspectRatio: false, 
                                    responsive: true
                                }} 
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Your Postings Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Your Job Postings</h2>
                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UilSearch className="text-gray-400" size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search postings..."
                                        value={postingSearchQuery}
                                        onChange={(e) => setPostingSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={postingSortField}
                                        onChange={(e) => setPostingSortField(e.target.value)}
                                        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Sort By</option>
                                        <option value="title">Title</option>
                                        <option value="salaryRange">Salary</option>
                                        <option value="location">Location</option>
                                        <option value="date">Date Added</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <UilSort className="text-gray-500" size={16} />
                                    </div>
                                </div>
                                {postingSortField && (
                                    <select
                                        value={postingSortOrder}
                                        onChange={(e) => setPostingSortOrder(e.target.value)}
                                        className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {filteredPostings.length > 0 ? (
                                filteredPostings.map((posting) => (
                                    <div key={posting.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{posting.title || "N/A"}</h3>
                                                <p className="text-indigo-600 font-medium">{posting.companyName || "N/A"}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="inline-flex items-center text-sm text-gray-600">
                                                        <UilMapMarker className="mr-1" size={14} />
                                                        {posting.location || "N/A"}
                                                    </span>
                                                    <span className="inline-flex items-center text-sm text-gray-600">
                                                        <UilMoneyBill className="mr-1" size={14} />
                                                        {posting.salaryRange || "N/A"}
                                                    </span>
                                                    <span className="inline-flex items-center text-sm text-gray-600">
                                                        <UilBuilding className="mr-1" size={14} />
                                                        {posting.jobType || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditPosting(posting)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <UilEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this posting?")) {
                                                            deleteDoc(doc(db, "postings", posting.id));
                                                        }
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <UilTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                                            {posting.description || "No description provided"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <UilBookmark className="text-gray-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">No postings found</h3>
                                    <p className="text-gray-600">Create your first job posting to get started</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submitted Applications Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Submitted Applications</h2>
                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UilSearch className="text-gray-400" size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search applications..."
                                        value={applicationSearchQuery}
                                        onChange={(e) => setApplicationSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={applicationSortField}
                                        onChange={(e) => setApplicationSortField(e.target.value)}
                                        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Sort By</option>
                                        <option value="studentName">Student Name</option>
                                        <option value="grade">Grade</option>
                                        <option value="status">Status</option>
                                        <option value="date">Date</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <UilSort className="text-gray-500" size={16} />
                                    </div>
                                </div>
                                {applicationSortField && (
                                    <select
                                        value={applicationSortOrder}
                                        onChange={(e) => setApplicationSortOrder(e.target.value)}
                                        className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((application) => (
                                    <div key={application.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {application.postingDetail?.title || "Job Title"}
                                                </h3>
                                                <p className="text-indigo-600 font-medium">
                                                    Applicant: {application.studentName || "N/A"}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="inline-flex items-center text-sm text-gray-600">
                                                        <UilGraduationCap className="mr-1" size={14} />
                                                        Grade: {application.grade || "N/A"}
                                                    </span>
                                                    <span className="inline-flex items-center text-sm text-gray-600">
                                                        <UilUser className="mr-1" size={14} />
                                                        GPA: {application.gpa || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(application.status || "pending")}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <a 
                                                href={application.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                                            >
                                                <UilFileAlt className="mr-1" size={14} />
                                                Resume
                                            </a>
                                            <a 
                                                href={application.coverLetter} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                                            >
                                                <UilEnvelope className="mr-1" size={14} />
                                                Cover Letter
                                            </a>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={() => setSelectedApplication(application)}
                                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                <UilEye className="mr-2" size={16} />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <UilUser className="text-gray-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">No applications found</h3>
                                    <p className="text-gray-600">Applications to your job postings will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert */}
            {alert && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                    alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    <div className="flex items-center">
                        {alert.type === "success" ? (
                            <UilCheck className="mr-2" size={20} />
                        ) : (
                            <UilTimes className="mr-2" size={20} />
                        )}
                        <span>{alert.message}</span>
                    </div>
                </div>
            )}

            {/* Application Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Application Details</h2>
                                <button 
                                    onClick={closeModal}
                                    className="text-white hover:text-gray-200"
                                >
                                    <UilTimes size={24} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-bold text-gray-800 mb-3">Applicant Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <UilUser className="mr-2" size={18} />
                                            <span><strong>Name:</strong> {selectedApplication.studentName || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <UilGraduationCap className="mr-2" size={18} />
                                            <span><strong>Grade:</strong> {selectedApplication.grade || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <UilGraduationCap className="mr-2" size={18} />
                                            <span><strong>GPA:</strong> {selectedApplication.gpa || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-bold text-gray-800 mb-3">Job Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <UilBuilding className="mr-2" size={18} />
                                            <span><strong>Position:</strong> {selectedApplication.postingDetail?.title || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <UilMapMarker className="mr-2" size={18} />
                                            <span><strong>Company:</strong> {selectedApplication.postingDetail?.companyName || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <UilMoneyBill className="mr-2" size={18} />
                                            <span><strong>Salary:</strong> {selectedApplication.postingDetail?.salaryRange || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3">Documents</h3>
                                <div className="flex flex-wrap gap-3">
                                    <a 
                                        href={selectedApplication.resume} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                    >
                                        <UilFileAlt className="mr-2" size={18} />
                                        View Resume
                                    </a>
                                    <a 
                                        href={selectedApplication.coverLetter} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                    >
                                        <UilEnvelope className="mr-2" size={18} />
                                        View Cover Letter
                                    </a>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3">Application Status</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedApplication.status !== "accepted" && (
                                        <button
                                            onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "accepted")}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <UilCheck className="mr-2" size={18} />
                                            Accept Application
                                        </button>
                                    )}
                                    {selectedApplication.status !== "rejected" && (
                                        <button
                                            onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "rejected")}
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <UilTimes className="mr-2" size={18} />
                                            Reject Application
                                        </button>
                                    )}
                                    {selectedApplication.status !== "pending" && (
                                        <button
                                            onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "pending")}
                                            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                        >
                                            <UilClock className="mr-2" size={18} />
                                            Reset to Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Posting Modal */}
            {editingPosting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Edit Job Posting</h2>
                                <button 
                                    onClick={closeModal}
                                    className="text-white hover:text-gray-200"
                                >
                                    <UilTimes size={24} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleUpdatePosting} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="title"
                                            type="text"
                                            value={editingPosting.title}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="companyName"
                                            type="text"
                                            value={editingPosting.companyName}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Job Type
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="jobType"
                                            value={editingPosting.jobType}
                                            onChange={handlePostingChange}
                                            required
                                        >
                                            <option value="">Select Job Type</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Location
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="location"
                                            type="text"
                                            value={editingPosting.location}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Salary Range
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="salaryRange"
                                            type="text"
                                            value={editingPosting.salaryRange}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Deadline
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="deadline"
                                            type="date"
                                            value={editingPosting.deadline}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Job Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                                        name="description"
                                        value={editingPosting.description}
                                        onChange={handlePostingChange}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Contact Email
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="contactEmail"
                                            type="email"
                                            value={editingPosting.contactEmail}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="contactPhone"
                                            type="text"
                                            value={editingPosting.contactPhone}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Update Posting
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Posting Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Create New Job Posting</h2>
                                <button 
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-white hover:text-gray-200"
                                >
                                    <UilTimes size={24} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleCreatePosting} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="title"
                                            type="text"
                                            placeholder="e.g. Software Engineer"
                                            value={newPostingData.title}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="companyName"
                                            type="text"
                                            placeholder="e.g. TechCorp"
                                            value={newPostingData.companyName}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Job Type
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="jobType"
                                            value={newPostingData.jobType}
                                            onChange={handleNewPostingChange}
                                            required
                                        >
                                            <option value="">Select Job Type</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Location
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="location"
                                            type="text"
                                            placeholder="e.g. New York, NY"
                                            value={newPostingData.location}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Salary Range
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="salaryRange"
                                            type="text"
                                            placeholder="e.g. $70,000 - $90,000"
                                            value={newPostingData.salaryRange}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Deadline
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="deadline"
                                            type="date"
                                            value={newPostingData.deadline}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Job Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                                        name="description"
                                        placeholder="Describe the role, responsibilities, and requirements..."
                                        value={newPostingData.description}
                                        onChange={handleNewPostingChange}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Contact Email
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="contactEmail"
                                            type="email"
                                            placeholder="e.g. hiring@company.com"
                                            value={newPostingData.contactEmail}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="contactPhone"
                                            type="text"
                                            placeholder="e.g. (555) 123-4567"
                                            value={newPostingData.contactPhone}
                                            onChange={handleNewPostingChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Create Posting
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAdminAuth(ModernBackendPanel);