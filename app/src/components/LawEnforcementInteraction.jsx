import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft, ChevronDown, Car, Users, Home, Scale,
  FileWarning, Search, CheckCircle, AlertTriangle, Shield
} from "lucide-react";
import ShareButton from "./ShareButton";
import { search as performSearch } from "../searchEngine";
import { sectionBasePaths, validSections } from "../routes";

// Progress Component
const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="w-full bg-muted rounded-full h-2 mb-4">
      <div
        className="bg-accent-gold h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
      <div className="text-sm text-text-muted mt-1">
        {completed} of {total} sections explored
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ navigate }) => {
  const quickActions = [
    { icon: AlertTriangle, text: "Emergency Rights", path: "/rights" },
    { icon: Car, text: "Traffic Stop", path: "/vehicle" },
    { icon: Users, text: "Street Stop", path: "/street" },
    { icon: Home, text: "Home Visit", path: "/home" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {quickActions.map((action, index) => (
        <div
          key={index}
          onClick={() => navigate(action.path)}
          className="bg-surface border border-border-subtle rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-surface-hover transition-colors"
        >
          <action.icon className="h-5 w-5 text-accent-gold" />
          <span className="text-base font-medium text-text-primary">{action.text}</span>
        </div>
      ))}
    </div>
  );
};

// Search Component with Results Dropdown
const SearchBar = ({ query, setQuery, results, onResultClick }) => (
  <div className="relative mb-6">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
    <input
      type="text"
      placeholder="Search rights, procedures, or ask a question..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-border-subtle rounded-xl
                 focus:border-accent-gold focus:outline-none
                 bg-surface text-text-primary
                 placeholder-text-muted text-base"
    />
    {results.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border-subtle rounded-xl shadow-lg z-50 overflow-hidden">
        {results.map((result) => (
          <button
            key={result.id}
            onClick={() => onResultClick(result.section)}
            className="w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border-subtle last:border-b-0"
          >
            <div className="font-medium text-sm text-text-primary">{result.title}</div>
            <div className="text-xs text-text-muted mt-0.5">{result.description}</div>
          </button>
        ))}
      </div>
    )}
  </div>
);

// Enhanced Accordion
const Accordion = ({ title, children, isImportant = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-xl mb-4 ${isImportant ? 'border-accent-gold/30 bg-accent-gold/5' : 'border-border-subtle bg-surface'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-hover transition-colors rounded-xl"
      >
        <span className={`font-semibold text-base ${isImportant ? 'text-accent-gold' : 'text-text-primary'}`}>
          {title}
        </span>
        <ChevronDown className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"} ${isImportant ? 'text-accent-gold' : 'text-text-muted'}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-text-secondary text-base leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

// Breadcrumb Navigation
const tabLabels = {
  vehicle: "Vehicle Stop",
  street: "Street Interaction",
  home: "Home Encounter",
  ice: "ICE Encounter",
  rights: "Rights Overview"
};

const stepLabels = {
  initial: null,
  driver: "Driver",
  passenger: "Passenger"
};

const Breadcrumb = ({ section, step, navigate }) => {
  const crumbs = [
    { label: "Home", action: () => navigate(sectionBasePaths[section]) },
  ];

  crumbs.push({
    label: tabLabels[section] || section,
    action: () => navigate(sectionBasePaths[section]),
  });

  if (step && step !== "initial" && stepLabels[step]) {
    crumbs.push({
      label: stepLabels[step],
      action: null,
    });
  }

  const displayCrumbs = crumbs.length > 3
    ? [crumbs[0], { label: "...", action: null }, crumbs[crumbs.length - 1]]
    : crumbs;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-muted py-2 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
      {displayCrumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-text-muted/50">→</span>}
          {crumb.action && i < displayCrumbs.length - 1 ? (
            <button
              onClick={crumb.action}
              className="hover:text-accent-gold transition-colors whitespace-nowrap"
            >
              {crumb.label}
            </button>
          ) : (
            <span className={`whitespace-nowrap ${i === displayCrumbs.length - 1 ? 'text-text-secondary font-medium' : ''}`}>
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Bottom Navigation for Mobile
const BottomNav = ({ activeSection, navigate }) => {
  const tabs = [
    { id: "vehicle", label: "Vehicle", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
    )},
    { id: "street", label: "Street", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { id: "home", label: "Home", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { id: "ice", label: "ICE", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
    )},
    { id: "rights", label: "Rights", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    )}
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-subtle sm:hidden z-50">
      <div className="flex justify-around items-center h-16 max-w-[640px] mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(sectionBasePaths[tab.id])}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              activeSection === tab.id ? 'text-accent-gold' : 'text-text-muted'
            }`}
          >
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Section tab icons
const tabIcons = {
  vehicle: Car,
  street: Users,
  home: Home,
  ice: FileWarning,
  rights: Shield
};

// Section index for animation direction
const sectionOrder = ['vehicle', 'street', 'home', 'ice', 'rights'];

// Main App Component
const LawEnforcementInteraction = () => {
  const { section = 'vehicle', step } = useParams();
  const currentStep = step || 'initial';
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect invalid sections
  useEffect(() => {
    if (!validSections.includes(section)) {
      navigate('/vehicle', { replace: true });
    }
  }, [section, navigate]);

  // Local state (not URL-driven)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Animation direction
  const [navDirection, setNavDirection] = useState(1);
  const prevSectionRef = useRef(section);
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const prevIdx = sectionOrder.indexOf(prevSectionRef.current);
    const currIdx = sectionOrder.indexOf(section);
    if (prevSectionRef.current !== section) {
      setNavDirection(currIdx >= prevIdx ? 1 : -1);
    } else if (prevStepRef.current !== currentStep) {
      setNavDirection(currentStep === 'initial' ? -1 : 1);
    }
    prevSectionRef.current = section;
    prevStepRef.current = currentStep;
  }, [section, currentStep]);

  // Theme
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Search
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(performSearch(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchResultClick = (routePath) => {
    navigate(routePath);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Track completed sections
  const markSectionCompleted = useCallback((sectionId) => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      return newSet;
    });
  }, []);

  const contentKey = `${section}-${currentStep}`;

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
  };

  // Render section content (placeholder for now — content added in Steps 2-5)
  const renderSectionContent = () => {
    return (
      <div className="text-center py-12 text-text-muted">
        <p className="text-lg font-medium text-text-secondary">
          {tabLabels[section] || section}
        </p>
        {currentStep !== 'initial' && (
          <p className="text-sm mt-1">Step: {currentStep}</p>
        )}
        <p className="text-sm mt-4">Content will be added in subsequent steps.</p>
      </div>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-background pb-20 sm:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-[640px] mx-auto bg-background border-0 shadow-none">
        <CardHeader className="bg-surface rounded-t-xl px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[28px] font-bold text-text-primary leading-[1.3]">Constitutional Rights Guide</CardTitle>
              <CardDescription className="text-text-muted text-base mt-1">
                Know Your Rights During Law Enforcement Encounters
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <ShareButton />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-background/30 transition-colors text-text-muted hover:text-text-primary"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
              <Shield className="h-8 w-8 text-accent-gold" />
            </div>
          </div>
          <div className="mt-4 p-3 bg-background/50 rounded-lg">
            <p className="text-sm text-text-muted leading-relaxed italic">
              <strong className="text-text-secondary not-italic">Legal Disclaimer:</strong> This app provides general information about legal rights in the United States.
              It is not legal advice, and no attorney-client relationship is created. Laws may vary by state.
              For legal advice specific to your situation, consult a licensed attorney.
            </p>
          </div>
        </CardHeader>

        <Breadcrumb section={section} step={currentStep} navigate={navigate} />

        <CardContent className="pt-4 px-4 sm:px-6">
          <div className="space-y-6">
            <ProgressBar completed={completedSections.size} total={10} />
            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              results={searchResults}
              onResultClick={handleSearchResultClick}
            />
            <QuickActions navigate={navigate} />

            <div>
              <h3 className="text-xl font-semibold mb-4 text-text-primary leading-[1.3]">Choose Your Situation</h3>

              {/* Desktop tab bar */}
              <div className="hidden sm:grid w-full grid-cols-5 gap-1 bg-muted p-1 rounded-lg mb-6">
                {validSections.map(s => {
                  const Icon = tabIcons[s];
                  return (
                    <button
                      key={s}
                      onClick={() => navigate(sectionBasePaths[s])}
                      className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors ${
                        section === s
                          ? 'bg-surface text-accent-gold shadow-sm'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{s === 'ice' ? 'ICE' : s === 'rights' ? 'Rights' : s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Section content with slide animation */}
              <AnimatePresence mode="wait" custom={navDirection}>
                <motion.div
                  key={contentKey}
                  custom={navDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {renderSectionContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
      <BottomNav activeSection={section} navigate={navigate} />
    </motion.div>
  );
};

export default LawEnforcementInteraction;
