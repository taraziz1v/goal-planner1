import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Sparkles, Key, Globe, Layers } from 'lucide-react';
import type { ApiConfig } from '../utils/ai';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSave: (config: ApiConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [mockMode, setMockMode] = useState(config.mockMode);
  const [provider, setProvider] = useState(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [model, setModel] = useState(config.model);
  const [showKey, setShowKey] = useState(false);

  // Sync state if config changes externally
  useEffect(() => {
    setMockMode(config.mockMode);
    setProvider(config.provider);
    setApiKey(config.apiKey);
    setBaseUrl(config.baseUrl);
    setModel(config.model);
  }, [config, isOpen]);

  // Autofill base URL and model defaults when provider toggles
  const handleProviderChange = (prov: 'openai' | 'openrouter') => {
    setProvider(prov);
    if (prov === 'openai') {
      setBaseUrl('https://api.openai.com/v1');
      setModel('gpt-4o-mini');
    } else {
      setBaseUrl('https://openrouter.ai/api/v1');
      setModel('google/gemini-2.5-flash');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      apiKey,
      baseUrl,
      model,
      provider,
      mockMode,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 glass-panel shadow-2xl transition-all duration-300 scale-100 z-10">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-600/20 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white m-0">API Engine Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="relative p-6 space-y-5">
          
          {/* Mode Selector Option */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Execution Engine Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5 p-1 rounded-xl bg-slate-950/60 border border-white/5">
              <button
                type="button"
                onClick={() => setMockMode(true)}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                  mockMode 
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mock Simulation
              </button>
              <button
                type="button"
                onClick={() => setMockMode(false)}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                  !mockMode 
                    ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Live LLM AI
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal m-0 pt-1">
              {mockMode 
                ? "💡 Out-of-the-box mode. Generates structured custom plans locally using goal heuristics. No API key required." 
                : "⚡ Enterprise Mode. Connects directly to real LLM engines using your custom credentials."}
            </p>
          </div>

          {/* Conditional Fields for Live mode */}
          {!mockMode && (
            <div className="space-y-4 border-t border-white/5 pt-4 animate-fadeIn">
              
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">API Provider</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleProviderChange('openai')}
                    className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      provider === 'openai' 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-transparent text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                    }`}
                  >
                    OpenAI
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProviderChange('openrouter')}
                    className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      provider === 'openrouter' 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-transparent text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                    }`}
                  >
                    OpenRouter
                  </button>
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-slate-400" />
                  API Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required={!mockMode}
                    placeholder={provider === 'openai' ? 'sk-...' : 'sk-or-...'}
                    className="w-full py-2 pl-3 pr-10 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Base URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  Base Endpoint URL
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  required={!mockMode}
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm text-slate-100"
                />
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  Model Identifier
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required={!mockMode}
                  placeholder={provider === 'openai' ? 'gpt-4o-mini' : 'google/gemini-2.5-flash'}
                  className="w-full py-2 px-3 rounded-xl glass-input text-sm text-slate-100"
                />
              </div>

            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-xl text-sm font-medium border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 active:scale-98 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium text-white shadow-lg active:scale-98 transition-all ${
                mockMode 
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-cyan-500/10' 
                  : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-violet-500/10'
              }`}
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
