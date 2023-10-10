import React, { useEffect, useState } from 'react';

interface PixabayFetchProps {
  searchWord: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const PixabayFetch: React.FC<PixabayFetchProps> = ({ searchWord, setImageUrl }) => {
  useEffect(() => {
    const fetchPixabayData = async () => {
      const apiKey = '26449723-554b1a548f2e90edf3bcfd722';
      const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchWord)}&image_type=photo`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.totalHits > 0) {
          setImageUrl(data.hits[0].largeImageURL); // Set the image URL in the state
          console.log(data.hits[0].largeImageURL)
        } else {
          console.log('No images found for the given search term.');
        }
      } catch (error) {
        console.error('Error fetching data from Pixabay:', error);
      }
    };

    fetchPixabayData();
  }, [searchWord, setImageUrl]);

  return null;
};

export default PixabayFetch;
