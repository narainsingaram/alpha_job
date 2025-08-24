import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UilChannel, 
  UilSearch, 
  UilFileAlt, 
  UilAnalysis, 
  UilHeadphonesAlt, 
  UilBriefcase, 
  UilGraduationCap, 
  UilBuilding, 
  UilUsersAlt, 
  UilChart, 
  UilRocket, 
  UilCheckCircle,
  UilArrowRight,
  UilPlay
} from '@iconscout/react-unicons';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <UilChannel className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AlphaJob
              </span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/student-login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Student Login
              </Link>
              <Link to="/employer-login" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                Employer Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Find Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dream Job</span> With AI
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl">
                AlphaJob connects talented students with top employers through our AI-powered platform. 
                Get personalized job recommendations, resume analysis, and interview preparation.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/student-login" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
                  Get Started as Student
                  <UilArrowRight className="ml-2" size={20} />
                </Link>
                <Link to="/employer-login" className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center">
                  Hire Talent
                  <UilUsersAlt className="ml-2" size={20} />
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </div>
                <p className="ml-4 text-gray-600">
                  <span className="font-bold text-gray-900">10,000+</span> students and employers trust AlphaJob
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <div className="flex items-center">
                    <UilSearch className="text-white" size={24} />
                    <h3 className="ml-2 text-white font-bold text-lg">Find Your Perfect Role</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <UilBriefcase className="text-indigo-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">Software Engineer</h4>
                        <p className="text-gray-600 text-sm">TechCorp • $80k - $100k</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <UilGraduationCap className="text-purple-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">Data Analyst</h4>
                        <p className="text-gray-600 text-sm">DataSystems • $65k - $85k</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-amber-50 rounded-xl">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <UilBuilding className="text-amber-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">Marketing Manager</h4>
                        <p className="text-gray-600 text-sm">BrandCorp • $70k - $90k</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
                      View All Opportunities
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900">Powerful Features for Your Success</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform provides everything you need to find the perfect job or hire the best talent.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                <UilSearch className="text-indigo-600" size={28} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">Smart Job Matching</h3>
              <p className="mt-3 text-gray-600">
                Our AI algorithm matches you with jobs that align with your skills, experience, and career goals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <UilFileAlt className="text-purple-600" size={28} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">Resume Analysis</h3>
              <p className="mt-3 text-gray-600">
                Get detailed feedback on your resume with actionable suggestions to improve your chances.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                <UilHeadphonesAlt className="text-amber-600" size={28} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">AI Interview Prep</h3>
              <p className="mt-3 text-gray-600">
                Practice with our AI-powered mock interviews tailored to your target job role.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <UilChart className="text-emerald-600" size={28} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">Performance Analytics</h3>
              <p className="mt-3 text-gray-600">
                Track your job search progress with detailed analytics and insights.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center">
                <UilUsersAlt className="text-rose-600" size={28} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">Talent Matching</h3>
              <p className="mt-3 text-gray-600">
                Employers find the perfect candidates with our advanced matching technology.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center">
                <UilRocket className="text-cyan-600" size={28} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">Career Growth</h3>
              <p className="mt-3 text-gray-600">
                Access learning resources and career development tools to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900">How AlphaJob Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple steps to transform your job search or hiring process.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">Create Your Profile</h3>
                  <p className="mt-2 text-gray-600">
                    Sign up and build your comprehensive profile with your skills, experience, and career goals.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-600 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">Get AI-Powered Recommendations</h3>
                  <p className="mt-2 text-gray-600">
                    Our AI analyzes your profile and matches you with the most relevant job opportunities.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-600 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">Apply & Prepare</h3>
                  <p className="mt-2 text-gray-600">
                    Apply to jobs directly through our platform and use our tools to prepare for interviews.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600 text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">Land Your Dream Job</h3>
                  <p className="mt-2 text-gray-600">
                    Track your applications and get notifications when employers view your profile.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h3 className="text-white font-bold text-lg">Your Career Dashboard</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="p-4 bg-indigo-50 rounded-xl">
                      <div className="flex justify-between">
                        <span className="font-bold text-indigo-800">Applications</span>
                        <span className="font-bold text-indigo-800">12</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="flex justify-between">
                        <span className="font-bold text-purple-800">Interviews Scheduled</span>
                        <span className="font-bold text-purple-800">5</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <div className="flex justify-between">
                        <span className="font-bold text-amber-800">Profile Strength</span>
                        <span className="font-bold text-amber-800">85%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                      <UilCheckCircle className="text-emerald-600" size={24} />
                      <div className="ml-4">
                        <h4 className="font-bold text-emerald-800">Congratulations!</h4>
                        <p className="text-emerald-700 text-sm">You've been accepted for Software Engineer at TechCorp</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Don't just take our word for it - hear from students and employers who have transformed their careers with AlphaJob.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-indigo-600">Software Engineer</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "AlphaJob helped me land my dream job at a top tech company. The AI interview prep was incredibly realistic and prepared me perfectly for the actual interviews."
              </p>
              <div className="mt-6 flex text-amber-400">
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Michael Chen</h4>
                  <p className="text-purple-600">Marketing Manager</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "The resume analysis feature is a game-changer. It identified weaknesses I didn't even know existed and provided actionable feedback that improved my response rate by 300%."
              </p>
              <div className="mt-6 flex text-amber-400">
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">TechCorp HR</h4>
                  <p className="text-amber-600">Recruitment Lead</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "We've reduced our hiring time by 50% since using AlphaJob. The talent matching algorithm consistently presents us with highly qualified candidates who are a perfect fit for our culture."
              </p>
              <div className="mt-6 flex text-amber-400">
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
                <UilCheckCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white">Ready to Transform Your Career?</h2>
            <p className="mt-4 text-xl text-indigo-100">
              Join thousands of students and employers who are already using AlphaJob to achieve their goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student-login" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
                Get Started as Student
                <UilGraduationCap className="ml-2" size={20} />
              </Link>
              <Link to="/employer-login" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all flex items-center justify-center">
                Hire Talent
                <UilUsersAlt className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                  <UilChannel className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  AlphaJob
                </span>
              </div>
              <p className="mt-4 text-gray-400">
                Connecting talented students with top employers through AI-powered technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">For Students</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/student-login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Job Search</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Builder</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">For Employers</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/employer-login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Talent Search</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2023 AlphaJob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;