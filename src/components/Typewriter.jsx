import React, { useState, useEffect } from 'react';

const Typewriter = ({ phrases, typingSpeed = 100, deletingSpeed = 50, delayBeforeDelete = 2000 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    
    if (isDeleting) {
      if (currentText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      const fullText = phrases[currentIndex];
      if (currentText === fullText) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delayBeforeDelete);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, phrases, typingSpeed, deletingSpeed, delayBeforeDelete]);

  return <span className="blinking-cursor">{currentText}</span>;
};

export default Typewriter;
