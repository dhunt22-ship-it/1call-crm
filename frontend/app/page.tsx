'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Strict Type Definitions for Engine Stability
interface Account {
  id: string | number;
  company_name?: string;
  name?: string;
  account_name?: string;
  website?: string;
  tier?: string;
  owner_id?: number | string;
}

interface Contact {
  id: string | number;
  account_id?: string | number;
  accountId?: string | number;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  title?: string;
  phone?: string;
  email?: string;
}

interface ActivityLog {
  id: string | number;
  account_id: string | number;
  outcome: string;
  notes: string;
  amount: number;
  timestamp: string;
}

export default function OneCallCockpit() {
  // Master Identity Management
  const [currentUser] = useState({ 
    name: 'Derek J. Hunt', 
    role: 'owner', 
    repo: 'dhunt22-ship-it',
    date: 'June 1, 2026'
  });

  // ROBUST FALLBACK SEED DATA (Guarantees the UI never unpopulates if database is sleeping)
  const fallbackAccounts: Account[] = [
    { id: 1, company_name: 'Acme Corporation', website: 'https://acme.com', tier: 'prospect', owner_id: 3 },
    { id: 2, company_name: 'Stark Industries', website: 'https://stark.com', tier: 'customer', owner_id: 3 },
    { id: 3, company_name: 'Wayne Enterprises', website: 'https://wayne.com', tier: 'client', owner_id: 4 }
  ];

  const fallbackContacts: Contact[] = [
    { id: 1, account_id: 1, first_name: 'Sarah', last_name: 'Jenkins', title: 'VP of Procurement', phone: '555-0192', email: 'sjenkins@acme.com' },
    { id: 2, account_id: 1, first_name: 'Michael', last_name: 'Chang', title: 'Technical Gatekeeper', phone: '555-0193', email: 'mchang@acme.com' },
    { id: 3, account_id: 2, first_name: 'Alex', last_name: 'Rivera', title: 'Chief Technology Officer', phone: '555-4481', email: 'alex@stark.com' },
    { id: 4, account_id: 3, first_name: 'Jordan', last_name: 'Vance', title: 'Managing Director', phone: '555-7722', email: 'jordan@wayne.com' }
  ];

  // CORE APPLICATION STATE
  const [accounts, setAccounts] = useState<Account[]>(fallbackAccounts);
  const [contacts, setContacts] = useState<Contact[]>(fallbackContacts);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  // EXECUTIVE PERFORMANCE SCOREBOARD
  const [winsToday, setWinsToday] = useState<number>(4);
  const [totalAttempts, setTotalAttempts] = useState<number>(12);
  const [cashCollected, setCashCollected] = useState<number>(72500);
  const [callbacksCount, setCallbacksCount] = useState<number>(3);

  // CURRENT INTERACTION CONTEXT
  const [selectedAccountId, setSelectedAccountId] = useState<string>('1');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [callOutcome, setCallOutcome] = useState<string>('Connected');
  const [notes, setNotes] = useState<string>('');
  const [dealAmount, setDealAmount] = useState<string>('5000');
  const [callbackDate, setCallbackDate] = useState<string>('');

  // HYDRATION PIPELINE (Supabase Dynamic Pull)
  useEffect(() => {
    async function hydrateCockpit() {
      try {
        setLoading(true);
        
        // Fetch Accounts Layer
        const { data: fetchedAccounts, error: accError } = await supabase
          .from('accounts')
          .select('*');
        if (accError) throw accError;

        // Fetch Contacts Layer
        const { data: fetchedContacts, error: contError } = await supabase
          .from('contacts')
          .select('*');
        if (contError) throw contError;

        // If records exist, inject them and mark DB live
        if (fetchedAccounts && fetchedAccounts.length > 0) {
          setAccounts(fetchedAccounts);
          setSelectedAccountId(String(fetchedAccounts[0].id));
          setDbConnected(true);
        }
        if (fetchedContacts && fetchedContacts.length > 0) {
          setContacts(fetchedContacts);
        }

      } catch (err: any) {
        console.warn('Supabase sync holding, utilizing client fallbacks safely:', err.message);
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    }
    hydrateCockpit();
  }, []);

  // RESOLUTION UTILITIES FOR SCHEMA FLEXIBILITY
  const getAccountName = (acc: Account | null): string => {
    if (!acc) return 'Unknown Entity';
    return acc.company_name || acc.name || acc.account_name || `Account Profile #${acc.id}`;
  };

  const getContactFullName = (c: Contact): string => {
    const first = c.first_name || c.firstName || '';
    const last = c.last_name || c.lastName || '';
    return `${first} ${last}`.trim() || 'Unnamed Contact';
  };

  // REACTIVE DATA FILTERING
  const currentAccount = accounts.find(a => String(a.id) === String(selectedAccountId)) || accounts[0] || null;
  
  const accountContacts = contacts.filter(c => {
    const assocId = c.account_id !== undefined ? c.account_id : c.accountId;
    return String(assocId) === String(selectedAccountId);
  });

  // Maintain active contact focus when switching accounts
  useEffect(() => {
    if (accountContacts.length > 0) {
      setSelectedContactId(String(accountContacts[0].id));
    } else {
      setSelectedContactId('');
    }
  }, [selectedAccountId, accounts, contacts]);

  const currentContact = contacts.find(c => String(c.id) === String(selectedContactId)) || accountContacts[0] || null;

  // ACTION LOG TRANSMISSION HANDLER
  const handleSecureFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) return;

    const pitchValue = Number(dealAmount) || 0;
    const trackingId = currentAccount.id;

    try {
      // Execute State Modification on Live Cloud Node
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ tier: 'customer' })
        .eq('id', trackingId);

      if (updateError) throw updateError;
      
      alert(`Transaction Locked! Supabase database updated successfully.`);
    } catch (err: any) {
      console.warn('Cloud write bypass, updating local reactive matrix:', err.message);
    }

    // Always update client interface state smoothly
    const newLog: ActivityLog = {
      id: Date.now(),
      account_id: trackingId,
      outcome: callOutcome,
      notes: notes || 'No custom details logged.',
      amount: callOutcome === 'Connected' ? pitchValue : 0,
      timestamp: new Date().toLocaleTimeString()
    };

    setLogs(prev => [newLog, ...prev]);
    setTotalAttempts(prev => prev + 1);

    if (callOutcome === 'Connected') {
      setWinsToday(prev => prev + 1);
      setCashCollected(prev => prev + pitchValue);
      // Inline upgrade row variant state
      setAccounts(prev => prev.map(acc => String(acc.id) === String(trackingId) ? { ...acc, tier: 'customer' } : acc));
    }

    if (callbackDate) {
      setCallbacksCount(prev => prev + 1);
    }

    // Reset interaction inputs clean
    setNotes('');
    setCallbackDate('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 tracking-widest uppercase">Initializing Operational Matrix Layers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* GLOBAL HEADBOARD SYSTEM */}
      <header className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-4 backdrop-blur-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter text-emerald-400 flex items-center gap-2">
              ⚡ 1CALL CRM COCKPIT
            </h1>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${dbConnected ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' : 'bg-amber-950/40 text-amber-400 border-amber-800/60'}`}>
              {dbConnected ? '● CLOUD NODE CONNECTED' : '○ CLIENT FALLBACK SAFE'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
            <p>Architect: <span className="text-slate-200 font-medium">{currentUser.name}</span></p>
            <span className="text-slate-700">|</span>
            <p>Branch Instance: <span className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{currentUser.repo}</span></p>
            <span className="text-slate-700">|</span>
            <p className="text-slate-500 font-mono text-[11px]">{currentUser.date}</p>
          </div>
        </div>

        {/* METRIC SCOREBOARD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/60 text-center text-[11px]">
          <div className="px-4 py-1 border-r border-slate-800/60">
            <p className="text-slate-500 font-bold tracking-wider uppercase">Wins Today</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{winsToday}<span className="text-slate-600 font-normal text-xs">/{totalAttempts}</span></p>
          </div>
          <div className="px-4 py-1 sm:border-r border-slate-800/60">
            <p className="text-slate-500 font-bold tracking-wider uppercase">Close Ratio</p>
            <p className="text-lg font-black text-blue-400 mt-0.5">{totalAttempts > 0 ? ((winsToday / totalAttempts) * 100).toFixed(0) : 0}%</p>
          </div>
          <div className="px-4 py-1 border-r border-slate-800/60">
            <p className="text-slate-500 font-bold tracking-wider uppercase">Cash Collected</p>
            <p className="text-lg font-black text-amber-400 mt-0.5">${cashCollected.toLocaleString()}</p>
          </div>
          <div className="px-4 py-1">
            <p className="text-slate-500 font-bold tracking-wider uppercase">Callbacks</p>
            <p className="text-lg font-black text-rose-400 mt-0.5">{callbacksCount}</p>
          </div>
        </div>
      </header>

      {/* DASHBOARD CORE CONTROL LAYOUT */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: TARGET SELECTION & PROFILES */}
        <section className="xl:col-span-5 bg-slate-950 p-6 border-r border-slate-900 flex flex-col gap-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Target Pipeline Queue</label>
            <select 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {getAccountName(acc)} {acc.tier ? `(${acc.tier.toUpperCase()})` : ''}
                </option>
              ))}
            </select>
          </div>

          {currentAccount && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{getAccountName(currentAccount)}</h2>
                  <a href={currentAccount.website} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-0.5 block font-mono">
                    {currentAccount.website || 'No domain reference linked'}
                  </a>
                </div>
                <span className={`text-[10px] font-mono tracking-widest font-black uppercase border px-2.5 py-0.5 rounded-md ${currentAccount.tier === 'customer' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {currentAccount.tier || 'prospect'}
                </span>
              </div>
              
              <hr className="border-slate-800/60" />

              <div className="space-y-3">
                <p className="text-xs font-black tracking-wider uppercase text-slate-400">Associated Decision Makers</p>
                {accountContacts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-lg border border-slate-900">No contact routing records mapped to this profile channel.</p>
                ) : (
                  <div className="space-y-2">
                    {accountContacts.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedContactId(String(c.id))}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${String(c.id) === String(selectedContactId) ? 'bg-slate-900 border-emerald-500/40 shadow-md shadow-black/20' : 'bg-slate-950/60 border-slate-800/40 hover:border-slate-700/60'}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-100 text-sm">{getContactFullName(c)}</p>
                          <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-medium">{c.title || 'Executive'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-400 text-xs font-mono mt-2.5 pt-2.5 border-t border-slate-900/60">
                          <p className="hover:text-slate-200 truncate">📞 {c.phone || 'No Phone'}</p>
                          <p className="hover:text-slate-200 truncate text-right">✉️ {c.email || 'No Email'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: ACTION RADAR & TRANSACTION FLUIDITY */}
        <section className="xl:col-span-7 bg-slate-900/20 p-6 flex flex-col gap-6 overflow-y-auto">
          
          <form onSubmit={handleSecureFunds} className="bg-slate-950 border border-slate-800/60 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3 flex justify-between items-center">
                <span>Outbound Interaction Router</span>
                {currentContact && <span className="text-slate-500 font-mono font-medium lowercase">Routing: {currentContact.email}</span>}
              </h3>
              
              {/* STATUS MATRIX */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide block">Call Matrix Outcome</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Connected', 'No Answer', 'Gatekeeper Blocked'].map((status) => (
                    <button
                      key={status} type="button" onClick={() => setCallOutcome(status)}
                      className={`p-3 text-xs rounded-lg font-black tracking-wide border uppercase transition-all ${callOutcome === status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500' : 'bg-slate-900/60 text-slate-500 border-slate-800/80 hover:border-slate-700'}`}
                    >
                      {status === 'Connected' ? '🤝 ' : status === 'No Answer' ? '⏳ ' : '🛡️ '}
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* TWO-COLUMN MATRIX: PITCH VALUE & CALLBACK SCHEDULING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 tracking-wide block">Deal Contract Pitch Value ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">$</span>
                    <input 
                      type="number" 
                      disabled={callOutcome !== 'Connected'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 pl-7 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all" 
                      value={dealAmount} 
                      onChange={(e) => setDealAmount(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 tracking-wide block">Set Pipeline Callback Window</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-colors" 
                    value={callbackDate} 
                    onChange={(e) => setCallbackDate(e.target.value)} 
                  />
                </div>
              </div>

              {/* CONVERSATION STREAM */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide block">Closing Negotiation Notes</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors resize-none" 
                  placeholder="Log core pain points, pricing alignment notes, or follow-up milestones here..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!currentAccount} 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest py-4 px-4 rounded-xl shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-40 mt-4"
            >
              🚀 SECURE FUNDS & CLOSE CONTRACT FLUIDITY
            </button>
          </form>

          {/* STREAM ACTIVITY TRACKING FEED */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Session Session Activity Stream</h4>
            {logs.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-600">
                No pipeline interaction sequences fired in this active runtime session.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map(log => {
                  const loggedAccount = accounts.find(a => String(a.id) === String(log.account_id));
                  return (
                    <div key={log.id} className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex justify-between items-center gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-200">
                          {getAccountName(loggedAccount || null)}
                        </p>
                        <p className="text-slate-400 font-normal line-clamp-1">{log.notes}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${log.outcome === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {log.outcome}
                        </span>
                        <p className="font-mono text-[10px] text-slate-500 mt-1">{log.timestamp} {log.amount > 0 && `| +$${log.amount.toLocaleString()}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}