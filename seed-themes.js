const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedThemes() {
  const themes = [
    {
      id: 'default',
      name: 'Default Theme',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      font: 'Inter',
      layout: 'centered',
      isDefault: true
    },
    {
      id: 'modern',
      name: 'Modern Theme',
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#FAFAFA',
      textColor: '#111827',
      font: 'Inter',
      layout: 'modern',
      isDefault: false
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#0F172A',
      textColor: '#F1F5F9',
      font: 'Inter',
      layout: 'centered',
      isDefault: false
    }
  ]

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { id: theme.id },
      update: theme,
      create: theme
    })
    console.log(`✅ Theme created/updated: ${theme.name}`)
  }

  console.log('🎨 All themes seeded successfully!')
  await prisma.$disconnect()
}

seedThemes().catch(console.error)