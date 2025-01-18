import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';

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
        resume: null,
        coverLetter: null
    });
    const [postingFormData, setPostingFormData] = useState({
        title: '',
        description: '',
        salaryRange: '',
        location: ''
    });

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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files[0]
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
                resume: formData.resume.name,
                coverLetter: formData.coverLetter.name
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
                employerId
            });
            alert('Job posting created successfully!');
            setShowCreatePostingForm(false);
            setPostingFormData({
                title: '',
                description: '',
                salaryRange: '',
                location: ''
            });
        } catch (error) {
            console.error("Error creating job posting:", error);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
      <div className="p-4">
<div class="text-3xl mb-4 font-extrabold text-center text-black bg-blue-300 px-8 py-1 rounded-3xl mx-auto max-w-max">
    AlphaJob
</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8 rounded-2xl">
          {postings.length > 0 ? (
            postings.map((posting) => (
              <div
                key={posting.id}
                className="p-6 bg-indigo-200/60 hover:bg-indigo-200 rounded-3xl duration-100 rounded-2xl shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-3xl text-indigo-800 font-extrabold">{posting.title}</h2>
                  <p>{posting.description}</p>
                  <p>Salary Range: {posting.salaryRange}</p>
                  <p>Location: {posting.location}</p>
                </div>
                <button
                  className="btn btn-primary self-end mt-4"
                  onClick={() => handleApply(posting.id)}
                >
                  Apply
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 border rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold">No postings found</h2>
            </div>
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
                    Resume
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="resume"
                    name="resume"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="coverLetter"
                  >
                    Cover Letter
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="coverLetter"
                    name="coverLetter"
                    type="file"
                    onChange={handleFileChange}
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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
