@echo off
echo Setting up Vercel environment variables...

vercel env add DATABASE_URL production
echo postgres://postgres.eketemhixkmvjrbiceym:1wGBjApQjGVxwRG6@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

echo Environment variables setup complete!
pause