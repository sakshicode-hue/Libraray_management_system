'use client';

import { useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  borrows: number;
  coverColor: string;
  textColor: string;
}

interface PopularBooksCarouselProps {
  books: Book[];
}

export default function PopularBooksCarousel({ books }: PopularBooksCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextBook = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };
  
  const prevBook = () => {
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };
  
  const currentBook = books[currentIndex];
  
  return (
    <div className="relative">
      <div className={`${currentBook.coverColor} rounded-lg p-6 mb-4 transition-all duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className={`text-xl font-bold ${currentBook.textColor}`}>{currentBook.title}</h4>
            <p className={`text-sm ${currentBook.textColor} opacity-90`}>by {currentBook.author}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${currentBook.textColor}`}>{currentBook.borrows}</div>
            <div className={`text-xs ${currentBook.textColor} opacity-90`}>borrows</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className={`h-2 ${currentBook.textColor} opacity-30 rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-current opacity-100 rounded-full"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={prevBook}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30"
          >
            ←
          </button>
          <button
            onClick={nextBook}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}