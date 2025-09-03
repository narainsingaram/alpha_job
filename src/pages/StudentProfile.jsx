import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { 
  UilUser, 
  UilGraduationCap, 
  UilBriefcase, 
  UilMapMarker, 
  UilTagAlt, 
  UilCheckCircle,
  UilPlus,
  UilTrash
} from '@iconscout/react-unicons';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    school: '',
    major: '',
    graduationYear: '',
    gpa: '',
    skills: [],
    experience: '',
    locationPreferences: [],
    jobTypePreferences: [],
    resumeLink: ''
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const studentId = Cookies.get('studentId');

  useEffect(() => {
    if (studentId) {
      fetchProfile();
    }
  }, [studentId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileDoc = await getDoc(doc(db, "studentProfiles", studentId));
      if (profileDoc.exists()) {
        setProfile({ ...profile, ...profileDoc.data() });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addLocationPreference = () => {
    if (newLocation.trim() && !profile.locationPreferences.includes(newLocation.trim())) {
      setProfile({
        ...profile,
        locationPreferences: [...profile.locationPreferences, newLocation.trim()]
      });
      setNewLocation('');
    }
  };

  const removeLocationPreference = (locationToRemove) => {
    setProfile({
      ...profile,
      locationPreferences: profile.locationPreferences.filter(loc => loc !== locationToRemove)
    });
  };

  const addJobTypePreference = () => {
    if (newJobType.trim() && !profile.jobTypePreferences.includes(newJobType.trim())) {
      setProfile({
        ...profile,
        jobTypePreferences: [...profile.jobTypePreferences, newJobType.trim()]
      });
      setNewJobType('');
    }
  };

  const removeJobTypePreference = (jobTypeToRemove) => {
    setProfile({
      ...profile,
      jobTypePreferences: profile.jobTypePreferences.filter(type => type !== jobTypeToRemove)
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const profileRef = doc(db, "studentProfiles", studentId);
      await setDoc(profileRef, profile, { merge: true });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error("Error saving profile:", error);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white">Student Profile</h1>
            <p className="text-indigo-100 mt-1">Manage your profile information for better job matching</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UilUser className="inline mr-2" size={18} />
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'education'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UilGraduationCap className="inline mr-2" size={18} />
                Education
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'experience'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UilBriefcase className="inline mr-2" size={18} />
                Skills & Experience
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UilMapMarker className="inline mr-2" size={18} />
                Preferences
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Resume Link</label>
                  <input
                    type="text"
                    name="resumeLink"
                    value={profile.resumeLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://drive.google.com/file/..."
                  />
                  <p className="mt-1 text-sm text-gray-500">Link to your resume (Google Drive, Dropbox, etc.)</p>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">School</label>
                    <input
                      type="text"
                      name="school"
                      value={profile.school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="West Forsyth High School"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Major/Field of Study</label>
                    <input
                      type="text"
                      name="major"
                      value={profile.major}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Graduation Year</label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={profile.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">GPA</label>
                    <input
                      type="text"
                      name="gpa"
                      value={profile.gpa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="3.8"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Experience Level</label>
                  <select
                    name="experience"
                    value={profile.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select your experience level</option>
                    <option value="high school">High School Student</option>
                    <option value="college">College Student</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Skills</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add a skill (e.g., JavaScript, Python, Marketing)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-indigo-600 text-white px-4 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
                    >
                      <UilPlus size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <UilTrash size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Location Preferences</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add a preferred location (e.g., Atlanta, Remote)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocationPreference())}
                    />
                    <button
                      type="button"
                      onClick={addLocationPreference}
                      className="bg-indigo-600 text-white px-4 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
                    >
                      <UilPlus size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.locationPreferences.map((location, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => removeLocationPreference(location)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <UilTrash size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Job Type Preferences</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newJobType}
                      onChange={(e) => setNewJobType(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add a job type (e.g., Internship, Full-time)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addJobTypePreference())}
                    />
                    <button
                      type="button"
                      onClick={addJobTypePreference}
                      className="bg-indigo-600 text-white px-4 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
                    >
                      <UilPlus size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.jobTypePreferences.map((jobType, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {jobType}
                        <button
                          type="button"
                          onClick={() => removeJobTypePreference(jobType)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <UilTrash size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <UilCheckCircle className="mr-2" size={20} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;