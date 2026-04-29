import React, { useState, useMemo } from 'react';
import { ArrowLeft, TrendingDown, Target, Zap, Waves, Recycle, PieChart, Calendar, ChevronRight } from 'lucide-react';
import { getIcon, formatCO2, formatAmount, getActivityUnit } from './activityData.jsx';
import './index.css';

const LineChart = ({ activities, timeframe, unitPref }) => {
    const chartData = useMemo(() => {
        const now = new Date();
        const factor = unitPref === 'lb' ? 2.20462 : 1;

        if (timeframe === 'Weekly') {
            const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const counts = [0, 0, 0, 0, 0, 0, 0];
            const currentDay = now.getDay();
            const lastSunday = new Date(now);
            lastSunday.setDate(now.getDate() - currentDay);
            lastSunday.setHours(0, 0, 0, 0);

            for (let i = 0; i < 7; i++) {
                const targetDay = new Date(lastSunday);
                targetDay.setDate(lastSunday.getDate() + i);
                activities.forEach(act => {
                    const actDate = new Date(act.date);
                    if (actDate.toDateString() === targetDay.toDateString()) {
                        counts[i] += (Number(act.co2ImpactKg) || 0) * factor;
                    }
                });
            }
            return { points: counts, labels };
        } else if (timeframe === 'Monthly') {
            const counts = [0, 0, 0, 0];
            const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            activities.forEach(act => {
                const actDate = new Date(act.date);
                if (actDate.getMonth() === now.getMonth() && actDate.getFullYear() === now.getFullYear()) {
                    const day = actDate.getDate();
                    const value = (Number(act.co2ImpactKg) || 0) * factor;
                    if (day <= 7) counts[0] += value;
                    else if (day <= 14) counts[1] += value;
                    else if (day <= 21) counts[2] += value;
                    else counts[3] += value;
                }
            });
            return { points: counts, labels };
        } else {
            const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const counts = Array(12).fill(0);
            activities.forEach(act => {
                const actDate = new Date(act.date);
                if (actDate.getFullYear() === now.getFullYear()) {
                    counts[actDate.getMonth()] += (Number(act.co2ImpactKg) || 0) * factor;
                }
            });
            return { points: counts, labels };
        }
    }, [activities, timeframe, unitPref]);

    const dataPoints = chartData.points;
    const labels = chartData.labels;
    const maxVal = Math.max(...dataPoints, 10) * 1.2;
    const height = 150;
    const width = 320;

    const points = dataPoints.map((val, i) => {
        const x = (i * (width / (dataPoints.length - 1)));
        const y = height - (val / maxVal) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ padding: '32px 20px 20px', background: 'var(--card-bg)', borderRadius: '24px', marginBottom: '24px', position: 'relative', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ position: 'absolute', top: '16px', left: '20px', fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Activity Trend</div>
            <svg width="100%" height="150" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                    </linearGradient>
                </defs>
                <path d={`M 0 ${height} L ${points} L ${width} ${height} Z`} fill="url(#lineGradient)" />
                <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>
                {labels.map((label, i) => <span key={i}>{label}</span>)}
            </div>
        </div>
    );
};

export default function StatisticsView({ activities, unitPref, onBack }) {
    const [timeframe, setTimeframe] = useState('Weekly');
    const factor = unitPref === 'lb' ? 2.20462 : 1;

    const stats = useMemo(() => {
        return activities.reduce((acc, act) => {
            acc[act.category] = (acc[act.category] || 0) + (Number(act.co2ImpactKg) || 0) * factor;
            return acc;
        }, {});
    }, [activities, factor]);

    return (
        <div className="view-container stats-view">
            <div className="greeting-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {onBack && (
                    <button onClick={onBack} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '16px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                        <ArrowLeft size={24} color="var(--primary)" />
                    </button>
                )}
                <div>
                    <p className="greeting-subtitle">Insights</p>
                    <h1 className="greeting-text">Your Analytics</h1>
                </div>
            </div>

            <div style={{ background: 'var(--card-bg)', padding: '6px', borderRadius: '20px', display: 'flex', marginBottom: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                {['Weekly', 'Monthly', 'Yearly'].map(tf => (
                    <div 
                        key={tf} 
                        onClick={() => setTimeframe(tf)}
                        style={{ 
                            flex: 1, 
                            textAlign: 'center', 
                            padding: '10px', 
                            borderRadius: '16px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease',
                            background: timeframe === tf ? 'var(--primary)' : 'transparent',
                            color: timeframe === tf ? 'white' : 'var(--text-muted)'
                        }}
                    >
                        {tf}
                    </div>
                ))}
            </div>

            <LineChart activities={activities} timeframe={timeframe} unitPref={unitPref} />

            <div className="stats-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary-light)', borderRadius: '10px' }}>
                        <PieChart size={20} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Impact Breakdown</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '20px', border: '1px solid #e0f2fe' }}>
                        <Zap size={18} color="#0ea5e9" style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase' }}>TRANSPORT</p>
                        <p style={{ fontSize: '18px', fontWeight: '800' }}>{(stats.transportation || 0).toFixed(1)} <span style={{ fontSize: '10px' }}>{unitPref === 'lb' ? 'lb' : 'kg'}</span></p>
                    </div>
                    <div style={{ background: '#fff7ed', padding: '16px', borderRadius: '20px', border: '1px solid #ffedd5' }}>
                        <Target size={18} color="#f97316" style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#9a3412', textTransform: 'uppercase' }}>ENERGY</p>
                        <p style={{ fontSize: '18px', fontWeight: '800' }}>{(stats.energy || 0).toFixed(1)} <span style={{ fontSize: '10px' }}>{unitPref === 'lb' ? 'lb' : 'kg'}</span></p>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '20px', border: '1px solid #d1fae5' }}>
                        <Recycle size={18} color="#10b981" style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase' }}>WASTE</p>
                        <p style={{ fontSize: '18px', fontWeight: '800' }}>{(stats.waste || 0).toFixed(1)} <span style={{ fontSize: '10px' }}>{unitPref === 'lb' ? 'lb' : 'kg'}</span></p>
                    </div>
                    <div style={{ background: '#f5f3ff', padding: '16px', borderRadius: '20px', border: '1px solid #ede9fe' }}>
                        <Waves size={18} color="#8b5cf6" style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#4c1d95', textTransform: 'uppercase' }}>FOOD</p>
                        <p style={{ fontSize: '18px', fontWeight: '800' }}>{(stats.food || 0).toFixed(1)} <span style={{ fontSize: '10px' }}>{unitPref === 'lb' ? 'lb' : 'kg'}</span></p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Timeline Breakdown</h3>
            </div>

            <div className="activities-list">
                {activities.slice(0, 10).map((act) => (
                    <div key={act._id} className="activity-item">
                        <div className="activity-icon-container">
                            {getIcon(act.type)}
                        </div>
                        <div className="activity-details">
                            <h4>{act.type}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>
                                <Calendar size={12} /> {new Date(act.date).toLocaleDateString()}
                                <span>•</span>
                                {formatAmount(act.amount, getActivityUnit(act.type))}
                            </div>
                        </div>
                        <div className="impact-badge">
                            {formatCO2(act.co2ImpactKg, unitPref)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
