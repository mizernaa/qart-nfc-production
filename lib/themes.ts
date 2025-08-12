export interface Theme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  font: string
  layout: string
  borderRadius?: string
  backgroundImage?: string
  backgroundGradient?: string
  cardBackground?: string
  cardBorder?: string
  buttonStyle?: 'rounded' | 'square' | 'pill'
  isDefault?: boolean
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Varsayılan',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    font: 'Inter',
    layout: 'centered',
    borderRadius: '0.5rem',
    buttonStyle: 'rounded',
    isDefault: true
  },
  {
    id: 'dark',
    name: 'Karanlık',
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    backgroundColor: '#0F172A',
    textColor: '#F1F5F9',
    font: 'Inter',
    layout: 'centered',
    borderRadius: '0.5rem',
    cardBackground: '#1E293B',
    cardBorder: '#334155',
    buttonStyle: 'rounded'
  },
  {
    id: 'professional',
    name: 'Profesyonel',
    primaryColor: '#1E40AF',
    secondaryColor: '#059669',
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
    font: 'Roboto',
    layout: 'centered',
    borderRadius: '0.25rem',
    buttonStyle: 'square'
  },
  {
    id: 'creative',
    name: 'Yaratıcı',
    primaryColor: '#EC4899',
    secondaryColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    textColor: '#78350F',
    font: 'Poppins',
    layout: 'centered',
    borderRadius: '1rem',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonStyle: 'pill'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#000000',
    secondaryColor: '#6B7280',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    font: 'Helvetica',
    layout: 'centered',
    borderRadius: '0',
    buttonStyle: 'square'
  },
  {
    id: 'nature',
    name: 'Doğa',
    primaryColor: '#059669',
    secondaryColor: '#84CC16',
    backgroundColor: '#ECFDF5',
    textColor: '#064E3B',
    font: 'Open Sans',
    layout: 'centered',
    borderRadius: '0.75rem',
    backgroundGradient: 'linear-gradient(to bottom, #86efac, #bbf7d0)',
    buttonStyle: 'rounded'
  },
  {
    id: 'sunset',
    name: 'Gün Batımı',
    primaryColor: '#F97316',
    secondaryColor: '#EF4444',
    backgroundColor: '#FFF7ED',
    textColor: '#7C2D12',
    font: 'Montserrat',
    layout: 'centered',
    borderRadius: '0.5rem',
    backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    buttonStyle: 'pill'
  },
  {
    id: 'ocean',
    name: 'Okyanus',
    primaryColor: '#0EA5E9',
    secondaryColor: '#06B6D4',
    backgroundColor: '#F0F9FF',
    textColor: '#0C4A6E',
    font: 'Lato',
    layout: 'centered',
    borderRadius: '1rem',
    backgroundGradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    buttonStyle: 'rounded'
  },
  {
    id: 'elegant',
    name: 'Zarif',
    primaryColor: '#7C3AED',
    secondaryColor: '#DB2777',
    backgroundColor: '#FAF5FF',
    textColor: '#4C1D95',
    font: 'Playfair Display',
    layout: 'centered',
    borderRadius: '0.375rem',
    cardBackground: '#F3E8FF',
    cardBorder: '#C084FC',
    buttonStyle: 'rounded'
  },
  {
    id: 'tech',
    name: 'Teknoloji',
    primaryColor: '#2563EB',
    secondaryColor: '#0891B2',
    backgroundColor: '#0F172A',
    textColor: '#E2E8F0',
    font: 'Source Code Pro',
    layout: 'centered',
    borderRadius: '0.125rem',
    cardBackground: '#1E293B',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonStyle: 'square'
  }
]

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id)
}

export function getDefaultTheme(): Theme {
  return themes.find(theme => theme.isDefault) || themes[0]
}

export function applyTheme(theme: Theme): Record<string, string> {
  return {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--background-color': theme.backgroundColor,
    '--text-color': theme.textColor,
    '--border-radius': theme.borderRadius || '0.5rem',
    '--card-background': theme.cardBackground || theme.backgroundColor,
    '--card-border': theme.cardBorder || theme.primaryColor,
    'font-family': theme.font
  }
}