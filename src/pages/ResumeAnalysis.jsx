"use client"

import { useState } from "react"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import pdfToText from "react-pdftotext"

function PDFParserReact() {
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [resumeText, setResumeText] = useState("")

  // Function to send extracted text to Gemini AI for feedback generation
  const generateFeedback = async (content) => {
    setLoading(true)

    const MODEL_NAME = "gemini-1.5-pro"; //  <---- CHECK GOOGLE DOCS FOR CORRECT NAME
    const API_KEY = "AIzaSyBrFLwWvr-WPscoHu7O-shXHSIZnlP4FNs"; // Replace with your actual API key

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    // Define input context for the AI (e.g., resume analysis instructions)
    const context = `
      You are an AI resume reviewer. Please analyze the following resume and provide feedback. Focus on the following aspects:
      1. Structure and readability
      2. Key skills and qualifications
      3. Relevance and clarity of work experience
      4. Overall presentation and professionalism
      5. Any areas for improvement or potential omissions

      **DO NOT INCLUDE ORIGINAL RESUME IN YOUR RESPONSE**
    `

    const generationConfig = {
      temperature: 0.7,
      topK: 10,
      topP: 0.9,
      maxOutputTokens: 1024,
    }

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ]

    try {
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: context }] }, // Use 'user' role for context
          { role: "user", parts: [{ text: content }] }, // User's resume content
        ],
        generationConfig,
        safetySettings,
      })

      const response = result.response.text()

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now() + 1,
          role: "bot",
          text: response, // Only save and display the AI feedback
        },
      ])
    } catch (error) {
        console.error("Gemini API Error:", error); // Log the full error
    } finally {
      setLoading(false)
    }
  }

  // Function to handle PDF file upload and extract text
  const extractText = (event) => {
    const file = event.target.files[0]

    if (file) {
      pdfToText(file)
        .then((text) => {
          setResumeText(text) // Set extracted text as preview
          generateFeedback(text) // Send the extracted text to AI for feedback
        })
        .catch((error) => {
          console.error("Failed to extract text from pdf:", error)
          alert("An error occurred while extracting the text.")
        })
    }
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Resume AI Analyzer
              <span className="ml-3 text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">
                AI Powered
              </span>
            </h1>
            <p className="mt-2 text-gray-600">
              Upload your resume to get professional AI feedback and improvement suggestions
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Upload and Preview */}
            <div className="lg:w-1/2 space-y-6">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-100 transition duration-300">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF files only</p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={extractText}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Resume Content Preview</h2>
                <div className="relative">
                  <textarea
                    value={resumeText}
                    readOnly
                    rows={12}
                    className="w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-4 font-mono"
                    style={{ resize: "none" }}
                  />
                  {!resumeText && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                      <p>Resume content will appear here after upload</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <p className="text-indigo-700 text-sm">
                  <span className="font-semibold">Pro tip:</span> Make sure your resume is in PDF format and contains
                  your most up-to-date information for the best analysis.
                </p>
              </div>
            </div>

            {/* Right Column - AI Feedback */}
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 h-full">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AI Feedback
                </h2>... {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-700 font-medium">Analyzing your resume...</p>
                    <p className="text-indigo-500 text-sm mt-2">This may take a few moments</p>
                  </div>
                ) : chatHistory.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-5 max-h-[500px] overflow-y-auto">
                    {chatHistory.map((chatItem) => (
                      <div key={chatItem.id} className="prose prose-indigo max-w-none">
                        <div className="whitespace-pre-line text-gray-800">{chatItem.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/50 rounded-lg border border-indigo-100 p-6 flex flex-col items-center justify-center h-[400px] text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-indigo-200 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-indigo-900 mb-2">No Feedback Yet</h3>
                    <p className="text-indigo-600 text-sm max-w-xs">
                      Upload your resume to receive personalized AI feedback on how to improve it
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Your resume data is processed securely and is not stored after analysis. The AI feedback is generated using
            Google's Gemini AI model.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PDFParserReact
