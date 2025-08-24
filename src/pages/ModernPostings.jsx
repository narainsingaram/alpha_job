import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '../components/ModernSpinner';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { 
  UilSearch, 
  UilMapMarker, 
  UilBuilding, 
  UilClock, 
  UilTagAlt, 
  UilFilter,
  UilSort,
  UilPlus,
  UilBriefcase,
  UilGraduationCap,
  UilMoneyBill,
  UilExternalLinkAlt,
  UilHeart,
  UilShareAlt
} from '@iconscout/react-unicons';

// Import all images from the asset/random_images folder
const imagesContext = require.context('../asset/random_images', false, /\.(png|jpe?g|svg|webp|avif)$/);
const images = imagesContext.keys().map(imagesContext);

const ModernHome = () => {
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
    const [favorites, setFavorites] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        jobType: '',
        salaryRange: '',
        remote: ''
    });
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

    const toggleFavorite = (postingId) => {
        if (favorites.includes(postingId)) {
            setFavorites(favorites.filter(id => id !== postingId));
        } else {
            setFavorites([...favorites, postingId]);
        }
    };

    const filteredPostings = postings
        .filter(posting =>
            posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            posting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            posting.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            posting.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(posting =>
            filterLocation ? posting.location.toLowerCase().includes(filterLocation.toLowerCase()) : true
        )
        .filter(posting => 
            activeFilters.jobType ? posting.jobType === activeFilters.jobType : true
        )
        .filter(posting => 
            activeFilters.salaryRange ? posting.salaryRange === activeFilters.salaryRange : true
        )
        .filter(posting => 
            activeFilters.remote ? posting.remoteOptions === activeFilters.remote : true
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
            if (sortField === 'dateAdded') {
                return sortOrder === 'asc' ? 
                    (a.dateAdded?.seconds || 0) - (b.dateAdded?.seconds || 0) : 
                    (b.dateAdded?.seconds || 0) - (a.dateAdded?.seconds || 0);
            }
            return 0;
        });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Jobs</h2>
                    <p className="text-gray-600 mb-6">{error.message}</p>
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
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Job</h1>
                        <p className="text-xl mb-8 text-indigo-100">Discover opportunities that match your skills and aspirations</p>
                        
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <UilSearch className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                                placeholder="Search for jobs, companies, or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2 rounded-lg transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-8 -mt-12">
                <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">{postings.length}</div>
                        <div className="text-gray-600">Active Jobs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">1,248</div>
                        <div className="text-gray-600">Candidates Hired</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">92%</div>
                        <div className="text-gray-600">Satisfaction Rate</div>
                    </div>
                </div>
            </div>

            {/* Filters and Sorting */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Job Opportunities</h2>
                        
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <select
                                    value={activeFilters.jobType}
                                    onChange={(e) => setActiveFilters({...activeFilters, jobType: e.target.value})}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Job Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <UilFilter className="text-gray-500" />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <select
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Sort By</option>
                                    <option value="title">Title</option>
                                    <option value="salaryRange">Salary</option>
                                    <option value="location">Location</option>
                                    <option value="dateAdded">Date Added</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <UilSort className="text-gray-500" />
                                </div>
                            </div>
                            
                            {sortField && (
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredPostings.length > 0 ? (
                        filteredPostings.map((posting, index) => {
                            const imageIndex = index % images.length;
                            const imageSrc = images[imageIndex];
                            const isFavorite = favorites.includes(posting.id);
                            
                            return (
                                <div 
                                    key={posting.id} 
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                                >
                                    <div className="relative">
                                        <img 
                                            src={imageSrc} 
                                            alt={posting.title} 
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <button 
                                                onClick={() => toggleFavorite(posting.id)}
                                                className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-500'} shadow-md hover:shadow-lg transition-all`}
                                            >
                                                <UilHeart />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                {posting.jobType}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{posting.title}</h3>
                                                <p className="text-indigo-600 font-medium">{posting.companyName}</p>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{posting.description}</p>
                                        
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-gray-600">
                                                <UilMapMarker className="mr-2" size={18} />
                                                <span className="text-sm">{posting.location}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <UilMoneyBill className="mr-2" size={18} />
                                                <span className="text-sm font-medium">{posting.salaryRange}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <UilClock className="mr-2" size={18} />
                                                <span className="text-sm">{posting.workHoursWeekly} hrs/week</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {posting.hashtags && posting.hashtags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <button 
                                                onClick={() => handleApply(posting.id)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                                            >
                                                <UilBriefcase className="mr-2" size={18} />
                                                Apply Now
                                            </button>
                                            <div className="flex space-x-2">
                                                <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                                                    <UilShareAlt size={18} />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                                                    <UilExternalLinkAlt size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveFilters({jobType: '', salaryRange: '', remote: ''});
                                    setFilterLocation('');
                                }}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                            <h2 className="text-2xl font-bold text-white">Apply for Job</h2>
                            <p className="text-indigo-100">Fill in your details to apply</p>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Grade</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="grade"
                                            type="text"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">GPA</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="gpa"
                                            type="text"
                                            value={formData.gpa}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Resume Link</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        name="resume"
                                        type="text"
                                        value={formData.resume}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Cover Letter Link</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        name="coverLetter"
                                        type="text"
                                        value={formData.coverLetter}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(null)}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Posting Modal */}
            {showCreatePostingForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Create Job Posting</h2>
                                    <p className="text-indigo-100">Fill out the form to create a new job opportunity</p>
                                </div>
                                <button 
                                    onClick={() => setShowCreatePostingForm(false)}
                                    className="text-white hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleCreatePosting} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Job Title</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="title"
                                            type="text"
                                            placeholder="e.g. Senior Software Engineer"
                                            value={postingFormData.title}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Company Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="companyName"
                                            type="text"
                                            placeholder="e.g. TechCorp"
                                            value={postingFormData.companyName}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Job Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="jobType"
                                            value={postingFormData.jobType}
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
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="location"
                                            type="text"
                                            placeholder="e.g. New York, NY"
                                            value={postingFormData.location}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Salary Range</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="salaryRange"
                                            type="text"
                                            placeholder="e.g. $70,000 - $90,000"
                                            value={postingFormData.salaryRange}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Work Hours (per week)</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="workHoursWeekly"
                                            type="text"
                                            placeholder="e.g. 40"
                                            value={postingFormData.workHoursWeekly}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Job Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                                        name="description"
                                        placeholder="Describe the role, responsibilities, and requirements..."
                                        value={postingFormData.description}
                                        onChange={handlePostingChange}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Qualifications</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="qualifications"
                                            type="text"
                                            placeholder="e.g. Bachelor's degree, 3+ years experience"
                                            value={postingFormData.qualifications}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Remote Options</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="remoteOptions"
                                            value={postingFormData.remoteOptions}
                                            onChange={handlePostingChange}
                                            required
                                        >
                                            <option value="">Select Remote Option</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="On-site">On-site</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Contact Email</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="contactEmail"
                                            type="email"
                                            placeholder="e.g. hiring@company.com"
                                            value={postingFormData.contactEmail}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Application Deadline</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="deadline"
                                            type="date"
                                            value={postingFormData.deadline}
                                            onChange={handlePostingChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Hashtags</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        name="hashtags"
                                        type="text"
                                        placeholder="e.g. #engineering, #remote, #startup (separate with commas)"
                                        value={postingFormData.hashtags}
                                        onChange={handlePostingChange}
                                    />
                                </div>
                                
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreatePostingForm(false)}
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

            {/* Floating Action Button for Employers */}
            {Cookies.get("adminMode") === "true" && (
                <button
                    onClick={() => setShowCreatePostingForm(true)}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40"
                >
                    <UilPlus size={24} />
                </button>
            )}
        </div>
    );
};

export default ModernHome;