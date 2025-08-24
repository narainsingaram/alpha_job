"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Cookies from "js-cookie"
import { 
  UilChannel, 
  UilPostcard, 
  UilAnalytics, 
  UilSignOutAlt, 
  UilListOl, 
  UilRocket, 
  UilCommentAltMessage,
  UilBars,
  UilTimes,
  UilUser,
  UilBriefcase,
  UilFileAlt,
  UilHeadphonesAlt
} from "@iconscout/react-unicons"

const ModernNavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [adminMode, setAdminMode] = useState(false)
  const [isEmployer, setIsEmployer] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const isAdmin = Cookies.get("adminMode") === "true"
    const employerId = Cookies.get("employerId")
    const studentId = Cookies.get("studentId")

    setAdminMode(isAdmin)
    setIsEmployer(!!employerId)
    setIsStudent(!!studentId)
  }, [location])

  const handleLogout = () => {
    Cookies.remove("adminMode")
    Cookies.remove("employerId")
    Cookies.remove("studentId")
    setAdminMode(false)
    setIsEmployer(false)
    setIsStudent(false)
    setMenuOpen(false)
    setProfileOpen(false)
    navigate("/")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <UilChannel className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AlphaJob
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="/"
              className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <UilBriefcase className="mr-2 h-4 w-4" />
              Jobs
            </a>
            
            {isStudent && (
              <>
                <a
                  href="/applications"
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                    isActive("/applications") 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <UilListOl className="mr-2 h-4 w-4" />
                  My Applications
                </a>
                <a
                  href="/ai_analysis"
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                    isActive("/ai_analysis") 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <UilRocket className="mr-2 h-4 w-4" />
                  Resume Analysis
                </a>
                <a
                  href="/interview-prep"
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                    isActive("/interview-prep") 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <UilHeadphonesAlt className="mr-2 h-4 w-4" />
                  Interview Prep
                </a>
              </>
            )}
            
            {adminMode && (
              <a
                href="/backend"
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                  isActive("/backend") 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <UilAnalytics className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center">
            {(!isEmployer && !isStudent) ? (
              <div className="hidden md:flex items-center space-x-2">
                <a
                  href="/student-login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Student Login
                </a>
                <a
                  href="/employer-login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Employer Login
                </a>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <UilUser className="h-5 w-5 text-white" />
                  </div>
                </button>

                {profileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {(isEmployer || isStudent || adminMode) && (
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <UilSignOutAlt className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              >
                {menuOpen ? (
                  <UilTimes className="block h-6 w-6" />
                ) : (
                  <UilBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <UilBriefcase className="inline mr-2 h-4 w-4" />
              Jobs
            </a>
            
            {isStudent && (
              <>
                <a
                  href="/applications"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/applications") 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <UilListOl className="inline mr-2 h-4 w-4" />
                  My Applications
                </a>
                <a
                  href="/ai_analysis"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/ai_analysis") 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <UilRocket className="inline mr-2 h-4 w-4" />
                  Resume Analysis
                </a>
                <a
                  href="/interview-prep"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/interview-prep") 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <UilHeadphonesAlt className="inline mr-2 h-4 w-4" />
                  Interview Prep
                </a>
              </>
            )}
            
            {adminMode && (
              <a
                href="/backend"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/backend") 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <UilAnalytics className="inline mr-2 h-4 w-4" />
                Dashboard
              </a>
            )}
            
            {(!isEmployer && !isStudent) && (
              <>
                <a
                  href="/student-login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Student Login
                </a>
                <a
                  href="/employer-login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Employer Login
                </a>
              </>
            )}
            
            {(isEmployer || isStudent || adminMode) && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <UilSignOutAlt className="inline mr-2 h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default ModernNavBar