import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Sparkles, Key, Globe, Layers } from 'lucide-react';
import type { ApiConfig } from '../utils/ai';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  lang: 'en' | 'ar';
  onSave: (config: ApiConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  lang, 
  onSave 
}) => {
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
  const handleProviderChange = (prov: 'openai' | 'openrouter' | 'gemini') => {
    setProvider(prov);
    if (prov === 'openai') {
      setBaseUrl('https://api.openai.com/v1');
      setModel('gpt-4o-mini');
    } else if (prov === 'openrouter') {
      setBaseUrl('https://openrouter.ai/api/v1');
      setModel('google/gemini-2.5-flash');
    } else {
      setBaseUrl('https://generativelanguage.googleapis.com/v1beta');
      setModel('gemini-2.5-flash');
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border-[3px] border-black hard-shadow transition-all duration-300 scale-100 z-10 p-0 overflow-hidden">
        
        {/* Header */}
        <div className={`relative flex items-center justify-between border-b-2 border-black/10 px-6 py-4 bg-surface-container-low ${
          lang === 'ar' ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Sparkles className="h-5 w-5 text-tertiary-container" />
            <h2 className="text-lg font-display font-extrabold text-on-surface m-0">
              {lang === 'ar' ? 'إعدادات محرك الذكاء الاصطناعي' : 'API Engine Settings'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="border-2 border-black p-1 bg-white hover:bg-surface-container-low transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            <X className="h-4 w-4 text-black font-bold stroke-[3px]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Mode Selector Option */}
          <div className="space-y-2">
            <label className={`text-xs font-display font-extrabold text-outline uppercase tracking-wider block ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}>
              {lang === 'ar' ? 'وضع تشغيل محرك التخطيط' : 'Execution Engine Mode'}
            </label>
            <div className="grid grid-cols-2 gap-2.5 p-1 border-2 border-black bg-surface-container-low">
              <button
                type="button"
                onClick={() => setMockMode(true)}
                className={`py-2 px-3 text-xs font-display font-extrabold border-2 transition-all duration-200 cursor-pointer ${
                  mockMode 
                    ? 'bg-secondary-container border-black text-black shadow-[2px_2px_0px_0px_#000000] font-extrabold' 
                    : 'bg-transparent border-transparent text-outline hover:text-on-surface'
                }`}
              >
                {lang === 'ar' ? 'محاكاة محلية' : 'Mock Simulation'}
              </button>
              <button
                type="button"
                onClick={() => setMockMode(false)}
                className={`py-2 px-3 text-xs font-display font-extrabold border-2 transition-all duration-200 cursor-pointer ${
                  !mockMode 
                    ? 'bg-tertiary-container border-black text-white shadow-[2px_2px_0px_0px_#000000] font-extrabold' 
                    : 'bg-transparent border-transparent text-outline hover:text-on-surface'
                }`}
              >
                {lang === 'ar' ? 'ذكاء اصطناعي مباشر' : 'Live LLM AI'}
              </button>
            </div>
            <p className={`text-[11px] font-medium text-on-surface-variant leading-normal m-0 pt-1 ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}>
              {mockMode 
                ? (lang === 'ar' 
                    ? "💡 وضع محلي فوري. يولد خطط عمل مخصصة بالكامل في متصفحك دون الحاجة لربط مفاتيح API."
                    : "💡 Out-of-the-box mode. Generates structured custom plans locally using goal heuristics. No API key required.") 
                : (lang === 'ar'
                    ? "⚡ وضع الاتصال الفعلي. يربط التطبيق مباشرة بمحركات الذكاء الاصطناعي باستخدام مفاتيح الوصول الخاصة بك."
                    : "⚡ Enterprise Mode. Connects directly to real LLM engines using your custom credentials.")}
            </p>
          </div>

          {/* Conditional Fields for Live mode */}
          {!mockMode && (
            <div className="space-y-4 border-t-2 border-black/10 pt-4 animate-fadeIn">
              
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className={`text-xs font-display font-extrabold text-on-surface block ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'مزود خدمة الذكاء الاصطناعي' : 'API Provider'}
                </label>
                <div className="flex gap-2">
                  {(['openai', 'openrouter', 'gemini'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => handleProviderChange(prov)}
                      className={`flex-1 py-1.5 px-1.5 text-[11px] font-display font-extrabold border-2 transition-all cursor-pointer ${
                        provider === prov 
                          ? 'bg-secondary-container border-black text-black shadow-[2px_2px_0px_0px_#000000]' 
                          : 'bg-white border-black text-outline hover:bg-surface-container-low'
                      }`}
                    >
                      {prov === 'openai' ? 'OpenAI' : prov === 'openrouter' ? 'OpenRouter' : 'Gemini'}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-1.5">
                <label className={`text-xs font-display font-extrabold text-on-surface flex items-center gap-1.5 justify-start ${
                  lang === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'
                }`}>
                  <Key className="h-4 w-4 text-outline" />
                  <span>{lang === 'ar' ? 'مفتاح الوصول السري (API Key)' : 'API Secret Key'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required={!mockMode}
                    placeholder={provider === 'openai' ? 'sk-...' : 'sk-or-...'}
                    className={`w-full py-2 pl-10 pr-3 bg-white border-2 border-black focus:outline-none focus:border-tertiary-container text-xs font-bold text-on-surface ${
                      lang === 'ar' ? 'text-right pl-10 pr-3' : 'text-left pr-10 pl-3'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className={`absolute inset-y-0 flex items-center px-3 text-outline hover:text-black cursor-pointer ${
                      lang === 'ar' ? 'left-0' : 'right-0'
                    }`}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Base URL */}
              <div className="space-y-1.5">
                <label className={`text-xs font-display font-extrabold text-on-surface flex items-center gap-1.5 justify-start ${
                  lang === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'
                }`}>
                  <Globe className="h-4 w-4 text-outline" />
                  <span>{lang === 'ar' ? 'رابط الوصول المباشر (Base URL)' : 'Base Endpoint URL'}</span>
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  required={!mockMode}
                  className={`w-full py-2 px-3 bg-white border-2 border-black focus:outline-none focus:border-tertiary-container text-xs font-bold text-on-surface ${
                    lang === 'ar' ? 'text-right' : 'text-left'
                  }`}
                />
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <label className={`text-xs font-display font-extrabold text-on-surface flex items-center gap-1.5 justify-start ${
                  lang === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'
                }`}>
                  <Layers className="h-4 w-4 text-outline" />
                  <span>{lang === 'ar' ? 'اسم معرّف النموذج (Model)' : 'Model Identifier'}</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required={!mockMode}
                  placeholder={provider === 'openai' ? 'gpt-4o-mini' : 'google/gemini-2.5-flash'}
                  className={`w-full py-2 px-3 bg-white border-2 border-black focus:outline-none focus:border-tertiary-container text-xs font-bold text-on-surface ${
                    lang === 'ar' ? 'text-right' : 'text-left'
                  }`}
                />
              </div>

            </div>
          )}

          {/* Action buttons */}
          <div className={`flex gap-3 border-t-2 border-black/10 pt-4 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border-2 border-black bg-white text-xs font-display font-extrabold hard-shadow hover:bg-surface-container-low transition-all active:scale-98 cursor-pointer text-center"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 border-2 border-black text-xs font-display font-extrabold hard-shadow hover:hard-shadow-hover transition-all active:scale-98 cursor-pointer text-center text-black ${
                mockMode ? 'bg-secondary-container' : 'bg-tertiary-container text-white'
              }`}
            >
              {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
