//TODO: use Chat GPT to get the best words for looking up the fact on the image website

export const analyzeFactComp = async (text: string): Promise<Record<string, number>> => {
    try {
      const response = await fetch('http://localhost:3005/analyze-fact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to analyze fact:', response.statusText);
        return {}; // or handle error as needed
      }
    } catch (error) {
      console.error('Error occurred during analysis:', error);
      return {}; // or handle error as needed
    }
  };