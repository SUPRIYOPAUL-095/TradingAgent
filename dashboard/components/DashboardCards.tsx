// ARTHNEETI Dashboard Cards Component
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, AlertCircle, CheckCircle, BadgeCheck, Sparkles, Bot } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DashboardCardsProps {
  decision: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  risk: 'Low' | 'Medium' | 'High';
  explanation: string;
  rsi: number;
  sma20: number;
  sma50: number;
  companySymbol?: string;
  latestPrice?: number;
  summarySource?: 'gemini' | 'local';
}

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardCards({
  decision,
  confidence,
  risk,
  explanation,
  rsi,
  sma20,
  sma50,
  companySymbol,
  latestPrice,
  summarySource = 'gemini',
}: DashboardCardsProps) {
  const decisionConfig = {
    BUY: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: ArrowUp },
    SELL: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ArrowDown },
    HOLD: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertCircle },
  };
  const riskConfig = {
    Low: { color: 'text-green-400', label: 'Low Risk' },
    Medium: { color: 'text-amber-400', label: 'Medium Risk' },
    High: { color: 'text-red-400', label: 'High Risk' },
  };
  const config = decisionConfig[decision];
  const DecisionIcon = config.icon;

  // Parse summary paragraphs — handle both \n\n and \n separators
  const summaryParagraphs = explanation
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Detect recommendation lines
  const isRecommendationLine = (line: string) => {
    const lower = line.toLowerCase();
    return (
      lower.startsWith('recommendation:') ||
      lower === 'buy' ||
      lower === 'sell' ||
      lower === 'hold'
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Decision Card */}
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className={`glass-effect border ${config.border} rounded-2xl p-8`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-300 font-medium">AI Decision</h3>
          <DecisionIcon className={config.color} size={24} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-4xl font-bold ${config.color} mb-2`}>{decision}</p>
            <p className="text-slate-400 text-sm">Recommendation</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">Confidence</p>
            <p className={`text-2xl font-bold ${config.color}`}>{confidence}%</p>
          </div>
        </div>
        {/* Confidence Bar */}
        <div className="mt-6">
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full ${
                decision === 'BUY'
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : decision === 'SELL'
                  ? 'bg-gradient-to-r from-red-500 to-red-400'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      {/* Technical Indicators Card */}
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="glass-effect border border-slate-600 rounded-2xl p-6"
      >
        <h3 className="text-slate-300 font-medium text-sm mb-4 flex items-center gap-2">
          <BadgeCheck className="text-blue-400" size={18} /> Technical Indicators
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 glass-effect border border-slate-700/30">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">RSI</p>
            <p className={`text-xl font-bold ${rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-green-400' : 'text-blue-400'}`}>{formatNumber(rsi)}</p>
          </div>
          <div className="text-center p-3 glass-effect border border-slate-700/30">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">SMA20</p>
            <p className="text-xl font-bold text-cyan-400">{formatNumber(sma20)}</p>
          </div>
          <div className="text-center p-3 glass-effect border border-slate-700/30">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">SMA50</p>
            <p className="text-xl font-bold text-indigo-400">{formatNumber(sma50)}</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Assessment Card */}
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="glass-effect border border-slate-600 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-300 font-medium text-sm">Risk Assessment</h3>
          <AlertCircle className={riskConfig[risk].color} size={20} />
        </div>
        <p className={`text-3xl font-bold ${riskConfig[risk].color} mb-2`}>{riskConfig[risk].label}</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          {risk === 'Low' && 'Technical indicators suggest stable price action with low volatility.'}
          {risk === 'Medium' && 'Moderate volatility expected based on current indicator crossovers.'}
          {risk === 'High' && 'High volatility signals detected. Exercise caution with position sizing.'}
        </p>
      </motion.div>

      {/* Gemini AI Analysis Summary — Enhanced */}
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm"
      >
        {/* Header with source badge */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              {summarySource === 'gemini' ? (
                <Sparkles className="text-blue-400" size={16} />
              ) : (
                <Bot className="text-indigo-400" size={16} />
              )}
            </span>
            Gemini AI Analysis Summary
          </h3>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
              summarySource === 'gemini'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}
          >
            {summarySource === 'gemini' ? '✦ Powered by Gemini AI' : '⚡ Technical Indicators Analysis'}
          </span>
        </div>

        {/* Stock context header */}
        {companySymbol && (
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
              <span className="text-sm font-bold text-cyan-400">
                {companySymbol.replace('.NS', '').replace('.BO', '').substring(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {companySymbol.replace('.NS', '').replace('.BO', '')}
              </p>
              <p className="text-slate-500 text-xs">{companySymbol}</p>
            </div>
            {latestPrice !== undefined && latestPrice > 0 && (
              <div className="ml-auto text-right">
                <p className="text-white font-bold text-lg">{formatCurrency(latestPrice)}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Current Price</p>
              </div>
            )}
          </div>
        )}

        {/* Analysis body */}
        <div className="space-y-4">
          {summaryParagraphs.map((paragraph, idx) => {
            // Render recommendation lines as highlighted badges
            if (isRecommendationLine(paragraph)) {
              const recText = paragraph.replace(/^recommendation:\s*/i, '').trim();
              const recUpper = recText.toUpperCase();
              const recColor =
                recUpper === 'BUY' || recUpper.includes('BUY')
                  ? 'from-green-500/10 to-green-600/5 border-green-500/30 text-green-400'
                  : recUpper === 'SELL' || recUpper.includes('SELL')
                  ? 'from-red-500/10 to-red-600/5 border-red-500/30 text-red-400'
                  : 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/30 text-yellow-400';

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 bg-gradient-to-r ${recColor} border rounded-xl px-5 py-3 mt-2`}
                >
                  <CheckCircle size={18} />
                  <span className="font-bold text-sm tracking-wide uppercase">
                    Recommendation: {recText || decision}
                  </span>
                </div>
              );
            }

            // Regular paragraph
            return (
              <div key={idx} className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-slate-300 text-sm leading-relaxed">{paragraph}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

