import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Car, Users, Home, Scale, FileWarning, Search, Shield, Sun, Moon, Lock, X } from "lucide-react";
import ShareButton from "./ShareButton";
import InstallPrompt from "./InstallPrompt";
import { search as performSearch } from "../searchEngine";
import { sectionBasePaths, validSections } from "../routes";
import { getSectionContent } from "../content";
import { translateTree } from "../translate";
import { useLanguage } from "../i18n";
import { ui } from "../uiStrings";

const sections = {
  vehicle: { icon: Car, label: ui.navVehicle },
  street: { icon: Users, label: ui.navStreet },
  home: { icon: Home, label: ui.navHome },
  ice: { icon: FileWarning, label: ui.navIce },
  arrest: { icon: Lock, label: ui.navArrest },
  rights: { icon: Shield, label: ui.navRights },
};

const stepLabels = { driver: ui.crumbDriver, passenger: ui.crumbPassenger };

// Collapsed one-line legal disclaimer
const Disclaimer = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 text-sm text-text-muted">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-start gap-1.5 text-left"
      >
        <Scale className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          {t(ui.disclaimerShort)}{" "}
          <span className="underline underline-offset-2 whitespace-nowrap">
            {open ? t(ui.disclaimerHide) : t(ui.disclaimerShow)}
          </span>
        </span>
      </button>
      {open && <p className="mt-2 leading-relaxed">{t(ui.disclaimerFull)}</p>}
    </div>
  );
};

// Theme: a saved choice wins, otherwise follow the device setting
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // storage blocked (sandboxed viewer, private mode)
  }
  try {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  } catch {
    // matchMedia unavailable
  }
  return 'dark';
};

const foldAccents = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "");

// Highlight matching terms in text (accents are ignored when matching)
const HighlightText = ({ text, query }) => {
  const terms = foldAccents(query.toLowerCase()).split(/\s+/).filter((term) => term.length > 1);
  if (terms.length === 0) return <>{text}</>;
  const folded = foldAccents(text.toLowerCase());
  if (folded.length !== text.length) return <>{text}</>;

  const marks = new Array(text.length).fill(false);
  for (const term of terms) {
    let from = folded.indexOf(term);
    while (from !== -1) {
      marks.fill(true, from, from + term.length);
      from = folded.indexOf(term, from + term.length);
    }
  }

  const parts = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marks[i] !== marks[start]) {
      const piece = text.slice(start, i);
      parts.push(
        marks[start]
          ? <mark key={start} className="bg-accent-gold/30 text-text-primary rounded px-0.5">{piece}</mark>
          : piece
      );
      start = i;
    }
  }
  return <>{parts}</>;
};

// Search box with results dropdown
const SearchBar = ({ query, setQuery, results, onResultClick }) => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef(null);

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
    <div className="relative" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
      <input
        type="text"
        placeholder={t(ui.searchPlaceholder)}
        aria-label={t(ui.searchPlaceholder)}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setDismissed(false); }}
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
          aria-label={t(ui.clearSearch)}
        >
          <X className="h-4 w-4" />
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

// Breadcrumb, shown only on sub-pages
const Breadcrumb = ({ section, step, navigate }) => {
  const { t } = useLanguage();
  if (!stepLabels[step]) return null;

  return (
    <nav aria-label={t(ui.breadcrumb)} className="flex items-center gap-1.5 text-sm text-text-muted">
      <button
        onClick={() => navigate(sectionBasePaths[section])}
        className="hover:text-accent-gold transition-colors whitespace-nowrap"
      >
        {t(ui.crumbVehicle)}
      </button>
      <span className="text-text-muted/50">→</span>
      <span className="whitespace-nowrap text-text-secondary font-medium">{t(stepLabels[step])}</span>
    </nav>
  );
};

// Bottom navigation for phones
const BottomNav = ({ activeSection, navigate }) => {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-subtle sm:hidden z-50">
      <div className="flex justify-around items-center h-16 max-w-[640px] mx-auto">
        {validSections.map((id) => {
          const Icon = sections[id].icon;
          return (
            <button
              key={id}
              onClick={() => navigate(sectionBasePaths[id])}
              aria-current={activeSection === id ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 h-full transition-colors ${
                activeSection === id ? 'text-accent-gold' : 'text-text-muted'
              }`}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span className="text-[11px] font-medium truncate max-w-full px-0.5">{t(sections[id].label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
};

// Main App Component
const LawEnforcementInteraction = () => {
  const { section = 'vehicle', step } = useParams();
  const currentStep = step || 'initial';
  const navigate = useNavigate();
  const { lang, dict, setLang, t } = useLanguage();

  // Redirect invalid sections
  useEffect(() => {
    if (!validSections.includes(section)) {
      navigate('/vehicle', { replace: true });
    }
  }, [section, navigate]);

  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(getInitialTheme);
  const searchResults = useMemo(
    () => (searchQuery.trim() ? performSearch(searchQuery, lang) : []),
    [searchQuery, lang]
  );

  // Slide direction follows the order of the tabs
  const [slide, setSlide] = useState({ section, step: currentStep, direction: 1 });
  if (slide.section !== section) {
    const direction = validSections.indexOf(section) >= validSections.indexOf(slide.section) ? 1 : -1;
    setSlide({ section, step: currentStep, direction });
  } else if (slide.step !== currentStep) {
    setSlide({ section, step: currentStep, direction: currentStep === 'initial' ? -1 : 1 });
  }
  const navDirection = slide.direction;

  // Theme
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#f8fafc' : '#1e293b');
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage blocked; theme just won't persist
    }
  };

  const handleSearchResultClick = (routePath) => {
    navigate(routePath);
    setSearchQuery("");
  };

  const content = useMemo(
    () => translateTree(getSectionContent(section, currentStep, navigate), dict),
    [section, currentStep, navigate, dict]
  );

  return (
    <Motion.div
      className="min-h-screen bg-background pb-20 sm:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-[640px] mx-auto">
        <header className="bg-surface px-4 sm:px-6 py-4 sm:rounded-b-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Shield className="h-7 w-7 text-accent-gold shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight">{t(ui.appTitle)}</h1>
                <p className="hidden sm:block text-text-muted text-sm mt-0.5">{t(ui.appSubtitle)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                lang={lang === 'es' ? 'en' : 'es'}
                className="px-2 py-1.5 rounded-lg border border-border-subtle text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-background/30 transition-colors"
                aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
              >
                {lang === 'es' ? 'English' : 'Español'}
              </button>
              <ShareButton />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-background/30 transition-colors text-text-muted hover:text-text-primary"
                aria-label={theme === 'dark' ? t(ui.toLight) : t(ui.toDark)}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <Disclaimer />
        </header>

        <main className="px-4 sm:px-6 pt-4 pb-6">
          <div className="space-y-4">
            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              results={searchResults}
              onResultClick={handleSearchResultClick}
            />
            <InstallPrompt />
            <Breadcrumb section={section} step={currentStep} navigate={navigate} />

            <div>
              {/* Desktop tab bar */}
              <div className="hidden sm:grid w-full grid-cols-6 gap-1 bg-muted p-1 rounded-lg mb-6">
                {validSections.map((id) => {
                  const Icon = sections[id].icon;
                  return (
                    <button
                      key={id}
                      onClick={() => navigate(sectionBasePaths[id])}
                      aria-current={section === id ? "page" : undefined}
                      className={`flex items-center justify-center gap-1.5 py-3 rounded-md text-sm font-medium transition-colors ${
                        section === id
                          ? 'bg-surface text-accent-gold shadow-sm'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{t(sections[id].label)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Section content with slide animation */}
              <AnimatePresence mode="wait" custom={navDirection}>
                <Motion.div
                  key={`${section}-${currentStep}`}
                  custom={navDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {content}
                </Motion.div>
              </AnimatePresence>
            </div>

            <footer className="pt-2 text-xs text-text-muted leading-relaxed">
              <p>{t(ui.footerScope)} {t(ui.footerUpdated)}</p>
              {section !== 'rights' && (
                <button
                  onClick={() => navigate('/rights')}
                  className="mt-1 underline underline-offset-2 hover:text-text-secondary"
                >
                  {t(ui.footerSources)}
                </button>
              )}
            </footer>
          </div>
        </main>
      </div>
      <BottomNav activeSection={section} navigate={navigate} />
    </Motion.div>
  );
};

export default LawEnforcementInteraction;
