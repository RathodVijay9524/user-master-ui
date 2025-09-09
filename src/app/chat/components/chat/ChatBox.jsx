import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { sendChat, clear, resetConversationId, sendMessage } from "../../../../redux/chat/chatSlice";
import { setProvider } from "../../../../redux/chat/settingsSlice";
import SettingsModal from "../SettingsModal";

const themes = {
  dark: {
    sidebar: "#0a0f1c",
    main: "#0f172a",
    bubble: "#1e293b",
    input: "#1e293b",
    text: "#e5e7eb",
    border: "#1f2937",
    userBubble: "#1e40af",
    userText: "#e0e7ff",
    aiBubble: "#334155",
    aiText: "#f1f5f9",
  },
  green: {
    sidebar: "#000000",
    main: "#0f2a20",
    bubble: "#1e3d32",
    input: "#1e3d32",
    text: "#ffffff",
    border: "#1f2937",
    userBubble: "#166534",
    userText: "#dcfce7",
    aiBubble: "#2d4a3e",
    aiText: "#f0fdf4",
  },
  light: {
    sidebar: "#f8f9fa",
    main: "#ffffff",
    bubble: "#f1f3f5",
    input: "#f9fafb",
    text: "#212529",
    border: "#e5e7eb",
    userBubble: "#dbeafe",
    userText: "#1e40af",
    aiBubble: "#e2e8f0",
    aiText: "#1e293b",
  },
};

const WAVEFORM_BARS = [30, 60, 45, 80, 55, 70, 40, 65, 50, 75, 35, 60];

export default function ChatBoxMcp() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordWave, setRecordWave] = useState([]);
  const [audioStream, setAudioStream] = useState(null);

  const [playingId, setPlayingId] = useState(null);
  const [progress, setProgress] = useState({});

  const { messages, isLoading: loading, error } = useSelector((state) => state.chat);
  const { provider, model, apiKey, baseUrl, temperature, maxTokens } = useSelector((state) => {
    const selectedProvider = state.settings.selectedProvider;
    const providerSettings = state.settings.providers[selectedProvider] || {};
    
    // Debug logging
    console.log('ChatBox - Selected Provider:', selectedProvider);
    console.log('ChatBox - Provider Settings:', providerSettings);
    
    return { 
      provider: selectedProvider,
      model: providerSettings.model || 'gpt-4',
      apiKey: providerSettings.apiKey || '',
      baseUrl: providerSettings.baseUrl || '',
      temperature: providerSettings.temperature || 0.7,
      maxTokens: providerSettings.maxTokens || 1000
    };
  });

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chatTheme");
    if (saved && saved in themes) setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("chatTheme", theme);
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea when input changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    let audioCtx;
    let analyser;
    let source;
    let dataArray;
    let rafId;
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setAudioStream(stream);
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        const tick = () => {
          if (analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray);
            const values = Array.from(dataArray).slice(0, 20).map((v) => (v / 255) * 100);
            setRecordWave(values);
            rafId = requestAnimationFrame(tick);
          }
        };
        tick();
      });
    } else {
      if (audioStream) {
        audioStream.getTracks().forEach((t) => t.stop());
        setAudioStream(null);
      }
      setRecordWave([]);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioStream) audioStream.getTracks().forEach((t) => t.stop());
    };
  }, [isRecording]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Mobile debugging
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('=== SENDING MESSAGE ===');
    console.log('Is Mobile:', isMobile);
    console.log('User Agent:', navigator.userAgent);
    console.log('Current URL:', window.location.href);
    console.log('API Base URL:', getApiBaseUrl());
    console.log('Sending message with:', { provider, model, apiKey, baseUrl, temperature, maxTokens, input });
    console.log('========================');
    
    // Add user message to UI immediately
    dispatch(sendChat({ message: input }));
    
    try {
      // Send message to backend for AI response
      const result = await dispatch(sendMessage({ 
        message: input, 
        provider: provider || 'openai',
        model: model || 'gpt-4',
        apiKey: apiKey || '',
        baseUrl: baseUrl || '',
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000
      })).unwrap();
      
      console.log('✅ Message sent successfully:', result);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        isMobile,
        userAgent: navigator.userAgent
      });
      
      // Show user-friendly error
      setError(`Failed to send message: ${error.message}`);
    }
    
    setInput("");
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleSendVoice = () => {
    // Add voice message to UI immediately
    dispatch(
      sendChat({
        message: {
          type: "voice",
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          duration: recordingTime,
        },
      })
    );
    
    // Send voice message to backend for AI response
    dispatch(sendMessage({ 
      message: "Voice message", 
      provider: provider || 'openai',
      model: model || 'gpt-4',
      apiKey: apiKey || '',
      baseUrl: baseUrl || '',
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 1000
    }));
    
    setIsRecording(false);
  };

  const colors = themes[theme];

  return (
    <div className="flex h-screen relative" style={{ background: colors.main, color: colors.text }}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarCollapsed && !mobileSidebarOpen ? "w-16" : "w-64"} 
          ${mobileSidebarOpen ? "fixed left-0 top-0 h-full z-50" : "hidden md:flex"}
          flex flex-col p-3 md:p-4 transition-all duration-300
        `}
        style={{ background: colors.sidebar, borderRight: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <h1 className="text-green-500 font-bold text-base md:text-lg flex items-center space-x-2">
              <span>💡</span> <span>AI Assistant</span>
            </h1>
          )}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen(false);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {sidebarCollapsed && !mobileSidebarOpen ? "→" : "←"}
          </button>
        </div>

        {(!sidebarCollapsed || mobileSidebarOpen) && (
          <button
            onClick={() => {
              resetConversationId();
              dispatch(clear());
              setMobileSidebarOpen(false);
            }}
            className="py-2 px-3 rounded-lg mb-4 flex items-center justify-center text-sm hover:opacity-80 transition-all duration-200 shadow-md hover:shadow-lg"
            style={{
              backgroundColor: colors.userBubble,
              color: colors.userText,
              boxShadow: `0 2px 6px ${colors.userBubble}20`,
            }}
          >
            + New Chat
          </button>
        )}

        <div className="mt-auto flex flex-col space-y-3">
          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <select
              value={provider}
              onChange={(e) => dispatch(setProvider(e.target.value))}
              className="w-full border rounded px-2 py-2 text-sm"
              style={{ background: colors.input, color: colors.text, borderColor: colors.border }}
            >
              <option value="claude">🤖 Claude</option>
              <option value="gemini">💎 Gemini</option>
              <option value="groq">⚡ Groq</option>
              <option value="huggingface">🤗 Hugging Face</option>
              <option value="ollama">🦙 Ollama</option>
              <option value="openai">🔑 OpenAI</option>
              <option value="openrouter">🌐 OpenRouter</option>
            </select>
          )}
          <button 
            onClick={() => {
              setShowSettings(true);
              setMobileSidebarOpen(false);
            }}
            title={sidebarCollapsed && !mobileSidebarOpen ? "Settings" : "Settings"}
            className={`px-3 py-2 text-sm rounded theme-hover w-full ${
              sidebarCollapsed && !mobileSidebarOpen ? 'px-2' : ''
            }`}
            style={{
              backgroundColor: colors.border,
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.text;
              e.target.style.color = colors.main;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.border;
              e.target.style.color = colors.text;
            }}
          >
            {sidebarCollapsed && !mobileSidebarOpen ? '⚙️' : '⚙️ Settings'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header
          className="flex justify-between items-center px-3 md:px-6 py-3 md:py-3"
          style={{ background: colors.main, borderBottom: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              ☰
            </button>
            
            <div className="relative flex-shrink-0">
              <img
                src="/ai1.png"
                alt="AI"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-black"></span>
            </div>
            <h1 className="text-sm md:text-lg font-bold truncate">Chat Interface</h1>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
            <button
              onClick={() => {
                const next = theme === "dark" ? "green" : theme === "green" ? "light" : "dark";
                setTheme(next);
              }}
              className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              {theme === "dark" ? "🌙" : theme === "green" ? "🌿" : "☀️"}
            </button>
            <Link 
              to="/" 
              title="Go to Home Page" 
              className="text-sm md:text-lg p-2 rounded-lg theme-hover"
              style={{
                color: colors.text,
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.border;
                e.target.style.color = colors.text;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = colors.text;
              }}
            >
              🏠
            </Link>
            <button 
              onClick={() => setShowSettings(true)} 
              className="text-sm md:text-lg p-1 md:p-2 rounded-lg theme-hover hidden md:block"
              style={{
                color: colors.text,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.border;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-3 md:py-6" style={{ background: colors.main }}>
          <div className="max-w-full md:max-w-3xl mx-auto space-y-3 md:space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[500px]">
                <div className="text-center px-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-xl md:text-2xl">🤖</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold mb-2" style={{ color: colors.text }}>Welcome to AI Chat</h2>
                  <p className="text-gray-400 mb-4 md:mb-6 max-w-md mx-auto text-sm">
                    Start a conversation with your AI assistant. Ask questions, get help, or just chat!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-2 md:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
                      ✨ Real-time Chat
                    </span>
                    <span className="px-2 md:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                      🎤 Voice Messages
                    </span>
                    <span className="px-2 md:px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                      🤖 Multiple AI Providers
                    </span>
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                style={{
                  gap: "12px"
                }}
              >
                {msg.role === "user" ? (
                  <>
                    <div className="flex flex-col max-w-xl">
                      <span className="text-xs opacity-60 mb-1">You</span>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.role === "user" 
                        ? "rounded-br-sm shadow-lg" 
                        : "rounded-bl-sm shadow-md"
                    }`}
                    style={{
                      backgroundColor: msg.role === "user" ? colors.userBubble : colors.aiBubble,
                      color: msg.role === "user" ? colors.userText : colors.aiText,
                      boxShadow: msg.role === "user" 
                        ? `0 2px 8px ${colors.userBubble}15` 
                        : `0 2px 8px rgba(0, 0, 0, 0.1)`,
                    }}
                  >
                    {typeof msg.text === "object" && msg.text.type === "voice" ? (
                      <div className="flex items-center space-x-3 w-64 relative">
                        <button
                          onClick={() => {
                            if (playingId === idx) {
                              setPlayingId(null);
                            } else {
                              setPlayingId(idx);
                              const audio = new Audio(msg.text.url);
                              audio.play();
                              audio.ontimeupdate = () =>
                                setProgress((p) => ({
                                  ...p,
                                  [idx]: (audio.currentTime / audio.duration) * 100,
                                }));
                              audio.onended = () => {
                                setPlayingId(null);
                                setProgress((p) => ({ ...p, [idx]: 0 }));
                              };
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                        >
                          {playingId === idx ? "⏸" : "▶️"}
                        </button>
                        <div className="relative flex space-x-0.5 flex-1 items-end h-6">
                          {WAVEFORM_BARS.map((h, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-sm ${
                                playingId === idx ? "bg-green-400 animate-wave" : "bg-gray-500"
                              }`}
                              style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full shadow"
                            style={{ left: `${(progress)[idx] || 0}%`, transform: "translate(-50%, -50%)" }}
                          />
                        </div>
                        <span className="text-xs opacity-70 flex-shrink-0">
                          {String(Math.floor(msg.text.duration / 60)).padStart(2, "0")}:
                          {String(msg.text.duration % 60).padStart(2, "0")}
                        </span>
                      </div>
                    ) : (
                      <div className="break-words">{msg.text}</div>
                    )}
                  </div>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="https://i.pravatar.cc/40?img=3"
                        alt="user"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="/ai1.png"
                        alt="AI Assistant"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col max-w-xl">
                      <span className="text-xs opacity-60 mb-1">AI Assistant</span>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.role === "user" 
                            ? "rounded-br-sm shadow-lg" 
                            : "rounded-bl-sm shadow-md"
                        }`}
                        style={{
                          backgroundColor: msg.role === "user" ? colors.userBubble : colors.aiBubble,
                          color: msg.role === "user" ? colors.userText : colors.aiText,
                          boxShadow: msg.role === "user" 
                            ? `0 2px 8px ${colors.userBubble}15` 
                            : `0 2px 8px rgba(0, 0, 0, 0.1)`,
                        }}
                      >
                        {typeof msg.text === "object" && msg.text.type === "voice" ? (
                          <div className="flex items-center space-x-3 w-64 relative">
                            <button
                              onClick={() => {
                                if (playingId === idx) {
                                  setPlayingId(null);
                                } else {
                                  setPlayingId(idx);
                                  const audio = new Audio(msg.text.url);
                                  audio.play();
                                  audio.ontimeupdate = () =>
                                    setProgress((p) => ({
                                      ...p,
                                      [idx]: (audio.currentTime / audio.duration) * 100,
                                    }));
                                  audio.onended = () => {
                                    setPlayingId(null);
                                    setProgress((p) => ({ ...p, [idx]: 0 }));
                                  };
                                }
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                            >
                              {playingId === idx ? "⏸" : "▶️"}
                            </button>
                            <div className="relative flex space-x-0.5 flex-1 items-end h-6">
                              {WAVEFORM_BARS.map((h, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-sm ${
                                    playingId === idx ? "bg-green-400 animate-wave" : "bg-gray-500"
                                  }`}
                                  style={{
                                    height: `${h}%`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-xs opacity-70 flex-shrink-0">
                              {String(Math.floor(msg.text.duration / 60)).padStart(2, "0")}:
                              {String(msg.text.duration % 60).padStart(2, "0")}
                            </span>
                          </div>
                        ) : (
                          <div className="break-words">{msg.text}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start space-x-3 justify-start animate-fade-in">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img src="/ai1.png" alt="AI Assistant" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col max-w-xl">
                  <span className="text-xs opacity-60 mb-1">AI Assistant is typing...</span>
                  <div 
                    className="px-4 py-2 rounded-xl border flex space-x-2"
                    style={{
                      backgroundColor: colors.aiBubble,
                      borderColor: colors.border,
                    }}
                  >
                    <span 
                      className="dot-animation w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.text }}
                    ></span>
                    <span 
                      className="dot-animation w-2 h-2 rounded-full delay-200"
                      style={{ backgroundColor: colors.text }}
                    ></span>
                    <span 
                      className="dot-animation w-2 h-2 rounded-full delay-400"
                      style={{ backgroundColor: colors.text }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div 
                className="text-sm px-3 py-2 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
                style={{
                  color: '#dc2626',
                  backgroundColor: theme === 'light' ? '#fef2f2' : theme === 'dark' ? '#1f2937' : '#0f2a20',
                  borderLeftColor: '#dc2626'
                }}
              >
                ⚠ {String(error)}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 safe-area-bottom" style={{ background: colors.main, borderTop: `1px solid ${colors.border}` }}>
          <div className="max-w-full md:max-w-3xl mx-auto w-full">
            {isRecording && (
              <div className="flex items-center justify-between bg-red-600 text-white text-xs md:text-sm px-3 py-2 rounded-md mb-2">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <span className="flex-shrink-0">🔴 Recording...</span>
                  <span className="text-xs font-mono opacity-90 flex-shrink-0">
                    {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
                    {String(recordingTime % 60).padStart(2, "0")}
                  </span>
                  <div className="flex space-x-0.5 h-4 md:h-6 items-end overflow-hidden">
                    {recordWave.slice(0, 6).map((h, i) => (
                      <div key={i} className="w-0.5 md:w-1 bg-white rounded-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                  <button onClick={() => setIsRecording(false)} className="px-2 py-0.5 bg-white/20 rounded text-xs">
                    ❌
                  </button>
                  <button onClick={handleSendVoice} className="px-2 py-0.5 bg-white/20 rounded hover:bg-green-500 text-xs">
                    ✅
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-end space-x-2 md:space-x-3">
              <div
                className="flex items-end border rounded-2xl md:rounded-full px-3 md:px-4 py-2 flex-1 min-w-0 overflow-hidden"
                style={{ background: colors.input, borderColor: colors.border }}
              >
                <span 
                  className="mr-2 flex-shrink-0 mb-1"
                  style={{ color: colors.text, opacity: 0.6 }}
                >
                  🔍
                </span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none px-1 md:px-2 py-1 text-sm md:text-base min-w-0 placeholder-opacity-60 overflow-y-auto"
                  style={{ 
                    color: colors.text,
                    minHeight: '20px',
                    maxHeight: '128px',
                    '::placeholder': { color: colors.text, opacity: 0.6 }
                  }}
                />
                   <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRecording((p) => !p)}
                  className={`w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm ${
                    isRecording ? "mic-pulse" : ""
                  }`}
                  style={{
                    backgroundColor: isRecording ? "#dc2626" : colors.border,
                    color: "#ffffff"
                  }}
                >
                  🎤
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-full disabled:opacity-50 text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  style={{
                    backgroundColor: colors.userBubble,
                    color: colors.userText,
                    boxShadow: `0 2px 6px ${colors.userBubble}20`,
                  }}
                >
                  ➤
                </button>
              </div>
              </div>
           
            </div>
          </div>
        </div>
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} theme={colors} />}

      <style>{`
        @keyframes wave {
          0% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.3);
          }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
        @keyframes micPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .mic-pulse {
          animation: micPulse 1.5s infinite;
        }
        @keyframes dotPulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .dot-animation {
          animation: dotPulse 1.4s infinite;
        }
        .dot-animation.delay-200 {
          animation-delay: 0.2s;
        }
        .dot-animation.delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        /* Theme-aware hover effects */
        .theme-hover {
          transition: all 0.2s ease;
        }
        
        .theme-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Mobile safe area */
        .safe-area-bottom {
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
        }

        /* Mobile scrolling improvements */
        @media (max-width: 768px) {
          body {
            -webkit-overflow-scrolling: touch;
          }
          
          .overflow-y-auto {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Prevent horizontal scroll */
          .max-w-full {
            max-width: 100%;
            overflow-wrap: break-word;
          }
          
          /* Better touch targets */
          button {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Reduce mic pulse effect on mobile */
          .mic-pulse {
            animation: micPulse 1.5s infinite;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
          }
        }

        /* Responsive text wrapping */
        .break-words {
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        /* Mobile keyboard handling */
        @media (max-width: 768px) {
          .flex-1.overflow-y-auto {
            /* Account for mobile keyboards */
            max-height: calc(100vh - 140px);
          }
        }
      `}</style>
    </div>
  );
}