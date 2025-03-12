import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="bg-gradient-to-r from-purple-800 to-purple-900 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link to="/" className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="bg-white text-purple-800 rounded-full w-8 h-8 flex items-center justify-center">A</span>
              <span className="!text-white">AlphaJob</span>
            </Link>
            <nav className="hidden lg:flex space-x-8">
              <Link
                to="/student-login"
                className="text-base font-medium !text-white hover:text-purple-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-purple-700"
              >
                Student Login
              </Link>
              <Link
                to="/employer-login"
                className="text-base font-medium !text-white hover:text-purple-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-purple-700"
              >
                Employer Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
      />
      <div
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>
      <div
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        aria-hidden="true"
      >
        <div
          className="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Join AlphaJob's Mission
          </h2>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
          At AlphaJob, we are dedicated to revolutionizing the job search experience by connecting talent with the right opportunities. Our mission is to empower job seekers and employers through cutting-edge technology, AI-driven job matching, and seamless hiring solutions.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            <a href="/student-login">
              Student Login <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="/employer-login">
              Employer Login <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Postings</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">100+</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Full-time students</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">5000+</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Professional Employers</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">125+</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Amount of Access</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">Unlimited</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

      <main>


        <section className="py-24 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Features</h2>
            <center className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16">
              Discover how AlphaJob can help you find the perfect career opportunity.
            </center>
            <div className="mt-12 grid gap-10 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">High School Job Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our advanced algorithms match high school students with the best job opportunities based on their
                  skills and preferences.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resume Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get expert analysis of your resume to improve your chances of landing your dream job.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expand Your Professional Network</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with professionals in your industry and expand your professional network.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Testimonials</h2>
            <center className="text-xl !text-center text-gray-600 mx-auto max-w-3xl mb-16">
              Hear what our users have to say about their experience with AlphaJob.
            </center>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="bg-purple-50 p-8 rounded-2xl shadow-lg border border-purple-100 relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-200 rounded-full mr-4 flex items-center justify-center text-purple-700 font-bold">
                    JS
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Jacob Smith</p>
                    <p className="text-gray-500 text-sm">High School Senior</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "AlphaJob helped me find my dream job in just a few weeks. The job matching feature is amazing! I
                  never thought I'd find such a perfect fit for my skills and interests."
                </p>
              </div>
              <div className="bg-purple-50 p-8 rounded-2xl shadow-lg border border-purple-100 relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-200 rounded-full mr-4 flex items-center justify-center text-purple-700 font-bold">
                    NP
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Nathan Patel</p>
                    <p className="text-gray-500 text-sm">College Freshman</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "The resume advice I received from AlphaJob was invaluable. I highly recommend this platform to anyone
                  looking to improve their job prospects and career trajectory."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-purple-50 py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img
                    className="w-full h-full object-cover"
                    src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/man-working-on-laptop.jpg"
                    alt="Man working on laptop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-transparent"></div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-50 z-0"></div>
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-300 rounded-full opacity-50 z-0"></div>
              </div>
              <div className="lg:w-1/2 mt-12 lg:mt-0">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose AlphaJob?</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  AlphaJob is dedicated to helping you find the best job opportunities and advance your career. Our
                  platform offers a range of features designed to make your job search easier and more effective.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700">Advanced job matching algorithms tailored to your skills</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700">Expert resume analysis with personalized feedback</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700">
                      Professional networking opportunities with industry leaders
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default Help;
