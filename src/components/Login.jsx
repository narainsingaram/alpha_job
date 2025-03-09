"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import studentsData from "../students.json"
import employersData from "../employers.json"
import { UilChannel } from "@iconscout/react-unicons"

const Login = ({ isEmployer }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [students, setStudents] = useState([])
  const [employers, setEmployers] = useState([])
  const [rememberMe, setRememberMe] = useState(false)
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
    clearCookies() // Clear cookies before setting new ones

    if (isEmployer) {
      const employer = employers.find((emp) => emp.name === email && emp.password === password)
      if (employer) {
        Cookies.set("employerId", employer.id)
        Cookies.set("adminMode", "true", { expires: 7 })
        if (rememberMe) {
          Cookies.set("rememberMe", "true", { expires: 7 })
        }
        navigate("/")
      } else {
        alert("Invalid employer credentials.")
      }
      return
    }

    const student = students.find((s) => s.name === email && s.password === password)
    if (student) {
      Cookies.set("studentId", student.id)
      if (rememberMe) {
        Cookies.set("rememberMe", "true", { expires: 7 })
      }
      navigate("/")
    } else {
      alert("Invalid student credentials.")
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gradient-to-r from-indigo-700 to-violet-500 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Students working on laptops"
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-90 transition-opacity duration-500"
          />
          <div className="hidden lg:relative lg:block lg:p-12 z-10">
            <div className="mb-8 flex items-center justify-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                <UilChannel className="w-24 h-24 text-white" />
              </div>
            </div>
            <h2 className="text-center mt-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl drop-shadow-md">
              Welcome Back to{" "}
              <span className="inline-block mt-2 bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">AlphaJob</span>
            </h2>
            <p className="mt-8 text-center text-lg leading-relaxed text-white/90 backdrop-blur-[2px]">
              AlphaJob is your gateway to exciting career opportunities. Get ready to explore and connect with top
              employers!
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent lg:hidden"></div>
        </section>
        <main
          aria-label="Main"
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-2xl lg:max-w-3xl w-full">
            <div className="relative -mt-16 block lg:hidden">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg">
                <UilChannel className="h-8 w-8" />
              </div>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">AlphaJob</h1>
            </div>
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
              <div className="mb-8 text-center">
                <div className="bg-gradient-to-r from-amber-50 to-red-50 border border-red-100 p-4 rounded-xl shadow-sm">
                  <p className="font-medium text-red-600">
                    <span className="font-bold text-amber-500">IMPORTANT:</span> IF YOU ARE TESTING THIS APP FROM FBLA,
                    PLEASE USE THE TEST CREDENTIALS WITH THE USERNAME:
                    <span className="mx-1 font-mono bg-white/80 px-2 py-0.5 rounded">fblatest</span>
                    AND PASSWORD:
                    <span className="mx-1 font-mono bg-white/80 px-2 py-0.5 rounded">1234</span>
                    FOR BOTH EMPLOYER AND STUDENT LOGIN
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-8">
                {isEmployer ? "Employer Login" : "Student Login"}
              </h1>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                    {isEmployer ? "Name" : "Name"}
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3.5 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                    id="email"
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3.5 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200"
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="rememberMe" className="font-medium text-gray-700">
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-medium text-white shadow-md hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>

              <div className="mt-8 rounded-xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  AlphaJob is a private app that is only available to employers and students of West Forsyth High
                  School. If you are not an employer or student, you do not have access to AlphaJob unless permissions
                  are added by contacting the school.
                </p>
              </div>

              <div className="mt-6 text-center">
                {isEmployer ? (
                  <p className="text-sm text-gray-600">
                    Not an employer?{" "}
                    <Link
                      to="/student-login"
                      className="font-medium text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline transition-all duration-200"
                    >
                      Student Login
                    </Link>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Not a student?{" "}
                    <Link
                      to="/employer-login"
                      className="font-medium text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline transition-all duration-200"
                    >
                      Employer Login
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default Login

