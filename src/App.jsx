import { useState, useEffect, useMemo } from 'react'
import { Home, BarChart2, Settings, Plus, X, Edit3, Clock } from 'lucide-react'
import HomeView from './HomeView'
import StatisticsView from './StatisticsView'
import TrackView from './TrackView'
import SettingsView from './SettingsView'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import api from './api'
import { activityCategories } from './activityData.jsx'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [authView, setAuthView] = useState('login');

  const [activeTab, setActiveTab] = useState('Home');
  const [activities, setActivities] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const loadRecommendations = async () => {
    try {
      const res = await api.get('/ai/recommendations');
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    }
  };

  const [newType, setNewType] = useState('Car (Petrol)');
  const [newAmount, setNewAmount] = useState(15);

  const unitPref = useMemo(() => userProfile?.preferences?.units || 'kg', [userProfile]);
  const distPref = useMemo(() => userProfile?.preferences?.distanceUnit || 'km', [userProfile]);
  const volPref = useMemo(() => userProfile?.preferences?.volumeUnit || 'liters', [userProfile]);

  const activeEmissionsTotal = useMemo(() => {
    return Number(activities.reduce((sum, act) => sum + (Number(act.co2ImpactKg) || 0), 0).toFixed(1));
  }, [activities]);

  useEffect(() => {
    if (userProfile?.preferences?.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [userProfile?.preferences?.darkMode]);

  useEffect(() => {
    if (editingActivity) {
      setNewType(editingActivity.type);
      setNewAmount(editingActivity.amount);
      setShowAddModal(true);
    } else {
      // Reset to default when not editing
      setNewType('Car (Petrol)');
      setNewAmount(15);
    }
  }, [editingActivity]);

  useEffect(() => {
    // Update newAmount based on newType selection from activityData
    let selectedType;
    activityCategories.forEach(c => {
      const t = c.types.find(i => i.name === newType);
      if (t) selectedType = t;
    });
    if (selectedType && selectedType.defaultAmount) {
      setNewAmount(selectedType.defaultAmount);
    }
  }, [newType]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
      loadActivities();
      loadRecommendations();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const res = await api.get('/auth/user');
      setUserProfile(res.data);
    } catch (err) {
      console.error("Failed to load user profile", err);
      handleLogout();
    }
  }

  const loadActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities", err);
    }
  };

  const getUnit = (type) => {
    let unit = 'units';
    activityCategories.forEach(cat => {
      const found = cat.types.find(t => t.name === type);
      if (found) {
        unit = found.unit;
        if (unit === 'km' && distPref === 'miles') unit = 'miles';
        if (unit === 'liters' && volPref === 'gallons') unit = 'gallons';
      }
    });
    return unit;
  };

  const handleAddOrEditActivity = async (catId, typ, amt, impact) => {
    try {
      let finalCat = catId;
      let finalTyp = typ || newType;
      let finalAmt = Number(amt || newAmount);
      let calculationAmt = finalAmt;

      // Convert to base units (km, liters) for accurate factor multiplication
      const currentUnit = getUnit(finalTyp);
      if (currentUnit === 'miles') calculationAmt = finalAmt * 1.60934;
      if (currentUnit === 'gallons') calculationAmt = finalAmt * 3.78541;

      let finalImpact = impact;

      if (!finalCat || finalImpact === undefined || finalImpact === null) {
        let selectedType;
        activityCategories.forEach(c => {
          const t = c.types.find(i => i.name === finalTyp);
          if (t) {
            selectedType = t;
            if (!finalCat) finalCat = c.id; 
          }
        });
        
        // Safety Fallback for new categories
        if (!finalCat) {
          if (finalTyp.includes('Thrift') || finalTyp.includes('Clothes') || finalTyp.includes('Shopping')) {
            finalCat = 'shopping';
          } else {
            finalCat = 'transportation'; // Default fallback
          }
        }

        if (selectedType && (finalImpact === undefined || finalImpact === null)) {
          const factor = selectedType.factor || 0.1;
          finalImpact = Number((calculationAmt * factor).toFixed(1));
        } else if (finalImpact === undefined || finalImpact === null) {
          finalImpact = Number((calculationAmt * 0.1).toFixed(1)); // Generic factor fallback
        }
      }

      const payload = {
        category: finalCat,
        type: finalTyp,
        amount: finalAmt,
        co2ImpactKg: finalImpact || 0
      };

      if (editingActivity) {
        await api.put(`/activities/${editingActivity._id}`, payload);
      } else {
        await api.post('/activities', payload);
      }

      loadActivities();
      loadUserProfile(); // Reload profile to update score
      setShowAddModal(false);
      setEditingActivity(null);
    } catch (err) {
      console.error("Action failed", err);
      const errorMsg = err.response?.data?.msg || err.response?.data || err.message || "Unknown Error";
      alert("Submission Failed: " + errorMsg);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    try {
      console.log("Deleting activity with ID:", id);
      await api.delete(`/activities/${id}`);
      loadActivities();
      loadUserProfile(); // Reload profile to update score
    } catch (err) {
      console.error("Deletion failed", err);
      alert(err.response?.data?.msg || "Deletion failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
    setActivities([]);
    setRecommendations([]);
    setActiveTab('Home');
  };

  if (!isAuthenticated) {
    return (
      <div id="app-container">
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {authView === 'login' ? (
            <Login onLogin={() => setIsAuthenticated(true)} onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <Register onRegister={() => setIsAuthenticated(true)} onSwitch={() => setAuthView('login')} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div id="app-container">
      <main className="main-content">
        {activeTab === 'Home' && (
          <HomeView
            userProfile={userProfile}
            activities={activities}
            onAddClick={() => { setEditingActivity(null); setShowAddModal(true); }}
            recommendations={recommendations}
          />
        )}
        {activeTab === 'History' && (
          <TrackView
            activities={activities}
            unitPref={unitPref}
            userProfile={userProfile}
            onEditActivity={setEditingActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
        {activeTab === 'Stats' && (
          <StatisticsView
            activities={activities}
            unitPref={unitPref}
            onBack={() => setActiveTab('Home')}
          />
        )}
        {activeTab === 'Settings' && (
          <SettingsView
            userProfile={userProfile}
            onLogout={handleLogout}
            onUpdateProfile={(p) => setUserProfile(p)}
          />
        )}
      </main>

      {/* FAB is now local to HomeView to avoid persistent appearance across tabs */}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingActivity(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderRadius: '32px 32px 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{editingActivity ? 'Edit Activity' : 'Add Activity'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingActivity(null); }} style={{ background: '#F3F4F6', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <label className="subtitle" style={{ display: 'block', marginBottom: '10px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>What did you do?</label>
            <select value={newType} onChange={e => setNewType(e.target.value)} className="input-field" style={{ height: '56px', fontWeight: '600' }}>
              {activityCategories.map(cat => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </optgroup>
              ))}
            </select>

            <label className="subtitle" style={{ display: 'block', marginBottom: '10px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>How much ({getUnit(newType)})?</label>
            <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="input-field" style={{ height: '56px', fontSize: '18px', fontWeight: '700' }} />

            <button onClick={() => handleAddOrEditActivity()} className="primary-btn" style={{ width: '100%', height: '60px', marginTop: 'var(--spacing-md)', fontSize: '18px' }}>
              {editingActivity ? 'Update Entry' : 'Save Tracked Activity'}
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        {[
          { name: 'Home', icon: Home },
          { name: 'History', icon: Clock },
          { name: 'Stats', icon: BarChart2 },
          { name: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.name} className={`nav-item ${activeTab === tab.name ? 'active' : ''}`} onClick={() => setActiveTab(tab.name)}>
              <Icon size={26} />
              <span>{tab.name}</span>
            </div>
          );
        })}
      </nav>
    </div>
  )
}

export default App
