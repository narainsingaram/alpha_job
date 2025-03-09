import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { UilMap, UilQuestionCircle, UilBuilding, UilUserPlus, UilEnvelopeUpload } from '@iconscout/react-unicons';

// Import all images from the asset/random_images folder
const imagesContext = require.context('../asset/random_images', false, /\.(png|jpe?g|svg)$/);
const images = imagesContext.keys().map(imagesContext);

const Home = () => {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(null);
    const [showCreatePostingForm, setShowCreatePostingForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        gpa: '',
        resume: '',
        coverLetter: ''
    });
    const [postingFormData, setPostingFormData] = useState({
        title: '',
        jobType: '',
        baseSalary: '',
        description: '',
        companyName: '',
        numberOfEmployers: '',
        workHoursWeekly: '',
        qualifications: '',
        remoteOptions: '',
        website: '',
        contactEmail: '',
        contactPhone: '',
        salaryRange: '',
        location: '',
        field: '',
        deadline: '',
        hashtags: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterLocation, setFilterLocation] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const studentId = Cookies.get('studentId');
            const employerId = Cookies.get('employerId');
            if (!studentId && !employerId) {
                navigate('/student-login');
            } else {
                fetchPostings();
            }
        };

        const fetchPostings = () => {
            setLoading(true);
            const unsub = onSnapshot(collection(db, "postings"), (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    list.push({ id: doc.id, ...data });
                });
                setPostings(list);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            });

            return () => {
                unsub();
            };
        };

        checkAuth();
    }, [navigate]);

    const handleApply = (postingId) => {
        setShowForm(postingId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePostingChange = (e) => {
        const { name, value } = e.target;
        setPostingFormData({
            ...postingFormData,
            [name]: value
        });
    };

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
                resume: formData.resume,
                coverLetter: formData.coverLetter,
                status: "pending"
            });

            alert('Application submitted successfully!');
            setShowForm(null);
            setFormData({
                name: '',
                grade: '',
                gpa: '',
                resume: '',
                coverLetter: ''
            });
        } catch (error) {
            console.error("Error submitting application:", error);
            alert('Failed to submit application.');
        }
    };

    const handleCreatePosting = async (e) => {
        e.preventDefault();
        const employerId = Cookies.get('employerId');
        if (!employerId) {
            alert('You must be logged in as an employer to create a posting.');
            return;
        }
        try {
            await addDoc(collection(db, "postings"), {
                ...postingFormData,
                employerId,
                dateAdded: serverTimestamp(),
                hashtags: postingFormData.hashtags.split(',').map(tag => tag.trim())
            });
            alert('Job posting created successfully!');
            setShowCreatePostingForm(false);
            setPostingFormData({
                title: '',
                jobType: '',
                baseSalary: '',
                description: '',
                companyName: '',
                numberOfEmployers: '',
                workHoursWeekly: '',
                qualifications: '',
                remoteOptions: '',
                website: '',
                contactEmail: '',
                contactPhone: '',
                salaryRange: '',
                location: '',
                field: '',
                deadline: '',
                hashtags: ''
            });
        } catch (error) {
            console.error("Error creating job posting:", error);
        }
    };

    const filteredPostings = postings
        .filter(posting =>
            posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            posting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            posting.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(posting =>
            filterLocation ? posting.location.toLowerCase().includes(filterLocation.toLowerCase()) : true
        )
        .sort((a, b) => {
            if (sortField === 'title') {
                return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            }
            if (sortField === 'salaryRange') {
                return sortOrder === 'asc' ? a.salaryRange.localeCompare(b.salaryRange) : b.salaryRange.localeCompare(a.salaryRange);
            }
            if (sortField === 'location') {
                return sortOrder === 'asc' ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location);
            }
            return 0;
        });

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-gray-200 border max-w-[50rem] mx-auto">
                    <div className="mb-6">
                        <div className="relative w-full max-w-4xl mx-auto mb-6">
                            <input
                                type="search"
                                id="location-search"
                                className="block p-3.5 w-full z-20 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Search for Job Posting"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="absolute top-0 end-0 h-full p-3.5 text-white bg-blue-600 hover:bg-blue-700 rounded-r-lg border-0 focus:ring-2 focus:outline-none focus:ring-blue-300 transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center mb-2">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">Sort by:</label>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value="">Select</option>
                                        <option value="title">Title</option>
                                        <option value="salaryRange">Salary Range</option>
                                        <option value="location">Location</option>
                                    </select>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center mb-2">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">Filter by Location:</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={filterLocation}
                                        onChange={(e) => setFilterLocation(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPostings.length > 0 ? (
                        filteredPostings.map((posting) => {
                            const randomImage = images[Math.floor(Math.random() * images.length)];
                            return (
                                <div
                                key={posting.id}
                                className="group flex flex-col h-full overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md rounded-xl dark:bg-neutral-900 dark:border-neutral-800"
                              >
                                {/* Image container with gradient overlay */}
                                <div className="relative overflow-hidden">
                                  <img
                                    src={randomImage || "/placeholder.svg"}
                                    alt="Job"
                                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                          
                                {/* Content section */}
                                <div className="flex-1 p-5 space-y-4">
                                  {/* Header with company name */}
                                  <div>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-800 line-clamp-2 dark:text-white">{posting.title}                                     
                                        <span className="block mt-1 text-sm font-semibold tracking-wide text-primary uppercase">
                                      {posting.companyName}
                                    </span>
                                    </h3>
                                  </div>
                          
                                  {/* Description */}
                                  <p className="text-sm mt-2 text-gray-600 line-clamp-3 dark:text-gray-300">{posting.description}</p>
                          
                                  {/* Job details */}
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="flex items-start gap-1.5">
                                      <span className="font-medium text-gray-900 dark:text-gray-200">Salary:</span>
                                      <span className="text-gray-600 dark:text-gray-400">{posting.baseSalary}</span>
                                    </div>
                                    <div className="flex items-start gap-1.5">
                                      <span className="font-medium text-gray-900 dark:text-gray-200">Hours:</span>
                                      <span className="text-gray-600 dark:text-gray-400">{posting.workHoursWeekly}/week</span>
                                    </div>
                                    <div className="flex items-start gap-1.5">
                                      <span className="font-medium text-gray-900 dark:text-gray-200">Type:</span>
                                      <span className="text-gray-600 dark:text-gray-400">{posting.jobType}</span>
                                    </div>
                                    <div className="flex items-start gap-1.5">
                                      <span className="font-medium text-gray-900 dark:text-gray-200">Location:</span>
                                      <span className="text-gray-600 dark:text-gray-400">{posting.location}</span>
                                    </div>
                                    <div className="col-span-2 flex items-start gap-1.5">
                                      <span className="font-medium text-gray-900 dark:text-gray-200">Field:</span>
                                      <span className="text-gray-600 dark:text-gray-400">{posting.field}</span>
                                    </div>
                                  </div>
                          
                                  {/* Qualifications */}
                                  <div className="pt-1">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1.5 dark:text-white">Qualifications:</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">{posting.qualifications}</p>
                                  </div>
                                </div>
                          
                                {/* Tags section */}
                                <div className="px-5 pb-3">
                                  <div className="flex flex-wrap gap-1.5">
                                    {posting.hashtags &&
                                      posting.hashtags.map((tag, index) => (
                                        <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                                          {tag}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                          
                                {/* Action buttons */}
                                <div className="mt-auto grid grid-cols-3 border-t border-gray-100 dark:border-neutral-800">
                                  <button
                                    className="py-3.5 px-2 flex justify-center items-center gap-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-200 dark:hover:bg-neutral-800"
                                    onClick={() => (window.location.href = `tel:${posting.contactPhone}`)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    Call
                                  </button>
                                  <button
                                    className="py-3.5 px-2 flex justify-center items-center gap-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-x border-gray-100 dark:border-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-800"
                                    onClick={() => (window.location.href = `mailto:${posting.contactEmail}`)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                    Email
                                  </button>
                                  <button
                                    className="py-3.5 px-2 flex justify-center items-center gap-1.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors dark:hover:bg-primary/10"
                                    onClick={() => handleApply(posting.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M5 12h14"></path>
                                      <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                    Apply
                                  </button>
                                </div>
                              </div>
                            );
                        })
                    ) : (
                        <p>No postings found.</p>
                    )}
                </div>
            </div>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply for Job</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 transition-colors duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="grade">
                    Grade
                </label>
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 transition-colors duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    id="grade"
                    name="grade"
                    type="text"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="gpa">
                    GPA
                </label>
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 transition-colors duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    id="gpa"
                    name="gpa"
                    type="text"
                    value={formData.gpa}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="resume">
                    Resume Link
                </label>
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 transition-colors duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    id="resume"
                    name="resume"
                    type="text"
                    value={formData.resume}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="coverLetter">
                    Cover Letter Link
                </label>
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 transition-colors duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    id="coverLetter"
                    name="coverLetter"
                    type="text"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-5 rounded-l-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                    type="button"
                    onClick={() => setShowForm(null)}
                >
                    Cancel
                </button>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-r-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
</div>
            )}
            {Cookies.get("adminMode") === "true" && (
                <button
                    className="fixed bottom-4 right-4 btn btn-primary"
                    onClick={() => setShowCreatePostingForm(true)}
                >
                    Create Posting
                </button>
            )}
            {showCreatePostingForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[85vh] border border-gray-100">
        {/* Header with sticky position */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 z-10 rounded-t-xl">
            <h2 className="text-2xl font-bold text-gray-800">
                Create Job Posting
            </h2>
            <p className="text-gray-500 text-sm mt-1">Fill out the form below to create a new job posting</p>
        </div>
        
        {/* Form with padding and grid layout */}
        <div className="px-8 py-6">
            <form onSubmit={handleCreatePosting} className="space-y-6">
                {/* Basic Job Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 pb-1 border-b border-gray-100">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="title">
                                Job Title
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g. Senior Software Engineer"
                                value={postingFormData.title}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="jobType">
                                Job Type
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="jobType"
                                name="jobType"
                                type="text"
                                placeholder="e.g. Full-time, Part-time, Contract"
                                value={postingFormData.jobType}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="description">
                            Job Description
                        </label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none min-h-[100px] resize-y"
                            id="description"
                            name="description"
                            placeholder="Describe the job responsibilities, requirements, and benefits..."
                            value={postingFormData.description}
                            onChange={handlePostingChange}
                            required
                        />
                    </div>
                </div>
                
                {/* Company Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 pb-1 border-b border-gray-100">Company Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="companyName">
                                Company Name
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="companyName"
                                name="companyName"
                                type="text"
                                placeholder="e.g. Acme Corporation"
                                value={postingFormData.companyName}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="numberOfEmployers">
                                Number of Employees
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="numberOfEmployers"
                                name="numberOfEmployers"
                                type="text"
                                placeholder="e.g. 50-100"
                                value={postingFormData.numberOfEmployers}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="website">
                                Website
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="website"
                                name="website"
                                type="text"
                                placeholder="e.g. https://www.example.com"
                                value={postingFormData.website}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="field">
                                Industry/Field
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="field"
                                name="field"
                                type="text"
                                placeholder="e.g. Technology, Healthcare"
                                value={postingFormData.field}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                
                {/* Job Details Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 pb-1 border-b border-gray-100">Job Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="baseSalary">
                                Base Salary
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="baseSalary"
                                name="baseSalary"
                                type="text"
                                placeholder="e.g. $75,000"
                                value={postingFormData.baseSalary}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="salaryRange">
                                Salary Range
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="salaryRange"
                                name="salaryRange"
                                type="text"
                                placeholder="e.g. $70,000-$90,000"
                                value={postingFormData.salaryRange}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="workHoursWeekly">
                                Work Hours Weekly
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="workHoursWeekly"
                                name="workHoursWeekly"
                                type="text"
                                placeholder="e.g. 40"
                                value={postingFormData.workHoursWeekly}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="location">
                                Location
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="location"
                                name="location"
                                type="text"
                                placeholder="e.g. New York, NY"
                                value={postingFormData.location}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="remoteOptions">
                                Remote Working Options
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="remoteOptions"
                                name="remoteOptions"
                                type="text"
                                placeholder="e.g. Remote, Hybrid, On-site"
                                value={postingFormData.remoteOptions}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="deadline">
                                Application Deadline
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={postingFormData.deadline}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="qualifications">
                            Recommended Qualifications
                        </label>
                        <input
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                            id="qualifications"
                            name="qualifications"
                            type="text"
                            placeholder="e.g. Bachelor's degree, 3+ years experience"
                            value={postingFormData.qualifications}
                            onChange={handlePostingChange}
                            required
                        />
                    </div>
                </div>
                
                {/* Contact Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 pb-1 border-b border-gray-100">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="contactEmail">
                                Contact Email
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                placeholder="e.g. jobs@example.com"
                                value={postingFormData.contactEmail}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="contactPhone">
                                Contact Phone
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                id="contactPhone"
                                name="contactPhone"
                                type="text"
                                placeholder="e.g. (555) 123-4567"
                                value={postingFormData.contactPhone}
                                onChange={handlePostingChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                
                {/* Tags Section */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="hashtags">
                        Hashtags
                    </label>
                    <input
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        id="hashtags"
                        name="hashtags"
                        type="text"
                        placeholder="e.g. #engineering, #remote, #startup"
                        value={postingFormData.hashtags}
                        onChange={handlePostingChange}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate hashtags with commas</p>
                </div>
                
                {/* Form Actions - Sticky Footer */}
                <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-100 mt-8 flex items-center justify-end space-x-4">
                    <button
                        className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        type="button"
                        onClick={() => setShowCreatePostingForm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                        type="submit"
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

export default Home;
