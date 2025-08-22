import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


export const extractTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ');
  }

  return text;
};

export const extractTextFromDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    // Fallback to file name if extraction fails
    return `[Document Content: ${file.name} - Could not extract full text]`;
  }
};

export const extractTextFromFile = async (file) => {
  const fileType = file.type;
  
  try {
    if (fileType === 'application/pdf') {
      return await extractTextFromPdf(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
              fileType === 'application/msword') {
      return await extractTextFromDocx(file);
    } else if (fileType === 'text/plain') {
      // Handle plain text files
      return await file.text();
    } else {
      console.warn(`Unsupported file type: ${fileType}. Attempting to extract as text.`);
      return await file.text().catch(() => 
        `[File: ${file.name} - Content could not be extracted]`
      );
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `[Content from ${file.name} could not be extracted. Error: ${error.message}]`;
  }
};
