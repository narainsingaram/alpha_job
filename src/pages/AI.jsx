import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const InterviewPrepModal = ({ application, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const generateResponse = async () => {
    setLoading(true);

    const MODEL_NAME = "gemini-1.5-pro";
    const API_KEY = "AIzaSyBrFLwWvr-WPscoHu7O-shXHSIZnlP4FNs"; // Replace with your actual API key

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      { text: "As an AI developed specifically to assist students in preparing for job interviews, my primary function is to provide accurate and relevant interview preparation questions based on the job role you have applied for. Please select a job application to begin." },
      { text: `Job Title: ${application.postingDetail.title}\nJob Description: ${application.postingDetail.description}` },
      { text: userInput }
    ];

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      const generatedText = response.text()
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Wrap text between double asterisks with <strong> tags

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now(),
          role: 'user',
          time: getCurrentTime(),
          text: userInput,
        },
        {
          id: Date.now() + 1,
          role: 'bot',
          time: getCurrentTime(),
          text: generatedText.replace(/\n/g, "<br>"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 bg-red-100 rounded-full font-bold hover:text-gray-700 w-8 h-8 text-9xl"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">
          Interview Preparation for {application.postingDetail.title}
        </h2>

        <div className="relative mb-4">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            type="text"
            className="p-4 w-full border-2 border-slate-200 rounded-full text-sm focus:border-blue-200"
            placeholder="Ask me anything..."
          />
          <div className="absolute top-1/2 end-2 -translate-y-1/2">
            <button
              onClick={generateResponse}
              type="button"
              className="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:text-gray-800 bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              disabled={loading}
            >
              <svg
                className="w-5 h-5 text-slate-600 hover:text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                />
              </svg>
            </button>
          </div>
        </div>

        {loading && (
          <div className="max-w-sm animate-pulse mt-4">
            <div role="status" className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {chatHistory.length > 0 && (
          <div className="space-y-4 mt-4 overflow-y-auto max-h-[60vh]">
            {chatHistory.map((chatItem) => (
              <div
                key={chatItem.id}
                className={`chat-item ${chatItem.role === "bot" ? "chat-start" : "chat-end"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      width="30"
                      height="30"
                      className="bg-slate-100"
                      alt={chatItem.role === "bot" ? "Bot Avatar" : "User Avatar"}
                      src={
                        chatItem.role === "bot"
                          ? "https://img.freepik.com/premium-photo/3d-style-chat-bot-robot-ai-app-icon-isolated-color-background-generative-ai_159242-25913.jpg"
                          : "https://cdn1.iconfinder.com/data/icons/facely-metapeople-3d-avatar-set/512/17._Designer.png"
                      }
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {chatItem.role === "bot" ? "Kyle" : "User"}
                  <time className="text-xs opacity-50">{chatItem.time}</time>
                </div>
                <div
                  className="bg-slate-100 border border-gray-200 rounded-2xl p-3 space-y-2"
                  dangerouslySetInnerHTML={{ __html: chatItem.text }}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepModal;
