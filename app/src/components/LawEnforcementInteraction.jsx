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

// Highlight matching terms in text
const HighlightText = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        terms.some(t => part.toLowerCase() === t)
          ? <mark key={i} className="bg-accent-gold/30 text-text-primary rounded px-0.5">{part}</mark>
          : part
      )}
    </>
  );
};

// Search Component with Results Dropdown
const SearchBar = ({ query, setQuery, results, onResultClick }) => {
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef(null);

  // Reset dismissed state when query changes
  useEffect(() => {
    setDismissed(false);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDismissed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setDismissed(true);
      e.target.blur();
    } else if (e.key === 'Enter' && results.length > 0) {
      onResultClick(results[0].section);
      setDismissed(true);
    }
  };

  const showResults = !dismissed && query.trim().length > 0 && results.length > 0;

  return (
    <div className="relative mb-6" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
      <input
        type="text"
        placeholder="Search rights, procedures, or ask a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setDismissed(false)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-10 py-3 border border-border-subtle rounded-xl
                   focus:border-accent-gold focus:outline-none
                   bg-surface text-text-primary
                   placeholder-text-muted text-base"
      />
      {query && (
        <button
          onClick={() => { setQuery(""); setDismissed(true); }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border-subtle rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => { onResultClick(result.section); setDismissed(true); }}
              className={`w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border-subtle last:border-b-0 ${
                index === 0 ? 'bg-surface-hover/50' : ''
              }`}
            >
              <div className="font-medium text-sm text-text-primary">
                <HighlightText text={result.title} query={query} />
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                <HighlightText text={result.description} query={query} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Section Header with Share Button
const SectionHeader = ({ children }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex-1">{children}</div>
    <ShareButton />
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

  // --- Vehicle Section ---
  const renderVehicleInitial = () => (
    <div className="space-y-6">
      <div className="bg-blue-900/20 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Are you the driver or a passenger?</h2>
        </SectionHeader>
        <p className="text-text-muted mb-6">Your rights and responsibilities differ based on your role in the vehicle.</p>
        <div className="grid gap-4">
          <Button
            onClick={() => {
              navigate('/vehicle/driver');
              markSectionCompleted("vehicle-driver");
            }}
            className="h-auto py-6 px-6 text-left justify-start bg-surface border border-border-subtle hover:border-accent-gold/50 text-text-primary hover:bg-surface-hover"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold text-lg">I'm the Driver</div>
                <div className="text-sm text-text-muted">Learn your rights and responsibilities as the driver</div>
              </div>
            </div>
          </Button>
          <Button
            onClick={() => {
              navigate('/vehicle/passenger');
              markSectionCompleted("vehicle-passenger");
            }}
            className="h-auto py-6 px-6 text-left justify-start bg-surface border border-border-subtle hover:border-accent-gold/50 text-text-primary hover:bg-surface-hover"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold text-lg">I'm a Passenger</div>
                <div className="text-sm text-text-muted">Understand your specific rights as a passenger</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderVehicleDriver = () => (
    <div className="space-y-6">
      <Button
        onClick={() => navigate('/vehicle')}
        variant="ghost"
        className="mb-4 text-text-muted hover:text-text-secondary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Vehicle Options
      </Button>

      <SectionHeader>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Driver Rights & Procedures</h2>
      </SectionHeader>

      <Accordion title="🚗 If You're Stopped as a Driver" isImportant={true}>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-bold text-red-300 mb-2">Immediate Actions</h4>
              <ul className="space-y-1 text-sm">
                <li>• Pull over safely and turn off engine</li>
                <li>• Turn on interior light if dark</li>
                <li>• Keep hands visible on steering wheel</li>
                <li>• Stay calm and move slowly</li>
                <li>• Begin recording if possible</li>
              </ul>
            </div>
            <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-300 mb-2">Required Documents</h4>
              <ul className="space-y-1 text-sm">
                <li>• Driver's license</li>
                <li>• Vehicle registration</li>
                <li>• Proof of insurance</li>
                <li className="font-semibold">• Nothing else is required</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-purple-300 mb-3">Your Constitutional Rights During the Stop</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-2">You Have the Right To:</h5>
                <ul className="space-y-2">
                  <li>• Remain silent <span className="text-xs">(5th Amendment)</span></li>
                  <li>• Refuse searches <span className="text-xs">(4th Amendment)</span></li>
                  <li>• Record the interaction <span className="text-xs">(1st Amendment)</span></li>
                  <li>• Ask if you're free to go</li>
                  <li>• Request a supervisor</li>
                  <li>• Get badge numbers & names</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">NOT Recommended:</h5>
                <ul className="space-y-2 text-red-400">
                  <li>✗ Answering investigative questions (can only hurt, never help you)</li>
                  <li>✗ Trying to "explain" or "clear things up"</li>
                  <li>✗ Consenting to any searches</li>
                  <li>✗ Admitting to anything</li>
                  <li>✗ Arguing or debating</li>
                  <li>✗ Making sudden movements</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
            <h4 className="font-bold text-amber-300 mb-2">If Asked to Exit Vehicle</h4>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold">• You must comply with the order to exit</li>
              <li>• Close and lock your door behind you</li>
              <li>• You are NOT required to allow re-entry to the vehicle</li>
              <li>• State: "I do not consent to any searches of my vehicle"</li>
              <li>• Keep your keys with you</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="⚖️ What to Say - Constitutional Invocations" isImportant={true}>
        <div className="space-y-4">
          <div className="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-bold text-red-300 mb-2">⚠️ Critical Legal Reality</h4>
            <p className="text-sm font-semibold mb-2">Your statements to police can ONLY hurt you, never help you:</p>
            <ul className="space-y-1 text-sm">
              <li>• Anything you say CAN be used against you in court</li>
              <li>• Anything you say in your defense CANNOT be used to help you (it's hearsay)</li>
              <li>• There is NO legal benefit to explaining yourself to police</li>
              <li>• Even truthful statements can be misremembered or twisted</li>
            </ul>
          </div>

          <div className="bg-indigo-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-indigo-300 mb-2">Proper Legal Invocations</h4>
            <ul className="space-y-2 text-sm italic">
              <li>"I invoke and do not waive my 5th Amendment right to remain silent"</li>
              <li>"I invoke and do not waive my 4th Amendment right against unreasonable searches"</li>
              <li>"I do not consent to any searches of my person, vehicle, or belongings"</li>
              <li>"Am I being detained or am I free to go?"</li>
              <li>"I will not answer questions without an attorney present"</li>
              <li>"I am exercising my 1st Amendment right to record this interaction"</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="📱 Recording & Documentation Rights">
        <div className="space-y-4">
          <div className="bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-green-300 mb-2">Recording is Your Right</h4>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold">• Recording police interactions is protected by the 1st Amendment</li>
              <li>• Use dash cam or phone mount (hands-free)</li>
              <li>• You don't need to inform officers you're recording</li>
              <li>• Officers cannot legally order you to stop recording</li>
              <li>• Never unlock phone without a warrant</li>
              <li>• Upload/backup recordings immediately</li>
            </ul>
          </div>
          <div className="bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 mb-2">Document Everything</h4>
            <ul className="space-y-1 text-sm">
              <li>• Officer names and badge numbers</li>
              <li>• Patrol car numbers</li>
              <li>• Time, date, and exact location</li>
              <li>• Reason given for stop</li>
              <li>• Any threats or promises made</li>
              <li>• Witness contact information</li>
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  );

  const renderVehiclePassenger = () => (
    <div className="space-y-6">
      <Button
        onClick={() => navigate('/vehicle')}
        variant="ghost"
        className="mb-4 text-text-muted hover:text-text-secondary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Vehicle Options
      </Button>

      <SectionHeader>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Passenger Rights & Procedures</h2>
      </SectionHeader>

      <Accordion title="👥 Passenger Constitutional Rights" isImportant={true}>
        <div className="space-y-6">
          <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-300 mb-3">Key Passenger Rights</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>NO ID required unless suspected of specific crime <span className="text-xs">(4th Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Right to remain silent <span className="text-xs">(5th Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Can refuse searches even if driver consents <span className="text-xs">(4th Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Right to record the interaction <span className="text-xs">(1st Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Can leave on foot unless detained <span className="text-xs">(4th Amendment)</span></span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-purple-300 mb-2">Proper Invocations</h4>
              <ul className="space-y-1 text-sm italic">
                <li>"I invoke my 5th Amendment right to remain silent"</li>
                <li>"I do not consent to any searches"</li>
                <li>"Am I free to leave?"</li>
                <li>"What specific crime am I suspected of?"</li>
                <li>"I need to speak with an attorney"</li>
              </ul>
            </div>
            <div className="bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-orange-300 mb-2">If Ordered to Exit</h4>
              <ul className="space-y-1 text-sm">
                <li className="font-semibold">• You must comply with the order</li>
                <li>• Take ALL belongings with you</li>
                <li>• Close and lock door behind you</li>
                <li>• Step away from the vehicle</li>
                <li>• State: "I do not consent to any searches"</li>
                <li>• Ask: "Am I being detained or am I free to leave?"</li>
                <li>• Record if possible</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 mb-2">🚶 Passenger-Specific Rights</h4>
            <ul className="space-y-2 text-sm">
              <li>• Unless detained for a specific crime, passengers can usually leave on foot</li>
              <li>• You are NOT responsible for the driver's violations</li>
              <li>• Your belongings are separate - driver cannot consent to search YOUR bag</li>
              <li>• If police find something illegal that's not yours, do NOT claim ownership</li>
              <li>• You can refuse to answer questions about the driver</li>
            </ul>
          </div>

          <div className="bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-red-300 mb-2">⚠️ Important: Not Recommended</h4>
            <ul className="space-y-1 text-sm">
              <li>✗ Answering questions about where you're going/coming from</li>
              <li>✗ Providing ID unless legally required</li>
              <li>✗ Consenting to any searches</li>
              <li>✗ Making statements about the driver or situation</li>
              <li>✗ Reaching for anything without announcing it first</li>
              <li>✗ Arguing or interfering with the driver's interaction</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="📱 Recording as a Passenger">
        <div className="bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-green-300 mb-2">Your Right to Record:</h4>
          <ul className="space-y-1 text-sm">
            <li>• You have a 1st Amendment right to record</li>
            <li>• Record quietly without interfering</li>
            <li>• You don't need to announce you're recording</li>
            <li>• Keep phone visible to avoid "reaching" concerns</li>
            <li>• Upload/stream immediately if possible</li>
          </ul>
        </div>
      </Accordion>
    </div>
  );

  // --- Street Section ---
  const renderStreetInitial = () => (
    <div className="space-y-6">
      <div className="bg-green-900/20 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Street Stop Rights in New York</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-green-400">
          <h3 className="font-bold text-green-300 mb-2">🔹 New York is NOT a "Stop and Identify" State</h3>
          <p className="text-sm mb-4 text-text-muted">You are not required to show ID just because an officer asks. They need reasonable suspicion of a crime.</p>
          <div className="space-y-2 text-text-secondary">
            <div>✓ "Am I free to go?" <span className="text-xs">(4th Amendment - freedom from detention)</span></div>
            <div>✓ "I invoke my 5th Amendment right to remain silent"</div>
            <div>✓ "What crime am I suspected of?"</div>
            <div>✓ "I am exercising my 1st Amendment right to record"</div>
          </div>
        </div>
      </div>

      <Accordion title="⚖️ Constitutional Rights on the Street" isImportant={true}>
        <div className="space-y-3">
          <div className="bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-purple-300 mb-2">Your Rights During Street Stops</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>4th Amendment:</strong> Protection from unreasonable detention - you cannot be detained without reasonable suspicion</li>
              <li>• <strong>5th Amendment:</strong> You don't have to answer any questions</li>
              <li>• <strong>1st Amendment:</strong> Right to record police in public spaces</li>
              <li>• You can walk away unless told you're being detained</li>
              <li>• You can refuse consent to searches</li>
            </ul>
          </div>

          <div className="bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-red-300 mb-2">⚠️ Remember: Explanations Can't Help You</h4>
            <p className="text-sm">
              Your explanations to police are inadmissible hearsay if you try to use them in your defense,
              but CAN be used against you as evidence. There's no legal benefit to explaining yourself on the street.
            </p>
          </div>
        </div>
      </Accordion>

      <Accordion title="📱 Recording Your Interaction" isImportant={true}>
        <div className="space-y-3">
          <div className="bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-blue-300 mb-2">Recording is Strongly Recommended</h4>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold">• Recording police is a 1st Amendment protected activity</li>
              <li>• You can record officers performing duties in public</li>
              <li>• Keep a safe, non-interfering distance</li>
              <li>• You don't have to stop recording if asked</li>
              <li>• Officers cannot legally delete your recordings</li>
              <li>• Immediately backup/stream recordings to cloud</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="🛑 Terry Stops and Your Rights">
        <div className="space-y-3">
          <div className="bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 mb-2">Understanding Terry Stops</h4>
            <ul className="space-y-1 text-sm">
              <li>• Police need "reasonable suspicion" to detain you</li>
              <li>• Pat-downs are only for weapons, not general searches</li>
              <li>• You can refuse consent to searches beyond pat-down</li>
              <li>• Ask: "Am I being detained or am I free to go?"</li>
              <li>• If free to go, you can leave immediately</li>
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  );

  // --- Home Section ---
  const renderHomeInitial = () => (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Police at Your Home</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-yellow-400">
          <h3 className="font-bold text-yellow-300 mb-2">🏠 Your 4th Amendment Castle Doctrine Rights</h3>
          <p className="text-sm mb-4 text-text-muted">Your home has the strongest Fourth Amendment protections against unreasonable searches.</p>
          <div className="space-y-2 text-text-secondary">
            <div>✓ You don't have to open the door</div>
            <div>✓ You can speak through the closed door</div>
            <div>✓ Demand to see a warrant signed by a judge</div>
            <div>✓ Record through doorbell camera or window</div>
            <div>✓ You can remain completely silent</div>
          </div>
        </div>
      </div>

      <Accordion title="⚖️ Constitutional Protections at Home" isImportant={true}>
        <div className="bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-indigo-300 mb-2">What to Say Through the Door</h4>
          <ul className="space-y-1 text-sm italic">
            <li>"I invoke my 4th Amendment right against unreasonable searches"</li>
            <li>"I do not consent to any entry or searches"</li>
            <li>"Please show me a warrant signed by a judge"</li>
            <li>"I invoke my 5th Amendment right to remain silent"</li>
            <li>"I will not open the door without a valid warrant"</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="🚪 When They Can Enter Without Your Permission" isImportant={true}>
        <div className="bg-red-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 mb-2">Limited Exceptions (Very Narrow):</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Valid Search Warrant:</strong> Must be signed by a judge, not just police</li>
            <li>• <strong>Hot Pursuit:</strong> Chasing someone who just committed a crime</li>
            <li>• <strong>Immediate Danger:</strong> Someone inside is in immediate peril</li>
            <li>• <strong>Destruction of Evidence:</strong> Very limited and specific circumstances</li>
          </ul>
          <p className="text-xs mt-3 font-semibold">Note: "We just want to talk" or "We're investigating" are NOT valid reasons for entry</p>
        </div>
      </Accordion>

      <Accordion title="📋 Warrant Requirements">
        <div className="bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-blue-300 mb-2">Valid Warrant Must Have:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Judge's signature (not just police)</li>
            <li>• Correct address</li>
            <li>• Specific items or persons being sought</li>
            <li>• Recent date (not expired)</li>
            <li>• Ask them to slip it under the door or show through window</li>
          </ul>
          <div className="bg-red-900/20 p-3 rounded mt-3">
            <p className="text-xs font-semibold text-red-300">⚠️ IMPORTANT: An arrest warrant for a person does NOT grant entry to a home unless they have reasonable belief the person is inside AND it's that person's residence</p>
          </div>
        </div>
      </Accordion>

      <Accordion title="⚠️ NEVER Open Your Door" isImportant={true}>
        <div className="bg-red-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 mb-2">Why Opening the Door is Dangerous:</h4>
          <ul className="space-y-2 text-sm">
            <li>• Officers may put their foot in to prevent closing</li>
            <li>• They may claim to "see" or "smell" something as probable cause</li>
            <li>• Opening creates opportunity for forced entry</li>
            <li>• You can be arrested if you step outside</li>
            <li className="font-semibold">• ALWAYS speak through the closed door</li>
            <li className="font-semibold">• Warrants can be slipped under the door if needed</li>
          </ul>
        </div>
      </Accordion>
    </div>
  );

  // --- ICE Section ---
  const renderIceInitial = () => (
    <div className="space-y-6">
      <div className="bg-purple-900/20 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">ICE Encounters</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-purple-400">
          <h3 className="font-bold text-purple-300 mb-2">⚖️ Constitutional Rights Apply to Everyone</h3>
          <p className="text-sm mb-4 text-text-muted">Regardless of immigration status, the Constitution protects you.</p>
          <div className="space-y-2 text-text-secondary">
            <div>✓ 5th Amendment right to remain silent</div>
            <div>✓ 4th Amendment right against unreasonable searches</div>
            <div>✓ 6th Amendment right to an attorney</div>
            <div>✓ Do not sign anything without an attorney</div>
            <div>✓ Right to refuse entry without judicial warrant</div>
          </div>
        </div>
      </div>

      <Accordion title="📋 If ICE Comes to Your Home" isImportant={true}>
        <div className="bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-blue-300 mb-2">Critical Steps:</h4>
          <ul className="space-y-2 text-sm">
            <li className="font-semibold">• DO NOT open the door</li>
            <li>• Ask: "Do you have a warrant signed by a judge?"</li>
            <li>• <strong>Administrative warrants (Form I-200, I-205) are NOT sufficient for entry</strong></li>
            <li>• Only a judicial warrant (signed by a judge) allows entry</li>
            <li>• Say: "I do not consent to entry"</li>
            <li>• Say: "I invoke my right to remain silent"</li>
            <li>• Have emergency contacts and attorney info ready</li>
            <li>• Document everything, record if possible</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="⚖️ Know Your Rights Statements">
        <div className="bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-purple-300 mb-2">What to Say:</h4>
          <ul className="space-y-1 text-sm italic">
            <li>"I invoke my 5th Amendment right to remain silent"</li>
            <li>"I do not consent to any entry or searches"</li>
            <li>"I will not sign anything without an attorney"</li>
            <li>"I am exercising my right to an attorney"</li>
            <li>"Show me a warrant signed by a federal judge"</li>
          </ul>
        </div>
      </Accordion>
    </div>
  );

  // --- Rights Section ---
  const renderRightsInitial = () => (
    <div className="space-y-6">
      <div className="bg-indigo-900/20 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Constitutional Rights During Law Enforcement Interactions</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-indigo-400">
          <h3 className="font-bold text-indigo-300 mb-2">📜 Key Amendments in Police Encounters</h3>
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <strong>1st Amendment:</strong> Right to record police, freedom of speech, assembly
              <p className="text-xs mt-1 text-text-muted">• You can record any police interaction in public spaces</p>
            </div>
            <div>
              <strong>4th Amendment:</strong> Protection from unreasonable searches and seizures
              <p className="text-xs mt-1 text-text-muted">• Requires warrant or probable cause for searches</p>
              <p className="text-xs text-text-muted">• Protects against unlawful detention</p>
            </div>
            <div>
              <strong>5th Amendment:</strong> Right to remain silent, protection against self-incrimination
              <p className="text-xs mt-1 text-text-muted">• You cannot be forced to answer questions</p>
              <p className="text-xs text-text-muted">• Must be clearly invoked to be effective</p>
            </div>
            <div>
              <strong>6th Amendment:</strong> Right to an attorney
              <p className="text-xs mt-1 text-text-muted">• Applies during custodial interrogation</p>
            </div>
          </div>
        </div>
      </div>

      <Accordion title="⚡ Critical Phrases for Any Police Encounter" isImportant={true}>
        <div className="bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-purple-300 mb-2">Say These Clearly and Calmly:</h4>
          <ul className="space-y-2 text-sm italic">
            <li>"I invoke and do not waive my 5th Amendment right to remain silent"</li>
            <li>"I invoke and do not waive my 4th Amendment rights"</li>
            <li>"I do not consent to any searches"</li>
            <li>"Am I free to leave?"</li>
            <li>"I will not answer questions without an attorney present"</li>
            <li>"I am exercising my 1st Amendment right to record"</li>
            <li>"May I have your name and badge number?"</li>
            <li>"I would like to speak with a supervisor"</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="⚠️ Why You Should NEVER Explain Yourself" isImportant={true}>
        <div className="bg-red-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 mb-2">The Legal Asymmetry - Statements Can Only Hurt You:</h4>
          <ul className="space-y-2 text-sm">
            <li className="font-semibold">• Your statements CAN be used AGAINST you in court</li>
            <li className="font-semibold">• Your statements CANNOT be used to HELP you (they're hearsay)</li>
            <li>• Even truthful explanations can be twisted or misremembered</li>
            <li>• "Clearing things up" with police has no legal benefit</li>
            <li>• Innocent explanations can accidentally provide probable cause</li>
            <li>• Your defense belongs in court with your attorney, not on the street</li>
          </ul>
          <p className="text-xs mt-3 font-semibold bg-red-900/30 p-2 rounded">
            REMEMBER: There is literally NO legal advantage to explaining yourself to police. Save your defense for court where it can actually help you.
          </p>
        </div>
      </Accordion>

      <Accordion title="🚫 What NOT to Do (Protecting Your Rights)">
        <div className="bg-red-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 mb-2">Never Recommended:</h4>
          <ul className="space-y-1 text-sm">
            <li>✗ Answering questions during an investigation</li>
            <li>✗ Trying to "explain your side" (it's hearsay and can't help you in court)</li>
            <li>✗ Consenting to any searches</li>
            <li>✗ Providing information beyond ID when required</li>
            <li>✗ Making statements about where you've been or are going</li>
            <li>✗ Trying to talk your way out of a situation</li>
            <li>✗ Physically resisting (even unlawful arrests)</li>
            <li>✗ Arguing law with officers on scene</li>
            <li>✗ Signing anything without reading and understanding</li>
          </ul>
          <p className="text-xs mt-3 font-semibold">Remember: Anything you say can and will be used against you, but CANNOT be used to help you (it's hearsay)</p>
        </div>
      </Accordion>

      <Accordion title="📱 Always Document Everything">
        <div className="bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-green-300 mb-2">Recording and Documentation Rights:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Recording police is a 1st Amendment protected activity</li>
            <li>• Get badge numbers, names, patrol car numbers</li>
            <li>• Note exact time, date, location</li>
            <li>• Get witness contact information</li>
            <li>• Save/backup recordings immediately</li>
            <li>• Write down everything while memory is fresh</li>
            <li>• Take photos of any injuries or damage</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="⚖️ After the Encounter">
        <div className="bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-300 mb-2">Protecting Your Rights After:</h4>
          <ul className="space-y-1 text-sm">
            <li>• File complaints for rights violations</li>
            <li>• Contact civil rights attorneys</li>
            <li>• Preserve all evidence and recordings</li>
            <li>• Get medical attention if needed (document injuries)</li>
            <li>• Don't post on social media until consulting attorney</li>
            <li>• Request body cam footage (time limits apply)</li>
          </ul>
        </div>
      </Accordion>

      <div className="mt-6 p-4 bg-surface rounded-xl border border-border-subtle">
        <h4 className="font-bold text-text-secondary mb-2 flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Important Legal Notice
        </h4>
        <p className="text-xs text-text-muted">
          This app provides general information about legal rights in the United States. It is not legal advice,
          and no attorney-client relationship is created. Laws may vary by state and jurisdiction. Constitutional
          rights described here are based on federal law, but state and local laws may provide additional protections
          or requirements. For legal advice specific to your situation, consult a licensed attorney in your jurisdiction.
          If you are arrested or charged with a crime, seek legal counsel immediately.
        </p>
      </div>
    </div>
  );

  // Render section content
  const renderSectionContent = () => {
    // Vehicle section
    if (section === 'vehicle') {
      if (currentStep === 'driver') return renderVehicleDriver();
      if (currentStep === 'passenger') return renderVehiclePassenger();
      return renderVehicleInitial();
    }

    // Street section
    if (section === 'street') return renderStreetInitial();

    // Home section
    if (section === 'home') return renderHomeInitial();

    // ICE section
    if (section === 'ice') return renderIceInitial();

    // Rights section
    if (section === 'rights') return renderRightsInitial();

    return null;
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
