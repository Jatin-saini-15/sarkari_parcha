import mammoth from 'mammoth';

interface Question {
  questionNumber: number;
  questionText: string;
  questionImage?: string; // URL or base64 data for question image
  optionA: string;
  optionAImage?: string; // URL or base64 data for option A image
  optionB: string;
  optionBImage?: string; // URL or base64 data for option B image
  optionC: string;
  optionCImage?: string; // URL or base64 data for option C image
  optionD: string;
  optionDImage?: string; // URL or base64 data for option D image
  correctOption: string;
  explanation?: string;
  explanationImage?: string; // URL or base64 data for explanation image
  debug?: string; // Debug info to show in UI
}

// Helper interface for extracted images
interface ExtractedImage {
  src: string; // Base64 data or URL
  alt: string;
  index: number; // Position in the document
}

export async function parseDocxQuestions(buffer: Buffer): Promise<Question[]> {
  try {
    // Extract text and images from DOCX
    console.log('Starting DOCX parsing...');
    
    // Array to store extracted images
    const extractedImages: ExtractedImage[] = [];
    let imageIndex = 0;
    
    // First, try to extract text with images
    const options = {
      buffer,
      convertImage: mammoth.images.imgElement((image) => {
        return image.read().then((imageBuffer) => {
          // Convert image buffer to base64 string
          const base64Image = `data:${image.contentType};base64,${imageBuffer.toString('base64')}`;
          
          // Store the image with its position
          extractedImages.push({
            src: base64Image,
            alt: `Image ${imageIndex}`,
            index: imageIndex
          });
          
          // Return an image placeholder that we can find in the text
          const placeholder = `[IMAGE:${imageIndex}]`;
          imageIndex++;
          return { src: placeholder };
        });
      })
    };
    
    // Extract text with image placeholders
    const result = await mammoth.convertToHtml(options);
    const htmlContent = result.value;
    
    // Convert HTML to plain text while preserving image placeholders
    const text = htmlContent
      .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, '$1') // Keep image placeholders
      .replace(/<[^>]*>/g, '') // Remove all other HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&lt;/g, '<') // Replace HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    
    console.log('Extracted text length:', text.length);
    console.log('Extracted images:', extractedImages.length);
    console.log('First 500 characters of text:', text.substring(0, 500));
    
    // Also extract raw text as a fallback
    const rawTextResult = await mammoth.extractRawText({ buffer });
    const rawText = rawTextResult.value;
    
    // Try to parse with both text versions
    const parsedQuestions1 = parseAllFormats(text, extractedImages, true);
    const parsedQuestions2 = parseAllFormats(rawText, extractedImages, false);
    
    // Combine all questions from both parsing attempts
    const allParsedQuestions = [...parsedQuestions1, ...parsedQuestions2];
    
    // Deduplicate questions based on question number and similar text
    const uniqueQuestions: Question[] = [];
    const seenQuestionNumbers = new Set<number>();
    const seenQuestionTexts = new Set<string>();
    
    for (const question of allParsedQuestions) {
      // Create a signature for the question text (first 50 chars)
      const textSignature = question.questionText.substring(0, 50).toLowerCase().trim();
      
      // Skip if we've seen this question number or very similar text
      if (seenQuestionNumbers.has(question.questionNumber)) {
        continue;
      }
      
      // Check if we've seen very similar text
      let isDuplicate = false;
      for (const seenText of seenQuestionTexts) {
        // Calculate similarity (simple approach - can be improved)
        const similarity = calculateSimilarity(textSignature, seenText);
        if (similarity > 0.8) { // 80% similarity threshold
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueQuestions.push(question);
        seenQuestionNumbers.add(question.questionNumber);
        seenQuestionTexts.add(textSignature);
      }
    }
    
    // Sort by question number
    uniqueQuestions.sort((a, b) => a.questionNumber - b.questionNumber);
    
    // Renumber questions to ensure sequential numbering
    uniqueQuestions.forEach((q, index) => {
      q.questionNumber = index + 1;
      
      // Add debug info to show in UI
      q.debug = `Question ${q.questionNumber}: Extracted with ${q.questionImage ? 'image' : 'no image'}, 
                Options: A: ${q.optionA?.substring(0, 20)}..., 
                B: ${q.optionB?.substring(0, 20)}..., 
                C: ${q.optionC?.substring(0, 20)}..., 
                D: ${q.optionD?.substring(0, 20)}...`;
    });
    
    console.log(`Total unique questions found: ${uniqueQuestions.length}`);
    
    if (uniqueQuestions.length === 0) {
      console.log('WARNING: No questions could be extracted from the document');
      console.log('Text sample for debugging:');
      // Print more text samples to help with debugging
      for (let i = 0; i < Math.min(text.length, 2000); i += 500) {
        console.log(`Text ${i}-${i+500}:`, text.substring(i, i+500));
      }
    }
    
    return uniqueQuestions;
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw new Error('Failed to parse DOCX file: ' + (error as Error).message);
  }
}

// Function to parse all formats and combine results
function parseAllFormats(text: string, extractedImages: ExtractedImage[], isHtml: boolean): Question[] {
  // First, try to identify and handle comprehension passages
  const comprehensionQuestions = parseComprehensionQuestions(text, extractedImages);
  
  // Try other methods for all questions
  const standardQuestions = parseStandardFormat(text, extractedImages);
  const numberedQuestions = parseNumberedFormat(text, extractedImages);
  const simpleQuestions = parseSimpleFormat(text, extractedImages);
  const genericQuestions = parseGenericFormat(text, extractedImages);
  
  // Add debug info about which parser was used
  const addParserInfo = (questions: Question[], parserName: string) => {
    return questions.map(q => ({
      ...q,
      debug: `Parsed with ${parserName} parser (${isHtml ? 'HTML' : 'Raw text'}). ${q.debug || ''}`
    }));
  };
  
  // Combine all questions from different parsers
  return [
    ...addParserInfo(comprehensionQuestions, 'Comprehension'),
    ...addParserInfo(standardQuestions, 'Standard'),
    ...addParserInfo(numberedQuestions, 'Numbered'),
    ...addParserInfo(simpleQuestions, 'Simple'),
    ...addParserInfo(genericQuestions, 'Generic')
  ];
}

function parseStandardFormat(text: string, extractedImages: ExtractedImage[]): Question[] {
  console.log('Attempting to extract questions with standard format...');
  const questions: Question[] = [];
  
  // More flexible question regex that handles Q. prefix and end of document
  // This regex is critical - it needs to be very robust to handle various formats
  // IMPORTANT: Modified to capture complete questions without truncating
  const questionRegex = /(?:Q\.?|Question)?\s*(\d+)\.?\s*((?:(?!\n\s*(?:Q\.?|Question)?\s*\d+\.?|\n\s*[aA]\.|\n\s*\([aA]\)|\n\s*[aA]\)|\n\s*[1-4][\.\)])[^\n])*)/g;
  
  // More flexible option regex that handles a., a), (a), 1., 1), (1), etc. and end of document
  const optionRegex = /(?:[aA]\.|\([aA]\)|[aA]\)|\n\s*[aA][\.\)]|\n\s*1[\.\)])\s*(.*?)(?:[bB]\.|\([bB]\)|[bB]\)|\n\s*[bB][\.\)]|\n\s*2[\.\)])\s*(.*?)(?:[cC]\.|\([cC]\)|[cC]\)|\n\s*[cC][\.\)]|\n\s*3[\.\)])\s*(.*?)(?:[dD]\.|\([dD]\)|[dD]\)|\n\s*[dD][\.\)]|\n\s*4[\.\)])\s*(.*?)(?:Ans\.?|Answer:?|Correct Answer:?|ans\.?|answer:?|Solution:?|Sol\.?|Explanation:?|Q\.?|Question|$)/gs;
  
  // More flexible answer regex that handles various formats
  const answerRegex = /(?:Ans\.?|Answer:?|Correct Answer:?|ans\.?|answer:?)\s*(?:is\s*)?([a-dA-D1-4])/g;
  
  // More flexible solution regex
  const solutionRegex = /(?:Sol\.?|Solution:?|Explanation:?|sol\.?|explanation:?)\s*(.*?)(?=(?:Q\.?|Question)\s*\d+|$)/gs;
  
  let match;
  let currentQuestionNumber = 0;
  let currentQuestionText = '';
  
  // Extract questions
  while ((match = questionRegex.exec(text)) !== null) {
    currentQuestionNumber = parseInt(match[1]);
    currentQuestionText = match[2].trim();
    const questionPosition = match.index;
    
    console.log(`Found question ${currentQuestionNumber}: ${currentQuestionText.substring(0, 50)}...`);
    
    // If question text is too short, try to get more text
    if (currentQuestionText.length < 10 && match.index + match[0].length < text.length) {
      // Look ahead for more text until we find options
      const moreText = text.substring(match.index + match[0].length, match.index + match[0].length + 500);
      const optionStart = moreText.search(/(?:[aA]\.|\([aA]\)|[aA]\)|\n\s*[aA][\.\)]|\n\s*1[\.\)])/);
      
      if (optionStart > 0) {
        currentQuestionText = moreText.substring(0, optionStart).trim();
        console.log(`Extended question text: ${currentQuestionText.substring(0, 50)}...`);
      }
    }
    
    // Check for images in the question text
    const questionImages = findImagesNearPosition(text, questionPosition, extractedImages);
    const questionImage = questionImages.length > 0 ? questionImages[0] : undefined;
    
    // Clean up question text by removing image placeholders
    currentQuestionText = currentQuestionText.replace(/\[IMAGE:\d+\]/g, '').trim();
    
    // Reset regex indices to search from the current question position
    const searchStartPos = match.index + match[0].length;
    
    // Extract options - search in the next 2000 characters
    const optionSearchText = text.substring(searchStartPos, searchStartPos + 2000);
    optionRegex.lastIndex = 0; // Reset regex
    const optionMatch = optionRegex.exec(optionSearchText);
    
    let debugInfo = `Question ${currentQuestionNumber}: "${currentQuestionText.substring(0, 30)}..." `;
    
    if (!optionMatch) {
      console.log(`No options found for question ${currentQuestionNumber}`);
      debugInfo += "No options found with regex. Trying line-by-line approach. ";
      
      // Try alternative approach - look for options line by line
      const lines = optionSearchText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      let optionA = '', optionB = '', optionC = '', optionD = '';
      let optionAPosition = -1, optionBPosition = -1, optionCPosition = -1, optionDPosition = -1;
      
      for (let i = 0; i < lines.length; i++) {
        // Check for option A/1
        if (lines[i].match(/^(?:A|a|1)[.)\s]+/i) && !optionA) {
          optionA = lines[i].replace(/^(?:A|a|1)[.)\s]+/i, '').trim();
          optionAPosition = searchStartPos + optionSearchText.indexOf(lines[i]);
      continue;
    }
    
        // Check for option B/2
        if (lines[i].match(/^(?:B|b|2)[.)\s]+/i) && !optionB) {
          optionB = lines[i].replace(/^(?:B|b|2)[.)\s]+/i, '').trim();
          optionBPosition = searchStartPos + optionSearchText.indexOf(lines[i]);
          continue;
        }
        
        // Check for option C/3
        if (lines[i].match(/^(?:C|c|3)[.)\s]+/i) && !optionC) {
          optionC = lines[i].replace(/^(?:C|c|3)[.)\s]+/i, '').trim();
          optionCPosition = searchStartPos + optionSearchText.indexOf(lines[i]);
          continue;
        }
        
        // Check for option D/4
        if (lines[i].match(/^(?:D|d|4)[.)\s]+/i) && !optionD) {
          optionD = lines[i].replace(/^(?:D|d|4)[.)\s]+/i, '').trim();
          optionDPosition = searchStartPos + optionSearchText.indexOf(lines[i]);
          continue;
        }
      }
      
      if (optionA && optionB && optionC && optionD) {
        debugInfo += `Found options line-by-line: A: "${optionA.substring(0, 20)}..." `;
        
        // Look for images in options
        const optionAImage = optionAPosition >= 0 ? findImagesNearPosition(text, optionAPosition, extractedImages, 200)[0] : undefined;
        const optionBImage = optionBPosition >= 0 ? findImagesNearPosition(text, optionBPosition, extractedImages, 200)[0] : undefined;
        const optionCImage = optionCPosition >= 0 ? findImagesNearPosition(text, optionCPosition, extractedImages, 200)[0] : undefined;
        const optionDImage = optionDPosition >= 0 ? findImagesNearPosition(text, optionDPosition, extractedImages, 200)[0] : undefined;
        
        // Clean up option text by removing image placeholders
        optionA = optionA.replace(/\[IMAGE:\d+\]/g, '').trim();
        optionB = optionB.replace(/\[IMAGE:\d+\]/g, '').trim();
        optionC = optionC.replace(/\[IMAGE:\d+\]/g, '').trim();
        optionD = optionD.replace(/\[IMAGE:\d+\]/g, '').trim();
        
        // Look for answer
        answerRegex.lastIndex = 0;
        const answerMatch = answerRegex.exec(optionSearchText);
        let correctOption = '';
        
        if (answerMatch) {
          // Convert numeric answers to letter format
          const rawAnswer = answerMatch[1].toUpperCase();
          if (['1', '2', '3', '4'].includes(rawAnswer)) {
            const answerMap: Record<string, string> = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
            correctOption = answerMap[rawAnswer];
          } else {
            correctOption = rawAnswer;
          }
          
          debugInfo += `Found answer: ${correctOption}. `;
          
          // Look for explanation
          solutionRegex.lastIndex = answerRegex.lastIndex;
          const solutionMatch = solutionRegex.exec(optionSearchText);
          const explanation = solutionMatch ? solutionMatch[1].trim() : '';
          
          // Find explanation image
          const explanationPosition = solutionMatch ? searchStartPos + optionSearchText.indexOf(solutionMatch[0]) : -1;
          const explanationImage = explanationPosition >= 0 ? findImagesNearPosition(text, explanationPosition, extractedImages, 300)[0] : undefined;
          
          questions.push({
            questionNumber: currentQuestionNumber,
            questionText: currentQuestionText,
            questionImage,
            optionA,
            optionAImage,
            optionB,
            optionBImage,
            optionC,
            optionCImage,
            optionD,
            optionDImage,
            correctOption,
            explanation: explanation.replace(/\[IMAGE:\d+\]/g, '').trim(),
            explanationImage,
            debug: debugInfo
          });
          
          console.log(`Added question ${currentQuestionNumber} using line-by-line approach`);
        } else {
          // If no answer found but we have all options, use 'A' as default
          console.log(`No answer found for question ${currentQuestionNumber}, using default 'A'`);
          debugInfo += "No answer found, using default 'A'. ";
          
          questions.push({
            questionNumber: currentQuestionNumber,
            questionText: currentQuestionText,
            questionImage,
            optionA,
            optionAImage,
            optionB,
            optionBImage,
            optionC,
            optionCImage,
            optionD,
            optionDImage,
            correctOption: 'A',
            debug: debugInfo
          });
        }
      }
      
      continue;
    }
    
    // Extract options from regex match
    let optionA = optionMatch[1].trim();
    let optionB = optionMatch[2].trim();
    let optionC = optionMatch[3].trim();
    let optionD = optionMatch[4].trim();
    
    debugInfo += `Found options with regex: A: "${optionA.substring(0, 20)}..." `;
    
    // Calculate positions of options in the text
    const optionAPosition = searchStartPos + optionSearchText.indexOf(optionA);
    const optionBPosition = searchStartPos + optionSearchText.indexOf(optionB);
    const optionCPosition = searchStartPos + optionSearchText.indexOf(optionC);
    const optionDPosition = searchStartPos + optionSearchText.indexOf(optionD);
    
    // Find images in options
    const optionAImage = findImagesNearPosition(text, optionAPosition, extractedImages, 200)[0];
    const optionBImage = findImagesNearPosition(text, optionBPosition, extractedImages, 200)[0];
    const optionCImage = findImagesNearPosition(text, optionCPosition, extractedImages, 200)[0];
    const optionDImage = findImagesNearPosition(text, optionDPosition, extractedImages, 200)[0];
    
    // Clean up option text by removing image placeholders
    optionA = optionA.replace(/\[IMAGE:\d+\]/g, '').trim();
    optionB = optionB.replace(/\[IMAGE:\d+\]/g, '').trim();
    optionC = optionC.replace(/\[IMAGE:\d+\]/g, '').trim();
    optionD = optionD.replace(/\[IMAGE:\d+\]/g, '').trim();
    
    console.log(`Options for question ${currentQuestionNumber}:`, 
      `A: ${optionA.substring(0, 20)}...`, 
      `B: ${optionB.substring(0, 20)}...`,
      `C: ${optionC.substring(0, 20)}...`,
      `D: ${optionD.substring(0, 20)}...`);
    
    // Reset regex indices to search from the options position
    answerRegex.lastIndex = 0;
    
    // Extract answer - search in the next 3000 characters after options
    const answerSearchText = text.substring(searchStartPos + optionMatch[0].length, searchStartPos + optionMatch[0].length + 3000);
    const answerMatch = answerRegex.exec(answerSearchText);
    let correctOption = '';
    
    if (answerMatch) {
      // Convert numeric answers (1,2,3,4) to letter format (A,B,C,D)
      const rawAnswer = answerMatch[1].toUpperCase();
      if (['1', '2', '3', '4'].includes(rawAnswer)) {
        const answerMap: Record<string, string> = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
        correctOption = answerMap[rawAnswer];
      } else {
        correctOption = rawAnswer;
      }
    console.log(`Correct option for question ${currentQuestionNumber}: ${correctOption}`);
      debugInfo += `Found answer: ${correctOption}. `;
    } else {
      console.log(`No answer found for question ${currentQuestionNumber}, using default 'A'`);
      correctOption = 'A'; // Default to A if no answer found
      debugInfo += "No answer found, using default 'A'. ";
    }
    
    // Reset regex indices to search from the answer position
    solutionRegex.lastIndex = 0;
    
    // Extract solution/explanation
    const solutionMatch = solutionRegex.exec(answerSearchText);
    const explanation = solutionMatch ? solutionMatch[1].trim() : '';
    
    // Find explanation image
    const explanationPosition = solutionMatch ? searchStartPos + answerSearchText.indexOf(solutionMatch[0]) : -1;
    const explanationImage = explanationPosition >= 0 ? findImagesNearPosition(text, explanationPosition, extractedImages, 300)[0] : undefined;
    
    questions.push({
      questionNumber: currentQuestionNumber,
      questionText: currentQuestionText,
      questionImage,
      optionA,
      optionAImage,
      optionB,
      optionBImage,
      optionC,
      optionCImage,
      optionD,
      optionDImage,
      correctOption,
      explanation: explanation.replace(/\[IMAGE:\d+\]/g, '').trim(),
      explanationImage,
      debug: debugInfo
    });
  }
  
  return questions;
}

function parseNumberedFormat(text: string, extractedImages: ExtractedImage[]): Question[] {
  console.log('Attempting to extract questions with numbered format...');
  const questions: Question[] = [];
  
  // Split text by lines to process line by line
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // More flexible regex for numbered questions
  const questionStartRegex = /^(\d+)[.)\s]+(.+)$/;
  
  // More flexible regex for options, accepting A., A), (A), 1., 1), (1), etc.
  const optionRegex = /^(?:[A-D]|[1-4])[.)\s]+(.+)$/;
  
  // More flexible regex for answers, accepting various formats
  const answerRegex = /^(?:Answer|Ans|Solution|Sol|Correct Answer|Correct|Explanation)[:.]\s*(?:is\s*)?([A-Da-d1-4])$/i;
  
  let currentQuestion: Partial<Question> | null = null;
  let currentOptionLetter: string | null = null;
  let expectingOptions = false;
  let questionCount = 0;
  let optionCount = 0;
  let currentQuestionPosition = -1;
  
  // First pass: identify all question numbers
  const questionNumbers = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(questionStartRegex);
    if (match) {
      const num = parseInt(match[1]);
      if (num > 0) {
        questionNumbers.add(num);
      }
    }
  }
  
  console.log(`Found ${questionNumbers.size} potential question numbers`);
  
  // Second pass: process questions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a new question
    const questionMatch = line.match(questionStartRegex);
    if (questionMatch) {
      const questionNumber = parseInt(questionMatch[1]);
      
      // Only consider lines that match our expected question numbers
      // But be more flexible - if we don't have many questions yet, accept more
      if (!questionNumbers.has(questionNumber) && questionNumbers.size > 10) {
        continue;
      }
      
      // Save previous question if it exists and has all required fields
      if (currentQuestion && 
          currentQuestion.questionText && 
          currentQuestion.optionA && 
          currentQuestion.optionB && 
          currentQuestion.optionC && 
          currentQuestion.optionD) {
        // If no correct option, default to A
        if (!currentQuestion.correctOption) {
          currentQuestion.correctOption = 'A';
        }
        questions.push(currentQuestion as Question);
        console.log(`Added question ${currentQuestion.questionNumber}`);
      }
      
      // Calculate position in the original text
      currentQuestionPosition = text.indexOf(line);
      
      // Start new question
      currentQuestion = {
        questionNumber: questionNumber,
        questionText: questionMatch[2].trim()
      };
      console.log(`Found question ${currentQuestion.questionNumber}: ${currentQuestion.questionText?.substring(0, 50) || ''}...`);
      
      // Check for images in the question
      if (currentQuestionPosition >= 0) {
        const questionImages = findImagesNearPosition(text, currentQuestionPosition, extractedImages, 300);
        if (questionImages.length > 0) {
          currentQuestion.questionImage = questionImages[0];
        }
      }
      
      // Clean up question text by removing image placeholders
      if (currentQuestion.questionText) {
        currentQuestion.questionText = currentQuestion.questionText.replace(/\[IMAGE:\d+\]/g, '').trim();
      }
      
      // Check if the question text is complete or continues on next lines
      let nextLineIndex = i + 1;
      while (nextLineIndex < lines.length) {
        const nextLine = lines[nextLineIndex];
        
        // Stop if we hit an option, another question, or an answer
        if (nextLine.match(questionStartRegex) || 
            nextLine.match(/^(?:[A-D]|[1-4])[.)\s]+/) ||
            nextLine.match(answerRegex)) {
          break;
        }
        
        // If the line doesn't look like a continuation, stop
        if (nextLine.length < 3 || nextLine.match(/^[A-Z]/)) {
          break;
        }
        
        // Append to question text
        if (currentQuestion.questionText) {
          currentQuestion.questionText += ' ' + nextLine;
        }
        nextLineIndex++;
        i = nextLineIndex - 1; // Update loop counter
      }
      
      expectingOptions = true;
      currentOptionLetter = null;
      optionCount = 0;
      questionCount++;
      continue;
    }
    
    // If we're not processing a question, skip
    if (!currentQuestion) continue;
    
    // Check if this is an option
    if (expectingOptions) {
      // Check for option A/1
      if (line.match(/^(?:A|a|1)[.)\s]+/i) && !currentQuestion.optionA) {
        currentQuestion.optionA = line.replace(/^(?:A|a|1)[.)\s]+/i, '').trim();
        console.log(`Found option A: ${currentQuestion.optionA.substring(0, 20)}...`);
        currentOptionLetter = 'A';
        optionCount++;
        
        // Check for images in option A
        const optionAPosition = text.indexOf(line);
        if (optionAPosition >= 0) {
          const optionAImages = findImagesNearPosition(text, optionAPosition, extractedImages, 200);
          if (optionAImages.length > 0) {
            currentQuestion.optionAImage = optionAImages[0];
          }
        }
        
        // Clean up option text
        currentQuestion.optionA = currentQuestion.optionA.replace(/\[IMAGE:\d+\]/g, '').trim();
        
        // Check for multi-line option
        let nextLineIndex = i + 1;
        while (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex];
          
          // Stop if we hit another option, question, or answer
          if (nextLine.match(/^(?:[A-D]|[1-4])[.)\s]+/) || 
              nextLine.match(questionStartRegex) ||
              nextLine.match(answerRegex)) {
            break;
          }
          
          // If the line doesn't look like a continuation, stop
          if (nextLine.length < 3) {
            break;
          }
          
          // Append to option text
          currentQuestion.optionA += ' ' + nextLine;
          nextLineIndex++;
          i = nextLineIndex - 1; // Update loop counter
        }
        
        continue;
      }
      
      // Check for option B/2
      if (line.match(/^(?:B|b|2)[.)\s]+/i) && !currentQuestion.optionB) {
        currentQuestion.optionB = line.replace(/^(?:B|b|2)[.)\s]+/i, '').trim();
        console.log(`Found option B: ${currentQuestion.optionB.substring(0, 20)}...`);
        currentOptionLetter = 'B';
        optionCount++;
        
        // Check for images in option B
        const optionBPosition = text.indexOf(line);
        if (optionBPosition >= 0) {
          const optionBImages = findImagesNearPosition(text, optionBPosition, extractedImages, 200);
          if (optionBImages.length > 0) {
            currentQuestion.optionBImage = optionBImages[0];
          }
        }
        
        // Clean up option text
        currentQuestion.optionB = currentQuestion.optionB.replace(/\[IMAGE:\d+\]/g, '').trim();
        
        // Check for multi-line option
        let nextLineIndex = i + 1;
        while (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex];
          
          // Stop if we hit another option, question, or answer
          if (nextLine.match(/^(?:[A-D]|[1-4])[.)\s]+/) || 
              nextLine.match(questionStartRegex) ||
              nextLine.match(answerRegex)) {
            break;
          }
          
          // If the line doesn't look like a continuation, stop
          if (nextLine.length < 3) {
            break;
        }
        
          // Append to option text
          currentQuestion.optionB += ' ' + nextLine;
          nextLineIndex++;
          i = nextLineIndex - 1; // Update loop counter
        }
        
        continue;
      }
      
      // Check for option C/3
      if (line.match(/^(?:C|c|3)[.)\s]+/i) && !currentQuestion.optionC) {
        currentQuestion.optionC = line.replace(/^(?:C|c|3)[.)\s]+/i, '').trim();
        console.log(`Found option C: ${currentQuestion.optionC.substring(0, 20)}...`);
        currentOptionLetter = 'C';
        optionCount++;
        
        // Check for images in option C
        const optionCPosition = text.indexOf(line);
        if (optionCPosition >= 0) {
          const optionCImages = findImagesNearPosition(text, optionCPosition, extractedImages, 200);
          if (optionCImages.length > 0) {
            currentQuestion.optionCImage = optionCImages[0];
          }
        }
        
        // Clean up option text
        currentQuestion.optionC = currentQuestion.optionC.replace(/\[IMAGE:\d+\]/g, '').trim();
        
        // Check for multi-line option
        let nextLineIndex = i + 1;
        while (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex];
          
          // Stop if we hit another option, question, or answer
          if (nextLine.match(/^(?:[A-D]|[1-4])[.)\s]+/) || 
              nextLine.match(questionStartRegex) ||
              nextLine.match(answerRegex)) {
            break;
          }
          
          // If the line doesn't look like a continuation, stop
          if (nextLine.length < 3) {
            break;
          }
          
          // Append to option text
          currentQuestion.optionC += ' ' + nextLine;
          nextLineIndex++;
          i = nextLineIndex - 1; // Update loop counter
        }
        
        continue;
      }
      
      // Check for option D/4
      if (line.match(/^(?:D|d|4)[.)\s]+/i) && !currentQuestion.optionD) {
        currentQuestion.optionD = line.replace(/^(?:D|d|4)[.)\s]+/i, '').trim();
        console.log(`Found option D: ${currentQuestion.optionD.substring(0, 20)}...`);
        currentOptionLetter = 'D';
        optionCount++;
        
        // Check for images in option D
        const optionDPosition = text.indexOf(line);
        if (optionDPosition >= 0) {
          const optionDImages = findImagesNearPosition(text, optionDPosition, extractedImages, 200);
          if (optionDImages.length > 0) {
            currentQuestion.optionDImage = optionDImages[0];
          }
        }
        
        // Clean up option text
        currentQuestion.optionD = currentQuestion.optionD.replace(/\[IMAGE:\d+\]/g, '').trim();
        
        // Check for multi-line option
        let nextLineIndex = i + 1;
        while (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex];
          
          // Stop if we hit another option, question, or answer
          if (nextLine.match(/^(?:[A-D]|[1-4])[.)\s]+/) || 
              nextLine.match(questionStartRegex) ||
              nextLine.match(answerRegex)) {
            break;
          }
          
          // If the line doesn't look like a continuation, stop
          if (nextLine.length < 3) {
            break;
        }
          
          // Append to option text
          currentQuestion.optionD += ' ' + nextLine;
          nextLineIndex++;
          i = nextLineIndex - 1; // Update loop counter
        }
        
        continue;
      }
    }
    
    // Check if this is an answer
      const answerMatch = line.match(answerRegex);
      if (answerMatch) {
      let answer = answerMatch[1].toUpperCase();
      
      // Convert numeric answers to letter format
      if (['1', '2', '3', '4'].includes(answer)) {
        const answerMap: Record<string, string> = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
        answer = answerMap[answer];
      }
      
      currentQuestion.correctOption = answer;
        console.log(`Found answer: ${currentQuestion.correctOption}`);
        
        // Look for explanation in the next lines
        let explanationText = '';
      let explanationPosition = text.indexOf(line);
        let j = i + 1;
        while (j < lines.length && 
               !lines[j].match(questionStartRegex) && 
             !lines[j].match(/^(?:A|B|C|D|1|2|3|4)[.)\s]+/i) &&
               !lines[j].match(answerRegex)) {
          explanationText += ' ' + lines[j];
          j++;
        }
        
        if (explanationText.trim()) {
          currentQuestion.explanation = explanationText.trim();
          console.log(`Found explanation: ${currentQuestion.explanation.substring(0, 30)}...`);
        
        // Check for images in explanation
        if (explanationPosition >= 0) {
          const explanationImages = findImagesNearPosition(text, explanationPosition, extractedImages, 300);
          if (explanationImages.length > 0) {
            currentQuestion.explanationImage = explanationImages[0];
          }
        }
        
        // Clean up explanation text
        currentQuestion.explanation = currentQuestion.explanation.replace(/\[IMAGE:\d+\]/g, '').trim();
        }
        
        continue;
    }
    
    // If we couldn't match the line to anything specific, it might be a continuation
    if (currentOptionLetter && !line.match(/^[A-D1-4][.)]/) && !line.match(/^(?:Answer|Ans|Sol|Solution|Explanation)[:.]/i)) {
      switch (currentOptionLetter) {
        case 'A':
          if (currentQuestion.optionA) currentQuestion.optionA += ' ' + line;
          break;
        case 'B':
          if (currentQuestion.optionB) currentQuestion.optionB += ' ' + line;
          break;
        case 'C':
          if (currentQuestion.optionC) currentQuestion.optionC += ' ' + line;
          break;
        case 'D':
          if (currentQuestion.optionD) currentQuestion.optionD += ' ' + line;
          break;
      }
    }
  }
  
  // Add the last question if it's complete
  if (currentQuestion && 
      currentQuestion.questionText && 
      currentQuestion.optionA && 
      currentQuestion.optionB && 
      currentQuestion.optionC && 
      currentQuestion.optionD) {
    // If no correct option, default to A
    if (!currentQuestion.correctOption) {
      currentQuestion.correctOption = 'A';
    }
    questions.push(currentQuestion as Question);
    console.log(`Added question ${currentQuestion.questionNumber}`);
  }
  
  console.log(`Found ${questionCount} potential questions, extracted ${questions.length} complete questions`);
  return questions;
}

function parseSimpleFormat(text: string, extractedImages: ExtractedImage[]): Question[] {
  console.log('Attempting to extract questions with simple format...');
  const questions: Question[] = [];
  
  // Split by double newlines to separate questions
  const blocks = text.split(/\n\s*\n/).filter(block => block.trim().length > 0);
  
  let questionNumber = 1;
  
  for (const block of blocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Need at least 6 lines (question + 4 options + answer)
    if (lines.length < 5) continue;
    
    // Find position of this block in the original text
    const blockPosition = text.indexOf(block);
    
    // First line is the question - try to clean up any question numbering
    const questionText = lines[0].replace(/^(?:Q\.?|Question)?\s*\d+[\s.)-]+/, '').trim();
    
    // Check for images in the question
    const questionImages = findImagesNearPosition(text, blockPosition, extractedImages, 300);
    const questionImage = questionImages.length > 0 ? questionImages[0] : undefined;
    
    // Look for options (A, B, C, D or 1, 2, 3, 4)
    const options: Record<string, string> = { A: '', B: '', C: '', D: '' };
    const optionPositions: Record<string, number> = { A: -1, B: -1, C: -1, D: -1 };
    let correctOption = '';
    let explanationText = '';
    let explanationImage: string | undefined = undefined;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const linePosition = blockPosition + block.indexOf(line);
      
      // Check for option A/1
      if (line.match(/^(?:A|1)[.)\s]+/i) && !options.A) {
        options.A = line.replace(/^(?:A|1)[.)\s]+/i, '').trim();
        optionPositions.A = linePosition;
        continue;
      }
      
      // Check for option B/2
      if (line.match(/^(?:B|2)[.)\s]+/i) && !options.B) {
        options.B = line.replace(/^(?:B|2)[.)\s]+/i, '').trim();
        optionPositions.B = linePosition;
        continue;
      }
      
      // Check for option C/3
      if (line.match(/^(?:C|c|3)[.)\s]+/i) && !options.C) {
        options.C = line.replace(/^(?:C|c|3)[.)\s]+/i, '').trim();
        optionPositions.C = linePosition;
        continue;
      }
      
      // Check for option D/4
      if (line.match(/^(?:D|4)[.)\s]+/i) && !options.D) {
        options.D = line.replace(/^(?:D|4)[.)\s]+/i, '').trim();
        optionPositions.D = linePosition;
        continue;
      }
      
      // Check if this is an answer
      const answerMatch = line.match(/^(?:Answer|Ans|Solution|Sol|Correct Answer|Correct|Explanation)[:.]\s*(?:is\s*)?([A-Da-d1-4])$/i);
      if (answerMatch) {
        let answer = answerMatch[1].toUpperCase();
        
        // Convert numeric answers to letter format
        if (['1', '2', '3', '4'].includes(answer)) {
          const answerMap: Record<string, string> = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
          answer = answerMap[answer];
        }
        
        correctOption = answer;
        
        // Look for explanation in the next lines
        explanationText = '';
        let j = i + 1;
        while (j < lines.length) {
          explanationText += ' ' + lines[j];
          j++;
        }
        
        // Find images in the explanation
        const explanationPosition = linePosition;
        const explanationImages = findImagesNearPosition(text, explanationPosition, extractedImages, 300);
        explanationImage = explanationImages.length > 0 ? explanationImages[0] : undefined;
        
        break;
      }
    }
    
    // Find images in options
    const optionAImage = optionPositions.A >= 0 ? findImagesNearPosition(text, optionPositions.A, extractedImages, 200)[0] : undefined;
    const optionBImage = optionPositions.B >= 0 ? findImagesNearPosition(text, optionPositions.B, extractedImages, 200)[0] : undefined;
    const optionCImage = optionPositions.C >= 0 ? findImagesNearPosition(text, optionPositions.C, extractedImages, 200)[0] : undefined;
    const optionDImage = optionPositions.D >= 0 ? findImagesNearPosition(text, optionPositions.D, extractedImages, 200)[0] : undefined;
    
    // Clean up option text by removing image placeholders
    options.A = options.A.replace(/\[IMAGE:\d+\]/g, '').trim();
    options.B = options.B.replace(/\[IMAGE:\d+\]/g, '').trim();
    options.C = options.C.replace(/\[IMAGE:\d+\]/g, '').trim();
    options.D = options.D.replace(/\[IMAGE:\d+\]/g, '').trim();
    
    // Only add if we have all options and an answer
    if (options.A && options.B && options.C && options.D && correctOption) {
      questions.push({
        questionNumber: questionNumber++,
        questionText: questionText.replace(/\[IMAGE:\d+\]/g, '').trim(),
        questionImage,
        optionA: options.A,
        optionAImage,
        optionB: options.B,
        optionBImage,
        optionC: options.C,
        optionCImage,
        optionD: options.D,
        optionDImage,
        correctOption,
        explanation: explanationText ? explanationText.replace(/\[IMAGE:\d+\]/g, '').trim() : undefined,
        explanationImage
      });
      
      console.log(`Added question ${questionNumber-1}: ${questionText.substring(0, 30)}...`);
    }
  }
  
  return questions;
}

function parseGenericFormat(text: string, extractedImages: ExtractedImage[]): Question[] {
  console.log('Attempting to extract questions with generic format...');
  const questions: Question[] = [];
  
  // Look for patterns that might indicate questions
  const lines = text.split('\n').map(line => line.trim());
  let questionNumber = 1;
  
  // Try to identify question blocks
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line) continue;
    
    // Look for question indicators - more flexible pattern matching
    if (line.match(/^\d+[\s.)-]+/) || 
        line.match(/^Q\.?\s*\d+/i) || 
        line.match(/^Question\s*\d+/i)) {
      
      // Find position of this line in the original text
      const questionPosition = text.indexOf(line);
      
      // Extract question text, removing any numbering prefix
      const questionText = line
        .replace(/^\d+[\s.)-]+/, '')
        .replace(/^Q\.?\s*\d+[\s.)-]*/i, '')
        .replace(/^Question\s*\d+[\s.)-]*/i, '')
        .trim();
      
      if (questionText.length < 10) continue; // Too short to be a question
      
      // Check for images in the question
      const questionImages = findImagesNearPosition(text, questionPosition, extractedImages, 300);
      const questionImage = questionImages.length > 0 ? questionImages[0] : undefined;
      
      // Look for options in the next lines
      const options: Record<string, string> = { A: '', B: '', C: '', D: '' };
      const optionPositions: Record<string, number> = { A: -1, B: -1, C: -1, D: -1 };
      let correctOption = '';
      let explanationText = '';
      let explanationImage: string | undefined = undefined;
      let j = i + 1;
      
      // Try to find 4 options and an answer within the next 30 lines
      while (j < lines.length && j < i + 30) {
        const optionLine = lines[j];
        const optionPosition = text.indexOf(optionLine, questionPosition);
        
        // Check for option A/1
        if (optionLine.match(/^(?:A|1)[.)\s]+/i) && !options.A) {
          options.A = optionLine.replace(/^(?:A|1)[.)\s]+/i, '').trim();
          optionPositions.A = optionPosition;
          j++;
          continue;
        }
        
        // Check for option B/2
        if (optionLine.match(/^(?:B|2)[.)\s]+/i) && !options.B) {
          options.B = optionLine.replace(/^(?:B|2)[.)\s]+/i, '').trim();
          optionPositions.B = optionPosition;
          j++;
          continue;
        }
        
        // Check for option C/3
        if (optionLine.match(/^(?:C|3)[.)\s]+/i) && !options.C) {
          options.C = optionLine.replace(/^(?:C|3)[.)\s]+/i, '').trim();
          optionPositions.C = optionPosition;
          j++;
          continue;
        }
        
        // Check for option D/4
        if (optionLine.match(/^(?:D|4)[.)\s]+/i) && !options.D) {
          options.D = optionLine.replace(/^(?:D|4)[.)\s]+/i, '').trim();
          optionPositions.D = optionPosition;
          j++;
          continue;
        }
        
        // Check for answer format
        const answerMatch = optionLine.match(/^(?:Answer|Ans|Solution|Sol|Correct Answer|Correct|Explanation)[:.]\s*(?:is\s*)?([A-Da-d1-4])$/i);
        if (answerMatch) {
          let answer = answerMatch[1].toUpperCase();
          
          // Convert numeric answers to letter format
          if (['1', '2', '3', '4'].includes(answer)) {
            const answerMap: Record<string, string> = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
            answer = answerMap[answer];
          }
          
          correctOption = answer;
          
          // Look for explanation in the next lines
          const explanationPosition = optionPosition;
          let k = j + 1;
          while (k < lines.length && k < j + 10) {
            explanationText += ' ' + lines[k];
            k++;
          }
          
          // Find images in the explanation
          const explanationImages = findImagesNearPosition(text, explanationPosition, extractedImages, 300);
          explanationImage = explanationImages.length > 0 ? explanationImages[0] : undefined;
          
          j = k;
          break;
        }
        
        j++;
      }
      
      // Find images in options
      const optionAImage = optionPositions.A >= 0 ? findImagesNearPosition(text, optionPositions.A, extractedImages, 200)[0] : undefined;
      const optionBImage = optionPositions.B >= 0 ? findImagesNearPosition(text, optionPositions.B, extractedImages, 200)[0] : undefined;
      const optionCImage = optionPositions.C >= 0 ? findImagesNearPosition(text, optionPositions.C, extractedImages, 200)[0] : undefined;
      const optionDImage = optionPositions.D >= 0 ? findImagesNearPosition(text, optionPositions.D, extractedImages, 200)[0] : undefined;
      
      // Clean up option text by removing image placeholders
      options.A = options.A.replace(/\[IMAGE:\d+\]/g, '').trim();
      options.B = options.B.replace(/\[IMAGE:\d+\]/g, '').trim();
      options.C = options.C.replace(/\[IMAGE:\d+\]/g, '').trim();
      options.D = options.D.replace(/\[IMAGE:\d+\]/g, '').trim();
      
      // Only add if we have all options and an answer
      if (options.A && options.B && options.C && options.D && correctOption) {
        questions.push({
          questionNumber: questionNumber++,
          questionText: questionText.replace(/\[IMAGE:\d+\]/g, '').trim(),
          questionImage,
          optionA: options.A,
          optionAImage,
          optionB: options.B,
          optionBImage,
          optionC: options.C,
          optionCImage,
          optionD: options.D,
          optionDImage,
          correctOption,
          explanation: explanationText ? explanationText.replace(/\[IMAGE:\d+\]/g, '').trim() : undefined,
          explanationImage
        });
        
        console.log(`Added question ${questionNumber-1}: ${questionText.substring(0, 30)}...`);
        
        // Skip ahead to after the options
        i = j - 1;
      }
    }
  }
  
  return questions;
}

// New function to handle comprehension passages with multiple questions
function parseComprehensionQuestions(text: string, extractedImages: ExtractedImage[]): Question[] {
  console.log('Attempting to extract comprehension questions...');
  const questions: Question[] = [];
  
  // Look for comprehension passages - more flexible pattern
  const comprehensionRegex = /(?:Comprehension|Passage|Reading|In the following passage)[\s\S]*?(?=Q\d+\.|Question\s*\d+\.|\d+\.)/gi;
  const passages = text.match(comprehensionRegex);
  
  if (!passages || passages.length === 0) {
    console.log('No comprehension passages found');
    return [];
  }
  
  console.log(`Found ${passages.length} potential comprehension passages`);
  
  // Process each comprehension passage
  for (const passage of passages) {
    console.log(`Processing comprehension passage: ${passage.substring(0, 100)}...`);
    const passagePosition = text.indexOf(passage);
    
    // Find images in the passage
    const passageImages = findImagesNearPosition(text, passagePosition, extractedImages, 1000);
    
    // Extract all questions from the document, then filter for those related to this passage
    const allQuestionMatches: { number: number, text: string, position: number }[] = [];
    
    // Find all questions in the entire document
    const questionRegex = /(?:Q\.?|Question)?\s*(\d+)\.?\s+(.*?)(?=(?:[aA]\.|\([aA]\)|[aA]\)|\n\s*[aA][\.\)]|\n\s*[1-4][\.\)]|$))/gs;
    let match;
    
    while ((match = questionRegex.exec(text)) !== null) {
      const questionNumber = parseInt(match[1]);
      const questionText = match[2].trim();
      allQuestionMatches.push({
        number: questionNumber,
        text: questionText,
        position: match.index
      });
    }
    
    // Sort questions by position in the document
    allQuestionMatches.sort((a, b) => a.position - b.position);
    
    // Find the position of the passage
    const passageEndPosition = passagePosition + passage.length;
    
    // Find questions that appear after the passage (within a reasonable range)
    const relatedQuestions = allQuestionMatches.filter(q => 
      q.position >= passagePosition - 200 && q.position <= passageEndPosition + 5000
    );
    
    console.log(`Found ${relatedQuestions.length} questions potentially related to this passage`);
    
    // Process each related question
    for (const questionInfo of relatedQuestions) {
      const questionPosition = questionInfo.position;
      const questionNumber = questionInfo.number;
      const questionText = questionInfo.text;
      
      console.log(`Processing question ${questionNumber}: ${questionText.substring(0, 50)}...`);
      
      // Find images in the question
      const questionImages = findImagesNearPosition(text, questionPosition, extractedImages, 300);
      const questionImage = questionImages.length > 0 ? questionImages[0] : undefined;
      
      // Clean up question text by removing image placeholders
      const cleanQuestionText = questionText.replace(/\[IMAGE:\d+\]/g, '').trim();
      
      // Extract options - look at text after the question
      const optionStartPos = questionPosition + questionText.length + 10; // Add some buffer
      const optionText = text.substring(optionStartPos, optionStartPos + 1000); // Look at next 1000 chars for options
      
      // Try to extract options using various patterns
      const optionPatterns = [
        // Pattern for a., b., c., d.
        /(?:[aA]\.|\([aA]\)|[aA]\))\s*(.*?)(?:[bB]\.|\([bB]\)|[bB]\))\s*(.*?)(?:[cC]\.|\([cC]\)|[cC]\))\s*(.*?)(?:[dD]\.|\([dD]\)|[dD]\))\s*(.*?)(?=(?:Ans\.?|Answer:?|Q\.?|Question|Sol\.?|\d+\.|$))/s,
        // Pattern for A., B., C., D.
        /(?:A\.|\(A\)|A\))\s*(.*?)(?:B\.|\(B\)|B\))\s*(.*?)(?:C\.|\(C\)|C\))\s*(.*?)(?:D\.|\(D\)|D\))\s*(.*?)(?=(?:Ans\.?|Answer:?|Q\.?|Question|Sol\.?|\d+\.|$))/s,
        // Pattern for 1., 2., 3., 4.
        /(?:1\.|\(1\)|1\))\s*(.*?)(?:2\.|\(2\)|2\))\s*(.*?)(?:3\.|\(3\)|3\))\s*(.*?)(?:4\.|\(4\)|4\))\s*(.*?)(?=(?:Ans\.?|Answer:?|Q\.?|Question|Sol\.?|\d+\.|$))/s
      ];
      
      let optionA = '', optionB = '', optionC = '', optionD = '';
      let optionAPosition = -1, optionBPosition = -1, optionCPosition = -1, optionDPosition = -1;
      let optionsFound = false;
      
      for (const pattern of optionPatterns) {
        const optionMatch = optionText.match(pattern);
        if (optionMatch) {
          optionA = optionMatch[1].trim();
          optionB = optionMatch[2].trim();
          optionC = optionMatch[3].trim();
          optionD = optionMatch[4].trim();
          
          // Calculate positions of options in the text
          optionAPosition = optionStartPos + optionText.indexOf(optionA);
          optionBPosition = optionStartPos + optionText.indexOf(optionB);
          optionCPosition = optionStartPos + optionText.indexOf(optionC);
          optionDPosition = optionStartPos + optionText.indexOf(optionD);
          
          optionsFound = true;
          break;
        }
      }
      
      // If options not found with patterns, try line-by-line approach
      if (!optionsFound) {
        const lines = optionText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        for (let i = 0; i < lines.length; i++) {
          // Check for option A/a/1
          if (lines[i].match(/^(?:A|a|1)[.)\s]+/i) && !optionA) {
            optionA = lines[i].replace(/^(?:A|a|1)[.)\s]+/i, '').trim();
            optionAPosition = optionStartPos + optionText.indexOf(lines[i]);
            continue;
          }
          
          // Check for option B/b/2
          if (lines[i].match(/^(?:B|b|2)[.)\s]+/i) && !optionB) {
            optionB = lines[i].replace(/^(?:B|b|2)[.)\s]+/i, '').trim();
            optionBPosition = optionStartPos + optionText.indexOf(lines[i]);
            continue;
          }
          
          // Check for option C/c/3
          if (lines[i].match(/^(?:C|c|3)[.)\s]+/i) && !optionC) {
            optionC = lines[i].replace(/^(?:C|c|3)[.)\s]+/i, '').trim();
            optionCPosition = optionStartPos + optionText.indexOf(lines[i]);
            continue;
          }
          
          // Check for option D/d/4
          if (lines[i].match(/^(?:D|d|4)[.)\s]+/i) && !optionD) {
            optionD = lines[i].replace(/^(?:D|d|4)[.)\s]+/i, '').trim();
            optionDPosition = optionStartPos + optionText.indexOf(lines[i]);
            continue;
          }
        }
      }
      
      // Find images in options
      const optionAImage = optionAPosition >= 0 ? findImagesNearPosition(text, optionAPosition, extractedImages, 200)[0] : undefined;
      const optionBImage = optionBPosition >= 0 ? findImagesNearPosition(text, optionBPosition, extractedImages, 200)[0] : undefined;
      const optionCImage = optionCPosition >= 0 ? findImagesNearPosition(text, optionCPosition, extractedImages, 200)[0] : undefined;
      const optionDImage = optionDPosition >= 0 ? findImagesNearPosition(text, optionDPosition, extractedImages, 200)[0] : undefined;
      
      // Clean up option text by removing image placeholders
      optionA = optionA.replace(/\[IMAGE:\d+\]/g, '').trim();
      optionB = optionB.replace(/\[IMAGE:\d+\]/g, '').trim();
      optionC = optionC.replace(/\[IMAGE:\d+\]/g, '').trim();
      optionD = optionD.replace(/\[IMAGE:\d+\]/g, '').trim();
      
      // Look for answer
      const answerRegex = /(?:Ans\.?|Answer:?|Correct Answer:?|ans\.?|answer:?)\s*(?:is\s*)?([a-dA-D1-4])/g;
      const searchRange = 3000; // Increase search range for answers
      const answerText = text.substring(optionStartPos, optionStartPos + searchRange);
      const answerMatch = answerRegex.exec(answerText);
      
      let correctOption = 'A'; // Default to A
      if (answerMatch) {
        // Convert numeric answers to letter format
        const rawAnswer = answerMatch[1].toUpperCase();
        if (['1', '2', '3', '4'].includes(rawAnswer)) {
          const answerMap: Record<string, string> = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
          correctOption = answerMap[rawAnswer];
        } else {
          correctOption = rawAnswer;
        }
      }
      
      // Look for explanation
      const solutionRegex = /(?:Sol\.?|Solution:?|Explanation:?|sol\.?|explanation:?)\s*(.*?)(?=(?:Q\.?|Question)\s*\d+|$)/s;
      const solutionMatch = answerText.match(solutionRegex);
      const explanation = solutionMatch ? solutionMatch[1].trim() : '';
      
      // Find explanation image
      const explanationPosition = solutionMatch ? optionStartPos + answerText.indexOf(solutionMatch[0]) : -1;
      const explanationImage = explanationPosition >= 0 ? findImagesNearPosition(text, explanationPosition, extractedImages, 300)[0] : undefined;
      
      // Only add if we have all options
      if (optionA && optionB && optionC && optionD) {
        // For comprehension questions, include passage text only for the first question
        const fullQuestionText = questionNumber === relatedQuestions[0]?.number 
          ? `${passage}\n\n${cleanQuestionText}`
          : cleanQuestionText;
        
        questions.push({
          questionNumber,
          questionText: fullQuestionText,
          questionImage: questionImage || (questionNumber === relatedQuestions[0]?.number ? passageImages[0] : undefined),
          optionA,
          optionAImage,
          optionB,
          optionBImage,
          optionC,
          optionCImage,
          optionD,
          optionDImage,
          correctOption,
          explanation: explanation.replace(/\[IMAGE:\d+\]/g, '').trim(),
          explanationImage
        });
        
        console.log(`Added comprehension question ${questionNumber}`);
      } else {
        console.log(`Could not extract all options or answer for question ${questionNumber}`);
        console.log(`Options found: A: ${optionA ? 'Yes' : 'No'}, B: ${optionB ? 'Yes' : 'No'}, C: ${optionC ? 'Yes' : 'No'}, D: ${optionD ? 'Yes' : 'No'}, Answer: ${correctOption ? 'Yes' : 'No'}`);
      }
    }
  }
  
  return questions;
}

// Helper function to calculate text similarity (simple Levenshtein-based approach)
function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;
  
  // Simple check - if one string contains the other
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.9;
  }
  
  // Count matching words
  const words1 = str1.split(/\s+/).filter(w => w.length > 3);
  const words2 = str2.split(/\s+/).filter(w => w.length > 3);
  
  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) {
      matches++;
    }
  }
  
  // Calculate similarity based on word matches
  const maxWords = Math.max(words1.length, words2.length);
  return maxWords > 0 ? matches / maxWords : 0;
}

// Helper function to find images near a specific position in text
function findImagesNearPosition(text: string, position: number, extractedImages: ExtractedImage[], range: number = 500): string[] {
  if (position < 0 || !extractedImages || extractedImages.length === 0) {
    return [];
  }

  const imagePlaceholders: string[] = [];
  const startPos = Math.max(0, position - range);
  const endPos = Math.min(text.length, position + range);
  const searchText = text.substring(startPos, endPos);
  
  // Find all image placeholders in the search range
  const regex = /\[IMAGE:(\d+)\]/g;
  let match;
  
  while ((match = regex.exec(searchText)) !== null) {
    const imageIndex = parseInt(match[1]);
    const image = extractedImages.find(img => img.index === imageIndex);
    if (image) {
      imagePlaceholders.push(image.src);
    }
  }
  
  return imagePlaceholders;
}

export async function processMockTestFile(
  buffer: Buffer, 
  mockTestId: string,
  sections?: { id: string; name: string; questions: number; marks: number }[]
) {
  try {
    console.log('Starting to process mock test file...');
    console.log('Buffer size:', buffer.length, 'bytes');
    console.log('Sections provided:', sections ? sections.length : 0);
    
    const questions = await parseDocxQuestions(buffer);
    
    if (questions.length === 0) {
      console.error('No questions extracted from the document');
      throw new Error('No questions found in the document');
    }
    
    console.log(`Successfully extracted ${questions.length} questions from document`);
    
    // If sections are provided, assign questions to sections
    if (sections && sections.length > 0) {
      console.log('Assigning questions to sections...');
      let questionIndex = 0;
      const sectionQuestions = [];
      
      for (const section of sections) {
        const sectionQuestionsCount = section.questions;
        const sectionQuestionsData = [];
        
        console.log(`Processing section: ${section.name}, expecting ${sectionQuestionsCount} questions`);
        
        for (let i = 0; i < sectionQuestionsCount && questionIndex < questions.length; i++) {
          const question = questions[questionIndex];
          sectionQuestionsData.push({
            ...question,
            mockTestId,
            subject: section.name,
            marks: section.marks / section.questions
          });
          questionIndex++;
        }
        
        console.log(`Added ${sectionQuestionsData.length} questions to section ${section.name}`);
        
        sectionQuestions.push({
          sectionName: section.name,
          questions: sectionQuestionsData
        });
      }
      
      console.log('Finished assigning questions to sections');
      return sectionQuestions;
    }
    
    // If no sections, return all questions
    console.log('No sections provided, returning all questions without sectioning');
    return questions.map(question => ({
      ...question,
      mockTestId,
      marks: 1
    }));
  } catch (error) {
    console.error('Error processing mock test file:', error);
    throw new Error('Failed to process mock test file: ' + (error as Error).message);
  }
} 