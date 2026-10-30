export type SupportedLanguage = 'en' | 'es' | 'pt' | 'zh' | 'gl';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'gl', label: 'Galician', nativeName: 'Galego', flag: '🌿' },
];
