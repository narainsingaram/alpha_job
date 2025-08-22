import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  UilMicrophone, 
  UilPlay, 
  UilStopCircle, 
  UilUser, 
  UilRobot, 
  UilSpinner, 
  UilArrowRight,
  UilFileUpload,
  UilLinkedin,
  UilFileCheck,
  UilTimes
} from '@iconscout/react-unicons';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromFile } from '../utils/fileUtils';

// --- Browser Voice APIs ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
}
const synth = window.speechSynthesis;

const MockInterview = () => {
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [jobDescription, setJobDescription] = useState('Seeking a skilled software engineer with experience in React, Node.js, and cloud technologies. The ideal candidate will be a great communicator and a team player.');
  const [resumeText, setResumeText] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  const systemPrompt = `
You are an expert AI interviewer embodying the role of a Senior Engineering Manager at Google. Your goal is to conduct a professional, in-depth technical and behavioral interview for the position of ${jobTitle}.

**Your Persona:**
- You are professional, encouraging, yet challenging.
- You work for Google.
- Do NOT reveal you are an AI.

**Interview Structure:**
1. Start with a brief, friendly greeting.
2. Ask one question at a time.
3. Begin with a behavioral question like "Tell me about yourself" or "Walk me through your resume."
4. Listen to the user's answer and ask relevant, insightful follow-up questions.
5. Alternate between behavioral questions (e.g., "Tell me about a time you faced a challenge") and technical questions related to the following job description:
    - Job Title: ${jobTitle}
    - Description: ${jobDescription}
6. Keep your responses concise and focused on the interview.

**Additional Context:**
${resumeText ? 'Resume Summary: ' + resumeText.substring(0, 1000) + (resumeText.length > 1000 ? '...' : '') : ''}
${linkedinUrl ? 'LinkedIn Profile: ' + linkedinUrl : ''}
`;

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userTranscript, setUserTranscript] = useState("");
  const [voices, setVoices] = useState([]);

  const chatEndRef = useRef(null);

  // --- Voice Selection and Synthesis ---
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      } 
    };

    // Voices load asynchronously
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, []);

  const findBestVoice = () => {
    // Find the best available US English voice
    const googleVoice = voices.find(v => v.name === 'Google US English' && v.lang === 'en-US');
    const premiumVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')); // Broader search for Google voices
    const defaultVoice = voices.find(v => v.lang === 'en-US' && v.default);

    return googleVoice || premiumVoice || defaultVoice || voices.find(v => v.lang === 'en-US');
  };

  const speak = (text) => {
    if (synth.speaking) {
      console.error('Already speaking.');
      return;
    }
    const utterThis = new SpeechSynthesisUtterance(text);
    const bestVoice = findBestVoice();

    if (bestVoice) {
      utterThis.voice = bestVoice;
    }

    utterThis.onstart = () => setIsSpeaking(true);
    utterThis.onend = () => {
      setIsSpeaking(false);
    };
    synth.speak(utterThis);
  };

  // --- Speech Recognition ---
  useEffect(() => {
    if (!recognition) {
      alert("Your browser does not support Speech Recognition. Please try Chrome or Safari.");
      return;
    }

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setUserTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };
  }, []);

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      if (userTranscript) {
        const newHistory = [...chatHistory, { role: 'user', text: userTranscript }];
        setChatHistory(newHistory);
        generateResponse(newHistory);
        setUserTranscript("");
      }
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // --- AI Generation ---
  const generateResponse = async (currentChatHistory) => {
    setIsLoading(true);
    const MODEL_NAME = "gemini-2.5-pro";
    const API_KEY = "AIzaSyAUfXq5yGSzpaYQaIDou3nO1OoLeSP9P1I"; // IMPORTANT: Replace with your actual API key

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const apiHistory = currentChatHistory.map(chat => ({
      role: chat.role === 'ai' ? 'model' : 'user',
      parts: [{ text: chat.text }]
    }));

    try {
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          ...apiHistory
        ],
      });

      const responseText = result.response.text();
      setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);
      speak(responseText);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = "Sorry, I encountered an error. Let's try that again.";
      setChatHistory(prev => [...prev, { role: 'ai', text: errorMessage }]);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setUploadSuccess('Resume uploaded successfully!');
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError(error.message || 'Failed to process the file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeResume = () => {
    setResumeText('');
    setUploadSuccess('Resume removed');
    setTimeout(() => setUploadSuccess(''), 3000);
  };

  const handleLinkedInSubmit = (e) => {
    e.preventDefault();
    if (linkedinUrl) {
      setUploadSuccess('LinkedIn profile saved!');
      setTimeout(() => setUploadSuccess(''), 3000);
    }
  };

  const startInterview = async () => {
    if (!resumeText) {
      setUploadError('Please upload your resume before starting the interview.');
      return;
    }
    
    setInterviewStarted(true);
    setIsLoading(true);
    
    const MODEL_NAME = "gemini-2.5-pro";
    const API_KEY = "AIzaSyAUfXq5yGSzpaYQaIDou3nO1OoLeSP9P1I"; // IMPORTANT: Replace with your actual API key
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      });
      const firstMessage = result.response.text();
      setChatHistory([{ role: 'ai', text: firstMessage }]);
      speak(firstMessage);
    } catch (error) {
      console.error("Error starting interview:", error);
      const errorMessage = "Sorry, I couldn't start the interview. Please check the console for errors.";
      setChatHistory([{ role: 'ai', text: errorMessage }]);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, userTranscript]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const pulse = {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div>
            <h1 className="text-2xl font-bold">AI Mock Interview</h1>
            <p className="text-blue-100">Practice with a Google Senior Engineering Manager</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {!interviewStarted ? (
              <button
                onClick={startInterview}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all font-medium shadow-lg"
              >
                <UilPlay size="18" />
                <span>Start Interview</span>
                <UilArrowRight size="16" />
              </button>
            ) : (
              <div className="flex items-center space-x-3 bg-white/20 px-4 py-2 rounded-xl">
                <div className={`h-3 w-3 rounded-full ${isListening ? 'bg-green-400' : 'bg-yellow-400'} ${isListening ? 'animate-pulse' : ''}`}></div>
                <span className="text-blue-100 font-medium">
                  {isListening ? 'Listening...' : 'Paused'}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <AnimatePresence>
            {chatHistory.length === 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="h-full flex flex-col items-center justify-center text-center p-6 w-full max-w-3xl mx-auto"
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
                  animate={pulse}
                >
                  <UilMicrophone size={40} className="text-blue-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Prepare for Your Interview</h3>
                <p className="text-gray-500 mb-8 max-w-2xl">Upload your resume and LinkedIn profile to get personalized interview questions based on your experience.</p>
                
                {/* Resume Upload Section */}
                <div className="w-full max-w-2xl mb-6">
                  <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                    <div className="flex flex-col items-center">
                      <UilFileUpload size={48} className="text-blue-500 mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {resumeText ? 'Resume Uploaded' : 'Upload Your Resume'}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        {resumeText 
                          ? 'Your resume has been successfully processed.'
                          : 'Upload a PDF or Word document (max 5MB)'}
                      </p>
                      
                      {resumeText ? (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                          <UilFileCheck size={20} />
                          <span>Resume Ready</span>
                          <button 
                            onClick={removeResume}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove resume"
                          >
                            <UilTimes size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                          <UilFileUpload size={16} />
                          <span>Choose File</span>
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* LinkedIn Profile */}
                <div className="w-full max-w-2xl mb-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <div className="flex flex-col items-center">
                      <UilLinkedin size={48} className="text-[#0077b5] mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Add Your LinkedIn Profile (Optional)
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Share your LinkedIn profile for more personalized questions
                      </p>
                      
                      <form onSubmit={handleLinkedInSubmit} className="w-full max-w-md">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://linkedin.com/in/your-profile"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                            disabled={!linkedinUrl}
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                {/* Start Interview Button */}
                <motion.button
                  onClick={startInterview}
                  disabled={!resumeText || isUploading}
                  className={`px-8 py-3 rounded-xl font-medium text-white shadow-lg transition-all ${
                    resumeText && !isUploading
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  whileHover={resumeText && !isUploading ? { scale: 1.02 } : {}}
                  whileTap={resumeText && !isUploading ? { scale: 0.98 } : {}}
                >
                  {isUploading ? 'Processing...' : 'Start Mock Interview'}
                </motion.button>
                
                {/* Upload Status */}
                {(uploadError || uploadSuccess) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
                      uploadError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {uploadError || uploadSuccess}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={index}
                      initial="hidden"
                      animate="visible"
                      variants={message.role === 'user' ? fadeIn : slideIn}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex max-w-4xl">
                        {message.role === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mr-3 self-end mb-1">
                            <UilRobot size={16} className="text-white" />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-5 py-3 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none shadow-md'
                              : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                          }`}
                        >
                          {message.text}
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-3 self-end mb-1">
                            <UilUser size={16} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 p-4 bg-white rounded-xl border border-gray-100 w-32 mx-auto shadow-sm"
                  >
                    <UilSpinner className="animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-gray-200 bg-gray-100 rounded-b-2xl">
          {!interviewStarted ? (
            <button
              onClick={startInterview}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:-translate-y-0.5"
            >
              <UilPlay />
              Start Interview
            </button>
          ) : (
            <button
              onClick={handleListen}
              disabled={isSpeaking || isLoading}
              className={`w-full flex items-center justify-center gap-3 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 transform hover:-translate-y-0.5 ${isListening ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300 hover:shadow-red-400/50' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300 hover:shadow-indigo-400/50'} disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none`}
            >
              {isListening ? (
                <>
                  <UilStopCircle size="28" />
                  <span className="text-lg">Stop & Send Answer</span>
                </>
              ) : (
                <>
                  <UilMicrophone size="28" />
                  <span className="text-lg">Record Answer</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MockInterview;
