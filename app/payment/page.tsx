'use client';

import { useState } from 'react';
import Link from 'next/link';

type PayoutMethod = 'airtel' | 'mpamba' | 'bank';

export default function PaymentPage() {
  const [plan, setPlan] = useState('5 Months');
  const [method, setMethod] = useState<PayoutMethod>('airtel');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  const amount = plan === '5 Months' ? 'K40,000' : 'K100,000';

  function savePayment() {
    if (!details.trim()) {
      setMessage('Please enter your payment details.');
      return;
    }

    const payment = {
      id: Date.now(),
      plan,
      amount,
      method,
      details: details.trim(),
      status: 'Payment Pending',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      'moveti_payment',
      JSON.stringify(payment)
    );

    setMessage(
      'Payment request saved successfully. MOVETI will verify your payment.'
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/" style={brandStyle}>
          MOVETI
        </Link>

        <section style={heroStyle}>
          <h1 style={headingStyle}>Distribution Payment</h1>
          <p style={mutedStyle}>
            Choose your MOVETI distribution plan and payment method.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitle}>Choose your plan</h2>

          <div style={plansStyle}>
            <button
              onClick={() => setPlan('5 Months')}
              style={plan === '5 Months' ? activePlanStyle : planStyle}
            >
              <strong>5 Months</strong>
              <span>K40,000</span>
              <small>Unlimited releases for 5 months</small>
            </button>

            <button
              onClick={() => setPlan('1 Year')}
              style={plan === '1 Year' ? activePlanStyle : planStyle}
            >
              <strong>1 Year</strong>
              <span>K100,000</span>
              <small>Unlimited releases for 12 months</small>
            </button>
          </div>

          <div style={selectedBoxStyle}>
            <span>Selected plan</span>
            <strong>{plan} — {amount}</strong>
          </div>

          <h2 style={sectionTitle}>Payment method</h2>

          <div style={methodsStyle}>
            <button
              onClick={() => setMethod('airtel')}
              style={method === 'airtel' ? activeMethodStyle : methodStyle}
            >
              <strong>📱 Airtel Money</strong>
              <span>Pay using Airtel Money</span>
            </button>

            <button
              onClick={() => setMethod('mpamba')}
              style={method === 'mpamba' ? activeMethodStyle : methodStyle}
            >
              <strong>📱 TNM Mpamba</strong>
              <span>Pay using Mpamba</span>
            </button>

            <button
              onClick={() => setMethod('bank')}
              style={method === 'bank' ? activeMethodStyle : methodStyle}
            >
              <strong>🏦 Bank Account</strong>
              <span>Pay by bank transfer</span>
            </button>
          </div>

          <label style={labelStyle}>
            {method === 'airtel'
              ? 'Airtel Money number'
              : method === 'mpamba'
              ? 'TNM Mpamba number'
              : 'Bank account / transfer reference'}
          </label>

          <input
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={
              method === 'bank'
                ? 'Enter transfer reference'
                : 'Enter your phone number'
            }
            style={inputStyle}
          />

          <div style={summaryStyle}>
            <div>
              <span>Distribution plan</span>
              <strong>{plan}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>{amount}</strong>
            </div>

            <div>
              <span>Payment method</span>
              <strong>
                {method === 'airtel'
                  ? 'Airtel Money'
                  : method === 'mpamba'
                  ? 'TNM Mpamba'
                  : 'Bank Account'}
              </strong>
            </div>
          </div>

          {message && (
            <div style={messageStyle}>
              {message}
            </div>
          )}

          <button onClick={savePayment} style={payButtonStyle}>
            Submit Payment Request — {amount}
          </button>

          <Link href="/releases" style={backLinkStyle}>
            ← Back to My Releases
          </Link>
        </section>
      </div>
    </main>
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
  maxWidth: '800px',
  margin: '0 auto'
};

const brandStyle = {
  display: 'inline-block',
  color: 'white',
  textDecoration: 'none',
  fontWeight: '900' as const,
  letterSpacing: '3px',
  marginBottom: '30px'
};

const heroStyle = {
  marginBottom: '24px'
};

const headingStyle = {
  fontSize: '32px',
  fontWeight: '900' as const,
  margin: '0 0 8px'
};

const mutedStyle = {
  color: '#929aa7',
  lineHeight: 1.5
};

const cardStyle = {
  background: '#11151c',
  border: '1px solid #252a33',
  borderRadius: '20px',
  padding: '24px'
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '800' as const,
  margin: '8px 0 15px'
};

const plansStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px'
};

const planStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  gap: '8px',
  padding: '18px',
  borderRadius: '14px',
  border: '1px solid #303744',
  background: '#181d25',
  color: 'white',
  cursor: 'pointer',
  textAlign: 'left' as const
};

const activePlanStyle = {
  ...planStyle,
  border: '2px solid white',
  background: '#202631'
};

const selectedBoxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '15px',
  flexWrap: 'wrap' as const,
  margin: '20px 0 28px',
  padding: '15px',
  borderRadius: '12px',
  background: '#191f28',
  color: '#cbd1da'
};

const methodsStyle = {
  display: 'grid',
  gap: '10px'
};

const methodStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  gap: '5px',
  padding: '15px',
  borderRadius: '12px',
  border: '1px solid #303744',
  background: '#181d25',
  color: 'white',
  cursor: 'pointer',
  textAlign: 'left' as const
};

const activeMethodStyle = {
  ...methodStyle,
  border: '2px solid white',
  background: '#202631'
};

const labelStyle = {
  display: 'block',
  marginTop: '25px',
  marginBottom: '8px',
  fontWeight: '700' as const,
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '15px',
  borderRadius: '12px',
  border: '1px solid #333a46',
  background: '#181d25',
  color: 'white',
  fontSize: '15px',
  outline: 'none'
};

const summaryStyle = {
  display: 'grid',
  gap: '12px',
  marginTop: '22px',
  padding: '16px',
  borderRadius: '14px',
  background: '#191f28'
};

const messageStyle = {
  marginTop: '18px',
  padding: '14px',
  borderRadius: '12px',
  background: '#17251b',
  border: '1px solid #315139',
  color: '#a9e0b1'
};

const payButtonStyle = {
  width: '100%',
  padding: '16px',
  marginTop: '18px',
  border: 'none',
  borderRadius: '14px',
  background: 'white',
  color: 'black',
  fontWeight: '900' as const,
  fontSize: '16px',
  cursor: 'pointer'
};

const backLinkStyle = {
  display: 'block',
  marginTop: '16px',
  textAlign: 'center' as const,
  color: '#9da5b2',
  textDecoration: 'none',
  fontSize: '14px'
};
