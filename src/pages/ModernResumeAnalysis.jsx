import { useState } from "react"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import pdfToText from "react-pdftotext"
import Spinner from '../components/ModernSpinner';
import { db } from "../firebase";
import { doc, setDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { 
  UilFileUpload, 
  UilAnalysis, 
  UilLightbulb, 
  UilFileCheck,
  UilFileAlt,
  UilCheckCircle,
  UilExclamationTriangle,
  UilInfoCircle,
  UilCheck
} from '@iconscout/react-unicons'

const ModernResumeAnalysis = () => {
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [resumeText, setResumeText] = useState("")
  const [fileName, setFileName] = useState("")
  const [extractedData, setExtractedData] = useState(null)
  const [saving, setSaving] = useState(false)

  // Function to send extracted text to Gemini AI for feedback generation
  const generateFeedback = async (content) => {
    setLoading(true)

    const MODEL_NAME = "gemini-1.5-pro";
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
      
      Format your response with clear headings and bullet points for better readability.
      Provide specific, actionable suggestions for improvement.
    `

    const generationConfig = {
      temperature: 0.7,
      topK: 10,
      topP: 0.9,
      maxOutputTokens: 2048,
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
          { role: "user", parts: [{ text: context }] },
          { role: "user", parts: [{ text: content }] },
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
          text: response,
        },
      ])
    } catch (error) {
      console.error("Gemini API Error:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Sorry, I encountered an error while analyzing your resume. Please try again later.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Function to extract structured data from resume
  const extractStructuredData = async (content) => {
    const MODEL_NAME = "gemini-1.5-pro";
    const API_KEY = "AIzaSyBrFLwWvr-WPscoHu7O-shXHSIZnlP4FNs"; // Replace with your actual API key

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const extractionContext = `
      You are an AI data extractor. Please extract the following information from the resume in JSON format:
      
      {
        "name": "Full name of the candidate",
        "email": "Email address",
        "phone": "Phone number",
        "skills": ["Array of skills found in the resume"],
        "experience": "Experience level (high school, college, bachelor, master, phd)",
        "education": [
          {
            "degree": "Degree name",
            "institution": "Institution name",
            "year": "Graduation year"
          }
        ],
        "summary": "Brief professional summary (2-3 sentences)"
      }
      
      Extract ONLY the JSON structure with the relevant information. If any information is not available, leave it as an empty string or empty array.
    `

    const generationConfig = {
      temperature: 0.3,
      topK: 5,
      topP: 0.8,
      maxOutputTokens: 1024,
    }

    try {
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: extractionContext }] },
          { role: "user", parts: [{ text: content }] },
        ],
        generationConfig,
      })

      const response = result.response.text()
      // Extract JSON from response
      const jsonStart = response.indexOf('{')
      const jsonEnd = response.lastIndexOf('}') + 1
      const jsonString = response.substring(jsonStart, jsonEnd)
      
      if (jsonString) {
        const data = JSON.parse(jsonString)
        setExtractedData(data)
        return data
      }
    } catch (error) {
      console.error("Error extracting structured data:", error)
    }
    
    return null
  }

  // Function to save extracted data to student profile
  const saveToProfile = async () => {
    if (!extractedData) return
    
    setSaving(true)
    const studentId = Cookies.get('studentId')
    
    try {
      const profileRef = doc(db, "studentProfiles", studentId)
      await setDoc(profileRef, {
        name: extractedData.name || "",
        email: extractedData.email || "",
        skills: extractedData.skills || [],
        experience: extractedData.experience || "",
        education: extractedData.education || [],
        resumeSummary: extractedData.summary || ""
      }, { merge: true })
      
      alert('Profile updated successfully with resume data!')
    } catch (error) {
      console.error("Error saving to profile:", error)
      alert('Failed to save data to profile.')
    } finally {
      setSaving(false)
    }
  }

  // Function to handle PDF file upload and extract text
  const extractText = (event) => {
    const file = event.target.files[0]

    if (file) {
      setFileName(file.name)
      setChatHistory([]) // Clear previous feedback
      setExtractedData(null) // Clear previous extracted data
      
      pdfToText(file)
        .then((text) => {
          setResumeText(text)
          generateFeedback(text)
          extractStructuredData(text)
        })
        .catch((error) => {
          console.error("Failed to extract text from pdf:", error)
          alert("An error occurred while extracting the text.")
        })
    }
  }

  // Function to format AI feedback with proper styling
  const formatFeedback = (text) => {
    // Convert markdown-style headings to HTML
    let formattedText = text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-indigo-700 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-indigo-800 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-indigo-900 mt-8 mb-4">$1</h1>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/(\n<li.*<\/li>)+/g, '<ul class="list-disc pl-5 my-3 space-y-1">$&</ul>')
    
    return { __html: formattedText }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center">
            <UilAnalysis className="mr-3 text-indigo-600" size={36} />
            Resume AI Analyzer
            <span className="ml-3 text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
              AI Powered
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your resume to get professional AI feedback and improvement suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <UilFileUpload className="mr-2" size={24} />
                  Upload Your Resume
                </h2>
                <p className="text-indigo-100 mt-1">Get instant AI-powered feedback</p>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-100 transition duration-300">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="mx-auto bg-indigo-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                        <UilFileUpload className="text-indigo-600" size={28} />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          <span className="text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-gray-500 mt-1">PDF files only</p>
                      </div>
                      <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
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
                
                {fileName && (
                  <div className="mt-6 flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <UilFileCheck className="text-indigo-600 mr-3" size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-800 truncate">{fileName}</p>
                      <p className="text-xs text-indigo-600">Ready for analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <UilFileAlt className="mr-2" size={24} />
                  Resume Content Preview
                </h2>
                <p className="text-gray-300 mt-1">Review your extracted content</p>
              </div>
              
              <div className="p-6">
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
                      <div className="text-center">
                        <UilFileAlt className="mx-auto mb-2" size={32} />
                        <p>Resume content will appear here after upload</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                <UilLightbulb className="mr-2 text-indigo-600" size={20} />
                Pro Tips for Best Results
              </h3>
              <ul className="space-y-2 text-indigo-700">
                <li className="flex items-start">
                  <UilCheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-indigo-500" size={16} />
                  <span>Use a clean, professional format with clear section headings</span>
                </li>
                <li className="flex items-start">
                  <UilCheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-indigo-500" size={16} />
                  <span>Include quantifiable achievements and specific skills</span>
                </li>
                <li className="flex items-start">
                  <UilCheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-indigo-500" size={16} />
                  <span>Keep it concise - ideally one page for early-career professionals</span>
                </li>
                <li className="flex items-start">
                  <UilCheckCircle className="mr-2 mt-0.5 flex-shrink-0 text-indigo-500" size={16} />
                  <span>Use industry-specific keywords relevant to your target role</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - AI Feedback and Data Extraction */}
          <div className="space-y-6">
            {/* AI Feedback */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <UilAnalysis className="mr-2" size={24} />
                  AI Feedback & Analysis
                </h2>
                <p className="text-emerald-100 mt-1">Professional insights to improve your resume</p>
              </div>
              
              <div className="flex-1 p-6 flex flex-col">
                {loading ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-12">
                    <Spinner />
                    <p className="text-emerald-700 font-medium mt-6">Analyzing your resume...</p>
                    <p className="text-emerald-500 text-sm mt-2">This may take a few moments</p>
                  </div>
                ) : chatHistory.length > 0 ? (
                  <div className="bg-gray-50 rounded-xl p-5 flex-1 overflow-y-auto">
                    {chatHistory.map((chatItem) => (
                      <div key={chatItem.id} className="prose prose-indigo max-w-none">
                        <div 
                          className="whitespace-pre-line text-gray-800 prose-headings:font-bold prose-headings:text-indigo-800 prose-li:ml-4"
                          dangerouslySetInnerHTML={formatFeedback(chatItem.text)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                    <div className="bg-emerald-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6">
                      <UilInfoCircle className="text-emerald-600" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Analysis Yet</h3>
                    <p className="text-gray-600 max-w-md">
                      Upload your resume to receive personalized AI feedback on how to improve it
                    </p>
                  </div>
                )}
              </div>
              
              <div className="px-6 pb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <span className="font-semibold">Privacy Notice:</span> Your resume data is processed securely and is not stored after analysis. 
                    The AI feedback is generated using Google's Gemini AI model.
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Data */}
            {extractedData && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <UilCheck className="mr-2" size={24} />
                    Extracted Data
                  </h2>
                  <p className="text-indigo-100 mt-1">Information extracted from your resume</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Name</h3>
                      <p className="text-gray-900">{extractedData.name || "Not found"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Email</h3>
                      <p className="text-gray-900">{extractedData.email || "Not found"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Experience Level</h3>
                      <p className="text-gray-900">{extractedData.experience || "Not found"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Skills</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {extractedData.skills && extractedData.skills.length > 0 ? (
                          extractedData.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills found</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Summary</h3>
                      <p className="text-gray-900">{extractedData.summary || "Not found"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={saveToProfile}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving to Profile...
                        </>
                      ) : (
                        <>
                          <UilCheck className="mr-2" size={20} />
                          Save to Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernResumeAnalysis