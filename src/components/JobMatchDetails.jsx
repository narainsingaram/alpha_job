import React from 'react';
import { UilCheck, UilTimes, UilMinus } from '@iconscout/react-unicons';

const JobMatchDetails = ({ studentProfile, jobPosting }) => {
  if (!studentProfile || !jobPosting) return null;

  // Check for skill matches
  const getSkillMatches = () => {
    if (!studentProfile.skills || !jobPosting.qualifications) return [];
    
    const qualifications = jobPosting.qualifications.toLowerCase();
    return studentProfile.skills.filter(skill => 
      qualifications.includes(skill.toLowerCase())
    );
  };

  // Check for location match
  const getLocationMatch = () => {
    if (!studentProfile.locationPreferences || !jobPosting.location) return false;
    
    return studentProfile.locationPreferences.some(pref => 
      jobPosting.location.toLowerCase().includes(pref.toLowerCase()) ||
      pref.toLowerCase().includes(jobPosting.location.toLowerCase())
    );
  };

  // Check for job type match
  const getJobTypeMatch = () => {
    if (!studentProfile.jobTypePreferences || !jobPosting.jobType) return false;
    
    return studentProfile.jobTypePreferences.some(pref => 
      pref.toLowerCase() === jobPosting.jobType.toLowerCase()
    );
  };

  // Check for major match
  const getMajorMatch = () => {
    if (!studentProfile.major || !jobPosting.field) return false;
    
    const major = studentProfile.major.toLowerCase();
    const field = jobPosting.field.toLowerCase();
    
    return major === field || field.includes(major) || major.includes(field);
  };

  // Check GPA requirement
  const getGPAMatch = () => {
    if (!studentProfile.gpa || !jobPosting.qualifications) return { meets: true, required: null };
    
    const gpa = parseFloat(studentProfile.gpa);
    if (isNaN(gpa)) return { meets: false, required: null };
    
    const gpaRegex = /(?:minimum|at least|require).*?(\d+(?:\.\d+)?)/i;
    const match = jobPosting.qualifications.match(gpaRegex);
    
    if (match) {
      const requiredGPA = parseFloat(match[1]);
      if (!isNaN(requiredGPA)) {
        return { meets: gpa >= requiredGPA, required: requiredGPA };
      }
    }
    
    return { meets: true, required: null };
  };

  const skillMatches = getSkillMatches();
  const locationMatch = getLocationMatch();
  const jobTypeMatch = getJobTypeMatch();
  const majorMatch = getMajorMatch();
  const gpaMatch = getGPAMatch();

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h4 className="font-bold text-gray-800 mb-3">Match Details</h4>
      
      <div className="space-y-3">
        {/* Skills Match */}
        <div>
          <div className="flex items-center text-sm">
            {skillMatches.length > 0 ? (
              <UilCheck className="text-green-500 mr-2" size={16} />
            ) : (
              <UilTimes className="text-red-500 mr-2" size={16} />
            )}
            <span className="font-medium">Skills Match</span>
            <span className="ml-2 text-gray-500">
              ({skillMatches.length} of {studentProfile.skills?.length || 0} skills match)
            </span>
          </div>
          {skillMatches.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {skillMatches.map((skill, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Location Match */}
        <div className="flex items-center text-sm">
          {locationMatch ? (
            <UilCheck className="text-green-500 mr-2" size={16} />
          ) : (
            <UilTimes className="text-red-500 mr-2" size={16} />
          )}
          <span className="font-medium">Location Preference</span>
          <span className="ml-2 text-gray-500">
            ({jobPosting.location})
          </span>
        </div>
        
        {/* Job Type Match */}
        <div className="flex items-center text-sm">
          {jobTypeMatch ? (
            <UilCheck className="text-green-500 mr-2" size={16} />
          ) : (
            <UilTimes className="text-red-500 mr-2" size={16} />
          )}
          <span className="font-medium">Job Type Preference</span>
          <span className="ml-2 text-gray-500">
            ({jobPosting.jobType})
          </span>
        </div>
        
        {/* Major Match */}
        <div className="flex items-center text-sm">
          {majorMatch ? (
            <UilCheck className="text-green-500 mr-2" size={16} />
          ) : (
            <UilTimes className="text-red-500 mr-2" size={16} />
          )}
          <span className="font-medium">Field of Study</span>
          <span className="ml-2 text-gray-500">
            ({studentProfile.major || 'Not specified'} → {jobPosting.field || 'Not specified'})
          </span>
        </div>
        
        {/* GPA Match */}
        <div className="flex items-center text-sm">
          {gpaMatch.meets ? (
            <UilCheck className="text-green-500 mr-2" size={16} />
          ) : (
            <UilTimes className="text-red-500 mr-2" size={16} />
          )}
          <span className="font-medium">GPA Requirement</span>
          <span className="ml-2 text-gray-500">
            {studentProfile.gpa ? `Your GPA: ${studentProfile.gpa}` : 'GPA not provided'}
            {gpaMatch.required && ` (Required: ${gpaMatch.required})`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobMatchDetails;