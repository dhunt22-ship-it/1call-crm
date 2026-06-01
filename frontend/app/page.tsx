'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function OneCallCockpit() {
  const [currentUser] = useState({ name: 'Derek J. Hunt', role: 'owner' });

  // DATABASE CHANNELS
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // PERFORMANCE METRICS
  const [winsToday, setWinsToday] = useState(4);
  const [totalAttempts, setTotalAttempts] = useState(12);
  const [cashCollected, setCashCollected] = useState(72500);
  const [callbacksCount, setCallbacksCount] = useState(3);

  // OPERATIONAL SELECTIONS
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [callOutcome, setCallOutcome] = useState('Connected');
  const [notes, setNotes] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [dealAmount, setDealAmount] = useState('5000');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // Dynamic fetch fallback to bypass exact column sorting issues
        const { data: fetchedAccounts, error: accError } = await supabase
          .from('accounts')
          .select('*');

        if (accError) throw accError;

        const { data: fetchedContacts, error: contError } = await supabase
          .from('contacts')
          .select('*');

        if (contError) throw contError;

        if (fetchedAccounts) setAccounts(fetchedAccounts);
        if (fetchedContacts) setContacts(fetchedContacts);

        if (fetchedAccounts && fetchedAccounts.length > 0) {
          setSelectedAccountId(fetchedAccounts[0].id);
        }
      } catch (err) {
        console.error('Error hydrating CRM cockpit from Supabase:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Structural name lookup safety utility
  const getAccountName = (acc) => {
    if (!acc) return '';
    return acc.name || acc.account_name || acc.company_name || `Account #${acc.id}`;
  };

  const currentAccount = accounts.find(a => String(a.id) === String(selectedAccountId)) || null;
  const accountContacts = contacts.filter(c => String(c.account_id) === String(selectedAccountId) || String(c.accountId) === String(selectedAccountId));
  const currentContact = contacts.find(c => String(c.id) === String(selectedContactId)) || accountContacts[0] || null;

  useEffect(() => {
    if (accountContacts.length > 0) {
      setSelectedContactId(accountContacts[0].id);
    } else {
      setSelectedContactId('');
    }
  }, [selectedAccountId, contacts]);

  const handleCloseDeal = async (e) => {
    e.preventDefault();
    if (!currentAccount) return;
    
    const revenueInput = Number(dealAmount) || 0;
    try {
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ tier: 'customer' })
        .eq('id', selectedAccountId);

      if (updateError) throw updateError;

      alert(`Deal Secured! Account record updated live in Supabase.`);
      setWinsToday(prev => prev + 1);
      setTotalAttempts(prev => prev + 1);
      setCashCollected(prev => prev + revenueInput);
      setNotes('');
    } catch (err) {
      alert(`Database updated locally, server notice: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center font-mono">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 tracking-wider">RESOLVING SUPABASE CONNECTIONS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wider text-emerald-400 flex items-center gap-2">
            ⚡ 1CALL CRM COCKPIT
          </h1>
          <p className="text-xs text-slate-400">Active Agent: {currentUser.name}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800 text-center text-xs">
          <div className="px-3 border-r border-slate-800"><p className="text-slate-500 font-bold">WINS TODAY</p><p className="text-base font-black text-emerald-400">{winsToday}/{totalAttempts}</p></div>
          <div className="px-3 sm:border-r border-slate-800"><p className="text-slate-500 font-bold">CLOSE RATIO</p><p className="text-base font-black text-blue-400">{totalAttempts > 0 ? ((winsToday/totalAttempts)*100).toFixed(0) : 0}%</p></div>
          <div className="px-3 border-r border-slate-800"><p className="text-slate-500 font-bold">CASH COLLECTED</p><p className="text-base font-black text-amber-400">${cashCollected.toLocaleString()}</p></div>
          <div className="px-3"><p className="text-slate-500 font-bold">CALLBACKS</p><p className="text-base font-black text-rose-400">{callbacksCount}</p></div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <section className="lg:col-span-5 bg-slate-950 p-6 border-r border-slate-800 flex flex-col gap-5 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Pipeline Queue</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              {accounts.length === 0 ? (
                <option value="">No Accounts Found in Supabase</option>
              ) : (
                accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{getAccountName(acc)}</option>
                ))
              )}
            </select>
          </div>

          {currentAccount && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-white">{getAccountName(currentAccount)}</h2>
                  <p className="text-xs text-blue-400">{currentAccount.website || 'No website attached'}</p>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
                  {currentAccount.tier || 'prospect'}
                </span>
              </div>
              <hr className="border-slate-800" />
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400">Associated Contacts</p>
                {accountContacts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No contacts synced to this account id.</p>
                ) : (
                  accountContacts.map(c => (
                    <div key={c.id} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs">
                      <p className="font-bold text-slate-200">{c.first_name || c.firstName} {c.last_name || c.lastName} — <span className="text-slate-400 font-normal">{c.title}</span></p>
                      <p className="text-slate-500 font-mono mt-1">📞 {c.phone || 'N/A'} | ✉️ {c.email || 'N/A'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>

        <section className="lg:col-span-7 bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto">
          <form onSubmit={handleCloseDeal} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">Outbound Action Logs</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Call Matrix Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Connected', 'No Answer', 'Gatekeeper Blocked'].map((status) => (
                    <button
                      key={status} type="button" onClick={() => setCallOutcome(status)}
                      className={`p-2 text-xs rounded font-bold border transition-all ${callOutcome === status ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Deal Contract Pitch Value ($)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-mono text-emerald-400 focus:outline-none" value={dealAmount} onChange={(e) => setDealAmount(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Closing Conversation Notes</label>
                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none" placeholder="Log negotiation high points here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={!currentAccount} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-widest p-3 rounded shadow-lg disabled:opacity-40">
              🤝 SECURE FUNDS & CLOSE THE DEAL
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}