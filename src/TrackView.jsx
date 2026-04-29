import React, { useState, useMemo } from 'react';
import { Trash2, Edit3, Calendar, Filter, Download, X, Check } from 'lucide-react';
import { getIcon, formatCO2, formatAmount, activityCategories, getActivityUnit } from './activityData';

export default function TrackView({ activities, unitPref, onEditActivity, onDeleteActivity, onBack, userProfile }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const prefs = userProfile?.preferences;

    // Filter Logic
    const filteredActivities = useMemo(() => {
        if (activeFilter === 'All') return activities;
        return activities.filter(act => {
            const cat = activityCategories.find(c => c.id === act.category);
            return cat?.name === activeFilter;
        });
    }, [activities, activeFilter]);

    // Download / Export Logic (CSV Generation)
    const handleDownload = () => {
        if (activities.length === 0) return;
        
        const headers = ["Date", "Category", "Type", "Amount", "CO2 Impact (kg)"];
        const rows = activities.map(act => [
            new Date(act.date).toLocaleDateString(),
            act.category,
            act.type,
            act.amount,
            act.co2ImpactKg
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `ecolife_history_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const categories = ['All', ...activityCategories.map(c => c.name)];

    return (
        <div className="view-container history-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="greeting-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <p className="greeting-subtitle">Your Journey</p>
                    <h1 className="greeting-text">Eco History</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        style={{ 
                            background: activeFilter !== 'All' ? 'var(--primary)' : 'white', 
                            padding: '10px', borderRadius: '12px', 
                            border: '1px solid var(--border-color)', 
                            color: activeFilter !== 'All' ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center'
                        }}
                    >
                        <Filter size={20} />
                    </button>
                    <button 
                        onClick={handleDownload}
                        style={{ 
                            background: 'white', padding: '10px', borderRadius: '12px', 
                            border: '1px solid var(--border-color)', color: 'var(--text-muted)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center'
                        }}
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Quick Menu */}
            {showFilterMenu && (
                <div className="stats-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', animation: 'slideDown 0.3s ease-out' }}>
                    {categories.map(cat => (
                        <div 
                            key={cat}
                            onClick={() => { setActiveFilter(cat); setShowFilterMenu(false); }}
                            style={{ 
                                padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
                                background: activeFilter === cat ? 'var(--primary)' : '#f3f4f6',
                                color: activeFilter === cat ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                        >
                            {activeFilter === cat && <Check size={14} />}
                            {cat}
                        </div>
                    ))}
                </div>
            )}

            <div className="activity-list">
                {filteredActivities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <Calendar size={64} style={{ marginBottom: '24px', opacity: 0.1 }} />
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>No {activeFilter !== 'All' ? activeFilter : ''} logs found.</p>
                        <p style={{ fontSize: '14px' }}>{activeFilter !== 'All' ? 'Try a different category or add new logs.' : 'Your environmental impact timeline will appear here.'}</p>
                    </div>
                ) : (
                    filteredActivities.map((act) => {
                        const baseUnit = getActivityUnit(act.type);

                        return (
                            <div key={act._id} className="activity-item" style={{ marginBottom: '16px', padding: '20px' }}>
                                <div className="activity-icon-container" style={{ width: '56px', height: '56px', borderRadius: '16px' }}>
                                    {getIcon(act.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <p style={{ fontWeight: '800', fontSize: '16px' }}>{act.type}</p>
                                        <p style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '16px' }}>
                                            {formatCO2(act.co2ImpactKg, unitPref)}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                            {formatAmount(act.amount, baseUnit, prefs)} • {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <Edit3 
                                                size={18} 
                                                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                                                onClick={() => onEditActivity(act)}
                                            />
                                            <Trash2 
                                                size={18} 
                                                style={{ color: '#ef4444', cursor: 'pointer' }} 
                                                onClick={() => onDeleteActivity(act._id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
