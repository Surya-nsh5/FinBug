import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoMdClose, IoMdHelpCircle } from "react-icons/io";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import appIcon from '../assets/finbug.png';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check if app is already installed/standalone
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true);
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Auto open popup after delay
        const timer = setTimeout(() => {
            const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
            if (!alreadyInstalled) {
                setIsOpen(true);
            }
        }, 2000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        }
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsOpen(false);
        }
    };

    if (isStandalone || !isOpen || location.pathname !== '/') return null;

    return (
        <div className="fixed bottom-5 right-5 z-[60] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-80 animate-slide-up">
            {/* Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
            >
                <IoMdClose size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <img src={appIcon} alt="Icon" className="w-8 h-8 object-contain" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Install FinBug</h3>
                    <p className="text-xs text-gray-500">Android & Windows</p>
                </div>
            </div>

            {deferredPrompt ? (
                <button
                    onClick={handleInstallClick}
                    className="w-full py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-sm mb-2"
                >
                    Install Now
                </button>
            ) : (
                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors mb-2 flex items-center justify-center gap-2"
                >
                    {showInstructions ? 'Hide Help' : 'How to Install?'}
                    {showInstructions ? <LuChevronUp /> : <LuChevronDown />}
                </button>
            )}

            {/* Toggle Instructions if Prompt is available but user wants help, OR if prompt not available */}
            {deferredPrompt && (
                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full text-xs text-gray-400 hover:text-purple-600 flex items-center justify-center gap-1 mb-1"
                >
                    Manual Instructions {showInstructions ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />}
                </button>
            )}

            {showInstructions && (
                <div className="mt-3 space-y-3 border-t border-gray-100 pt-3 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="flex gap-2 items-start">
                        <span className="text-sm shrink-0">🤖</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-700">Android (Chrome)</p>
                            <p className="text-[10px] text-gray-500">Tap <span className="font-bold">⋮</span> &gt; <span className="font-bold">Install App</span></p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-start">
                        <span className="text-sm shrink-0">💻</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-700">Windows (Edge/Chrome)</p>
                            <p className="text-[10px] text-gray-500">Click <span className="font-bold">⬇ Install</span> in URL bar</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-start">
                        <span className="text-sm shrink-0">🍏</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-700">iOS (Safari)</p>
                            <p className="text-[10px] text-gray-500">Tap <span className="font-bold">Share ⎋</span> &gt; <span className="font-bold">Add to Home Screen</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstallPWA;
