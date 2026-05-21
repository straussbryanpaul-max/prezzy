import { useEffect, useState, useCallback } from 'react';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import StatusBar from './components/StatusBar.jsx';
import SlideRouter from './slides/index.jsx';
import { lsGet, useLocalStorageBool } from './hooks/useLocalStorage.js';

export default function App() {
  const [activeSlideId, setActiveSlideId] = useState('cover');
  const [showRedacted, setShowRedacted] = useLocalStorageBool('showRedacted', false);
  const [projectName, setProjectName] = useState(() => lsGet('f_project_name', ''));
  const [redactVersion, setRedactVersion] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Ready');
  const [statusColor, setStatusColor] = useState('var(--green)');

  // Listen for project name changes via storage
  useEffect(() => {
    const handler = () => setProjectName(lsGet('f_project_name', ''));
    window.addEventListener('storage', handler);
    const id = setInterval(handler, 1000);
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(id);
    };
  }, []);

  const navigate = useCallback(id => {
    setActiveSlideId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onRedactChange = useCallback(() => {
    setRedactVersion(v => v + 1);
  }, []);

  const toggleRedaction = useCallback(() => {
    setShowRedacted(!showRedacted);
  }, [showRedacted, setShowRedacted]);

  return (
    <>
      <TopBar
        projectName={projectName}
        showRedacted={showRedacted}
        onToggleRedaction={toggleRedaction}
        onToggleAI={() => alert('AI Assistant panel coming next.')}
        onToggleNotes={() => alert('Estimator Notes drawer coming next.')}
        onOpenFileModal={() => alert('File modal coming next.')}
      />
      <Sidebar
        activeSlideId={activeSlideId}
        showRedacted={showRedacted}
        onNavigate={navigate}
        redactVersion={redactVersion}
      />
      <div className="main">
        <div className="slide-view">
          <SlideRouter slideId={activeSlideId} onRedactChange={onRedactChange} />
        </div>
      </div>
      <StatusBar statusMsg={statusMsg} statusColor={statusColor} redactVersion={redactVersion} />
    </>
  );
}
