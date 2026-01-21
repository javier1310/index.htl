import React from 'react';
import { motion } from 'framer-motion';

// Letter-by-letter karaoke animation component
const KaraokeLine = ({ text, progress }) => {
    // Ensure progress is between 0 and 1
    const normalizedProgress = Math.min(Math.max(progress, 0), 1);
    
    // Split text into individual characters (including spaces)
    const characters = text.split('');
    
    // Calculate how many characters should be lit up
    const totalChars = characters.length;
    const litChars = Math.floor(normalizedProgress * totalChars);

    return (
        <div className="relative inline-block leading-tight">
            <span className="flex flex-wrap justify-center">
                {characters.map((char, index) => {
                    // Determine if this character is "active" (lit up)
                    const isActive = index < litChars;
                    
                    // Calculate individual character progress for smooth transition
                    const charProgress = normalizedProgress * totalChars - index;
                    const charOpacity = Math.min(Math.max(charProgress, 0), 1);
                    
                    return (
                        <motion.span
                            key={`${index}-${char}`}
                            className="inline-block transition-all duration-150 ease-out"
                            style={{
                                color: isActive 
                                    ? `rgba(243, 229, 171, ${0.9 + charOpacity * 0.1})` // Bright gold
                                    : 'rgba(255, 255, 255, 0.15)', // Dim white
                                textShadow: isActive 
                                    ? `0 0 ${10 + charOpacity * 10}px rgba(243, 229, 171, 0.5)` 
                                    : 'none',
                                transform: isActive 
                                    ? `scale(${1 + charOpacity * 0.05})` 
                                    : 'scale(1)',
                            }}
                            animate={{
                                y: isActive ? [0, -3, 0] : 0,
                            }}
                            transition={{
                                y: {
                                    duration: 0.3,
                                    ease: "easeOut"
                                }
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    );
                })}
            </span>
        </div>
    );
};

export default KaraokeLine;
