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
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { extractTextFromFile, parseResume } from '../utils/resumeParser';

// Avatar component for the interviewer
const InterviewerAvatar = ({ isSpeaking, isListening, isThinking }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (isSpeaking) {
      const sequence = async () => {
        while (isSpeaking) {
          await controls.start({
            y: [0, -5, 0],
            transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
          });
        }
      };
      sequence();
    } else {
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [isSpeaking, controls]);

  return (
    <div className="flex flex-col items-center mb-6">
      <motion.div 
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden shadow-lg border-4 border-white"
        animate={controls}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-16 h-16">
            {/* Eyes */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-center -mt-4">
              <div className="flex space-x-4">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Mouth */}
            <motion.div 
              className={`absolute bottom-0 left-1/2 w-6 h-3 -ml-3 rounded-b-full ${
                isSpeaking ? 'bg-red-400' : 'bg-gray-600'
              }`}
              animate={isSpeaking ? {
                height: [3, 6, 3],
                width: [24, 28, 24],
                transition: { duration: 0.3, repeat: Infinity }
              } : {}}
            />
          </div>
        </div>
        
        {/* Thinking animation */}
        {isThinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    },
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Listening indicator */}
        {isListening && (
          <div className="absolute -bottom-2 -right-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
              <div className="relative w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <UilMicrophone size={14} className="text-white" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="mt-4 text-center">
        <p className="font-medium text-gray-700">AI Interviewer</p>
        <div className="flex items-center justify-center space-x-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${
            isSpeaking ? 'bg-green-500' : isListening ? 'bg-blue-500' : 'bg-gray-400'
          }`}></div>
          <p className="text-xs text-gray-500">
            {isSpeaking ? 'Speaking' : isListening ? 'Listening...' : 'Ready'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

const MockInterview = () => {
  // State for interview flow
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  
  // State for resume upload
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  // Refs
  const chatEndRef = useRef(null);
  const synth = window.speechSynthesis;
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    setResumeFile(file);

    try {
      // Extract text from the uploaded file
      const text = await extractTextFromFile(file);
      
      // Parse the extracted text to get structured resume data
      const parsedResume = parseResume(text);
      
      // Format the parsed data for the AI prompt
      const formattedResume = `
        Name: ${parsedResume.name || 'Not specified'}
        Email: ${parsedResume.email || 'Not specified'}
        Phone: ${parsedResume.phone || 'Not specified'}
        
        Skills: ${parsedResume.skills.join(', ') || 'No skills listed'}
        
        Experience:
        ${parsedResume.experience.length > 0 ? parsedResume.experience.join('\n') : 'No experience listed'}
        
        Education:
        ${parsedResume.education.length > 0 ? parsedResume.education.join('\n') : 'No education listed'}
      `;
      
      setResumeText(formattedResume);
      setUploadSuccess('Resume uploaded and processed successfully!');
      document.getElementById('linkedin-url')?.focus();
    } catch (error) {
      console.error('Error processing resume:', error);
      setUploadError('Error processing file. Please make sure it is a valid PDF or DOCX file.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove uploaded resume
  const removeResume = () => {
    setResumeFile(null);
    setResumeText('');
    setUploadError('');
    setUploadSuccess('Resume removed');
    setTimeout(() => setUploadSuccess(''), 3000);
  };
  
  // Handle LinkedIn URL submission
  const handleLinkedInSubmit = (e) => {
    e.preventDefault();
    if (linkedinUrl) {
      setUploadSuccess('LinkedIn profile saved!');
      setTimeout(() => setUploadSuccess(''), 3000);
    }
  };
  
  // Start the interview
  const startInterview = async () => {
    if (isStarting || isLoading) return;
    
    if (!resumeText || !resumeFile) {
      setUploadError('Please upload your resume before starting the interview.');
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setIsStarting(true);
    setInterviewStarted(true);
    setIsLoading(true);
    
    // Clear any previous chat history
    setChatHistory([]);
    
    // Stop any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Initialize AI model
    const MODEL_NAME = "gemini-2.5-pro";
    const API_KEY = "YOUR_GOOGLE_AI_API_KEY"; // Replace with your actual API key
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    try {
      // Generate initial greeting based on resume
      const prompt = `You are an AI interviewer for the ${jobTitle} position. 
        Here's the candidate's resume information:
        ${resumeText}
        
        Start the interview with a friendly greeting and ask the first question.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Add AI's greeting to chat
      setChatHistory([
        { role: 'assistant', content: text }
      ]);
      
      // Speak the greeting
      speakText(text);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      setUploadError('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
      setIsStarting(false);
    }
  };
  
  // Speak text using Web Speech API
  const speakText = (text) => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.voice = synth.getVoices().find(voice => voice.name.includes('Google'));
    
    setIsSpeaking(true);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Start listening when done speaking
      if (recognition && !isListening) {
        recognition.start();
        setIsListening(true);
      }
    };
    
    synth.speak(utterance);
  };
  
  // Generate AI response
  const generateResponse = async (currentChatHistory) => {
    setIsThinking(true);
    
    try {
      const MODEL_NAME = "gemini-2.5-pro";
      const API_KEY = "YOUR_GOOGLE_AI_API_KEY"; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      // Prepare conversation history for the AI
      const conversation = [
        {
          role: 'user',
          parts: [{ text: `You are an AI interviewer for the ${jobTitle} position. 
            Here's the candidate's resume information:
            ${resumeText}
            
            Continue the interview based on the following conversation:` }]
        },
        ...currentChatHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ];
      
      const result = await model.generateContent({
        contents: conversation,
      });
      
      const response = await result.response;
      const text = response.text();
      
      // Update chat history with AI's response
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: text }
      ]);
      
      // Speak the response
      speakText(text);
      
    } catch (error) {
      console.error('Error generating response:', error);
      setUploadError('Error generating response. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };
  
  // Handle speech recognition result
  const handleRecognitionResult = useCallback((event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    
    setUserTranscript(transcript);
    
    // If the result is final, add it to the chat
    if (event.results[0].isFinal) {
      const userMessage = { role: 'user', content: transcript };
      const newHistory = [...chatHistory, userMessage];
      
      setChatHistory(newHistory);
      setUserTranscript('');
      
      // Generate AI response
      setIsThinking(true);
      setTimeout(() => {
        generateResponse(newHistory);
      }, 800);
    }
  }, [chatHistory]);
  
  // Set up speech recognition
  useEffect(() => {
    if (!recognition) return;
    
    recognition.onresult = handleRecognitionResult;
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
    };
  }, [handleRecognitionResult]);
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setUserTranscript('');
    }
  };
  
  // Stop the interview
  const stopInterview = () => {
    if (recognition) recognition.stop();
    if (synth.speaking) synth.cancel();
    
    setInterviewStarted(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setUserTranscript('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Mock Interview</h1>
          <p className="text-lg text-gray-600">Practice your interview skills with our AI interviewer</p>
        </div>
        
        {!interviewStarted ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <div className="text-center mb-8">
              <InterviewerAvatar 
                isSpeaking={false} 
                isListening={false} 
                isThinking={false} 
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Prepare for Your Interview</h2>
              <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                Upload your resume and LinkedIn profile to get personalized interview questions based on your experience.
              </p>
            </div>
            
            {/* Resume Upload Section */}
            <div id="upload-section" className="w-full max-w-2xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Upload Your Resume</h3>
                <p className="text-sm text-gray-600 mb-4">We'll analyze your resume to create personalized interview questions.</p>
                
                {resumeFile ? (
                  <div className="w-full">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center">
                        <UilFileCheck className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                          <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeResume}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={isUploading}
                      >
                        <UilTimes className="h-5 w-5" />
                      </button>
                    </div>
                    {uploadSuccess && (
                      <p className="mt-2 text-sm text-green-600">{uploadSuccess}</p>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
                    <div className="flex flex-col items-center justify-center">
                      <UilFileUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF or DOCX (max 5MB)</p>
                    </div>
                    <input 
                      id="resume-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
                
                {isUploading && (
                  <div className="mt-4 flex items-center justify-center">
                    <UilSpinner className="animate-spin h-5 w-5 text-blue-500 mr-2" />
                    <p className="text-sm text-gray-600">Processing your resume...</p>
                  </div>
                )}
                
                {uploadError && (
                  <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
              </div>
            </div>
            
            {/* LinkedIn Profile Section */}
            <div className="w-full max-w-2xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Add Your LinkedIn Profile (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">Include your LinkedIn profile for more personalized questions.</p>
                
                <form onSubmit={handleLinkedInSubmit} className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UilLinkedin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="linkedin-url"
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
            
            {/* Job Title Section */}
            <div className="w-full max-w-2xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Job Title</h3>
                <p className="text-sm text-gray-600 mb-4">What position are you interviewing for?</p>
                
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Product Manager, etc."
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>
            
            {/* Start Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={startInterview}
                disabled={!resumeFile || isStarting}
                className={`flex items-center px-8 py-3 text-lg font-medium text-white rounded-lg ${
                  !resumeFile || isStarting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all'
                }`}
              >
                {isStarting ? (
                  <>
                    <UilSpinner className="animate-spin h-5 w-5 mr-2" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    Start Mock Interview
                    <UilArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Interview Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">AI Mock Interview</h2>
                  <p className="text-blue-100 text-sm">Position: {jobTitle}</p>
                </div>
                <button
                  onClick={stopInterview}
                  className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <UilStopCircle className="h-5 w-5 mr-1" />
                  End Interview
                </button>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
              <div className="flex justify-center mb-6">
                <InterviewerAvatar 
                  isSpeaking={isSpeaking} 
                  isListening={isListening} 
                  isThinking={isThinking} 
                />
              </div>
              
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Starting your interview...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-3/4 rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.role === 'assistant' ? (
                            <UilRobot className="h-4 w-4 mr-2 text-indigo-600" />
                          ) : (
                            <UilUser className="h-4 w-4 mr-2 text-blue-300" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'assistant' ? 'Interviewer' : 'You'}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {userTranscript && (
                    <div className="flex justify-end">
                      <div className="max-w-3/4 bg-blue-100 text-gray-800 rounded-2xl px-4 py-2 rounded-br-none">
                        <div className="flex items-center mb-1">
                          <UilUser className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="text-xs font-medium">You (typing...)</span>
                        </div>
                        <p>{userTranscript}</p>
                      </div>
                    </div>
                  )}
                  
                  {isThinking && (
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 w-fit">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <span className="ml-2 text-sm text-gray-500">Interviewer is thinking...</span>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-full mr-2 ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  } transition-colors`}
                  disabled={isSpeaking || isThinking}
                >
                  <UilMicrophone className="h-6 w-6" />
                </button>
                
                <div className="flex-grow bg-white border border-gray-300 rounded-lg overflow-hidden flex items-center">
                  <input
                    type="text"
                    placeholder={isListening ? 'Speak now...' : 'Type your response...'}
                    className="flex-grow px-4 py-2 focus:outline-none"
                    value={userTranscript}
                    onChange={(e) => setUserTranscript(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && userTranscript.trim()) {
                        const newHistory = [...chatHistory, { role: 'user', content: userTranscript }];
                        setChatHistory(newHistory);
                        setUserTranscript('');
                        setIsThinking(true);
                        
                        setTimeout(() => {
                          generateResponse(newHistory);
                        }, 800);
                      }
                    }}
                    disabled={isSpeaking || isThinking}
                  />
                  
                  <button
                    type="button"
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!userTranscript.trim() || isSpeaking || isThinking}
                    onClick={() => {
                      const newHistory = [...chatHistory, { role: 'user', content: userTranscript }];
                      setChatHistory(newHistory);
                      setUserTranscript('');
                      setIsThinking(true);
                      
                      setTimeout(() => {
                        generateResponse(newHistory);
                      }, 800);
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  {isListening 
                    ? 'Listening... Speak now' 
                    : isSpeaking 
                      ? 'Interviewer is speaking...' 
                      : isThinking 
                        ? 'Interviewer is thinking...' 
                        : 'Type your response or click the microphone to speak'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
