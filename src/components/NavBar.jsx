"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { UilChannel } from "@iconscout/react-unicons"
import { UilPostcard } from "@iconscout/react-unicons"
import { UilAnalytics } from "@iconscout/react-unicons"
import { UilSignOutAlt } from "@iconscout/react-unicons"
import { UilListOl } from "@iconscout/react-unicons"
import { UilRocket } from "@iconscout/react-unicons"

const NavBar = () => {
  const navigate = useNavigate()
  const [adminMode, setAdminMode] = useState(false)
  const [isEmployer, setIsEmployer] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const isAdmin = Cookies.get("adminMode") === "true"
    const employerId = Cookies.get("employerId")
    const studentId = Cookies.get("studentId")

    setAdminMode(isAdmin)
    setIsEmployer(!!employerId)
    setIsStudent(!!studentId)
  }, [])

  const handleAdminLogin = () => {
    document.getElementById("admin_modal").showModal()
  }

  const handleLogout = () => {
    Cookies.remove("adminMode")
    Cookies.remove("employerId")
    Cookies.remove("studentId")
    setAdminMode(false)
    setIsEmployer(false)
    setIsStudent(false)
    navigate("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="bg-white max-w-[100rem] mx-auto my-6 p-4 px-6 rounded-2xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="self-center text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition-colors duration-200">
            <UilChannel className="inline mb-1.5 mr-2 text-indigo-600"></UilChannel>
            AlphaJob
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          aria-controls="navbar-default"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className={`w-full md:block md:w-auto ${menuOpen ? "block" : "hidden"}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0">
            <li>
              <a
                href="/postings"
                className="flex items-center py-2 px-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 md:hover:bg-transparent md:border-0 md:p-0 transition-colors duration-200"
              >
                <UilPostcard className="w-5 h-5 mr-2 text-black" />
                <span className="text-black">Postings</span>
              </a>
            </li>
            {isStudent && (
              <>
                <li>
                  <a
                    href="/applications"
                    className="flex items-center py-2 px-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 md:hover:bg-transparent md:border-0 md:p-0 transition-colors duration-200"
                  >
                    <UilListOl className="w-5 h-5 mr-2 text-black"></UilListOl>
                    <span className="text-black">My Applications</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/ai_analysis"
                    className="flex items-center py-2 px-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 md:hover:bg-transparent md:border-0 md:p-0 transition-colors duration-200"
                  >
                    <UilRocket className="w-5 h-5 mr-2 text-black"></UilRocket>
                    <span className="text-black">Resume Analysis</span>
                  </a>
                </li>
              </>
            )}
            {adminMode && (
              <>
                <li>
                  <a
                    href="/backend"
                    className="flex items-center py-2 px-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 md:hover:bg-transparent md:border-0 md:p-0 transition-colors duration-200"
                  >
                    <UilAnalytics className="w-5 h-5 mr-2 mb-0.5 text-black" />
                    <span className="text-black">Backend Panel</span>
                  </a>
                </li>
              </>
            )}
            {!isEmployer && !isStudent && (
              <>
                <li>
                  <a
                    href="/student-login"
                    className="flex items-center py-2 px-4 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 md:hover:bg-transparent md:border-0 md:p-0 md:hover:text-indigo-600 transition-colors duration-200"
                  >
                    <span>Student Login</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/employer-login"
                    className="flex items-center py-2 px-4 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 md:hover:bg-transparent md:border-0 md:p-0 md:hover:text-indigo-600 transition-colors duration-200"
                  >
                    <span>Employer Login</span>
                  </a>
                </li>
              </>
            )}
            {(isEmployer || isStudent || adminMode) && (
              <li>
                <button
                  onClick={() => {
                    handleLogout()
                    window.location.reload()
                  }}
                  className="flex items-center py-2 px-3 text-red-500 rounded-lg hover:bg-red-50 md:hover:bg-transparent md:border-0 md:p-0 md:hover:text-red-600 transition-colors duration-200"
                >
                  <UilSignOutAlt className="w-5 h-5 mr-2"></UilSignOutAlt>
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <dialog id="admin_modal" className="modal">
        <div className="modal-box bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <h3 className="font-bold text-xl text-indigo-700 mb-4">Admin Mode Settings</h3>
          <div className="mb-6 mt-4">
            <input
              className="input input-bordered bg-white w-full mb-3 p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Enter admin name..."
              type="text"
              id="adminName"
            />
            <input
              className="input input-bordered bg-white w-full mb-4 p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Enter secret code..."
              type="password"
              id="secretCode"
            />
            <br></br>
            <button
              className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
              onClick={() => {
                const adminName = document.getElementById("adminName").value
                const secretCode = document.getElementById("secretCode").value
                const admins = [
                  { name: "Shourya Sinha", code: "1234" },
                  { name: "Narain Singaram", code: "1234" },
                  { name: "Mithran Prakash", code: "1234" },
                  { name: "Alex Johnson", code: "1234" },
                  { name: "Sarah Williams", code: "1234" },
                  { name: "Michael Chen", code: "1234" },
                  { name: "Emma Rodriguez", code: "1234" },
                  { name: "James Wilson", code: "1234" },
                  { name: "Olivia Garcia", code: "1234" },
                  { name: "William Taylor", code: "1234" },
                  { name: "Sophia Lee", code: "1234" },
                  { name: "Lucas Brown", code: "1234" },
                  { name: "Isabella Martinez", code: "1234" },
                ]
                const admin = admins.find((a) => a.name === adminName && a.code === secretCode)
                if (admin) {
                  Cookies.set("adminMode", "true", { expires: 7 })
                  setAdminMode(true)
                  document.getElementById("admin_modal").close()
                } else {
                  alert("Invalid admin credentials.")
                }
              }}
            >
              Activate Admin Mode
            </button>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={handleLogout}
              >
                Close & Deactivate Admin Mode
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </nav>
  )
}

export default NavBar

