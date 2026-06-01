'use client';

import React, { useState } from 'react';

export default function OneCallCockpit() {
  // Master Session Config
  const [currentUser] = useState({ name: 'Derek J. Hunt', role: 'owner' });

  // 1. DYNAMIC ACCOUNT PIPELINE STATE
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Acme Corporation', website: 'https://acme.com', tier: 'prospect' },
    { id: 2, name: 'Stark Industries', website: 'https://stark.com', tier: 'customer' },
    { id: 3, name: 'Wayne Enterprises', website: 'https://wayne.com', tier: 'client' },
  ]);

  const [contacts] = useState([
    { id: 1, accountId: 1, firstName: 'Arthur', lastName: 'Dent', title: 'Gatekeeper', phone: '555-0142', email: 'adent@acme.com' },
    { id: 2, accountId: 1, firstName: 'Pepper', lastName: 'Potts', title: 'CEO', phone: '555-0199', email: 'ppotts@acme.com' },
    { id: 3, accountId: 2, firstName: 'Tony', lastName: 'Stark', title: 'Founder', phone: '555-3000', email: 'tony@stark.com' },
    { id: 4, accountId: 3, firstName: 'Bruce', lastName: 'Wayne', title: 'Chairman', phone: '555-1939', email: 'bruce@wayne.com' },
  ]);

  // 2. DYNAMIC KPI ENGINE STATES (Hydrated with your baseline database seed values)
  const [winsToday, setWinsToday] = useState(4);
  const [totalAttempts, setTotalAttempts] = useState(12);
  const [cashCollected, setCashCollected] = useState(72500);
  const [callbacksCount, setCallbacksCount] = useState(3);

  // Form Processing States
  const [selectedAccountId, setSelectedAccountId] = useState(1);
  const [selectedContactId, setSelectedContactId] = useState(1);
  const [callOutcome, setCallOutcome] = useState('Connected');
  const [notes, setNotes] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [dealAmount, setDealAmount] = useState('5000');

  // Computed relational mapping
  const currentAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const accountContacts = contacts.filter(c => c.accountId === selectedAccountId);
  const currentContact = contacts.find(c => c.id === selectedContactId) || accountContacts[0];

  // Dynamic Live Ratio Calculation
  const closeRatio = totalAttempts > 0 ? ((winsToday / totalAttempts) * 100).toFixed(1) : '0.0';

  // HIGH-VELOCITY DEAL SUBMISSION ENGINE
  const handleCloseDeal = (e) => {
    e.preventDefault();
    
    const revenueInput = Number(dealAmount) || 0;
    
    alert(`Funds Secured! Closed $${revenueInput.toLocaleString()} with ${currentContact.firstName} at ${currentAccount.name}. Dashboard metrics updating...`);
    
    // Update KPI panels dynamically
    setWinsToday(prev => prev + 1);
    setTotalAttempts(prev => prev + 1);
    setCashCollected(prev => prev + revenueInput);
    if (callbackDate) {
      setCallbacksCount(prev => prev + 1);
    }

    // Step up the client tier rating dynamically on the left pane
    setAccounts(prev => prev.map(acc => {
      if (acc.id === selectedAccountId) {
        const nextTier = acc.tier === 'prospect' ? 'customer' : 'client';
        return { ...acc, tier: nextTier };
      }
      return acc;
    }));

    // Reset log states
    setNotes('');
    setCallbackDate('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* 1. MASTER HEADER SECTION */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-emerald-400 flex items-center gap-2">
            ⚡ 1CALL <span className="text-slate-400 text-sm font-normal tracking-normal border border-slate-700 px-2 py-0.5 rounded">CRM Cockpit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Active Session: <strong className="text-slate-300">{currentUser.name}</strong> ({currentUser.role})</p>
        </div>

        {/* 2. LIVE DYNAMIC KPI DASHBOARD BLOCK */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
          <div className="px-4 py-1 text-center border-r border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">1-Call Wins Today</p>
            <p className="text-lg font-black text-emerald-400">{winsToday} / {totalAttempts}</p>
          </div>
          <div className="px-4 py-1 text-center sm:border-r border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Close Ratio</p>
            <p className="text-lg font-black text-blue-400">{closeRatio}%</p>
          </div>
          <div className="px-4 py-1 text-center border-r border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Cash Collected</p>
            <p className="text-lg font-black text-amber-400">${cashCollected.toLocaleString()}</p>
          </div>
          <div className="px-4 py-1 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Callbacks Due</p>
            <p className="text-lg font-black text-rose-400">{callbacksCount}</p>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE: SPLIT-PANE DESIGN */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANE: LEAD SELECTION & HISTORICAL DOSSIER (5 Cols) */}
        <section className="lg:col-span-5 bg-slate-950 p-6 border-r border-slate-800 flex flex-col gap-6 overflow-y-auto">
          
          {/* Target Account Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Queue</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-emerald-500"
              value={selectedAccountId}
              onChange={(e) => {
                const accId = Number(e.target.value);
                setSelectedAccountId(accId);
              }}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Profile Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">{currentAccount.name}</h2>
                <a href={currentAccount.website} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">{currentAccount.website}</a>
              </div>
              {/* Custom Tier Indicator */}
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${
                currentAccount.tier === 'prospect' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                currentAccount.tier === 'customer' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {currentAccount.tier}
              </span>
            </div>

            <hr className="border-slate-800" />

            {/* Target Contact Profile Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Decision Maker</label>
                <select 
                  className="bg-slate-950 border border-slate-700 rounded text-xs p-1 focus:outline-none"
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(Number(e.target.value))}
                >
                  {accountContacts.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>

              {currentContact && (
                <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-slate-200">{currentContact.firstName} {currentContact.lastName}</p>
                    <span className="text-xs text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {currentContact.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">📞 {currentContact.phone}</p>
                  <p className="text-xs text-slate-400 font-mono">✉️ {currentContact.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log Audit Timeline */}
          <div className="space-y-2 flex-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity History & System Dossier</label>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs space-y-3 font-mono h-48 overflow-y-auto">
              <p className="text-slate-500">[05/31/2026 14:22] - Call completed. Outcome: Connected. Note: Pitch deck sent directly.</p>
              <p className="text-amber-400/80">[05/30/2026 09:15] - Call completed. Outcome: Gatekeeper Blocked. Note: Spoke with gatekeeper. Blocked access to decision maker.</p>
              <p className="text-slate-500">[05/28/2026 11:00] - System Record Created. Tier established automatically as [prospect].</p>
            </div>
          </div>
        </section>

        {/* RIGHT PANE: THE OUTBOUND ACTION HUB (7 Cols) */}
        <section className="lg:col-span-7 bg-slate-900 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="border border-slate-800 bg-slate-950 rounded-xl p-6 shadow-2xl flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              ⚡ Outbound Action Engine
            </h3>

            <form onSubmit={handleCloseDeal} className="space-y-6 mt-4 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* 1. High-Velocity Outcome Dropdown / Radios */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Outcome Matrix</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Connected', 'No Answer', 'Gatekeeper Blocked'].map((outcome) => (
                      <button
                        key={outcome}
                        type="button"
                        onClick={() => setCallOutcome(outcome)}
                        className={`p-2.5 text-xs rounded font-bold border transition-colors ${
                          callOutcome === outcome
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {outcome}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Deal Capital Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">One-Call Deal Contract Value ($)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    value={dealAmount}
                    onChange={(e) => setDealAmount(e.target.value)}
                  />
                </div>

                {/* 3. Action Notes Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Logs & Closing Notes</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                    placeholder="Enter explicit negotiation details or context logs here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* 4. Scheduled Callback Alarm Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Schedule Pipeline Callback Alarm (Optional)</label>
                  <input 
                    type="datetime-local"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                    value={callbackDate}
                    onChange={(e) => setCallbackDate(e.target.value)}
                  />
                </div>
              </div>

              {/* 5. Master Submission Closing Button */}
              <div className="pt-6 border-t border-slate-800 mt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-widest p-4 rounded-lg shadow-lg transition-all transform active:scale-[0.99]"
                >
                  🤝 SECURE FUNDS & CLOSE THE DEAL
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}