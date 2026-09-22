# MOVETI Socials — Production Checklist

## Application
- Next.js production build verified
- MOVETI Socials temporary branding installed
- Website routes present
- API routes preserved

## Security
- Supabase client uses public publishable credentials only
- Service-role credentials must remain server-side
- Payment-provider secret keys must remain server-side
- Mobile-money PINs must never be stored by MOVETI

## Payments
- Subscription plans:
  - 5 Months — K40,000
  - 1 Year — K100,000
- Artist royalties: 100%
- MOVETI royalty commission: 0%
- Artist wallet and MOVETI business finances remain separate
- Live payment/payout activation requires approved provider credentials

## Distribution
- Distribution infrastructure prepared
- Actual DSP delivery requires approved distributor/partner access

## Mobile
- Android project prepared
- iOS project prepared
- Final icon/splash artwork can replace the temporary branding

## Launch
- Production environment variables must be configured
- Supabase production project must be verified
- Payment provider must be approved before live money movement
- Final launch audit must pass
