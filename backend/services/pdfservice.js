import pdfParse from 'pdf-parse';
import fs from 'fs';

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};

export const extractTextFromFile = async (filePath, fileType) => {
  try {
    if (fileType === 'pdf' || filePath.endsWith('.pdf')) {
      return await extractTextFromPDF(filePath);
    } else {
      // For text files
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw error;
  }
};
