'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

type Method = 'airtel' | 'mpamba' | 'bank';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string | null;
  reference: string | null;
  status: string;
  created_at: string;
};

export default function WalletPage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [method, setMethod] = useState<Method>('airtel');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function loadWallet() {
    setLoading(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Please sign in to view your MOVETI wallet.');
      setLoading(false);
      return;
    }

    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: history } = await supabase
      .from('wallet_transactions')
      .select(
        'id,type,amount,currency,description,reference,status,created_at'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    setBalance(Number(wallet?.balance || 0));
    setTransactions((history || []) as Transaction[]);
    setLoading(false);
  }

  useEffect(() => {
    loadWallet();
  }, []);

  async function requestWithdrawal(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    const requested = Number(amount);

    if (!Number.isFinite(requested) || requested <= 0) {
      setMessage('Enter a valid withdrawal amount.');
      return;
    }

    if (requested > balance) {
      setMessage('You cannot withdraw more than your current balance.');
      return;
    }

    if (!destination.trim()) {
      setMessage(
        method === 'bank'
          ? 'Enter the bank account destination.'
          : 'Enter the mobile-money number.'
      );
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Please sign in again.');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from('withdrawal_requests').insert({
      user_id: user.id,
      amount: requested,
      method,
      destination: destination.trim(),
      status: 'pending',
    });

    if (error) {
      setMessage(
        error.message.includes('row-level security')
          ? 'Withdrawal request could not be submitted. Please try again.'
          : error.message
      );
    } else {
      setAmount('');
      setDestination('');
      setMessage(
        'Withdrawal request submitted. MOVETI will review and process it.'
      );
      await loadWallet();
    }

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-400">
            ← Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-black">My MOVETI Wallet</h1>
          <p className="mt-2 text-sm text-gray-400">
            Your personal artist balance and earnings.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 text-black shadow-xl">
          <p className="text-sm font-bold text-gray-500">AVAILABLE BALANCE</p>
          <p className="mt-2 text-4xl font-black">
            K{balance.toLocaleString('en-MW', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This balance belongs only to your MOVETI artist account.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 text-black shadow-xl">
          <h2 className="text-xl font-black">Withdraw</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose where you want MOVETI to send your requested amount.
          </p>

          <form onSubmit={requestWithdrawal} className="mt-5 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('airtel')}
                className={`rounded-xl p-3 text-sm font-black ${
                  method === 'airtel'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                Airtel Money
              </button>

              <button
                type="button"
                onClick={() => setMethod('mpamba')}
                className={`rounded-xl p-3 text-sm font-black ${
                  method === 'mpamba'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                TNM Mpamba
              </button>

              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`rounded-xl p-3 text-sm font-black ${
                  method === 'bank'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                Bank Account
              </button>
            </div>

            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount in MWK"
              className="w-full rounded-xl border border-gray-200 p-4 outline-none"
            />

            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              type="text"
              placeholder={
                method === 'bank'
                  ? 'Bank account destination'
                  : 'Airtel/Mpamba number'
              }
              className="w-full rounded-xl border border-gray-200 p-4 outline-none"
            />

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-xl bg-black p-4 font-black text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Withdraw Now'}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-xl bg-gray-100 p-4 text-sm font-bold">
              {message}
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 text-black shadow-xl">
          <h2 className="text-xl font-black">My Transaction History</h2>

          {loading ? (
            <p className="mt-4 text-sm text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No transactions yet.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black">
                        {transaction.description || transaction.type}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-black">
                      {transaction.amount >= 0 ? '+' : ''}K
                      {Number(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {transaction.status}
                    {transaction.reference
                      ? ` • ${transaction.reference}`
                      : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-gray-500">
          MOVETI does not request or store your Airtel Money or TNM Mpamba PIN.
          Actual money transfers require an approved payment provider.
        </p>
      </div>
    </main>
  );
}
