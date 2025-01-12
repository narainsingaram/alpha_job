import React from 'react';
import { useState } from 'react';

const Help = () => {
  const [adminMode, setAdminMode] = useState(false);

  // Function to toggle admin mode
  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  return (
    <div className="container mx-auto py-8 ">
    <h1 className="text-3xl font-bold mb-4 !ml-8">AlphaJob - School Job Management System  <span className="text-blue-500">(Info)</span></h1>
      <div className="bg-slate-100 rounded-2xl m-4 p-6">
        <h2 className="text-xl font-bold mb-4">Description</h2>

        <div className="mb-4">
          <p>Upon launching the application, you'll see a dashboard displaying all your business and community partners. The system is pre-loaded with at least 25 partners to get you started.</p>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div className="bg-slate-100 rounded-2xl  hover:shadow-lg transition-shadow duration-300 p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Dashboard</h3>
    <p className="text-gray-600">
      Get a comprehensive overview of all your business partners. View key metrics, recent activities, and quick access to partner information.
    </p>
    <a href="/" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Explore Dashboard</a>
  </div>

  <div className="bg-slate-100 rounded-2xl  hover:shadow-lg transition-shadow duration-300 p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Graphs</h3>
    <p className="text-gray-600">
      Visualize your partner data with interactive charts and graphs. Analyze trends, compare sectors, and gain valuable insights.
    </p>
    <a href="graph" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">View Graphs</a>
  </div>

  <div className="bg-slate-100 rounded-2xl  hover:shadow-lg transition-shadow duration-300 p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Map</h3>
    <p className="text-gray-600">
      Explore the geographical distribution of your partners. Identify regional clusters and potential areas for expansion.
    </p>
    <a href="/map" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Open Map</a>
  </div>

  <div className="bg-slate-100 rounded-2xl  hover:shadow-lg transition-shadow duration-300 p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Q&A AI Chatbot</h3>
    <p className="text-gray-600">
      Get instant answers to your questions about partners or the system. Our AI-powered chatbot is here to assist you 24/7.
    </p>
    <a href="/ai" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Chat Now</a>
  </div>

  <div className="bg-slate-100 rounded-2xl  hover:shadow-lg transition-shadow duration-300 p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">Instructions/Guide</h3>
    <p className="text-gray-600">
      New to the system? Check out our comprehensive guide to learn how to make the most of all features and functionalities.
    </p>
    <a href="#" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Read Guide (this page)</a>
  </div>
</div>

    </div>
  );
};

export default Help;
