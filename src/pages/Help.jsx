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

      <section class="bg-indigo-100 overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[800px]">
          <div class="relative flex items-center justify-center w-full lg:order-2 lg:w-7/12">
            <div class="absolute bottom-0 right-0 hidden lg:block">
              <img class="object-contain w-auto h-48" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/curved-lines.png" alt="" />
            </div>
            <div class="relative px-4 pt-24 pb-16 text-center sm:px-6 md:px-24 2xl:px-32 lg:py-24 lg:text-left">
              <h1 class="text-4xl font-bold text-black sm:text-6xl xl:text-8xl">
                Get it done.<br />
                Fast, Easy.
              </h1>
              <p class="mt-8 text-xl text-black">We help you to make your remote work life easier. Build a distruction free working experience.</p>
              <button type="submit" class="inline-flex items-center justify-center w-full px-4 py-4 mt-4 font-semibold text-white transition-all duration-200 bg-indigo-500 border border-transparent rounded-full sm:w-auto sm:ml-4 sm:mt-0 hover:bg-orange-600 focus:bg-orange-600">
                Try 14 days free
              </button>
              <p class="mt-5 text-base text-black">Instant access . No credit card required</p>
            </div>
            <div class="absolute right-0 z-10 -bottom-16 lg:top-24 lg:-left-20">
              <img class="w-32 h-32 md:w-40 md:h-40" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/circular-text.png" alt="" />
            </div>
          </div>
          <div class="relative w-full overflow-hidden lg:order-1 h-96 lg:h-auto lg:w-5/12">
            <div class="absolute inset-0">
              <img class="object-cover w-full h-full scale-150" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/man-working-on-laptop.jpg" alt="" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div class="absolute bottom-0 left-0">
              <div class="p-4 sm:p-6 lg:p-8">
                <div class="flex items-center">
                  <svg class="w-10 h-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                  </svg>
                  <h2 class="font-bold text-white text-7xl ml-2.5">395</h2>
                </div>
                <p class="max-w-xs mt-1.5 text-xl text-white">Professionals have organized their desk via PostCra</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
