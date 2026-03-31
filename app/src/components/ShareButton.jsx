import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2 } from 'lucide-react';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/Claude-code/#${location.pathname}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [location.pathname]);

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="p-2 rounded-lg hover:bg-background/30 transition-colors text-text-muted hover:text-text-primary"
        aria-label="Copy link to clipboard"
      >
        <Link2 className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-border-subtle text-text-primary text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
