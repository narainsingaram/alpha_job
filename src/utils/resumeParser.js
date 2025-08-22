import * as pdfjs from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const extractTextFromFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') || 
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or Word document.');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Error processing your file. Please try another file.');
  }
};

const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(' ') + '\n';
  }
  
  return text;
};

const extractTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const parseResume = (text) => {
  const sections = {
    name: '',
    email: '',
    phone: '',
    skills: [],
    experience: [],
    education: []
  };

  // Extract name (first line with more than 2 words is likely the name)
  const nameMatch = text.match(/^([^\n]+)/);
  if (nameMatch) {
    const potentialName = nameMatch[1].trim();
    if (potentialName.split(/\s+/).length >= 2) {
      sections.name = potentialName;
    }
  }

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    sections.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = text.match(/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
  if (phoneMatch) {
    sections.phone = phoneMatch[0];
  }

  // Extract skills section
  const skillsMatch = text.match(/(?:skills|technical\s*skills|technologies)[:;\s]*([\s\S]*?)(?=\n\n|$)/i);
  if (skillsMatch && skillsMatch[1]) {
    sections.skills = skillsMatch[1]
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  // Extract experience (simplified)
  const expMatch = text.match(/(?:experience|work\s*experience)[:;\s]*([\s\S]*?)(?=\n\n|$)/i);
  if (expMatch && expMatch[1]) {
    sections.experience = expMatch[1]
      .split('\n')
      .filter(line => line.trim().length > 0);
  }

  // Extract education (simplified)
  const eduMatch = text.match(/(?:education|academic\s*background)[:;\s]*([\s\S]*?)(?=\n\n|$)/i);
  if (eduMatch && eduMatch[1]) {
    sections.education = eduMatch[1]
      .split('\n')
      .filter(line => line.trim().length > 0);
  }

  return sections;
};
