// Utility functions for job-student matching

/**
 * Calculate a matching score between a student and a job posting
 * @param {Object} studentProfile - Student's profile with skills, experience, etc.
 * @param {Object} jobPosting - Job posting with requirements
 * @returns {number} Matching score between 0 and 100
 */
export const calculateMatchingScore = (studentProfile, jobPosting) => {
  if (!studentProfile || !jobPosting) return 0;
  
  let score = 0;
  let totalWeight = 0;
  
  // Skills matching (30% weight)
  if (studentProfile.skills && jobPosting.qualifications) {
    const skillScore = calculateSkillMatch(studentProfile.skills, jobPosting.qualifications);
    score += skillScore * 30;
    totalWeight += 30;
  }
  
  // Experience matching (20% weight)
  if (studentProfile.experience && jobPosting.jobType) {
    const experienceScore = calculateExperienceMatch(studentProfile.experience, jobPosting.jobType);
    score += experienceScore * 20;
    totalWeight += 20;
  }
  
  // Location preference matching (15% weight)
  if (studentProfile.locationPreferences && jobPosting.location) {
    const locationScore = calculateLocationMatch(studentProfile.locationPreferences, jobPosting.location);
    score += locationScore * 15;
    totalWeight += 15;
  }
  
  // Job type matching (15% weight)
  if (studentProfile.jobTypePreferences && jobPosting.jobType) {
    const jobTypeScore = calculateJobTypeMatch(studentProfile.jobTypePreferences, jobPosting.jobType);
    score += jobTypeScore * 15;
    totalWeight += 15;
  }
  
  // Major/Field of study matching (10% weight)
  if (studentProfile.major && jobPosting.field) {
    const majorScore = calculateMajorMatch(studentProfile.major, jobPosting.field);
    score += majorScore * 10;
    totalWeight += 10;
  }
  
  // GPA matching (10% weight)
  if (studentProfile.gpa && jobPosting.qualifications) {
    const gpaScore = calculateGPAMatch(studentProfile.gpa, jobPosting.qualifications);
    score += gpaScore * 10;
    totalWeight += 10;
  }
  
  // Normalize score to 0-100 range
  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
};

/**
 * Calculate skill matching score
 * @param {Array} studentSkills - Array of student's skills
 * @param {string} jobQualifications - Job qualifications text
 * @returns {number} Score between 0 and 1
 */
const calculateSkillMatch = (studentSkills, jobQualifications) => {
  if (!studentSkills || studentSkills.length === 0 || !jobQualifications) return 0;
  
  // Convert job qualifications to lowercase for comparison
  const jobQualificationsLower = jobQualifications.toLowerCase();
  
  // Count matching skills
  const matchingSkills = studentSkills.filter(skill => 
    jobQualificationsLower.includes(skill.toLowerCase())
  );
  
  // Calculate percentage of matching skills
  return matchingSkills.length / studentSkills.length;
};

/**
 * Calculate experience matching score
 * @param {string} studentExperience - Student's experience level
 * @param {string} jobType - Job type (Full-time, Part-time, Internship, etc.)
 * @returns {number} Score between 0 and 1
 */
const calculateExperienceMatch = (studentExperience, jobType) => {
  // Define experience level mapping
  const experienceLevels = {
    'high school': 1,
    'college': 2,
    'bachelor': 3,
    'master': 4,
    'phd': 5
  };
  
  // Define job type experience requirements
  const jobTypeRequirements = {
    'Internship': 1,     // Suitable for high school/college students
    'Part-time': 2,      // College students and above
    'Full-time': 3,      // Bachelor's degree or above
    'Contract': 3        // Bachelor's degree or above
  };
  
  const studentLevel = experienceLevels[studentExperience.toLowerCase()] || 1;
  const requiredLevel = jobTypeRequirements[jobType] || 1;
  
  // If student has equal or more experience than required, return 1
  // Otherwise, return a partial score based on the difference
  return studentLevel >= requiredLevel ? 1 : studentLevel / requiredLevel;
};

/**
 * Calculate location matching score
 * @param {Array} studentPreferences - Student's location preferences
 * @param {string} jobLocation - Job location
 * @returns {number} Score between 0 and 1
 */
const calculateLocationMatch = (studentPreferences, jobLocation) => {
  if (!studentPreferences || studentPreferences.length === 0 || !jobLocation) return 0;
  
  // Check if job location matches any of student's preferences
  const isMatch = studentPreferences.some(pref => 
    jobLocation.toLowerCase().includes(pref.toLowerCase()) ||
    pref.toLowerCase().includes(jobLocation.toLowerCase())
  );
  
  return isMatch ? 1 : 0;
};

/**
 * Calculate job type matching score
 * @param {Array} studentPreferences - Student's job type preferences
 * @param {string} jobType - Job type
 * @returns {number} Score between 0 and 1
 */
const calculateJobTypeMatch = (studentPreferences, jobType) => {
  if (!studentPreferences || studentPreferences.length === 0 || !jobType) return 0;
  
  // Check if job type matches student preferences
  const isMatch = studentPreferences.some(pref => 
    pref.toLowerCase() === jobType.toLowerCase()
  );
  
  return isMatch ? 1 : 0;
};

/**
 * Calculate major/field of study matching score
 * @param {string} studentMajor - Student's major/field of study
 * @param {string} jobField - Job field
 * @returns {number} Score between 0 and 1
 */
const calculateMajorMatch = (studentMajor, jobField) => {
  if (!studentMajor || !jobField) return 0;
  
  // Convert both to lowercase for comparison
  const major = studentMajor.toLowerCase();
  const field = jobField.toLowerCase();
  
  // Check for direct match or partial match
  if (major === field || field.includes(major) || major.includes(field)) {
    return 1;
  }
  
  return 0;
};

/**
 * Calculate GPA matching score
 * @param {string} studentGPA - Student's GPA
 * @param {string} jobQualifications - Job qualifications text
 * @returns {number} Score between 0 and 1
 */
const calculateGPAMatch = (studentGPA, jobQualifications) => {
  if (!studentGPA || !jobQualifications) return 0;
  
  // Parse student GPA
  const gpa = parseFloat(studentGPA);
  if (isNaN(gpa)) return 0;
  
  // Look for minimum GPA requirement in job qualifications
  const gpaRegex = /(?:minimum|at least|require).*?(\d+(?:\.\d+)?)/i;
  const match = jobQualifications.match(gpaRegex);
  
  if (match) {
    const requiredGPA = parseFloat(match[1]);
    if (!isNaN(requiredGPA)) {
      // If student meets or exceeds requirement, return 1
      // Otherwise, return partial score based on how close they are
      return gpa >= requiredGPA ? 1 : Math.max(0, gpa / requiredGPA);
    }
  }
  
  // If no GPA requirement found, assume student meets criteria
  return 1;
};

/**
 * Get top matching jobs for a student
 * @param {Object} studentProfile - Student's profile
 * @param {Array} jobPostings - Array of job postings
 * @param {number} limit - Number of top matches to return
 * @returns {Array} Sorted array of job postings with matching scores
 */
export const getTopMatchingJobs = (studentProfile, jobPostings, limit = 10) => {
  // Calculate scores for all jobs
  const jobsWithScores = jobPostings.map(job => ({
    ...job,
    matchingScore: calculateMatchingScore(studentProfile, job)
  }));
  
  // Sort by matching score (descending)
  jobsWithScores.sort((a, b) => b.matchingScore - a.matchingScore);
  
  // Return top matches
  return jobsWithScores.slice(0, limit);
};