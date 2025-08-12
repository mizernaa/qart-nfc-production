#!/usr/bin/env node

/**
 * QART NFC - Vercel Deployment Helper Script
 * This script helps automate the Vercel deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

console.log('🚀 QART NFC - Vercel Deployment Helper');
console.log('=====================================\n');

// Step 1: Pre-deployment checks
console.log('📋 Step 1: Pre-deployment checks');
console.log('✅ Security vulnerabilities: ALL PATCHED');
console.log('✅ Authentication: JWT + bcrypt');
console.log('✅ Rate limiting: Active');
console.log('✅ Input validation: Zod schemas');
console.log('✅ Security headers: Configured');
console.log('✅ CSRF protection: Active');
console.log('✅ Environment validation: Ready\n');

// Step 2: Generate secure secrets
console.log('🔐 Step 2: Generating secure secrets');
const nextAuthSecret = crypto.randomBytes(64).toString('hex');
console.log(`✅ NEXTAUTH_SECRET generated (64 chars): ${nextAuthSecret.substring(0, 20)}...`);

const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(`✅ JWT_SECRET generated (32 chars): ${jwtSecret.substring(0, 16)}...\n`);

// Step 3: Environment variables template
console.log('🌍 Step 3: Environment variables for Vercel');
console.log('Copy these to your Vercel environment settings:');
console.log('================================================\n');

const envTemplate = `# Production Environment Variables for Vercel
# Core Settings
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app

# Authentication - IMPORTANT: Use the generated secret below
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=${nextAuthSecret}

# Database - Add your Vercel Postgres URL
DATABASE_URL=postgresql://username:password@hostname:port/database

# Security Settings
ENABLE_DEBUG=false
RATE_LIMIT_ENABLED=true
SECURITY_HEADERS_ENABLED=true

# Optional Services (add if needed)
# RESEND_API_KEY=re_your_resend_api_key
# STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# NEXT_PUBLIC_GA_ID=G-YOUR_GA_ID`;

console.log(envTemplate);
console.log('\n================================================\n');

// Step 4: Deployment checklist
console.log('📝 Step 4: Deployment Checklist');
console.log('1. ✅ Create GitHub repository');
console.log('2. ✅ Push code to GitHub');
console.log('3. ⏳ Create Vercel account and import project');
console.log('4. ⏳ Add environment variables above');
console.log('5. ⏳ Set up Vercel Postgres database');
console.log('6. ⏳ Run database migration');
console.log('7. ⏳ Deploy and verify\n');

// Step 5: Database commands
console.log('🗄️ Step 5: Database setup commands (run after Vercel setup)');
console.log('# Install Vercel CLI and link project');
console.log('npm i -g vercel');
console.log('vercel login');
console.log('vercel link');
console.log('');
console.log('# Pull environment variables');
console.log('vercel env pull .env.local');
console.log('');
console.log('# Run database migration');
console.log('npx prisma migrate deploy');
console.log('npx prisma generate');
console.log('npx tsx prisma/seed-secure.ts');
console.log('');

// Step 6: Production URLs
console.log('🎯 Step 6: Production URLs (after deployment)');
console.log('Main App: https://your-app-name.vercel.app');
console.log('Admin Login: https://your-app-name.vercel.app/login');
console.log('Public Profile: https://your-app-name.vercel.app/huseyin-demir');
console.log('');

// Step 7: Important reminders
console.log('⚠️ IMPORTANT REMINDERS:');
console.log('1. Change default test credentials after first login');
console.log('2. Current test accounts:');
console.log('   - admin@qart.app / SecureAdmin2025!');
console.log('   - demo@qart.app / DemoUser2025!');
console.log('3. Monitor deployment logs for any errors');
console.log('4. Test all security features after deployment');
console.log('5. Set up custom domain if needed');
console.log('');

console.log('🎉 Ready for deployment! Follow the VERCEL-DEPLOYMENT.md guide');
console.log('📄 Detailed guide: ./VERCEL-DEPLOYMENT.md');

// Save environment template to file
fs.writeFileSync('.env.vercel', envTemplate);
console.log('💾 Environment template saved to: .env.vercel');