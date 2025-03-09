import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import Job_Image from '../asset/job_image.jpg';
import { UilMap } from '@iconscout/react-unicons'
import { UilQuestionCircle } from '@iconscout/react-unicons'
import { UilBuilding } from '@iconscout/react-unicons'
import { UilUserPlus } from '@iconscout/react-unicons'
import { UilEnvelopeUpload } from '@iconscout/react-unicons'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

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
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const checkAuth = () => {
            const studentId = Cookies.get('studentId');
            const employerId = Cookies.get('employerId');
            if (!studentId && !employerId) {
                navigate('/student-login'); // Redirect to login page if not logged in
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
        console.log('Employer ID:', employerId); // Debugging log
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
                {/* Search Bar */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-gray-200 border max-w-[50rem] mx-auto">
      <div className="mb-6">
        {/* Search Bar */}
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

        {/* Sorting and Filtering */}
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

                {/* Sorting and Filtering */}
            </div>

            <div className="max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPostings.length > 0 ? (
                    filteredPostings.map((posting) => (
                        
                        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                        <div class="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                          <svg class="size-28" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="56" height="56" rx="10" fill="white"/>
                            <path d="M20.2819 26.7478C20.1304 26.5495 19.9068 26.4194 19.6599 26.386C19.4131 26.3527 19.1631 26.4188 18.9647 26.5698C18.848 26.6622 18.7538 26.78 18.6894 26.9144L10.6019 43.1439C10.4874 43.3739 10.4686 43.6401 10.5496 43.884C10.6307 44.1279 10.805 44.3295 11.0342 44.4446C11.1681 44.5126 11.3163 44.5478 11.4664 44.5473H22.7343C22.9148 44.5519 23.0927 44.5037 23.2462 44.4084C23.3998 44.3132 23.5223 44.1751 23.5988 44.011C26.0307 38.9724 24.5566 31.3118 20.2819 26.7478Z" fill="url(#paint0_linear_2204_541)"/>
                            <path d="M28.2171 11.9791C26.201 15.0912 25.026 18.6755 24.8074 22.3805C24.5889 26.0854 25.3342 29.7837 26.9704 33.1126L32.403 44.0113C32.4833 44.1724 32.6067 44.3079 32.7593 44.4026C32.912 44.4973 33.088 44.5475 33.2675 44.5476H44.5331C44.6602 44.5479 44.7861 44.523 44.9035 44.4743C45.0209 44.4257 45.1276 44.3543 45.2175 44.2642C45.3073 44.1741 45.3785 44.067 45.427 43.9492C45.4755 43.8314 45.5003 43.7052 45.5 43.5777C45.5001 43.4274 45.4659 43.2791 45.3999 43.1441L29.8619 11.9746C29.7881 11.8184 29.6717 11.6864 29.5261 11.594C29.3805 11.5016 29.2118 11.4525 29.0395 11.4525C28.8672 11.4525 28.6984 11.5016 28.5529 11.594C28.4073 11.6864 28.2908 11.8184 28.2171 11.9746V11.9791Z" fill="#2684FF"/>
                            <defs>
                            <linearGradient id="paint0_linear_2204_541" x1="24.734" y1="29.2284" x2="16.1543" y2="44.0429" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stop-color="#0052CC"/>
                            <stop offset="0.92" stop-color="#2684FF"/>
                            </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div class="p-4">
                          <p class="block text-sm font-semibold uppercase text-blue-600 dark:text-blue-500">
                            {posting.companyName}
                          </p>
                          <h3 class="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                            {posting.title}
                          </h3>
                          <p class="mt-3 text-gray-500 dark:text-neutral-500">
                            {posting.description}
                          </p>
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
  <li><strong className="text-gray-900">Base Salary:</strong> {posting.baseSalary}</li>
  <li><strong className="text-gray-900">Work Hours:</strong> {posting.workHoursWeekly} hours/week</li>
  <li><strong className="text-gray-900">Qualifications:</strong> {posting.qualifications}</li>
  <li><strong className="text-gray-900">Job Type:</strong> {posting.jobType}</li>
  <li><strong className="text-gray-900">Location:</strong> {posting.location}</li>
  <li><strong className="text-gray-900">Salary Range:</strong> {posting.salaryRange}</li>
  <li><strong className="text-gray-900">Field:</strong> {posting.field}</li>
</ul>

                        </div>

                        <div className="flex flex-wrap my-4 ml-4">
                                    {posting.hashtags &&
                                        posting.hashtags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                </div>

                        <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                          <button class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" onClick={() => window.location.href = `tel:${posting.contactPhone}`}
 href="#">
                            Call Now
                          </button>
                          <button onClick={() => window.location.href = `mailto:${posting.contactEmail}`}
 class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                            Contact Email
                          </button>
                          <button onClick={() => handleApply(posting.id)}
 class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                    <p>No postings found.</p>
                )}
            </div>
        </div>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Apply for Job</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="grade"
                                >
                                    Grade
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="grade"
                                    name="grade"
                                    type="text"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="gpa"
                                >
                                    GPA
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="gpa"
                                    name="gpa"
                                    type="text"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="resume"
                                >
                                    Resume Link
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="resume"
                                    name="resume"
                                    type="text"
                                    value={formData.resume}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="coverLetter"
                                >
                                    Cover Letter Link
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="coverLetter"
                                    name="coverLetter"
                                    type="text"
                                    value={formData.coverLetter}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Submit
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => setShowForm(null)}
                                >
                                    Cancel
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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-[80vh]">
                        <h2 className="text-2xl font-semibold mb-4">
                            Create Job Posting
                        </h2>
                        <form onSubmit={handleCreatePosting}>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="title"
                                >
                                    Job Title
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={postingFormData.title}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="jobType"
                                >
                                    Job Type
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="jobType"
                                    name="jobType"
                                    type="text"
                                    value={postingFormData.jobType}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="baseSalary"
                                >
                                    Base Salary
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="baseSalary"
                                    name="baseSalary"
                                    type="text"
                                    value={postingFormData.baseSalary}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="description"
                                >
                                    Job Description
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="description"
                                    name="description"
                                    value={postingFormData.description}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="companyName"
                                >
                                    Company Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    value={postingFormData.companyName}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="numberOfEmployers"
                                >
                                    Number of Employers
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="numberOfEmployers"
                                    name="numberOfEmployers"
                                    type="text"
                                    value={postingFormData.numberOfEmployers}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="workHoursWeekly"
                                >
                                    Work Hours Weekly
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="workHoursWeekly"
                                    name="workHoursWeekly"
                                    type="text"
                                    value={postingFormData.workHoursWeekly}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="qualifications"
                                >
                                    Recommended Qualifications
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="qualifications"
                                    name="qualifications"
                                    type="text"
                                    value={postingFormData.qualifications}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="remoteOptions"
                                >
                                    Remote Working Options
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="remoteOptions"
                                    name="remoteOptions"
                                    type="text"
                                    value={postingFormData.remoteOptions}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="website"
                                >
                                    Website
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="website"
                                    name="website"
                                    type="text"
                                    value={postingFormData.website}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="contactEmail"
                                >
                                    Contact Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    value={postingFormData.contactEmail}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="contactPhone"
                                >
                                    Contact Phone
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="contactPhone"
                                    name="contactPhone"
                                    type="text"
                                    value={postingFormData.contactPhone}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="salaryRange"
                                >
                                    Salary Range
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="salaryRange"
                                    name="salaryRange"
                                    type="text"
                                    value={postingFormData.salaryRange}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="location"
                                >
                                    Location
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={postingFormData.location}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="field"
                                >
                                    Field
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="field"
                                    name="field"
                                    type="text"
                                    value={postingFormData.field}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="deadline"
                                >
                                    Deadline
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="deadline"
                                    name="deadline"
                                    type="date"
                                    value={postingFormData.deadline}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="hashtags"
                                >
                                    Hashtags (comma-separated)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="hashtags"
                                    name="hashtags"
                                    type="text"
                                    value={postingFormData.hashtags}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Create Posting
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => setShowCreatePostingForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
