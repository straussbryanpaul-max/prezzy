import { useEffect, useState, useCallback } from 'react';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import StatusBar from './components/StatusBar.jsx';
import AIPanel from './components/AIPanel.jsx';
import NotesDrawer from './components/NotesDrawer.jsx';
import FileModal from './components/FileModal.jsx';
import BlockToolbar from './components/blocks/BlockToolbar.jsx';
import BlockContainer from './components/blocks/BlockContainer.jsx';
import ShapePicker from './components/blocks/ShapePicker.jsx';
import SlideRouter from './slides/index.jsx';
import { lsGet, useLocalStorageBool } from './hooks/useLocalStorage.js';
import { useBlocks } from './hooks/useBlocks.js';

export default function App() {
  const [activeSlideId, setActiveSlideId] = useState('cover');
  const [showRedacted, setShowRedacted] = useLocalStorageBool('showRedacted', false);
  const [projectName, setProjectName] = useState(() => lsGet('f_project_name', ''));
  const [redactVersion, setRedactVersion] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Ready');
  const [statusColor, setStatusColor] = useState('var(--green)');

  const [aiOpen, setAIOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [shapePickerOpen, setShapePickerOpen] = useState(false);

  const { blocks, add, update, remove, resize, reorder } = useBlocks(activeSlideId);

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

  const setStatus = useCallback((msg, color) => {
    setStatusMsg(msg);
    setStatusColor(color || 'var(--green)');
    if (color !== 'var(--orange)') {
      setTimeout(() => setStatusMsg('Ready'), 3000);
    }
  }, []);

  function addBlock(type) {
    if (type === 'shape') {
      setShapePickerOpen(true);
      return;
    }
    add(type);
  }

  function onShapeConfirm({ emoji, color }) {
    add('shape', { emoji, color });
    setShapePickerOpen(false);
  }

  return (
    <>
      <TopBar
        projectName={projectName}
        showRedacted={showRedacted}
        onToggleRedaction={toggleRedaction}
        onToggleAI={() => setAIOpen(o => !o)}
        onToggleNotes={() => setNotesOpen(o => !o)}
        onOpenFileModal={() => setFileOpen(true)}
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
          <BlockContainer
            blocks={blocks}
            onUpdate={update}
            onDelete={remove}
            onResize={resize}
            onReorder={reorder}
          />
        </div>
      </div>
      <AIPanel open={aiOpen} onClose={() => setAIOpen(false)} />
      <NotesDrawer open={notesOpen} onClose={() => setNotesOpen(false)} onStatus={setStatus} />
      <FileModal open={fileOpen} onClose={() => setFileOpen(false)} onStatus={setStatus} />
      <BlockToolbar onAdd={addBlock} onClose={() => {}} />
      <ShapePicker
        open={shapePickerOpen}
        onCancel={() => setShapePickerOpen(false)}
        onConfirm={onShapeConfirm}
      />
      <StatusBar statusMsg={statusMsg} statusColor={statusColor} redactVersion={redactVersion} />
    </>
  );
}
