import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import Job_Image from '../asset/job_image.jpg';
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

    useEffect(() => {
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
    }, []);

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
            <div className="text-3xl mb-4 font-extrabold text-center text-black bg-indigo-300 px-8 py-1 rounded-3xl mx-auto max-w-max">
                AlphaJob
            </div>
            <div className="mb-4">
    {/* Search Bar */}
    <div className="relative w-full mb-4">
        <input
            type="search"
            id="location-search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-2xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search for Job Posting"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
        />
        <button
            type="submit"
            className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
    <div className="flex justify-center items-center gap-4">
        <div className="flex items-center">
            <label className="mr-2">Sort by:</label>
            <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
            >
                <option value="">Select</option>
                <option value="title">Title</option>
                <option value="salaryRange">Salary Range</option>
                <option value="location">Location</option>
            </select>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
        <div className="flex items-center">
            <label className="mr-2">Filter by Location:</label>
            <input
                type="text"
                placeholder="Location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8 rounded-2xl">
  {filteredPostings.length > 0 ? (
    filteredPostings.map((posting) => (
      <div
        key={posting.id}
        className="p-6 bg-white shadow-md rounded-3xl border border-gray-200 flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl text-indigo-700 font-bold mb-2">
            {posting.title}           
          </h2>
          <p className="text-lg mb-8 mt-2 font-bold text-blue-600 bg-blue-100 px-3 py-2 rounded-2xl">Company Name: {posting.companyName}</p>
          <p className="text-lg mb-8 mt-2 font-bold text-emerald-600 bg-emerald-100 px-3 py-2 rounded-2xl">Job Type: {posting.jobType}</p>
          <p className="text-lg mb-8 mt-2 font-bold text-yellow-600 bg-yellow-100 px-3 py-2 rounded-2xl">Location: {posting.location}</p>

          <img className="rounded-2xl mb-4 mt-8" src={Job_Image} alt="Company Logo" />
          <p className="text-md bg-slate-100 p-4 rounded-2xl text-gray-700 mb-4">
            <span className='font-bold'>Description: </span>{posting.description}
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Base Salary:</strong> {posting.baseSalary}
            </p>
            <p>
              <strong>Work Hours:</strong> {posting.workHoursWeekly} hours/week
            </p>
          </div>
          <hr className="my-4" />
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Qualifications:</strong> {posting.qualifications}
            </p>
            <p>
              <strong>Salary Range:</strong> {posting.salaryRange}
            </p>
            <p>
              <strong>Field:</strong> {posting.field}
            </p>
          </div>
          <hr className="my-4" />
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={posting.website}
                className="text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {posting.website}
              </a>
            </p>
            <p>
              <strong>Contact Phone:</strong> {posting.contactPhone}
            </p>
          </div>
          <div className="flex flex-wrap mt-4">
            {posting.hashtags &&
              posting.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2"
                >
                  #{tag}
                </span>
              ))}
          </div>
        </div>
        <div className="flex justify-end mt-6">
        <button
  className="btn bg-green-600 text-white"
  onClick={() => window.location.href = `mailto:${posting.contactEmail}`}
>
  Contact Email
</button>

          <button
            className="btn bg-indigo-600 text-white"
            onClick={() => handleApply(posting.id)}
          >
            Apply Now
          </button>
        </div>
      </div>
    ))
  ) : (
    <p>No postings found.</p>
  )}
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
