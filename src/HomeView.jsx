import React, { useMemo, useState, useEffect } from 'react';
import { Plus, TrendingUp, Zap, Leaf, Lightbulb, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { getIcon, formatCO2, formatAmount, activityCategories, getActivityUnit } from './activityData';

export default function HomeView({ userProfile, activities, onAddClick, recommendations }) {
  const recentActivities = activities.slice(0, 3);
  const [tipIndex, setTipIndex] = useState(0);

  // CALCULATE LIVE SCORE
  const liveScore = useMemo(() => {
    return activities.reduce((sum, act) => sum + (Number(act.co2ImpactKg) || 0), 0);
  }, [activities]);

  const unitPref = userProfile?.preferences?.units || 'kg';

  // DYNAMIC RANK
  const dynamicRank = useMemo(() => {
    const absScore = Math.abs(liveScore);
    let rankPercent = 0.5 + (absScore * 0.2);
    if (rankPercent > 99.9) rankPercent = 99.9;
    
    let badge = '';
    if (rankPercent < 5) badge = ' (Eco Legend)';
    else if (rankPercent < 15) badge = ' (Green Hero)';
    else if (rankPercent < 30) badge = ' (Rising Star)';

    return `Top ${rankPercent.toFixed(1)}%${badge}`;
  }, [liveScore]);

  // REAL STREAK
  const ecoStreak = useMemo(() => {
    if (!activities || activities.length === 0) return 0;
    const dates = [...new Set(activities.map(a => new Date(a.date).toDateString()))]
      .map(d => new Date(d))
      .sort((a, b) => b - a);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dates[0].toDateString() !== today && dates[0].toDateString() !== yesterday) return 0;
    let streak = 0;
    let checkDate = new Date(dates[0]);
    for (let i = 0; i < dates.length; i++) {
      if (dates[i].toDateString() === checkDate.toDateString()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else { break; }
    }
    return streak;
  }, [activities]);

  // Handle Carousel Rotation
  useEffect(() => {
    if (!recommendations || recommendations.length <= 1) return;
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % recommendations.length);
    }, 10000); // 10 seconds per tip for better reading
    return () => clearInterval(timer);
  }, [recommendations]);

  const hasTips = recommendations && recommendations.length > 0;
  
  const nextTip = (e) => {
    e.stopPropagation();
    if (hasTips) setTipIndex((prev) => (prev + 1) % recommendations.length);
  };
  
  const prevTip = (e) => {
    e.stopPropagation();
    if (hasTips) setTipIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <div className="view-container home-view" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="greeting-section">
        <p className="greeting-subtitle">Welcome back,</p>
        <h1 className="greeting-text">{userProfile?.name || 'Eco Warrior'}</h1>
      </div>

      <div className="stats-card" style={{ 
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: 'white',
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 32px'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>SURPLUS EMISSIONS</p>
          <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '4px' }}>
            {formatCO2(Math.abs(liveScore), unitPref)}
          </h2>
          <p style={{ fontSize: '12px', opacity: 0.8, fontWeight: '500' }}>Your tracked environmental footprint</p>
        </div>
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
          <Leaf size={140} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="stats-card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '8px' }}><TrendingUp size={20} /></div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>GLOBAL STANDING</p>
          <p style={{ fontSize: '16px', fontWeight: '800' }}>{dynamicRank}</p>
        </div>
        <div className="stats-card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ color: ecoStreak > 0 ? '#f59e0b' : '#94a3b8', marginBottom: '8px' }}><Zap size={20} /></div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>ECO STREAK</p>
          <p style={{ fontSize: '16px', fontWeight: '800' }}>{ecoStreak} {ecoStreak === 1 ? 'Day' : 'Days'}</p>
        </div>
      </div>

      {/* GENTLE ECO-INTELLIGENCE CAROUSEL */}
      <div className="stats-card" style={{ 
        background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', 
        border: '1.5px solid #BBF7D0', 
        padding: '20px 24px',
        marginBottom: '24px',
        position: 'relative',
        color: '#065F46',
        boxShadow: '0 8px 20px rgba(22, 163, 74, 0.1)',
        animation: 'slideUp 0.6s ease-out',
        minHeight: '140px'
      }}>
        <div style={{ position: 'absolute', top: '-5px', right: '5px', opacity: 0.1 }}>
            <Sparkles size={80} color="#059669" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ 
            width: '28px', height: '28px', background: '#DCFCE7', 
            borderRadius: '8px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', color: '#059669', border: '1px solid #BBF7D0'
          }}>
            <Lightbulb size={16} />
          </div>
          <h4 style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#047857' }}>AI INSIGHTS</h4>
        </div>
        
        <div style={{ minHeight: '48px' }}>
          <p key={tipIndex} style={{ 
            fontSize: '14px', 
            lineHeight: '1.5', 
            fontWeight: '600',
            color: '#064E3B',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            {hasTips ? recommendations[tipIndex] : "Analyze your footprint to unlock personalized insights."}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                {hasTips && recommendations.slice(0, 5).map((_, i) => (
                    <div key={i} style={{ 
                        width: i === tipIndex ? '16px' : '5px', 
                        height: '5px', 
                        borderRadius: '3px', 
                        background: i === tipIndex ? '#059669' : 'rgba(5, 150, 105, 0.2)',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={prevTip} style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '50%', padding: '5px', color: '#059669', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                <button onClick={nextTip} style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '50%', padding: '5px', color: '#059669', cursor: 'pointer' }}><ChevronRight size={16} /></button>
            </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Recent Activity</h3>
      </div>

      <div className="activity-list">
        {recentActivities.map((act) => {
          const baseUnit = getActivityUnit(act.type);

          return (
            <div key={act._id} className="activity-item" style={{ animation: 'slideUp 0.4s ease-out' }}>
              <div className="activity-icon-container">
                {getIcon(act.type)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>{act.type}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatAmount(act.amount, baseUnit, userProfile?.preferences)}
                </p>
              </div>
              <div className="impact-badge">
                {formatCO2(act.co2ImpactKg, unitPref)}
              </div>
            </div>
          );
        })}
      </div>

      <button className="fab-button" onClick={onAddClick}>
        <Plus size={32} />
      </button>
    </div>
  );
}
