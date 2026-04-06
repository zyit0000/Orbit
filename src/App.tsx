/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Play, 
  Eraser, 
  FolderOpen, 
  Save, 
  Paperclip, 
  ChevronDown, 
  Settings, 
  Minus, 
  Square, 
  X, 
  Circle,
  Info,
  Bell,
  Copy
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, type ReactNode, useEffect, useRef } from 'react';

const OrbitLogo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Central Eye/Planet */}
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    
    {/* Inner Ring */}
    <ellipse cx="50" cy="50" rx="22" ry="12" stroke="currentColor" strokeWidth="4" />
    
    {/* Middle Ring */}
    <ellipse cx="50" cy="50" rx="38" ry="22" stroke="currentColor" strokeWidth="4" />
    
    {/* Outer Ring */}
    <ellipse cx="50" cy="50" rx="54" ry="32" stroke="currentColor" strokeWidth="4" />
    
    {/* Orbital Dots based on image */}
    <circle cx="12" cy="50" r="6" fill="currentColor" /> {/* Left dot on middle ring */}
    <circle cx="75" cy="22" r="6" fill="currentColor" /> {/* Top right dot on outer ring */}
    <circle cx="82" cy="72" r="6" fill="currentColor" /> {/* Bottom right dot on outer ring */}
  </svg>
);

const DiscordIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

function Toggle({ enabled, onClick, isDark }: { enabled: boolean, onClick: () => void, isDark: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled 
          ? (isDark ? 'bg-white' : 'bg-[#323130]') 
          : (isDark ? 'bg-[#444444]' : 'bg-[#EDEBE9]')
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
          isDark ? 'bg-[#1F1F1F]' : 'bg-white'
        } ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

interface NotificationData {
  id: string;
  type: 'info' | 'error' | 'success';
  message: string;
}

function Notification({ id, type, message, onClose, isDark }: { id: string, type: 'info' | 'error' | 'success', message: string, onClose: (id: string) => void, isDark: boolean }) {
  const isError = type === 'error';
  
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="relative flex items-start gap-3 p-4 rounded-lg shadow-2xl border min-w-[300px] max-w-md backdrop-blur-md bg-[#1F1F1F]/90 border-[#444444] text-white"
    >
      <div className="flex-shrink-0 mt-1">
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative ${isError ? 'border-red-500/50' : 'border-white/20'}`}>
          <Bell size={20} className={isError ? 'text-red-500' : 'text-white'} />
          <div className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full ${isError ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'}`} />
        </div>
      </div>
      
      <div className="flex-1 pr-6">
        <h4 className="text-sm font-semibold mb-1">
          {isError ? 'Error Occurred' : 'Notification'}
        </h4>
        <p className="text-xs text-[#A19F9D] leading-relaxed break-words">
          {message}
        </p>
        
        {isError && (
          <button 
            onClick={copyToClipboard}
            className={`mt-2 text-[10px] font-bold uppercase tracking-wider hover:underline flex items-center gap-1 ${isDark ? 'text-white' : 'text-[#0078D4]'}`}
          >
            <Copy size={10} />
            Copy Error
          </button>
        )}
      </div>

      <button 
        onClick={() => onClose(id)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <X size={14} className="text-[#A19F9D]" />
      </button>
    </motion.div>
  );
}

export default function App() {
  const [isDisconnected, setIsDisconnected] = useState(true);
  const [attachedPort, setAttachedPort] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const addNotification = (type: 'info' | 'error' | 'success', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Editor Settings
  const defaultSettings = {
    fontSize: 14,
    lineNumbers: true,
    minimap: false,
    wordWrap: true,
    smoothTyping: true,
    executor: 'Opiumware',
    theme: 'dark' as 'light' | 'dark',
  };
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('orbit_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem('orbit_code');
    return saved || 'print("Welcome!")';
  });

  const handleAttach = async () => {
    try {
      const response = await fetch('/api/attach', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executor: settings.executor })
      });
      const data = await response.json();
      if (data.success) {
        setIsDisconnected(false);
        setAttachedPort(data.port);
        addNotification('success', `Connected! (${data.port})`);
      } else {
        setIsDisconnected(true);
        setAttachedPort(null);
        addNotification('error', data.message);
      }
    } catch (error: any) {
      addNotification('error', `Failed to connect: ${error.message}`);
    }
  };

  const handleExecute = async () => {
    if (isDisconnected || !attachedPort) {
      addNotification('info', 'Please attach to a port first.');
      return;
    }

    try {
      const isOpium = settings.executor === 'Opiumware';
      const finalCode = isOpium ? `OpiumwareScript ${code}` : code;
      
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: finalCode, 
          port: attachedPort,
          executor: settings.executor
        })
      });
      const data = await response.json();
      if (data.success) {
        addNotification('success', 'Script executed successfully.');
      } else {
        addNotification('error', data.message);
      }
    } catch (error: any) {
      addNotification('error', `Execution failed: ${error.message}`);
    }
  };

  useEffect(() => {
    // Detach if executor changes
    if (attachedPort) {
      setIsDisconnected(true);
      setAttachedPort(null);
      addNotification('info', `Switched to ${settings.executor}. Please re-attach.`);
    }
  }, [settings.executor]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('orbit_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('orbit_code', code);
  }, [code]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem('orbit_code', code);
    }, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [code]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const isDark = settings.theme === 'dark';
  const setTheme = (t: 'light' | 'dark') => setSettings({ ...settings, theme: t });

  return (
    <div className={`w-screen h-screen flex font-sans transition-colors duration-300 ${isDark ? 'dark bg-[#1F1F1F] text-[#F3F3F3]' : 'light bg-white text-[#323130]'}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`w-full h-full flex flex-col relative transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}
      >
        {/* Top Bar */}
        <div 
          className={`h-12 flex items-center justify-between px-4 relative z-50 backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F]/80' : 'bg-white/80'}`}
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <OrbitLogo size={20} className={isDark ? 'text-[#F3F3F3]' : 'text-[#323130]'} />
            <div className={`h-4 w-[1px] ${isDark ? 'bg-[#333333]' : 'bg-[#E1E1E1]'}`} />
            <div className="flex items-center gap-1" ref={dropdownRef}>
              <span className="text-sm font-medium">Orbit</span>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`p-1 rounded transition-colors flex items-center ${isDark ? 'hover:bg-[#333333]' : 'hover:bg-[#EDEBE9]'}`}
                >
                  <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute left-0 mt-2 w-48 border rounded-md shadow-lg py-1 z-50 transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F] border-[#444444]' : 'bg-white border-[#E1E1E1]'}`}
                    >
                      <button 
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-[#3D3D3D]' : 'hover:bg-[#F3F2F1]'}`}
                      >
                        <Settings size={14} />
                        <span>Settings</span>
                      </button>
                      <div className={`h-[1px] my-1 ${isDark ? 'bg-[#444444]' : 'bg-[#E1E1E1]'}`} />
                      <a 
                        href="https://example.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-[#3D3D3D]' : 'hover:bg-[#F3F2F1]'}`}
                      >
                        <OrbitLogo size={14} />
                        <span>About Orbit</span>
                      </a>
                      <a 
                        href="https://discord.gg/opiumware" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'hover:bg-[#3D3D3D]' : 'hover:bg-[#F3F2F1]'}`}
                      >
                        <DiscordIcon size={14} className="text-[#5865F2]" />
                        <span>Discord</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <Circle size={10} fill={isDisconnected ? "#D83B01" : "#107C10"} className={isDisconnected ? "text-[#D83B01]" : "text-[#107C10]"} />
            <span className={`text-sm font-medium ${isDark ? 'text-[#F3F3F3]' : 'text-[#323130]'}`}>
              {isDisconnected ? "Disconnected!" : `Connected! (${attachedPort})`}
            </span>
          </div>

          <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button 
              onClick={() => (window as any).electron?.minimize()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-[#333333]' : 'hover:bg-[#EDEBE9]'}`}
            >
              <Minus size={16} />
            </button>
            <button 
              onClick={() => (window as any).electron?.maximize()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-[#333333]' : 'hover:bg-[#EDEBE9]'}`}
            >
              <Square size={14} />
            </button>
            <button 
              onClick={() => (window as any).electron?.close()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-[#C42B1C] hover:text-white' : 'hover:bg-[#C42B1C] hover:text-white'}`}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden relative">
          <Editor
            height="100%"
            defaultLanguage="lua"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={isDark ? 'orbit-dark' : 'light'}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('orbit-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': '#1F1F1F',
                  'scrollbarSlider.background': '#444444',
                  'scrollbarSlider.hoverBackground': '#555555',
                  'scrollbarSlider.activeBackground': '#666666',
                },
              });
            }}
            options={{
              minimap: { enabled: settings.minimap },
              fontSize: settings.fontSize,
              fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
              lineNumbers: settings.lineNumbers ? 'on' : 'off',
              wordWrap: settings.wordWrap ? 'on' : 'off',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              fontLigatures: true,
              padding: { top: 16 },
              cursorStyle: 'line',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: settings.smoothTyping ? 'on' : 'off',
              renderLineHighlight: 'all',
              backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              }
            }}
          />
        </div>

        {/* Bottom Bar */}
        <div className={`h-16 flex items-center justify-between px-4 z-10 transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <ActionButton 
              icon={<Play size={16} />} 
              label="Execute" 
              isDark={isDark}
              onClick={handleExecute} 
            />
            <ActionButton icon={<Eraser size={16} />} label="Clear" isDark={isDark} onClick={() => setCode('')} />
            <ActionButton icon={<FolderOpen size={16} />} label="Open" isDark={isDark} />
            <ActionButton icon={<Save size={16} />} label="Save" isDark={isDark} />
          </div>

          <ActionButton icon={<Paperclip size={16} />} label="Attach" isDark={isDark} onClick={handleAttach} />
        </div>

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
          <AnimatePresence>
            {notifications.map(notification => (
              <div key={notification.id} className="pointer-events-auto">
                <Notification 
                  {...notification} 
                  onClose={removeNotification} 
                  isDark={isDark}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Full-UI Settings Overlay */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`rounded-lg shadow-2xl border w-full max-w-lg overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F] border-[#444444]' : 'bg-white border-[#E1E1E1]'}`}
              >
                <div className={`h-12 border-b flex items-center justify-between px-4 transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F] border-[#333333]' : 'bg-white border-[#E1E1E1]'}`}>
                  <span className="font-semibold text-sm">Settings</span>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-[#333333]' : 'hover:bg-[#EDEBE9]'}`}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-6 max-h-[450px] overflow-y-auto">
                  {/* Theme Setting */}
                  <div className="space-y-3">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Appearance</label>
                    <div className={`flex gap-2 p-1 rounded-lg ${isDark ? 'bg-[#111111]' : 'bg-[#F3F2F1]'}`}>
                      <button 
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${settings.theme === 'light' ? 'bg-white shadow-sm text-black' : isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}
                      >
                        Light
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${settings.theme === 'dark' ? (isDark ? 'bg-[#333333]' : 'bg-white') + ' shadow-sm ' + (isDark ? 'text-white' : 'text-black') : isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-3">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Editor Font Size</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="10" 
                        max="24" 
                        value={settings.fontSize} 
                        onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                        className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer ${isDark ? 'accent-white bg-[#333333]' : 'accent-black bg-[#EDEBE9]'}`}
                      />
                      <span className="text-sm font-mono w-10 text-right">{settings.fontSize}px</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Line Numbers</div>
                        <div className={`text-xs ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Display numbers in the gutter</div>
                      </div>
                      <Toggle enabled={settings.lineNumbers} isDark={isDark} onClick={() => setSettings({...settings, lineNumbers: !settings.lineNumbers})} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Minimap</div>
                        <div className={`text-xs ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Show a code overview on the right</div>
                      </div>
                      <Toggle enabled={settings.minimap} isDark={isDark} onClick={() => setSettings({...settings, minimap: !settings.minimap})} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Word Wrap</div>
                        <div className={`text-xs ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Wrap long lines to fit the screen</div>
                      </div>
                      <Toggle enabled={settings.wordWrap} isDark={isDark} onClick={() => setSettings({...settings, wordWrap: !settings.wordWrap})} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Smooth Typing</div>
                        <div className={`text-xs ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Enable smooth caret animations</div>
                      </div>
                      <Toggle enabled={settings.smoothTyping} isDark={isDark} onClick={() => setSettings({...settings, smoothTyping: !settings.smoothTyping})} />
                    </div>

                    {/* Executor Setting */}
                    <div className="space-y-3 pt-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>Executor</label>
                      <select 
                        value={settings.executor}
                        onChange={(e) => setSettings({...settings, executor: e.target.value})}
                        className={`w-full p-2 rounded border text-sm font-medium focus:outline-none transition-colors ${isDark ? 'bg-[#2D2D2D] border-[#444444] text-white focus:border-white' : 'bg-white border-[#E1E1E1] text-[#323130] focus:border-black'}`}
                      >
                        <option value="Opiumware">Opiumware</option>
                        <option value="MacSploit">MacSploit</option>
                      </select>
                      {attachedPort && (
                        <div className={`text-xs font-medium ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}>
                          Attached to port: <span className="text-[#0078D4]">{attachedPort}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`h-14 border-t flex items-center justify-between px-4 transition-colors duration-300 ${isDark ? 'bg-[#1F1F1F] border-[#333333]' : 'bg-white border-[#E1E1E1]'}`}>
                  <button 
                    onClick={resetSettings}
                    className={`text-xs font-medium hover:underline ${isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}`}
                  >
                    Reset to Defaults
                  </button>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className={`px-6 py-1.5 rounded text-sm font-medium transition-colors shadow-sm ${isDark ? 'bg-white text-black hover:bg-[#F3F3F3]' : 'bg-black text-white hover:bg-[#333333]'}`}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


function ActionButton({ icon, label, onClick, className = "", isDark = false }: { icon: ReactNode, label: string, onClick?: () => void, className?: string, isDark?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm font-medium transition-all shadow-sm ${className} ${
        isDark 
          ? 'bg-[#2D2D2D] border-[#444444] text-[#F3F3F3] hover:bg-[#3D3D3D] hover:border-[#555555] active:bg-[#444444]' 
          : 'bg-white border-[#E1E1E1] text-[#323130] hover:bg-[#F3F2F1] hover:border-[#D1D1D1] active:bg-[#EDEBE9]'
      }`}
    >
      <span className={isDark ? 'text-[#A19F9D]' : 'text-[#605E5C]'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}






