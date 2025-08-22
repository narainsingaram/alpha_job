import mammoth from 'mammoth';

// Simple text extraction for PDF files (fallback)
const extractTextFromPdfFallback = async (file) => {
  // This is a simple fallback that extracts text from the file name
  // In a production environment, you'd want to use a proper PDF parsing library
  console.warn('Using fallback PDF text extraction - limited functionality');
  return `[PDF Content: ${file.name} - Full text extraction requires additional setup]`;
};

export const extractTextFromPdf = extractTextFromPdfFallback;

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
