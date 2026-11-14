import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const SectionHeader = ({ children }) => <div>{children}</div>;

export const Accordion = ({ title, children, isImportant = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-xl mb-4 ${isImportant ? 'border-accent-gold/30 bg-accent-gold/5' : 'border-border-subtle bg-surface'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-hover transition-colors rounded-xl"
      >
        <span className={`font-semibold text-base ${isImportant ? 'text-accent-gold' : 'text-text-primary'}`}>
          {title}
        </span>
        <ChevronDown className={`shrink-0 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"} ${isImportant ? 'text-accent-gold' : 'text-text-muted'}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-text-secondary text-base leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};
