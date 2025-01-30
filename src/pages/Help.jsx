import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [adminMode, setAdminMode] = useState(false);

  // Function to toggle admin mode
  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  return (
    <div class="relative">
      <header class="absolute inset-x-0 top-0 z-10 w-full bg-white shadow-md">
        <div class="px-4 mx-auto sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 lg:h-20">
            <div class="flex-shrink-0">
              <Link to="/" class="flex">
                <span className="text-indigo-600 font-extrabold text-2xl">AlphaJob</span>
              </Link>
            </div>
            <div class="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">
              <Link to="/postings" class="text-base font-semibold text-black transition-all duration-200 hover:text-indigo-600">Postings</Link>
              <Link to="/student-login" class="text-base font-semibold text-black transition-all duration-200 hover:text-indigo-600">Student Login</Link>
              <Link to="/employer-login" class="text-base font-semibold text-black transition-all duration-200 hover:text-indigo-600">Employer Login</Link>
            </div>
          </div>
        </div>
      </header>

      <section class="bg-slate-100 overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[800px]">
          <div class="relative w-full overflow-hidden lg:order-1 h-96 lg:h-auto lg:w-5/12">
            <div class="absolute inset-0">
              <img class="object-cover w-full h-full scale-150" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/man-working-on-laptop.jpg" alt="" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
          <div class="relative flex items-center justify-center w-full lg:order-2 lg:w-7/12 bg-indigo-100">
            <div class="relative px-4 pt-24 pb-16 text-center sm:px-6 md:px-24 2xl:px-32 lg:py-24 lg:text-left">
              <h1 class="text-4xl font-bold text-black sm:text-6xl xl:text-8xl">
                Welcome to AlphaJob
              </h1>
              <p class="mt-8 text-xl text-black">Your one-stop solution for job postings and career opportunities.</p>
              <div class="mt-8 space-y-4">
                <Link to="/postings" class="inline-block px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700">Explore Job Postings</Link>
                <Link to="/student-login" class="inline-block px-6 py-3 text-lg font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-white hover:text-indigo-600">Student Login</Link>
                <Link to="/employer-login" class="inline-block px-6 py-3 text-lg font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-white hover:text-indigo-600">Employer Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gray-100 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center text-gray-900">Features</h2>
          <div class="mt-12 grid gap-8 lg:grid-cols-3">
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <h3 class="text-xl font-semibold text-gray-900">High School Job Matching</h3>
              <p class="mt-4 text-gray-600">Our advanced algorithms match high school students with the best job opportunities based on their skills and preferences.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <h3 class="text-xl font-semibold text-gray-900">Resume Analysis</h3>
              <p class="mt-4 text-gray-600">Get expert analysis of your resume to improve your chances of landing your dream job.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <h3 class="text-xl font-semibold text-gray-900">Expand Your Professional Network</h3>
              <p class="mt-4 text-gray-600">Connect with professionals in your industry and expand your professional network.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center text-gray-900">Testimonials</h2>
          <div class="mt-12 grid gap-8 lg:grid-cols-2">
            <div class="bg-gray-50 p-6 rounded-lg shadow-lg">
              <p class="text-gray-600">"AlphaJob helped me find my dream job in just a few weeks. The job matching feature is amazing!"</p>
              <p class="mt-4 text-gray-900 font-semibold">- Jacob Smith</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg shadow-lg">
              <p class="text-gray-600">"The resume advice I received from AlphaJob was invaluable. I highly recommend this platform."</p>
              <p class="mt-4 text-gray-900 font-semibold">- Nathan Patel</p>
            </div>
          </div>
        </div>
      </section>

      <footer class="bg-indigo-600 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <span class="text-white text-lg font-semibold">AlphaJob</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Help;