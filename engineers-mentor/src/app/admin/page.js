'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { googleSheetsUrl } from '@/lib/emailService';

function getValidImageUrl(url) {
  if (!url) return null;
  const gDriveMatch = url.match(/\/file\/d\/(.+?)\//) || url.match(/\?id=(.+?)(&|$)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${gDriveMatch[1]}`;
  }
  return url;
}

export default function AdminPage() {
  const [step, setStep] = useState('CHECKING'); // CHECKING, LOGIN, OTP, DASHBOARD
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    description: '',
    techStack: '',
    image: '',
    color: '#8b5cf6',
  });

  // Since we don't have a check-session API, we'll just optimistically try to load the dashboard.
  // Actually, we can check if document.cookie contains admin_session.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (document.cookie.includes('admin_session=authenticated')) {
        setStep('DASHBOARD');
        fetchProjects();
      } else {
        setStep('LOGIN');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('OTP');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('DASHBOARD');
        fetchProjects();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      // In the real implementation, this hits the Google Sheets URL.
      const response = await fetch(`${googleSheetsUrl}?type=projects`); 
      const result = await response.json();
      if (result.success || result.status === 'success') {
        setProjects(result.data || []);
      }
    } catch (error) {
      console.error('Fetch error', error);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        type: 'project',
        timestamp: new Date().toISOString(),
        title: formData.title,
        domain: formData.domain,
        description: formData.description,
        techStack: formData.techStack, // Comma separated
        image: formData.image,
        color: formData.color,
      };

      // In reality, this posts to Google Apps Script URL
      const response = await fetch(googleSheetsUrl, { 
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      alert('Project added successfully! It will appear after you refresh (and might take a moment to sync from Google Sheets).');
      setFormData({
        title: '',
        domain: '',
        description: '',
        techStack: '',
        image: '',
        color: '#8b5cf6',
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error adding project');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'CHECKING') return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] section-padding">
      <div className="container-custom relative z-10 max-w-4xl mx-auto pt-20">
        
        {step !== 'DASHBOARD' ? (
          <div className="max-w-md mx-auto glass p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-gradient">Admin Panel</h2>
            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
            
            {step === 'LOGIN' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="form-label">Email</label>
                  <input required type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input required type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Sending OTP...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="form-label">Verification Code (Sent to Email)</label>
                  <input required type="text" className="form-input text-center text-2xl tracking-widest" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gradient">Dashboard - Featured Projects</h2>
              <button 
                onClick={() => {
                  document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                  setStep('LOGIN');
                }}
                className="btn-outline text-sm py-2 px-4"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Add Project Form */}
              <div className="glass p-8 rounded-2xl h-fit">
                <h3 className="text-xl font-bold mb-6">Add New Project</h3>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <label className="form-label">Project Title</label>
                    <input required type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Domain</label>
                    <input required type="text" className="form-input" placeholder="e.g. AI & Machine Learning" value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea required className="form-input min-h-[80px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="form-label">Tech Stack (comma separated)</label>
                    <input required type="text" className="form-input" placeholder="React, Node.js, Python" value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Image URL / Local Path</label>
                    <input required type="text" className="form-input" placeholder="/projects/project-1.jpg or https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Accent Color (Hex)</label>
                    <input required type="color" className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-4">
                    {loading ? 'Adding...' : 'Add Project to Sheets'}
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-6">Current Projects</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {projects.length === 0 ? (
                    <p className="text-gray-400">No projects found. Make sure your Google Sheet has a 'Projects' tab.</p>
                  ) : (
                    projects.map((project, idx) => (
                      <div key={idx} className="glass p-6 rounded-xl flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: project.color, backgroundImage: `url('${getValidImageUrl(project.image)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div>
                          <h4 className="font-bold text-[var(--text-primary)]">{project.title}</h4>
                          <p className="text-sm text-[var(--text-muted)]">{project.domain}</p>
                          <div className="text-xs text-[var(--text-secondary)] mt-1 truncate max-w-[200px] md:max-w-[300px]">
                            {project.techStack}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
