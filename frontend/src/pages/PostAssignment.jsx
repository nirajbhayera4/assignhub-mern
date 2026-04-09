import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAssignment } from '../services/assignments';
import { getStoredUser } from '../services/auth';
import '../styles/PostAssignment.css';

const INITIAL_FORM = {
  title: '',
  subject: '',
  category: 'Coding',
  assignmentType: 'Project',
  description: '',
  budget: '',
  deadline: '',
  difficulty: 'Medium',
  pricingType: 'Fixed Price',
  maxWorkers: 1,
  estimatedTime: '',
  skillsRequired: '',
  attachments: [],
};

const categoryOptions = ['Coding', 'Design', 'Writing', 'Presentation', 'Research', 'Other'];
const assignmentTypes = ['Homework', 'Project', 'Thesis', 'Exam Prep', 'Presentation', 'Other'];
const subjectSuggestions = ['Java', 'Spring Boot', 'React', 'Python', 'UI/UX', 'Academic Writing'];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

const PostAssignment = () => {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const minDeadline = useMemo(() => new Date().toISOString().slice(0, 16), []);
  const countdownLabel = useMemo(() => {
    if (!formData.deadline) {
      return 'Choose a deadline to activate the timer.';
    }

    const msRemaining = new Date(formData.deadline).getTime() - Date.now();

    if (msRemaining <= 0) {
      return 'This deadline has already passed.';
    }

    const totalHours = Math.floor(msRemaining / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0) {
      return `${days} day(s) and ${hours} hour(s) remaining`;
    }

    return `${hours} hour(s) remaining`;
  }, [formData.deadline]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'budget' || name === 'maxWorkers' ? value.replace(/[^\d]/g, '') : value,
    }));
  };

  const handleAttachmentSelect = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    if (formData.attachments.length + files.length > 5) {
      setError('You can upload up to 5 attachments.');
      return;
    }

    try {
      const nextAttachments = await Promise.all(
        files.map(async (file) => {
          if (file.size > 2 * 1024 * 1024) {
            throw new Error(`${file.name} is larger than 2 MB.`);
          }

          const dataUrl = await readFileAsDataUrl(file);

          return {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            dataUrl,
          };
        })
      );

      setFormData((current) => ({
        ...current,
        attachments: [...current.attachments, ...nextAttachments],
      }));
      setError('');
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to attach files right now.');
    } finally {
      event.target.value = '';
    }
  };

  const removeAttachment = (attachmentName) => {
    setFormData((current) => ({
      ...current,
      attachments: current.attachments.filter((file) => file.name !== attachmentName),
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
      setError('Please enter a budget of at least Rs 1.');
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
        skillsRequired: formData.skillsRequired
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
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
          <h1>Post the work exactly the way you want it done</h1>
          <p>
            Add the assignment brief, category, pricing model, deadline, skills,
            attachments, and worker requirements. The new post will be saved with poster
            identity details and status tracking built in.
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

          <div className="poster-card">
            <span className="poster-card-label">Posted By</span>
            <strong>{storedUser?.name || 'Logged-in student'}</strong>
            <div className="poster-meta-list">
              <span>{storedUser?.collegeId || 'Add your college ID in profile'}</span>
              <span>{storedUser?.isVerified ? 'Verified badge active' : 'Verification pending'}</span>
              <span>Rating {Number(storedUser?.rating || 0).toFixed(1)} ⭐</span>
            </div>
          </div>

          <div className="status-lane">
            <div className="status-step active">Open</div>
            <div className="status-step">In Progress</div>
            <div className="status-step">Completed</div>
            <div className="status-step">Cancelled</div>
          </div>
        </div>

        <form className="post-assignment-form" onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="form-heading">
              <h2>Assignment Details</h2>
              <p>Build a complete post that feels like a real marketplace listing.</p>
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
                placeholder="Example: Java Spring Boot API Needed"
                required
                type="text"
              />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span>Category</span>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Assignment type</span>
                <select
                  name="assignmentType"
                  value={formData.assignmentType}
                  onChange={handleChange}
                >
                  {assignmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Subject / Category detail</span>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Example: Spring Boot, Canva, Data Structures"
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
              <span>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
                placeholder="Write the full requirements, deliverables, coding standards, design references, or report expectations here."
                required
                rows="8"
              />
              <small>{formData.description.length}/1000 characters</small>
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span>Pricing model</span>
                <select name="pricingType" value={formData.pricingType} onChange={handleChange}>
                  <option value="Fixed Price">Fixed Price</option>
                  <option value="Bidding">Bidding System</option>
                </select>
              </label>

              <label className="form-field">
                <span>Budget / Reward (Rs)</span>
                <input
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="1"
                  placeholder="300"
                  required
                  type="number"
                />
              </label>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Estimated completion time</span>
                <input
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  placeholder="Example: 2 days"
                  type="text"
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
                <span>Skills needed</span>
                <input
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="React, Java, Python, Figma"
                  type="text"
                />
                <small>Separate skills with commas for matching and recommendation features.</small>
              </label>

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
            </div>

            <label className="form-field">
              <span>Attachments</span>
              <label className="attachment-picker">
                Upload PDF, docs, or images
                <input
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                  multiple
                  onChange={handleAttachmentSelect}
                  type="file"
                  hidden
                />
              </label>
              <small>Up to 5 files, 2 MB each.</small>

              {formData.attachments.length ? (
                <div className="attachment-list">
                  {formData.attachments.map((file) => (
                    <div className="attachment-item" key={`${file.name}-${file.size}`}>
                      <div>
                        <strong>{file.name}</strong>
                        <p>{Math.round(file.size / 1024)} KB</p>
                      </div>
                      <button onClick={() => removeAttachment(file.name)} type="button">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </label>

            <div className="form-grid preview-grid">
              <div className="post-preview">
                <span className="preview-label">Quick preview</span>
                <strong>{formData.title.trim() || 'Your assignment title'}</strong>
                <p>{formData.subject.trim() || 'Subject goes here'}</p>
                <div className="preview-meta">
                  <span>Rs {formData.budget || 0}</span>
                  <span>{formData.category}</span>
                  <span>{formData.assignmentType}</span>
                  <span>{formData.difficulty}</span>
                  <span>{Number(formData.maxWorkers) || 1} worker(s)</span>
                </div>
              </div>

              <div className="countdown-card">
                <span className="preview-label">Deadline timer</span>
                <strong>{countdownLabel}</strong>
                <p>
                  {formData.pricingType === 'Bidding'
                    ? 'Workers can respond with a proposal message, estimated time, and bid amount.'
                    : 'Workers will apply against the fixed reward you set here.'}
                </p>
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
