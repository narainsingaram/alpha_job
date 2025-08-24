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
  UilTimes,
  UilCheckCircle,
  UilExclamationTriangle
} from '@iconscout/react-unicons';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { extractTextFromFile } from '../utils/fileUtils';
import officeBackground from '../asset/random_images/istockphoto-1435220822-612x612.jpg';

// Avatar component for the interviewer
const InterviewerAvatar = ({ isSpeaking, isListening, isThinking, mood }) => {
  const controls = useAnimation();
  const eyeControls = useAnimation();

  useEffect(() => {
    if (isSpeaking) {
      controls.start({
        y: [0, -5, 0],
        transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
      });
    } else {
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [isSpeaking, controls]);

  useEffect(() => {
    const blink = async () => {
      while (true) {
        await eyeControls.start({ scaleY: 0.1, transition: { duration: 0.05 } });
        await eyeControls.start({ scaleY: 1, transition: { duration: 0.05 } });
        await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 2000));
      }
    };
    blink();
  }, [eyeControls]);

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
                <motion.div className="w-4 h-4 bg-blue-600 rounded-full" animate={eyeControls} />
                <motion.div className="w-4 h-4 bg-blue-600 rounded-full" animate={eyeControls} />
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
        <h3 className="font-semibold text-gray-800">Your Interviewer</h3>
        <p className="text-sm text-gray-500">Senior Hiring Manager</p>
      </div>
    </div>
  );
};

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
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  // Enhanced resume text extraction
  const extractResumeInfo = async (text) => {
    try {
      // Extract key information from resume
      const nameMatch = text.match(/^(.*?)\n/s) || [];
      const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [];
      const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) || [];
      const skillsMatch = text.match(/(?:skills|technical\s*skills|technologies)[:;\s]*([\s\S]*?)(?=\n\n|$)/i) || [];
      const expMatch = text.match(/(?:experience|work\s*experience)[:;\s]*([\s\S]*?)(?=\n\n|$)/i) || [];
      const eduMatch = text.match(/(?:education|academic\s*background)[:;\s]*([\s\S]*?)(?=\n\n|$)/i) || [];
      
      const resumeInfo = [];
      if (nameMatch[1]) resumeInfo.push(`Name: ${nameMatch[1].trim()}`);
      if (emailMatch[0]) resumeInfo.push(`Email: ${emailMatch[0]}`);
      if (phoneMatch[0]) resumeInfo.push(`Phone: ${phoneMatch[0]}`);
      if (skillsMatch[1]) resumeInfo.push(`Skills: ${skillsMatch[1].trim()}`);
      if (expMatch[1]) resumeInfo.push(`Experience: ${expMatch[1].trim()}`);
      if (eduMatch[1]) resumeInfo.push(`Education: ${eduMatch[1].trim()}`);
      
      return resumeInfo.length > 0 ? resumeInfo.join('\n') : text;
    } catch (error) {
      console.error('Error processing resume:', error);
      return text; // Fallback to original text if parsing fails
    }
  };
  
  const systemPrompt = `You are an expert AI interviewer conducting a mock interview for the position of ${jobTitle}. Your role is to be both professional and insightful, helping the candidate prepare for real interviews.

**Resume Context (USE THIS FOR PERSONALIZED QUESTIONS):**
${resumeText ? resumeText : 'No resume information provided'}

**LinkedIn Profile (ADDITIONAL CONTEXT):**
${linkedinUrl || 'No LinkedIn profile provided'}

**Interview Guidelines:**
1. Start by acknowledging something specific from their resume (e.g., "I see you worked at [Company] as a [Role]...")
2. Ask detailed follow-up questions about their experiences and skills
3. Reference specific technologies or projects from their resume
4. If they mention a challenge, ask how they overcame it
5. Provide constructive feedback after their responses
6. Keep questions relevant to the ${jobTitle} position
7. If they seem stuck, offer gentle guidance or rephrase the question

**Your Persona:**
- You are a Senior Engineering Manager at Google with 15+ years of experience
- You are knowledgeable about the candidate's background from their resume and LinkedIn
- You are professional, encouraging, and provide constructive feedback
- You can reference specific details from their resume/LinkedIn naturally in conversation
- You NEVER reveal you are an AI - you must maintain the persona of a human interviewer

**Interview Structure:**
1. Start with a warm, professional greeting and brief introduction
2. Begin with a behavioral question that references their experience, such as:
   - "I see you worked at [Company] as a [Role]. Can you tell me about a challenging project you worked on there?"
   - "Your resume mentions [specific skill/technology]. How did you apply this in your work at [Company]?"
   - "I noticed on your LinkedIn that you worked on [project/achievement]. Can you tell me more about that?"

3. Follow up with deep dive questions about their experiences and skills
4. Include 1-2 technical questions relevant to their background and the ${jobTitle} role
5. Conclude with their questions for you and provide brief, constructive feedback

**Candidate's Background (Use this to personalize questions):**
${resumeText ? `Resume Summary: ${resumeText}` : 'No resume provided'}
${linkedinUrl ? `LinkedIn Profile: ${linkedinUrl}` : 'No LinkedIn profile provided'}

**Job Details:**
- Title: ${jobTitle}
- Description: ${jobDescription}

**Key Points to Remember:**
1. Reference specific experiences from their resume/LinkedIn naturally
2. Ask follow-up questions that show you've reviewed their background
3. Provide a realistic interview experience with appropriate pauses and reactions
4. Keep responses concise - maximum 2-3 sentences unless providing feedback
5. If they mention a skill or technology, ask them to elaborate on their experience with it
6. If they mention a challenge or problem, ask how they overcame it
7. Provide brief, constructive feedback at the end about their responses and areas for improvement`;

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userTranscript, setUserTranscript] = useState("");
  const [voices, setVoices] = useState([]);
  const [interviewerMood, setInterviewerMood] = useState('neutral'); // 'neutral', 'happy', 'thinking', 'listening'

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
      synth.cancel();
    }
    
    const utterThis = new SpeechSynthesisUtterance(text);
    const bestVoice = findBestVoice();

    if (bestVoice) {
      utterThis.voice = bestVoice;
    }

    // Add slight pitch and rate variations for more natural speech
    utterThis.pitch = 1 + (Math.random() * 0.2 - 0.1); // Slight pitch variation
    utterThis.rate = 0.95 + (Math.random() * 0.1); // Slight rate variation

    utterThis.onstart = () => {
      setIsSpeaking(true);
      setInterviewerMood('talking');
    };
    
    utterThis.onend = () => {
      setIsSpeaking(false);
      setInterviewerMood('listening');
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

  const [isTyping, setIsTyping] = useState(false);

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setInterviewerMood('thinking');
      
      if (userTranscript) {
        const newHistory = [...chatHistory, { role: 'user', text: userTranscript, timestamp: new Date() }];
        setChatHistory(newHistory);
        setIsThinking(true);
        
        // Small delay to show thinking animation
        setTimeout(() => {
          generateResponse(newHistory);
          setIsThinking(false);
        }, 800);
        
        setUserTranscript("");
      } else {
        setInterviewerMood('neutral');
      }
    } else {
      recognition.start();
      setIsListening(true);
      setInterviewerMood('listening');
    }
  };

  // --- AI Generation ---
  const generateResponse = async (currentChatHistory) => {
    setIsLoading(true);
    setIsTyping(true);
    setInterviewerMood('thinking');
    
    const MODEL_NAME = "gemini-2.5-pro";
    const API_KEY = "AIzaSyAUfXq5yGSzpaYQaIDou3nO1OoLeSP9P1I";

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
      
      // Update mood based on response content
      const positiveWords = ['great', 'excellent', 'impressive', 'wonderful', 'perfect'];
      const isPositive = positiveWords.some(word => responseText.toLowerCase().includes(word));
      
      setInterviewerMood(isPositive ? 'happy' : 'neutral');
      
      // Add typing effect for AI response
      const words = responseText.split(' ');
      let currentText = '';
      
      setChatHistory(prev => [...prev, { role: 'ai', text: '', timestamp: new Date() }]);

      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = currentText + '...';
          return newHistory;
        });
        await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 20));
      }
      
      // Remove the trailing '...' when done
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = currentText;
        return newHistory;
      });
      
      // Start speaking after a short delay
      setTimeout(() => speak(responseText), 200);
      
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = "I apologize, but I'm having trouble generating a response. Could you please rephrase your question?";
      setChatHistory(prev => [...prev, { role: 'ai', text: errorMessage, timestamp: new Date() }]);
      speak(errorMessage);
      setInterviewerMood('neutral');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    setResumeFile(file);

    try {
      // Extract raw text first
      let text = await extractTextFromFile(file);
      
      // Process the text to extract structured information
      const processedText = await extractResumeInfo(text);
      
      // Store both raw and processed text
      setResumeText(processedText);
      setUploadSuccess('Resume uploaded and processed successfully!');
      
      // Log the extracted information for debugging
      console.log('Extracted resume info:', processedText);
      
      // Auto-focus the LinkedIn field for better UX
      document.getElementById('linkedin-url')?.focus();
      
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError('Error processing file. Please make sure it is a valid PDF or DOCX file.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
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
    <div 
      className="font-sans bg-cover bg-center flex items-center justify-center min-h-screen p-4"
      style={{ backgroundImage: `url(${officeBackground})` }}
    >
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
                <div className="w-full max-w-2xl mb-6">
                  <InterviewerAvatar 
                    isSpeaking={isSpeaking} 
                    isListening={isListening}
                    isThinking={isThinking}
                    mood={interviewerMood}
                  />
                </div>
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
                          <div className="text-xs text-gray-400 mt-1 text-right">{message.timestamp.toLocaleTimeString()}</div>
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

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 p-4 bg-white rounded-xl border border-gray-100 w-32 shadow-sm"
                  >
                    <UilSpinner className="animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">Typing...</span>
                  </motion.div>
                )}

                {isLoading && !isTyping && (
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
