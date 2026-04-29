import React, { useState } from 'react';
import { Mail, Lock, User, MapPin, Globe, ArrowRight } from 'lucide-react';
import api from '../../api';

const countries = [
  { name: 'United States', code: 'US', units: 'lb', dist: 'miles', vol: 'gallons' },
  { name: 'India', code: 'IN', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'United Kingdom', code: 'GB', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'Canada', code: 'CA', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'Australia', code: 'AU', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'Germany', code: 'DE', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'France', code: 'FR', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'United Arab Emirates', code: 'AE', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'Japan', code: 'JP', units: 'kg', dist: 'km', vol: 'liters' },
  { name: 'Brazil', code: 'BR', units: 'kg', dist: 'km', vol: 'liters' },
];

export default function Register({ onRegister, onSwitch }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: 'United States',
  });
  const [error, setError] = useState('');

  const selectedCountry = countries.find(c => c.name === formData.location) || countries[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Auto-determine preferences based on country
      const preferences = {
        units: selectedCountry.units,
        distanceUnit: selectedCountry.dist,
        volumeUnit: selectedCountry.vol,
        notifications: true,
        darkMode: false
      };

      const res = await api.post('/auth/register', { ...formData, preferences });
      localStorage.setItem('token', res.data.token);
      onRegister();
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', height: '64px', background: 'var(--primary-light)', 
            borderRadius: '20px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' 
          }}>
            <Globe size={32} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Join EcoLife</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Start your journey to a greener lifestyle</p>
        </div>

        {error && (
          <div style={{ 
            background: '#FEF2F2', color: '#EF4444', padding: '12px', 
            borderRadius: '12px', marginBottom: '20px', fontSize: '14px', 
            fontWeight: '600', textAlign: 'center', border: '1px solid #FEE2E2' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>FULL NAME</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input
                type="text"
                placeholder="Gourav Kothari"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input
                type="email"
                placeholder="name@example.com"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>SELECT COUNTRY</label>
            <div style={{ position: 'relative' }}>
              <MapPin style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <select
                className="input-field"
                style={{ paddingLeft: '48px', appearance: 'none' }}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              >
                {countries.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '6px', fontWeight: '600' }}>
              Automatically setting units to: {selectedCountry.dist}, {selectedCountry.units}
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="primary-btn" style={{ height: '56px', fontSize: '16px' }}>
            Create Account
            <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span 
            onClick={onSwitch} 
            style={{ color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
