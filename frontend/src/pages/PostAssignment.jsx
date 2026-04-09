import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAssignment } from '../services/assignments';
import '../styles/PostAssignment.css';

const INITIAL_FORM = {
  title: '',
  subject: '',
  description: '',
  budget: '',
  deadline: '',
  difficulty: 'Medium',
  maxWorkers: 1,
};

const subjectSuggestions = [
  'Programming',
  'Mathematics',
  'Science',
  'Business',
  'Writing',
  'Design',
];

const PostAssignment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const minDeadline = useMemo(() => new Date().toISOString().slice(0, 16), []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'budget' || name === 'maxWorkers' ? value.replace(/[^\d]/g, '') : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.title.trim() || !formData.subject.trim() || !formData.description.trim()) {
      setError('Please fill in the title, subject, and assignment description.');
      return;
    }

    if (!formData.budget || Number(formData.budget) < 1) {
      setError('Please enter a budget of at least $1.');
      return;
    }

    if (!formData.deadline) {
      setError('Please choose a deadline for the assignment.');
      return;
    }

    setSubmitting(true);

    try {
      await createAssignment({
        ...formData,
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        budget: Number(formData.budget),
        maxWorkers: Number(formData.maxWorkers) || 1,
        deadline: new Date(formData.deadline).toISOString(),
      });

      setSuccessMessage('Assignment posted successfully. Redirecting to your dashboard...');
      setFormData(INITIAL_FORM);

      window.setTimeout(() => {
        navigate('/provider-dashboard');
      }, 900);
    } catch (submitError) {
      const apiMessage =
        submitError.response?.data?.message ||
        submitError.response?.data?.error ||
        'We could not post the assignment right now. Please try again.';
      setError(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-assignment-page">
      <div className="post-assignment-background">
        <div className="post-orb post-orb-1"></div>
        <div className="post-orb post-orb-2"></div>
      </div>

      <div className="post-assignment-shell">
        <div className="post-assignment-hero">
          <span className="post-kicker">Create a New Assignment</span>
          <h1>Post exactly the work you need help with</h1>
          <p>
            Add the title, subject, instructions, budget, deadline, and how many workers
            you want. Once posted, it appears in your dashboard and the marketplace.
          </p>

          <div className="post-suggestions">
            {subjectSuggestions.map((subject) => (
              <button
                key={subject}
                className="suggestion-pill"
                onClick={() => setFormData((current) => ({ ...current, subject }))}
                type="button"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <form className="post-assignment-form" onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="form-heading">
              <h2>Assignment Details</h2>
              <p>Describe the assignment clearly so the right expert can pick it up.</p>
            </div>

            {error ? <div className="form-alert error">{error}</div> : null}
            {successMessage ? <div className="form-alert success">{successMessage}</div> : null}

            <label className="form-field">
              <span>Assignment title</span>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="Example: Build a MERN attendance dashboard"
                required
                type="text"
              />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span>Subject or category</span>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Example: Programming"
                  required
                  type="text"
                />
              </label>

              <label className="form-field">
                <span>Difficulty</span>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>
            </div>

            <label className="form-field">
              <span>Assignment description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
                placeholder="Write the full task here: goals, instructions, required tools, deliverables, and anything else the worker should know."
                required
                rows="8"
              />
              <small>{formData.description.length}/1000 characters</small>
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span>Budget in USD</span>
                <input
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="1"
                  placeholder="150"
                  required
                  type="number"
                />
              </label>

              <label className="form-field">
                <span>Deadline</span>
                <input
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={minDeadline}
                  required
                  type="datetime-local"
                />
              </label>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Maximum workers</span>
                <input
                  name="maxWorkers"
                  value={formData.maxWorkers}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                  type="number"
                />
              </label>

              <div className="post-preview">
                <span className="preview-label">Quick preview</span>
                <strong>{formData.title.trim() || 'Your assignment title'}</strong>
                <p>{formData.subject.trim() || 'Subject goes here'}</p>
                <div className="preview-meta">
                  <span>${formData.budget || 0}</span>
                  <span>{formData.difficulty}</span>
                  <span>{Number(formData.maxWorkers) || 1} worker(s)</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link className="secondary-action" to="/provider-dashboard">
                Back to dashboard
              </Link>
              <button className="primary-action" disabled={submitting} type="submit">
                {submitting ? 'Posting Assignment...' : 'Post Assignment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostAssignment;
