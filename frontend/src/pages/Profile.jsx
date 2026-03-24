import React, { useEffect, useState } from 'react';
import { getMe, getStoredUser, updateUserDetails } from '../services/auth';
import '../styles/Profile.css';

const Profile = () => {
  const storedUser = getStoredUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const user = await getMe();

        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          bio: user?.bio || '',
          skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
        });
        setError('');
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load your profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateUserDetails(payload);
      setSuccess('Your profile details have been updated.');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to save your profile right now.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-shell">
          <div className="profile-state-card">
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-background">
        <div className="profile-orb profile-orb-1"></div>
        <div className="profile-orb profile-orb-2"></div>
      </div>

      <div className="profile-shell">
        <section className="profile-header-card">
          <div className="profile-avatar-large">
            {formData.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-header-copy">
            <span className="profile-kicker">Logged In Profile</span>
            <h1>{formData.name || 'Your profile'}</h1>
            <p>Add details about yourself so clients and collaborators can understand your strengths, skills, and background.</p>
            <div className="profile-meta-row">
              <span>{storedUser?.role || 'member'}</span>
              <span>{formData.email || 'No email added'}</span>
            </div>
          </div>
        </section>

        <section className="profile-content-grid">
          <div className="profile-panel">
            <h2>Public Profile Details</h2>
            <p className="profile-panel-text">
              Keep your name, bio, and skills current so your profile feels more complete and trustworthy.
            </p>

            <form className="profile-form" onSubmit={handleSubmit}>
              <label className="profile-field">
                <span>Full Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="profile-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="profile-field">
                <span>Bio</span>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short introduction about yourself, your experience, and the kind of work you do."
                  rows="6"
                />
              </label>

              <label className="profile-field">
                <span>Skills</span>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Academic Writing, UI Design"
                />
                <small>Separate skills with commas.</small>
              </label>

              {error ? <p className="profile-message profile-error">{error}</p> : null}
              {success ? <p className="profile-message profile-success">{success}</p> : null}

              <button className="profile-save-btn" disabled={saving} type="submit">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          <aside className="profile-panel profile-sidebar">
            <h2>Profile Preview</h2>
            <div className="profile-preview-card">
              <div className="profile-preview-top">
                <div className="profile-avatar-small">
                  {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3>{formData.name || 'Your name'}</h3>
                  <p>{storedUser?.role || 'Member'}</p>
                </div>
              </div>

              <div className="profile-preview-block">
                <span>About</span>
                <p>{formData.bio || 'Your bio will appear here once you add it.'}</p>
              </div>

              <div className="profile-preview-block">
                <span>Skills</span>
                <div className="profile-skill-list">
                  {formData.skills
                    .split(',')
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span key={skill} className="profile-skill-chip">
                        {skill}
                      </span>
                    ))}
                  {!formData.skills.trim() ? (
                    <span className="profile-skill-chip muted">Add skills to show them here</span>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Profile;
