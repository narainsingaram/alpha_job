"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import studentsData from "../students.json"
import employersData from "../employers.json"
import { UilChannel, UilUser, UilLock, UilEye, UilEyeSlash } from "@iconscout/react-unicons"

const ModernLogin = ({ isEmployer }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [students, setStudents] = useState([])
  const [employers, setEmployers] = useState([])
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setStudents(studentsData)
    setEmployers(employersData)
  }, [])

  const clearCookies = () => {
    Cookies.remove("employerId")
    Cookies.remove("studentId")
    Cookies.remove("adminMode")
    Cookies.remove("rememberMe")
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    clearCookies() // Clear cookies before setting new ones

    // Simulate API call delay
    setTimeout(() => {
      if (isEmployer) {
        const employer = employers.find((emp) => emp.name === email && emp.password === password)
        if (employer) {
          Cookies.set("employerId", employer.id)
          Cookies.set("adminMode", "true", { expires: 7 })
          if (rememberMe) {
            Cookies.set("rememberMe", "true", { expires: 7 })
          }
          navigate("/home")
        } else {
          alert("Invalid employer credentials.")
        }
        setLoading(false)
        return
      }

      const student = students.find((s) => s.name === email && s.password === password)
      if (student) {
        Cookies.set("studentId", student.id)
        if (rememberMe) {
          Cookies.set("rememberMe", "true", { expires: 7 })
        }
        navigate("/home")
      } else {
        alert("Invalid student credentials.")
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <UilChannel className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isEmployer ? "Employer Portal" : "Student Portal"}
            </h1>
            <p className="text-indigo-100 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <span className="font-bold">Test Credentials:</span> Use username:{" "}
                <span className="font-mono bg-white px-2 py-1 rounded">fblatest</span>{" "}
                and password:{" "}
                <span className="font-mono bg-white px-2 py-1 rounded">1234</span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UilUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    id="email"
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UilLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <UilEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <UilEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {isEmployer ? (
                  <p className="text-center text-sm text-gray-600">
                    Not an employer?{" "}
                    <Link
                      to="/student-login"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Student Login
                    </Link>
                  </p>
                ) : (
                  <p className="text-center text-sm text-gray-600">
                    Not a student?{" "}
                    <Link
                      to="/employer-login"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Employer Login
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>AlphaJob is a private app for West Forsyth High School students and employers.</p>
        </div>
      </div>
    </div>
  )
}

export default ModernLogin