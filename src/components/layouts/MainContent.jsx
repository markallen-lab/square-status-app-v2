
import React from 'react';
import { motion } from 'framer-motion';

const MainContent = ({ children, currentPath }) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
      <motion.div
        key={currentPath}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </main>
  );
};

export default MainContent;
