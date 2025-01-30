import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';
import withAdminAuth from '../utils/hoc/withAdminAuth.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const BackendPanel = () => {
    const [postings, setPostings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postingIds, setPostingIds] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [alert, setAlert] = useState(null); // For DaisyUI alerts
    const [editingPosting, setEditingPosting] = useState(null);
    const [postingSearchQuery, setPostingSearchQuery] = useState('');
    const [postingSortField, setPostingSortField] = useState('');
    const [postingSortOrder, setPostingSortOrder] = useState('asc');
    const [applicationSearchQuery, setApplicationSearchQuery] = useState('');
    const [applicationSortField, setApplicationSortField] = useState('');
    const [applicationSortOrder, setApplicationSortOrder] = useState('asc');
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

    const handleUpdateApplicationStatus = async (id, status) => {
        try {
            await updateDoc(doc(db, "applications", id), { status });
            setApplications(applications.map(application => application.id === id ? { ...application, status } : application));
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

    const handleUpdatePosting = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "postings", editingPosting.id), {
                title: editingPosting.title,
                description: editingPosting.description,
                salaryRange: editingPosting.salaryRange,
                location: editingPosting.location,
                field: editingPosting.field,
                deadline: editingPosting.deadline
            });
            setPostings(postings.map(posting => posting.id === editingPosting.id ? editingPosting : posting));
            setEditingPosting(null);
            setAlert({ type: "success", message: "Posting updated successfully" });
        } catch (err) {
            setAlert({ type: "error", message: "Failed to update posting" });
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        const handleOutsideClick = (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const filteredPostings = postings
        .filter(posting =>
            posting.title.toLowerCase().includes(postingSearchQuery.toLowerCase()) ||
            posting.description.toLowerCase().includes(postingSearchQuery.toLowerCase()) ||
            posting.location.toLowerCase().includes(postingSearchQuery.toLowerCase())
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
            return 0;
        });

    const filteredApplications = applications
        .filter(application =>
            application.studentName.toLowerCase().includes(applicationSearchQuery.toLowerCase()) ||
            application.grade.toLowerCase().includes(applicationSearchQuery.toLowerCase()) ||
            application.status.toLowerCase().includes(applicationSearchQuery.toLowerCase())
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
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            },
        ],
    };

    const postingsData = {
        labels: ['Postings'],
        datasets: [
            {
                label: 'Number of Postings',
                data: [postings.length],
                backgroundColor: ['#FF6384'],
            },
        ],
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-5xl mb-4 font-bold text-center">Backend Panel</h1>
            {/* Graphs Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 mx-12">
                <div className="p-6 bg-white rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Number of Postings</h2>
                    <Bar data={postingsData} />
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Status Distribution</h2>
                    <Pie data={statusDistributionData} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* Your Postings Section */}
                <div className="px-8 py-2 border-r border-gray-100">
                    <h2 className="text-3xl font-bold mb-4 text-center">Your Postings</h2>
                    <div className="mb-4 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Search postings..."
                            value={postingSearchQuery}
                            onChange={(e) => setPostingSearchQuery(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                        />
                        <div className="flex items-center">
                            <select
                                value={postingSortField}
                                onChange={(e) => setPostingSortField(e.target.value)}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            >
                                <option value="">Select</option>
                                <option value="title">Title</option>
                                <option value="salaryRange">Salary Range</option>
                                <option value="location">Location</option>
                            </select>
                            <select
                                value={postingSortOrder}
                                onChange={(e) => setPostingSortOrder(e.target.value)}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPostings.length > 0 ? (
                            filteredPostings.map((posting) => (
                                <div key={posting.id} className="p-6 bg-white rounded-2xl">
                                    <p><strong>Title:</strong> {posting.title || "N/A"}</p>
                                    <p><strong>Location:</strong> {posting.location || "N/A"}</p>
                                    <p><strong>Description:</strong> {posting.description || "N/A"}</p>
                                    <div className="flex justify-between mt-2">
                                        <button
                                            className="btn btn-info"
                                            onClick={() => handleEditPosting(posting)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-error"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this posting?")) {
                                                    deleteDoc(doc(db, "postings", posting.id));
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 border rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold">No postings found</h2>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submitted Applications Section */}
                <div className="px-8 py-2">
                    <h2 className="text-3xl font-bold mb-4 text-center">Submitted Applications</h2>
                    <div className="mb-4 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Search applications..."
                            value={applicationSearchQuery}
                            onChange={(e) => setApplicationSearchQuery(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                        />
                        <div className="flex items-center">
                            <select
                                value={applicationSortField}
                                onChange={(e) => setApplicationSortField(e.target.value)}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            >
                                <option value="">Select</option>
                                <option value="studentName">Student Name</option>
                                <option value="grade">Grade</option>
                                <option value="status">Status</option>
                            </select>
                            <select
                                value={applicationSortOrder}
                                onChange={(e) => setApplicationSortOrder(e.target.value)}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 ">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((application) => (
                                <div key={application.id} className="p-6 bg-white rounded-2xl">
                                    <p><strong>Student Name:</strong> {application.studentName || "N/A"}</p>
                                    <p><strong>Grade:</strong> {application.grade || "N/A"}</p>
                                    <p><strong>Status:</strong> {application.status || "Pending"}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setSelectedApplication(application)}
                                    >
                                        View Fullscreen
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 border rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold">No applications found</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DaisyUI Alert */}
            {alert && (
                <div className={`alert alert-${alert.type} shadow-lg my-4`}>
                    <div>
                        <span>{alert.message}</span>
                    </div>
                </div>
            )}

            {/* DaisyUI Modal for Application Details */}
            {selectedApplication && (
                <div className="modal modal-open modal-overlay">
                    <div className="modal-box">
                        <h1 className="font-extrabold text-3xl">Application Details</h1>
                        <p><strong>Student Name:</strong> {selectedApplication.studentName || "N/A"}</p>
                        <p><strong>Grade:</strong> {selectedApplication.grade || "N/A"}</p>
                        <p><strong>GPA:</strong> {selectedApplication.gpa || "N/A"}</p>
                        <p><strong>Resume:</strong> {selectedApplication.resume || "N/A"}</p>
                        <p><strong>Cover Letter:</strong> {selectedApplication.coverLetter || "N/A"}</p>
                        <p><strong>Posting Title:</strong> {selectedApplication.postingDetail?.title || "N/A"}</p>
                        <p><strong>Status:</strong> {selectedApplication.status || "Pending"}</p>
                        <div className="modal-action">
                            {selectedApplication.status !== "accepted" && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "accepted")}
                                >
                                    Accept
                                </button>
                            )}
                            {selectedApplication.status !== "rejected" && (
                                <button
                                    className="btn btn-error"
                                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "rejected")}
                                >
                                    Reject
                                </button>
                            )}
                            {selectedApplication.status !== "pending" && (
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "pending")}
                                >
                                    Reset Status
                                </button>
                            )}
                            <button
                                className="btn"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DaisyUI Modal for Editing Posting */}
            {editingPosting && (
                <div className="modal modal-open modal-overlay">
                    <div className="modal-box">
                        <h1 className="font-extrabold text-3xl">Edit Posting</h1>
                        <form onSubmit={handleUpdatePosting}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Job Title
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={editingPosting.title}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Job Description
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="description"
                                    name="description"
                                    value={editingPosting.description}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salaryRange">
                                    Salary Range
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="salaryRange"
                                    name="salaryRange"
                                    type="text"
                                    value={editingPosting.salaryRange}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={editingPosting.location}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field">
                                    Field
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="field"
                                    name="field"
                                    type="text"
                                    value={editingPosting.field}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                                    Deadline
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="deadline"
                                    name="deadline"
                                    type="date"
                                    value={editingPosting.deadline}
                                    onChange={handlePostingChange}
                                    required
                                />
                            </div>
                            <div className="modal-action">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Update Posting
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => setEditingPosting(null)}
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

export default withAdminAuth(BackendPanel);
