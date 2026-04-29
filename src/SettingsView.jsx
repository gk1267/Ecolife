import React, { useState, useRef } from 'react';
import { User, Bell, Moon, Shield, LogOut, Info, ChevronRight, HelpCircle, Database, Globe, Camera, X, Check, ArrowLeft, Ruler, Droplets as Drop, Edit3 } from 'lucide-react';
import api from './api';
import './index.css';

export default function SettingsView({ userProfile, onLogout, onUpdateProfile }) {
    const [view, setView] = useState('main'); 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [name, setName] = useState(userProfile?.name || '');
    const [email, setEmail] = useState(userProfile?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
    const [profilePicture, setProfilePicture] = useState(userProfile?.profilePicture || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState('');

    const [notifs, setNotifs] = useState(userProfile?.preferences?.notifications ?? true);
    const [units, setUnits] = useState(userProfile?.preferences?.units ?? 'kg');
    const [distUnit, setDistUnit] = useState(userProfile?.preferences?.distanceUnit ?? 'km');
    const [volUnit, setVolUnit] = useState(userProfile?.preferences?.volumeUnit ?? 'liters');

    const fileInputRef = useRef(null);

    const handleProfileUpdate = async () => {
        try {
            const res = await api.put('/auth/profile', { name, email, phoneNumber, profilePicture });
            onUpdateProfile?.(res.data);
            setPassSuccess('Profile updated successfully!');
            setView('main');
            setTimeout(() => setPassSuccess(''), 4000);
        } catch (err) {
            const msg = err.response?.data?.msg || err.message || 'Failed to update profile';
            alert('Update Error: ' + msg);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPassError("Passwords don't match");
            return;
        }
        try {
            await api.put('/auth/password', { currentPassword, newPassword });
            setPassSuccess('Password updated successfully!');
            setPassError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPassSuccess(''), 3000);
        } catch (err) {
            setPassError(err.response?.data?.msg || 'Failed to update password');
        }
    };

    const handlePreferenceUpdate = async (newPrefs) => {
        try {
            const mergedPrefs = {
                ...userProfile.preferences,
                ...newPrefs
            };
            const res = await api.put('/auth/preferences', { preferences: mergedPrefs });
            onUpdateProfile?.(res.data);
        } catch (err) {
            console.error('Failed to update preferences');
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderMain = () => (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="greeting-section">
                <p className="greeting-subtitle">Your Preferences</p>
                <h1 className="greeting-text">Settings</h1>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                padding: '28px',
                borderRadius: '28px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '32px',
                boxShadow: '0 12px 24px rgba(16, 185, 129, 0.25)',
                position: 'relative'
            }}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.15)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden',
                    border: '3px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    flexShrink: 0
                }}>
                    {profilePicture ? <img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} />}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{userProfile?.name}</h2>
                    <p style={{ opacity: 0.8, fontSize: '13px' }}>{userProfile?.email}</p>
                </div>
                <button 
                    onClick={() => setView('profile')} 
                    style={{ 
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(255,255,255,0.2)', 
                        border: 'none', 
                        padding: '10px', 
                        borderRadius: '12px', 
                        color: 'white', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Edit3 size={18} />
                </button>
            </div>

            {passSuccess && <div style={{ color: 'var(--primary)', fontSize: '14px', marginBottom: '16px', background: '#ECFDF5', padding: '16px', borderRadius: '16px', fontWeight: '700', textAlign: 'center', animation: 'fadeIn 0.3s ease-out', border: '1.5px solid #D1FAE5' }}>{passSuccess}</div>}

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>System Preferences</h3>
                <div className="stats-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ padding: '8px', background: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)' }}><Bell size={20} /></div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '700', fontSize: '15px' }}>Notifications</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tips & alerts</p>
                        </div>
                        <input type="checkbox" checked={notifs} onChange={() => {
                            const newVal = !notifs;
                            setNotifs(newVal);
                            handlePreferenceUpdate({ notifications: newVal });
                        }} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    </div>

                    <div onClick={() => {
                        const next = units === 'kg' ? 'lb' : units === 'lb' ? 'tonnes' : 'kg';
                        setUnits(next);
                        handlePreferenceUpdate({ units: next });
                    }} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                        <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '10px', color: '#0ea5e9' }}><Globe size={20} /></div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '700', fontSize: '15px' }}>Impact Unit</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing in: {units.toUpperCase()}</p>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>

                    <div onClick={() => {
                        const next = distUnit === 'km' ? 'miles' : 'km';
                        setDistUnit(next);
                        handlePreferenceUpdate({ distanceUnit: next });
                    }} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                        <div style={{ padding: '8px', background: '#fef3c7', borderRadius: '10px', color: '#d97706' }}><Ruler size={20} /></div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '700', fontSize: '15px' }}>Distance Unit</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Using: {distUnit === 'km' ? 'Kilometers' : 'Miles'}</p>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>

                    <div onClick={() => {
                        const next = volUnit === 'liters' ? 'gallons' : 'liters';
                        setVolUnit(next);
                        handlePreferenceUpdate({ volumeUnit: next });
                    }} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                        <div style={{ padding: '8px', background: '#e0e7ff', borderRadius: '10px', color: '#4f46e5' }}><Drop size={20} /></div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '700', fontSize: '15px' }}>Volume Unit</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Using: {volUnit.charAt(0).toUpperCase() + volUnit.slice(1)}</p>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Security & Support</h3>
                <div className="stats-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div onClick={() => setView('password')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                        <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '10px', color: '#ef4444' }}><Shield size={20} /></div>
                        <p style={{ flex: 1, fontWeight: '700', fontSize: '15px' }}>Change Password</p>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div onClick={() => setView('about')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                        <div style={{ padding: '8px', background: '#f3f4f6', borderRadius: '10px', color: '#64748b' }}><Info size={20} /></div>
                        <p style={{ flex: 1, fontWeight: '700', fontSize: '15px' }}>About EcoLife AI</p>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                </div>
            </div>

            <button className="primary-btn" onClick={onLogout} style={{ background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fee2e2', boxShadow: 'none', marginBottom: '40px' }}>
                <LogOut size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Logout
            </button>
        </div>
    );

    const renderProfile = () => (
        <div style={{ animation: 'slideRight 0.3s ease-out' }}>
            <div className="greeting-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setView('main')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="var(--primary)" />
                </button>
                <div>
                    <p className="greeting-subtitle">Account</p>
                    <h1 className="greeting-text">Edit Profile</h1>
                </div>
            </div>

            <div className="stats-card" style={{ padding: '32px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                    <div
                        style={{
                            width: '100px', height: '100px', borderRadius: '32px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden', border: '2px dashed var(--primary)'
                        }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {profilePicture ? <img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={32} style={{ color: 'var(--primary)' }} />}
                    </div>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                    <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Change Photo</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>FULL NAME</label>
                    <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                    <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>PHONE NUMBER</label>
                    <input type="text" className="input-field" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </div>
                <button onClick={handleProfileUpdate} className="primary-btn">Save Profile Changes</button>
            </div>
        </div>
    );

    const renderPassword = () => (
        <div style={{ animation: 'slideRight 0.3s ease-out' }}>
            <div className="greeting-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setView('main')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="var(--primary)" />
                </button>
                <div>
                    <p className="greeting-subtitle">Security</p>
                    <h1 className="greeting-text">Change Password</h1>
                </div>
            </div>

            <form onSubmit={handlePasswordChange} className="stats-card" style={{ padding: '24px' }}>
                {passError && <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '16px', background: '#FEF2F2', padding: '12px', borderRadius: '12px', fontWeight: '600' }}>{passError}</div>}
                {passSuccess && <div style={{ color: 'var(--primary)', fontSize: '13px', marginBottom: '16px', background: '#ECFDF5', padding: '12px', borderRadius: '12px', fontWeight: '600' }}>{passSuccess}</div>}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>CURRENT PASSWORD</label>
                    <input type="password" className="input-field" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>NEW PASSWORD</label>
                    <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                </div>
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>CONFIRM NEW PASSWORD</label>
                    <input type="password" className="input-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>

                <button type="submit" className="primary-btn">Update Security Password</button>
            </form>
        </div>
    );

    const renderAbout = () => (
        <div style={{ animation: 'slideRight 0.3s ease-out' }}>
            <div className="greeting-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setView('main')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="var(--primary)" />
                </button>
                <div>
                    <p className="greeting-subtitle">Information</p>
                    <h1 className="greeting-text">About EcoLife AI</h1>
                </div>
            </div>

            <div className="stats-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                    <Globe size={40} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>EcoLife AI</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Version 1.2.4 (Premium Build)</p>

                <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '12px' }}>What is EcoLife AI?</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        EcoLife AI is a world-class sustainability tracker designed to help you understand and reduce your carbon footprint through AI-driven insights and activity tracking.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="view-container settings-view">
            {view === 'main' && renderMain()}
            {view === 'profile' && renderProfile()}
            {view === 'password' && renderPassword()}
            {view === 'about' && renderAbout()}

            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '16px' }}>Confirm Action</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Are you sure you want to delete all account data? This cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="primary-btn" style={{ background: '#f3f4f6', color: '#4b5563', boxShadow: 'none' }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="primary-btn" style={{ background: '#ef4444' }} onClick={() => {}}>Delete All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
