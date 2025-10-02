import fs from 'fs';
import path from 'path';
import { parseDocxQuestions } from './docx-parser';

// This is a test script to verify the DOCX parsing functionality
// You can run it with: npx ts-node src/lib/test-docx-parser.ts <path-to-docx-file>

async function testDocxParser() {
  // Get file path from command line arguments or use a default
  const filePath = process.argv[2] || path.join(process.cwd(), 'public', 'uploads', 'mock-tests', 'sample.docx');
  
  console.log(`Testing DOCX parser with file: ${filePath}`);
  
  try {
    // Read the file
    const buffer = fs.readFileSync(filePath);
    console.log(`File size: ${buffer.length} bytes`);
    
    // Parse the questions
    const questions = await parseDocxQuestions(buffer);
    
    // Display results
    console.log(`\nExtracted ${questions.length} questions:`);
    
    questions.forEach(q => {
      console.log(`\n--- Question ${q.questionNumber} ---`);
      console.log(`Text: ${q.questionText}`);
      console.log(`A: ${q.optionA}`);
      console.log(`B: ${q.optionB}`);
      console.log(`C: ${q.optionC}`);
      console.log(`D: ${q.optionD}`);
      console.log(`Correct: ${q.correctOption}`);
      if (q.explanation) {
        console.log(`Explanation: ${q.explanation.substring(0, 100)}${q.explanation.length > 100 ? '...' : ''}`);
      }
    });
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing DOCX parser:', error);
  }
}

// Run the test
testDocxParser().catch(console.error); 