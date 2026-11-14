import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../i18n';
import { ui } from '../uiStrings';

const DISMISSED_KEY = 'installPromptDismissed';

const isStandalone = () => {
  try {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  } catch {
    return false;
  }
};

const wasDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
};

// iOS browsers have no install event, so we show instructions there instead.
const isIos = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

const InstallPrompt = () => {
  const { t } = useLanguage();
  const [installEvent, setInstallEvent] = useState(null);
  const [hidden, setHidden] = useState(() => isStandalone() || wasDismissed());
  const [showIosHint] = useState(isIos);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    const onInstalled = () => setHidden(true);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (hidden || (!installEvent && !showIosHint)) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // storage blocked; the prompt will come back next visit
    }
  };

  const install = async () => {
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    setInstallEvent(null);
    if (outcome === 'accepted') setHidden(true);
  };

  return (
    <div className="flex items-center gap-3 bg-surface border border-border-subtle rounded-xl p-3">
      <Download className="h-5 w-5 text-accent-gold shrink-0" />
      <div className="flex-1 min-w-0 text-sm">
        <div className="font-semibold text-text-primary">{t(ui.installTitle)}</div>
        <div className="text-text-muted">
          {installEvent
            ? t(ui.installBody)
            : t(ui.installIos)}
        </div>
      </div>
      {installEvent && (
        <button
          onClick={install}
          className="shrink-0 rounded-lg bg-accent-gold px-3 py-2 text-sm font-semibold text-background hover:bg-accent-gold-hover transition-colors"
        >
          {t(ui.installButton)}
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label={t(ui.installDismiss)}
        className="shrink-0 p-2 rounded-lg text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default InstallPrompt;
