import { useEffect, useState, useCallback } from 'react';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import StatusBar from './components/StatusBar.jsx';
import AIPanel from './components/AIPanel.jsx';
import TemplateManager from './components/TemplateManager.jsx';
import PrintView from './components/PrintView.jsx';
import StatusView from './components/StatusView.jsx';
import PresentationView from './components/PresentationView.jsx';
import BlockToolbar from './components/blocks/BlockToolbar.jsx';
import BlockContainer from './components/blocks/BlockContainer.jsx';
import ShapePicker from './components/blocks/ShapePicker.jsx';
import SlideRouter from './slides/index.jsx';
import RedactedShroud from './components/RedactedShroud.jsx';
import { lsGet, useLocalStorageBool } from './hooks/useLocalStorage.js';
import { useBlocks } from './hooks/useBlocks.js';

export default function App() {
  const [activeSlideId, setActiveSlideId] = useState('cover');
  const [showRedacted, setShowRedacted] = useLocalStorageBool('showRedacted', false);
  const [projectName, setProjectName] = useState(() => lsGet('f_project_name', ''));
  const [redactVersion, setRedactVersion] = useState(0);
  const [preReadVersion, setPreReadVersion] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Ready');
  const [statusColor, setStatusColor] = useState('var(--green)');

  const [aiOpen, setAIOpen] = useState(false);
  const [shapePickerOpen, setShapePickerOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useLocalStorageBool('sidebarOpen', true);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [presentMode, setPresentMode] = useState(false);

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

  const setStatus = useCallback((msg, color) => {
    setStatusMsg(msg);
    setStatusColor(color || 'var(--green)');
    if (color !== 'var(--orange)') {
      setTimeout(() => setStatusMsg('Ready'), 3000);
    }
  }, []);

  // Global paste: if clipboard has an image, create an image block on current slide
  useEffect(() => {
    function onPaste(e) {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        const items = e.clipboardData?.items || [];
        const hasImage = Array.from(items).some(i => i.type.startsWith('image/'));
        if (!hasImage) return;
      }

      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;
          const reader = new FileReader();
          reader.onload = ev => {
            add('image', { src: ev.target.result });
            setStatus('📸 Screenshot pasted as new image block');
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add]);

  const navigate = useCallback(id => {
    setActiveSlideId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onRedactChange = useCallback(() => {
    setRedactVersion(v => v + 1);
  }, []);

  // Card dispatches a window event on preread toggle; we just bump the version.
  useEffect(() => {
    const bump = () => setPreReadVersion(v => v + 1);
    window.addEventListener('preread-change', bump);
    return () => window.removeEventListener('preread-change', bump);
  }, []);

  const toggleRedaction = useCallback(() => {
    setShowRedacted(!showRedacted);
  }, [showRedacted, setShowRedacted]);

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
        onToggleTemplates={() => setTemplatesOpen(o => !o)}
        onPrint={() => setPrintMode(true)}
        onOpenStatus={() => setStatusOpen(true)}
        onPresent={() => setPresentMode(true)}
      />
      {printMode && (
        <PrintView showRedacted={showRedacted} onAfterPrint={() => setPrintMode(false)} />
      )}
      <Sidebar
        activeSlideId={activeSlideId}
        showRedacted={showRedacted}
        onNavigate={navigate}
        redactVersion={redactVersion}
        preReadVersion={preReadVersion}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {!sidebarOpen && (
        <button
          className="sidebar-reopen"
          onClick={() => setSidebarOpen(true)}
          title="Show slide list"
        >
          ☰
        </button>
      )}
      <div className={`main${!sidebarOpen ? ' full-width' : ''}`}>
        <div className="slide-view">
          <RedactedShroud
            slideId={activeSlideId}
            showRedacted={showRedacted}
            redactVersion={redactVersion}
          >
            <SlideRouter slideId={activeSlideId} onRedactChange={onRedactChange} />
            <BlockContainer
              blocks={blocks}
              onUpdate={update}
              onDelete={remove}
              onResize={resize}
              onReorder={reorder}
            />
          </RedactedShroud>
        </div>
      </div>
      <AIPanel open={aiOpen} onClose={() => setAIOpen(false)} onStatus={setStatus} />
      <TemplateManager open={templatesOpen} onClose={() => setTemplatesOpen(false)} onStatus={setStatus} />
      <StatusView open={statusOpen} onClose={() => setStatusOpen(false)} onNavigate={navigate} />
      {presentMode && (
        <PresentationView
          initialSlideId={activeSlideId}
          showRedacted={showRedacted}
          onExit={() => setPresentMode(false)}
        />
      )}
      {toolbarOpen ? (
        <BlockToolbar onAdd={addBlock} onClose={() => setToolbarOpen(false)} />
      ) : (
        <button
          className="block-toolbar-reopen"
          onClick={() => setToolbarOpen(true)}
          title="Show Add Block toolbar"
        >
          ＋
        </button>
      )}
      <ShapePicker
        open={shapePickerOpen}
        onCancel={() => setShapePickerOpen(false)}
        onConfirm={onShapeConfirm}
      />
      <StatusBar statusMsg={statusMsg} statusColor={statusColor} redactVersion={redactVersion} />
    </>
  );
}
