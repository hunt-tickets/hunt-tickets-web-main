"use client";

import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { FaWhatsapp, FaGooglePlay, FaApple } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { GLSLHills } from '@/components/ui/glsl-hills';

type AvatarProps = {
  imageSrc: string;
  delay: number;
};

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => {
  return (
    <div
      className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img
        src={imageSrc}
        alt="User avatar"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};

const WaitlistForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="relative z-10 w-full flex justify-center">
      {!isSubmitted ? (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base font-medium ${
              isSubmitting
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-muted-foreground border-t-primary-foreground rounded-full animate-spin"></div>
            ) : (
              'Descubrir eventos'
            )}
          </button>

          <button
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base font-medium bg-background/50 hover:bg-background/70 text-foreground border border-border backdrop-blur-sm"
          >
            Soy Productor
          </button>
        </div>
      ) : (
        <div className="bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-300 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-center animate-fadeIn text-sm sm:text-base">
          Thanks! We'll notify you when we launch.
        </div>
      )}
    </div>
  );
};

const AnimatedShaderBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <GLSLHills />
      {/* Gradient overlay for better text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
    </div>
  );
};

export const Component: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const words = ['Experiences', 'Events', 'Adventures', 'Moments', 'Vibes'];

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    if (isTyping) {
      // Typing effect
      if (displayedText.length < currentWord.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // Word complete, wait then start deleting
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      // Deleting effect
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Deletion complete, move to next word
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsTyping(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedText, isTyping, currentWordIndex]);

  return (
    <section className="relative h-full w-full overflow-hidden">
      <AnimatedShaderBackground />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full pb-8 px-6 sm:px-8 md:px-12">
        <h1 className="w-full text-foreground leading-tight tracking-tight mb-6 sm:mb-8 animate-fadeIn px-4">
          <span className="font-black text-[clamp(1.5rem,6vw,3.75rem)] whitespace-nowrap" style={{ fontFamily: 'LOT, sans-serif' }}>
            HUNT YOUR <span className="text-primary">{displayedText}<span className="animate-pulse">|</span></span>
          </span>
        </h1>

        <div className="mb-6 sm:mb-10 px-4">
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-muted-foreground leading-relaxed animate-fadeIn animation-delay-200">
            Descubre, compara y compra los tickets que van con tu estilo.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-muted-foreground leading-relaxed animate-fadeIn animation-delay-300">
            En Hunt tú mandas.
          </p>
        </div>

        <div className="w-full max-w-2xl mb-6 sm:mb-8 px-4">
          <WaitlistForm />
        </div>

        <div className="flex justify-center space-x-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            <Instagram size={20} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </a>
          <a href="mailto:" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            <SiGmail size={20} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </a>
          <a href="https://wa.me/573228597640" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            <FaWhatsapp size={20} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            <FaApple size={20} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            <FaGooglePlay size={20} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </a>
        </div>
      </div>
    </section>
  );
};