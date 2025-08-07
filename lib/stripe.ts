import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return import('@stripe/stripe-js').then(({ loadStripe }) =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    )
  }
  return null
}

// Plan definitions
export const plans = {
  free: {
    name: 'Free',
    description: 'Kişisel kullanım için ideal',
    price: 0,
    priceId: '',
    features: [
      '1 Dijital Kartvizit',
      'Temel Analitik',
      'QR Kod',
      '5 Sosyal Medya Linki',
      'Email Desteği'
    ],
    limits: {
      profiles: 1,
      socialLinks: 5,
      customFields: 3,
      monthlyViews: 1000
    }
  },
  pro: {
    name: 'Pro',
    description: 'Profesyoneller için',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Sınırsız Kartvizit',
      'Gelişmiş Analitik',
      'Özel Domain',
      'Lead Yönetimi',
      'Sınırsız Sosyal Link',
      'Özel Alanlar',
      'Öncelikli Destek'
    ],
    limits: {
      profiles: -1, // unlimited
      socialLinks: -1,
      customFields: -1,
      monthlyViews: -1
    }
  },
  business: {
    name: 'Business',
    description: 'Ekipler ve şirketler için',
    price: 299,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    features: [
      '10 Kullanıcı',
      'Ekip Yönetimi',
      'API Erişimi',
      'White Label',
      'Özel Entegrasyonlar',
      'Dedicated Support'
    ],
    limits: {
      profiles: -1,
      socialLinks: -1,
      customFields: -1,
      monthlyViews: -1,
      teamMembers: 10
    }
  }
}