import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { applyToAssignment, getAssignment } from '../services/assignments';
import { getStoredUser, isAuthenticated } from '../services/auth';
import { formatCurrencyINR } from '../utils/helpers';
import '../styles/AssignmentDetails.css';

const getWorkerId = (application) => {
  if (!application) {
    return null;
  }

  if (typeof application.worker === 'string') {
    return application.worker;
  }

  return application.worker?._id || application.worker?.id || null;
};

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [assignment, setAssignment] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    proposedBudget: '',
    estimatedTime: '',
    proposalMessage: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const response = await getAssignment(id);
        const nextAssignment = response.assignment;

        setAssignment(nextAssignment);
        setFormData((current) => ({
          ...current,
          proposedBudget: nextAssignment?.budget ? String(nextAssignment.budget) : '',
          estimatedTime: nextAssignment?.estimatedTime || '',
        }));
        setError('');
      } catch (requestError) {
        console.error('Failed to load assignment details:', requestError);
        setError('We could not load this assignment right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const alreadyApplied = useMemo(() => {
    if (!assignment || !user?._id) {
      return false;
    }

    return assignment.applications?.some(
      (application) => getWorkerId(application) === user._id
    );
  }, [assignment, user?._id]);

  const isProviderView = user?.role === 'provider';
  const isOwner = assignment?.provider?._id === user?._id;
  const isClosed = assignment?.status && assignment.status !== 'Open';

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (isProviderView) {
      setError('Provider accounts cannot apply to assignments. Please switch to a worker account.');
      return;
    }

    if (alreadyApplied) {
      setError('You have already applied to this assignment.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccessMessage('');

      await applyToAssignment(id, {
        message: formData.message.trim(),
        proposedBudget: Number(formData.proposedBudget),
        estimatedTime: formData.estimatedTime.trim(),
        proposalMessage: formData.proposalMessage.trim(),
      });

      setSuccessMessage('Application submitted successfully. The client can now review your proposal.');
      setAssignment((current) => ({
        ...current,
        applications: [
          ...(current?.applications || []),
          {
            worker: user?._id,
          },
        ],
      }));
    } catch (submitError) {
      console.error('Failed to submit application:', submitError);
      setError(
        submitError.response?.data?.message ||
          'Application failed. Please review your details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="assignment-apply-page">
        <div className="assignment-apply-shell">
          <div className="assignment-loading-card">
            <div className="loading-spinner"></div>
            <p>Loading assignment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="assignment-apply-page">
        <div className="assignment-apply-shell">
          <div className="assignment-error-card">
            <h1>Assignment unavailable</h1>
            <p>{error || 'This assignment could not be found.'}</p>
            <Link className="assignment-primary-btn" to="/marketplace">
              Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const providerName = assignment.provider?.name || assignment.posterSnapshot?.name || 'Anonymous';
  const providerRating = assignment.provider?.rating || assignment.posterSnapshot?.rating || 0;
  const applicationCount = assignment.applications?.length || 0;
  const canApply =
    isAuthenticated() && !isProviderView && !isOwner && !alreadyApplied && !isClosed;

  return (
    <div className="assignment-apply-page">
      <div className="assignment-apply-shell">
        <div className="assignment-hero-card">
          <div className="assignment-hero-copy">
            <span className="assignment-kicker">Real application flow</span>
            <h1>{assignment.title}</h1>
            <p>{assignment.description}</p>
          </div>

          <div className="assignment-hero-stats">
            <div className="hero-stat-card">
              <span>Budget</span>
              <strong>{formatCurrencyINR(assignment.budget)}</strong>
            </div>
            <div className="hero-stat-card">
              <span>Deadline</span>
              <strong>
                {assignment.deadline
                  ? new Date(assignment.deadline).toLocaleDateString()
                  : 'Flexible'}
              </strong>
            </div>
            <div className="hero-stat-card">
              <span>Applications</span>
              <strong>{applicationCount}</strong>
            </div>
          </div>
        </div>

        <div className="assignment-layout">
          <section className="assignment-summary-card">
            <div className="summary-pill-row">
              <span className="summary-pill">{assignment.subject || 'General'}</span>
              <span className="summary-pill">{assignment.difficulty || 'Medium'}</span>
              <span className="summary-pill">{assignment.pricingType || 'Fixed Price'}</span>
              <span className={`summary-pill status-pill ${isClosed ? 'closed' : 'open'}`}>
                {assignment.status || 'Open'}
              </span>
            </div>

            <div className="summary-section">
              <h2>Client snapshot</h2>
              <p>{providerName}</p>
              <span>Rating {Number(providerRating).toFixed(1)}</span>
            </div>

            <div className="summary-section">
              <h2>Project details</h2>
              <ul className="details-list">
                <li>Category: {assignment.category || 'Other'}</li>
                <li>Assignment type: {assignment.assignmentType || 'Project'}</li>
                <li>Estimated time: {assignment.estimatedTime || 'To be discussed'}</li>
                <li>Max workers: {assignment.maxWorkers || 1}</li>
              </ul>
            </div>

            <div className="summary-section">
              <h2>Skills requested</h2>
              <div className="skills-wrap">
                {assignment.skillsRequired?.length ? (
                  assignment.skillsRequired.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="muted-copy">No specific skills listed for this assignment.</p>
                )}
              </div>
            </div>

            {assignment.attachments?.length ? (
              <div className="summary-section">
                <h2>Attachments</h2>
                <div className="attachment-list">
                  {assignment.attachments.map((attachment) => (
                    <a
                      key={`${attachment.name}-${attachment.uploadedAt || attachment.size}`}
                      className="attachment-link"
                      href={attachment.dataUrl}
                      download={attachment.name}
                    >
                      {attachment.name}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="assignment-form-card">
            <div className="form-card-header">
              <span className="form-kicker">Submit proposal</span>
              <h2>Apply for this assignment</h2>
              <p>
                Send your real proposal here. It will be saved against this assignment in the backend.
              </p>
            </div>

            {!isAuthenticated() ? (
              <div className="assignment-info-banner">
                <p>You need to log in as a worker before you can apply.</p>
                <Link className="assignment-primary-btn" to="/login">
                  Log in to apply
                </Link>
              </div>
            ) : null}

            {isOwner ? (
              <div className="assignment-info-banner warning">
                <p>You posted this assignment, so you cannot apply to your own listing.</p>
              </div>
            ) : null}

            {isProviderView && !isOwner ? (
              <div className="assignment-info-banner warning">
                <p>Provider accounts cannot submit applications. Use a worker account to apply.</p>
              </div>
            ) : null}

            {alreadyApplied ? (
              <div className="assignment-info-banner success">
                <p>You have already applied to this assignment.</p>
              </div>
            ) : null}

            {isClosed ? (
              <div className="assignment-info-banner warning">
                <p>This assignment is currently {assignment.status?.toLowerCase()} and not accepting new applications.</p>
              </div>
            ) : null}

            {error ? <div className="assignment-feedback error">{error}</div> : null}
            {successMessage ? <div className="assignment-feedback success">{successMessage}</div> : null}

            <form className="assignment-application-form" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>Quick intro</span>
                <input
                  disabled={!canApply || submitting}
                  maxLength={500}
                  name="message"
                  onChange={handleChange}
                  placeholder="Briefly introduce yourself and explain why you fit this work."
                  type="text"
                  value={formData.message}
                />
              </label>

              <div className="form-grid">
                <label className="form-field">
                  <span>Proposed budget</span>
                  <input
                    disabled={!canApply || submitting}
                    min="1"
                    name="proposedBudget"
                    onChange={handleChange}
                    required
                    type="number"
                    value={formData.proposedBudget}
                  />
                </label>

                <label className="form-field">
                  <span>Estimated time</span>
                  <input
                    disabled={!canApply || submitting}
                    maxLength={120}
                    name="estimatedTime"
                    onChange={handleChange}
                    placeholder="Example: 3 days"
                    required
                    type="text"
                    value={formData.estimatedTime}
                  />
                </label>
              </div>

              <label className="form-field">
                <span>Full proposal</span>
                <textarea
                  disabled={!canApply || submitting}
                  maxLength={1000}
                  name="proposalMessage"
                  onChange={handleChange}
                  placeholder="Describe your approach, deliverables, and how you will complete the assignment."
                  required
                  rows="7"
                  value={formData.proposalMessage}
                />
              </label>

              <div className="form-actions">
                <button
                  className="assignment-primary-btn"
                  disabled={!canApply || submitting}
                  type="submit"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <Link className="assignment-secondary-btn" to="/marketplace">
                  Back to marketplace
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
