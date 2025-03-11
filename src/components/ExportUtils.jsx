// exportUtils.js

// Function to export results as a neatly formatted .txt file
export const exportResultsToTextFile = (results) => {
    const formattedResults = results.map((result, index) => {
      return `========================================
  Result #${index + 1}
  ========================================
  ID: ${result._id || 'N/A'}
  Reference Number: ${result.reference_number || 'N/A'}
  Name: ${result.firstName || ''} ${result.secondName || ''} ${result.thirdName || ''} 
  Similarity: ${result.similarityPercentage || 'N/A'}%
  Date of Birth: ${result.dob || 'N/A'}
  Created At: ${result.created_at || 'N/A'}
  Alias Names: 
  ${result.aka && result.aka.length ? result.aka.join(', ') : 'N/A'}
  
  ----------------------------------------
  `;
    }).join('\n');
  
    // Create and download the text file
    const blob = new Blob([formattedResults], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'search_results.txt';
    link.click();
  };
  