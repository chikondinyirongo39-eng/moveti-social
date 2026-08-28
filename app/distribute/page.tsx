'use client';

import Link from 'next/link';

export default function DistributePage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={brandStyle}>
          MOVETI
        </Link>

        <section style={heroStyle}>
          <div style={eyebrowStyle}>MOVETI DISTRIBUTION</div>
          <h1 style={headingStyle}>Distribute your music</h1>
          <p style={subtitleStyle}>
            Release your music worldwide through MOVETI.
          </p>
        </section>

        <div style={plansStyle}>
          <Plan
            name="5 Months"
            price="K40,000"
            description="Unlimited releases for 5 months."
            popular={false}
          />

          <Plan
            name="1 Year"
            price="K100,000"
            description="Unlimited releases for 12 months."
            popular
          />
        </div>

        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Worldwide distribution</h2>
          <p style={mutedStyle}>
            Submit singles, EPs and albums for distribution to supported
            streaming platforms.
          </p>

          <div style={releaseTypesStyle}>
            <div style={typeCardStyle}>
              <div style={iconStyle}>🎵</div>
              <strong>Single</strong>
              <span>One track release</span>
            </div>

            <div style={typeCardStyle}>
              <div style={iconStyle}>💿</div>
              <strong>EP</strong>
              <span>Multiple tracks</span>
            </div>

            <div style={typeCardStyle}>
              <div style={iconStyle}>📀</div>
              <strong>Album</strong>
              <span>Full music project</span>
            </div>
          </div>

          <Link href="/new-release" style={primaryButtonStyle}>
            Start a Release →
          </Link>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Artist earnings</h2>

          <p style={mutedStyle}>
            Artist royalties are tracked separately from the MOVETI
            distribution subscription.
          </p>

          <div style={earningsBoxStyle}>
            <div>
              <strong>95%</strong>
              <span>Artist royalties</span>
            </div>

            <div>
              <strong>5%</strong>
              <span>MOVETI share</span>
            </div>
          </div>

          <h3 style={smallHeadingStyle}>Payout methods</h3>

          <div style={payoutStyle}>
            <span>📱 Airtel Money</span>
            <span>📱 Mpamba</span>
            <span>🏦 Bank Account</span>
          </div>

          <Link href="/payment" style={secondaryButtonStyle}>
            Manage Payments →
          </Link>
        </section>
      </div>
    </main>
  );
}

function Plan({
  name,
  price,
  description,
  popular
}: {
  name: string;
  price: string;
  description: string;
  popular: boolean;
}) {
  return (
    <div style={popular ? popularPlanStyle : planStyle}>
      {popular && <div style={popularBadgeStyle}>BEST VALUE</div>}

      <h2 style={planNameStyle}>{name}</h2>

      <div style={priceStyle}>{price}</div>

      <p style={planDescriptionStyle}>{description}</p>

      <Link href="/payment" style={planButtonStyle}>
        Choose Plan
      </Link>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: '#07090d',
  color: 'white',
  fontFamily: 'Arial, sans-serif',
  padding: '24px',
  boxSizing: 'border-box' as const
};

const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto'
};

const brandStyle = {
  display: 'inline-block',
  color: 'white',
  textDecoration: 'none',
  fontWeight: '900' as const,
  letterSpacing: '3px',
  marginBottom: '35px'
};

const heroStyle = {
  marginBottom: '30px'
};

const eyebrowStyle = {
  color: '#8f98a6',
  fontSize: '12px',
  fontWeight: '800' as const,
  letterSpacing: '2px',
  marginBottom: '8px'
};

const headingStyle = {
  margin: 0,
  fontSize: '38px',
  fontWeight: '900' as const
};

const subtitleStyle = {
  color: '#929aa7',
  fontSize: '17px',
  lineHeight: 1.5
};

const plansStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '16px',
  marginBottom: '20px'
};

const planStyle = {
  position: 'relative' as const,
  padding: '25px',
  borderRadius: '20px',
  border: '1px solid #292f39',
  background: '#11151c'
};

const popularPlanStyle = {
  ...planStyle,
  border: '2px solid white'
};

const popularBadgeStyle = {
  position: 'absolute' as const,
  top: '15px',
  right: '15px',
  fontSize: '10px',
  fontWeight: '900' as const,
  padding: '6px 8px',
  borderRadius: '999px',
  background: 'white',
  color: 'black'
};

const planNameStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '800' as const
};

const priceStyle = {
  fontSize: '32px',
  fontWeight: '900' as const,
  marginTop: '14px'
};

const planDescriptionStyle = {
  color: '#929aa7',
  minHeight: '42px',
  lineHeight: 1.5
};

const planButtonStyle = {
  display: 'block',
  marginTop: '20px',
  padding: '13px',
  borderRadius: '12px',
  background: 'white',
  color: 'black',
  textDecoration: 'none',
  textAlign: 'center' as const,
  fontWeight: '900' as const
};

const sectionStyle = {
  marginTop: '20px',
  padding: '25px',
  borderRadius: '20px',
  border: '1px solid #292f39',
  background: '#11151c'
};

const sectionTitle = {
  margin: 0,
  fontSize: '23px',
  fontWeight: '900' as const
};

const mutedStyle = {
  color: '#929aa7',
  lineHeight: 1.6
};

const releaseTypesStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  margin: '20px 0'
};

const typeCardStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '7px',
  padding: '16px',
  borderRadius: '13px',
  background: '#181d25'
};

const iconStyle = {
  fontSize: '24px'
};

const primaryButtonStyle = {
  display: 'block',
  padding: '15px',
  borderRadius: '13px',
  background: 'white',
  color: 'black',
  textDecoration: 'none',
  textAlign: 'center' as const,
  fontWeight: '900' as const
};

const earningsBoxStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginTop: '20px'
};

const payoutStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '10px',
  margin: '15px 0 20px'
};

const payoutItemStyle = {
  padding: '10px 12px',
  borderRadius: '10px',
  background: '#181d25'
};

const smallHeadingStyle = {
  marginTop: '25px',
  marginBottom: '8px'
};

const secondaryButtonStyle = {
  display: 'block',
  padding: '14px',
  borderRadius: '13px',
  border: '1px solid #3a424e',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center' as const,
  fontWeight: '800' as const
};
