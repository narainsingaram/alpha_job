import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ResumeAIAnalysis = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        text += pageText + " ";
      }

      return text.trim();
    } catch (error) {
      console.error("Error extracting text from PDF: ", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile.size > 5 * 1024 * 1024) {
      alert("File size exceeds the 5 MB limit. Please upload a smaller file.");
      return;
    }
    setFile(uploadedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const extractedText = await extractTextFromPDF(file);
      console.log("Extracted Text: ", extractedText);

      const apiKey = "AIzaSyBrFLwWvr-WPscoHu7O-shXHSIZnlP4FNs"; // Replace with your key or use .env
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(
        `Analyze this resume/cover letter and provide specific feedback to improve it: ${extractedText}`
      );

      console.log("API Response: ", result);
      setFeedback(result.response.text);
    } catch (error) {
      console.error("Error analyzing resume: ", error);
      setFeedback("An error occurred while processing your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Resume AI Analysis</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="fileInput">Upload your Resume or Cover Letter (PDF only): </label>
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {feedback && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h2>Feedback</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeAIAnalysis;
