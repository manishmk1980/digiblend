import React, { useMemo } from 'react';
import { Users, Zap, CreditCard, Calendar, TrendingUp, Sparkles, Activity, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { SaaSUser, SaaSSubscription, UsageLog } from '../types';

interface MetricsOverviewProps {
  saasUsers: SaaSUser[];
  saasSubscriptions: SaaSSubscription[];
  usageLogs: UsageLog[];
}

export default function MetricsOverview({ saasUsers, saasSubscriptions, usageLogs }: MetricsOverviewProps) {
  // Pivot date is June 30, 2026 based on mock system state, or fallback to system's local date
  const todayDateString = useMemo(() => {
    // Check if there are users with activity to find the latest active date, or default to current date
    if (saasUsers.length > 0) {
      const dates = saasUsers.map(u => u.lastActive.substring(0, 10));
      dates.sort();
      return dates[dates.length - 1] || '2026-06-30';
    }
    return new Date().toISOString().substring(0, 10);
  }, [saasUsers]);

  // 1. Daily Signups
  const dailySignups = useMemo(() => {
    return saasUsers.filter(u => u.createdAt && u.createdAt.substring(0, 10) === todayDateString).length;
  }, [saasUsers, todayDateString]);

  // Signups yesterday (June 29, 2026) for growth indicator
  const yesterdaySignups = useMemo(() => {
    const yesterdayDate = new Date(new Date(todayDateString).getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10);
    return saasUsers.filter(u => u.createdAt && u.createdAt.substring(0, 10) === yesterdayDate).length;
  }, [saasUsers, todayDateString]);

  // 2. Active Pro Subscribers
  const activeProSubscribers = useMemo(() => {
    return saasUsers.filter(u => u.plan === 'PRO').length;
  }, [saasUsers]);

  // Active subscription records
  const activeSubRecords = useMemo(() => {
    return saasSubscriptions.filter(s => s.status === 'ACTIVE').length;
  }, [saasSubscriptions]);

  // 3. Total Tool Invocations
  const totalToolInvocations = useMemo(() => {
    return saasUsers.reduce((sum, u) => sum + u.usageCount, 0);
  }, [saasUsers]);

  // Invocations today
  const dailyInvocations = useMemo(() => {
    // If usageLogs has usedAt field
    return usageLogs.filter(log => log.usedAt && log.usedAt.substring(0, 10) === todayDateString).length;
  }, [usageLogs, todayDateString]);

  // Growth rates & estimates
  const signupGrowthPercentage = useMemo(() => {
    if (yesterdaySignups === 0) return dailySignups > 0 ? 100 : 0;
    return Math.round(((dailySignups - yesterdaySignups) / yesterdaySignups) * 100);
  }, [dailySignups, yesterdaySignups]);

  const projectedMRR = useMemo(() => {
    return activeProSubscribers * 499; // ₹499/mo per active seat
  }, [activeProSubscribers]);

  const avgInvocationsPerUser = useMemo(() => {
    if (saasUsers.length === 0) return 0;
    return (totalToolInvocations / saasUsers.length).toFixed(1);
  }, [totalToolInvocations, saasUsers]);

  return (
    <div className="space-y-6">
      {/* Real-time KPI Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Daily Signups */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500" />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Daily Signups
            </span>
            <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {dailySignups}
            </h3>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              signupGrowthPercentage >= 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              {signupGrowthPercentage >= 0 ? '+' : ''}{signupGrowthPercentage}%
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Yesterday: {yesterdaySignups} users</span>
            <span className="text-indigo-500 dark:text-indigo-400 flex items-center gap-0.5">
              Target: 5/day <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* KPI 2: Active Pro Subscribers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500" />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Active Pro Subscribers
            </span>
            <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {activeProSubscribers}
            </h3>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              ₹{projectedMRR}/mo
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Subs Recs: {activeSubRecords} active</span>
            <span className="text-amber-500 dark:text-amber-400">
              {Math.round((activeProSubscribers / (saasUsers.length || 1)) * 100)}% Conv. Rate
            </span>
          </div>
        </div>

        {/* KPI 3: Total Tool Invocations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500" />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Total Tool Invocations
            </span>
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {totalToolInvocations}
            </h3>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +{dailyInvocations} today
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Avg: {avgInvocationsPerUser} / user</span>
            <span className="text-emerald-500 dark:text-emerald-400">
              Logs size: {usageLogs.length}
            </span>
          </div>
        </div>

      </div>

      {/* Mini Visual Analytics Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide font-mono">
              Real-time Ingestion Streams
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Comparing customer allocations, subscription status and execution frequencies
            </p>
          </div>
          <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> LIVE STREAMING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Progress Stream 1 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 font-medium">PRO Seats Utilisation</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {activeProSubscribers} / {saasUsers.length} ({Math.round((activeProSubscribers / (saasUsers.length || 1)) * 100)}%)
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
              <div 
                style={{ width: `${(activeProSubscribers / (saasUsers.length || 1)) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              />
            </div>
          </div>

          {/* Progress Stream 2 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Daily Signup Runrate</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {dailySignups} / 5 users ({Math.min(100, Math.round((dailySignups / 5) * 100))}%)
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
              <div 
                style={{ width: `${Math.min(100, (dailySignups / 5) * 100)}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
