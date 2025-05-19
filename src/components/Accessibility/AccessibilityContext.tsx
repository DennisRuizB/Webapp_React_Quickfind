import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type ColorMode = 'default' | 'dark' | 'high-contrast' | 'protanopia' | 'deuteranopia' | 'tritanopia';
export type FontSize = 'normal' | 'large' | 'x-large';
export type Language = 'es' | 'en' | 'ca';

export interface AccessibilitySettings {
    colorMode: ColorMode;
    fontSize: FontSize;
    dyslexicFont: boolean;
    reducedMotion: boolean;
    language: Language;
}

const defaultSettings: AccessibilitySettings = {
    colorMode: 'default',
    fontSize: 'normal',
    dyslexicFont: false,
    reducedMotion: false,
    language: 'es'
};

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
    resetSettings: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType>({
    settings: defaultSettings,
    updateSettings: () => console.warn('AccessibilityProvider not initialized'), // Implementación básica
    resetSettings: () => console.warn('AccessibilityProvider not initialized')  // Implementación básica
});

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        const saved = localStorage.getItem('accessibility-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));

        // Aplicar configuración al documento HTML
        document.documentElement.setAttribute('data-color-mode', settings.colorMode);
        document.documentElement.setAttribute('data-font-size', settings.fontSize);

        if (settings.dyslexicFont) {
            document.documentElement.classList.add('dyslexic-font');
        } else {
            document.documentElement.classList.remove('dyslexic-font');
        }

        if (settings.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
    }, [settings]);

    const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => React.useContext(AccessibilityContext);