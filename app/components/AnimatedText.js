"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Word = ({ word, index, total, scrollYProgress }) => {
  const wordStart = index / total;
  const wordEnd = (index + 1) / total;

  // Only opacity change based on scroll
  const opacity = useTransform(scrollYProgress, [wordStart, wordEnd], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block mr-2">
      {word}
    </motion.span>
  );
};

const AnimatedText = ({ text, className = "" }) => {
  const ref = useRef(null);
  const words = text.split(" ").filter(Boolean);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 60%"],
  });

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <Word
          key={index}
          word={word}
          index={index}
          total={words.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
};

export default AnimatedText;