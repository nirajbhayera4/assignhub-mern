import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAssignments,
  getAdzunaMarketplaceAssignments,
} from '../services/assignments';
import { formatCurrencyINR } from '../utils/helpers';
import '../styles/Marketplace.css';

const SAVED_ASSIGNMENTS_KEY = 'assignhub_saved_assignments';

const getBudgetLabel = (budget) => {
  if (budget >= 500) {
    return '₹500+';
  }

  if (budget >= 300) {
    return '₹300 - ₹499';
  }

  if (budget >= 100) {
    return '₹100 - ₹299';
  }

  return '₹0 - ₹99';
};

const matchesBudgetRange = (budget, budgetRange) => {
  if (budgetRange === 'all') {
    return true;
  }

  if (budgetRange === '0-100') {
    return budget < 100;
  }

  if (budgetRange === '100-300') {
    return budget >= 100 && budget < 300;
  }

  if (budgetRange === '300-500') {
    return budget >= 300 && budget < 500;
  }

  return budget >= 500;
};

const Marketplace = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketplaceNotice, setMarketplaceNotice] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [budgetRange, setBudgetRange] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [savedAssignments, setSavedAssignments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (sortBy === 'highest') {
        params.sort = '-budget';
      } else if (sortBy === 'deadline') {
        params.sort = 'deadline';
      } else if (sortBy === 'popular') {
        params.sort = '-applications';
      } else {
        params.sort = '-createdAt';
      }

      if (filterCategory !== 'all') {
        params.subject = filterCategory;
      }

      const requests = [];

      if (sourceFilter !== 'adzuna') {
        requests.push(getAssignments(params));
      } else {
        requests.push(Promise.resolve({ assignments: [] }));
      }

      if (sourceFilter !== 'local') {
        requests.push(
          getAdzunaMarketplaceAssignments({
            search: searchTerm,
            subject: filterCategory !== 'all' ? filterCategory : undefined,
            limit: 12,
          })
        );
      } else {
        requests.push(Promise.resolve({ assignments: [] }));
      }

      const [localResult, adzunaResult] = await Promise.allSettled(requests);

      const localAssignments =
        localResult.status === 'fulfilled'
          ? (localResult.value.assignments || []).map((assignment) => ({
              ...assignment,
              source: 'local',
            }))
          : [];
      const adzunaAssignments =
        adzunaResult.status === 'fulfilled'
          ? (adzunaResult.value.assignments || []).map((assignment) => ({
              ...assignment,
              source: 'adzuna',
            }))
          : [];

      setAssignments([...adzunaAssignments, ...localAssignments]);

      if (adzunaResult.status === 'rejected' && sourceFilter !== 'local') {
        setMarketplaceNotice(
          adzunaResult.reason?.response?.data?.message ||
            'External freelance feed is unavailable right now. Showing AssignHub work only.'
        );
      } else if (adzunaAssignments.length > 0) {
        setMarketplaceNotice('Marketplace includes AssignHub projects plus live Adzuna job opportunities.');
      } else if (sourceFilter === 'local') {
        setMarketplaceNotice('Showing AssignHub native jobs only.');
      } else {
        setMarketplaceNotice('');
      }

      if (localResult.status === 'rejected' && adzunaResult.status === 'rejected') {
        throw localResult.reason || adzunaResult.reason;
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError('Failed to load assignments. Please try again.');
      setMarketplaceNotice('');
    } finally {
      setLoading(false);
    }
  }, [filterCategory, searchTerm, sortBy, sourceFilter]);

  useEffect(() => {
    const storedAssignments = localStorage.getItem(SAVED_ASSIGNMENTS_KEY);

    if (storedAssignments) {
      try {
        setSavedAssignments(JSON.parse(storedAssignments));
      } catch (parseError) {
        console.error('Failed to parse saved assignments:', parseError);
      }
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm, budgetRange, difficultyFilter, sourceFilter, filterCategory, sortBy]);

  const toggleSavedAssignment = (assignmentId) => {
    const nextSavedAssignments = savedAssignments.includes(assignmentId)
      ? savedAssignments.filter((id) => id !== assignmentId)
      : [...savedAssignments, assignmentId];

    setSavedAssignments(nextSavedAssignments);
    localStorage.setItem(SAVED_ASSIGNMENTS_KEY, JSON.stringify(nextSavedAssignments));
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const title = assignment.title?.toLowerCase() || '';
    const description = assignment.description?.toLowerCase() || '';
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const difficulty = assignment.difficulty?.toLowerCase() || 'medium';
    const budget = Number(assignment.budget) || 0;

    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      description.includes(normalizedSearch);
    const matchesDifficulty =
      difficultyFilter === 'all' || difficulty === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty && matchesBudgetRange(budget, budgetRange);
  });

  const visibleAssignments = filteredAssignments.slice(0, visibleCount);
  const totalBudget = filteredAssignments.reduce(
    (sum, assignment) => sum + (Number(assignment.budget) || 0),
    0
  );
  const averageBudget = filteredAssignments.length
    ? Math.round(totalBudget / filteredAssignments.length)
    : 0;
  const adzunaCount = filteredAssignments.filter((assignment) => assignment.source === 'adzuna').length;
  const localCount = filteredAssignments.filter((assignment) => assignment.source === 'local').length;
  const featuredCollections = [
    {
      title: 'Fast-turnaround wins',
      description: 'Short, budget-friendly jobs with fast hiring energy and quick delivery windows.',
      value: `${filteredAssignments.filter((assignment) => (Number(assignment.budget) || 0) < 150).length} open`,
    },
    {
      title: 'Portfolio builders',
      description: 'Projects that help new freelancers earn reviews, proof of work, and repeat clients.',
      value: `${savedAssignments.length} saved`,
    },
    {
      title: 'Premium contracts',
      description: 'Higher-value work that looks more like a traditional freelance client engagement.',
      value: `${filteredAssignments.filter((assignment) => (Number(assignment.budget) || 0) >= 300).length} premium`,
    },
  ];

  return (
    <div className="marketplace-page">
      <div className="marketplace-background">
        <div className="market-blob market-blob-1"></div>
        <div className="market-blob market-blob-2"></div>
      </div>

      <div className="marketplace-container">
        <div className="marketplace-hero">
          <div className="marketplace-header">
            <span className="marketplace-kicker">Freelance Discovery Hub</span>
            <h1>Explore a smarter assignment marketplace</h1>
            <p>Browse local work, compare external opportunities, shortlist strong fits, and move from discovery to delivery like a real freelance platform.</p>
          </div>

          <div className="marketplace-summary">
            <div className="summary-card">
              <span>Open opportunities</span>
              <strong>{filteredAssignments.length}</strong>
              <p>Live listings after your current filters</p>
            </div>
            <div className="summary-card">
              <span>Average budget</span>
              <strong>{formatCurrencyINR(averageBudget)}</strong>
              <p>Healthy mix of starter gigs and premium jobs</p>
            </div>
            <div className="summary-card">
              <span>Saved shortlist</span>
              <strong>{savedAssignments.length}</strong>
              <p>Keep strong matches ready for follow-up</p>
            </div>
          </div>
        </div>

        <div className="marketplace-source-bar">
          <button
            className={`source-pill ${sourceFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSourceFilter('all')}
            type="button"
          >
            All Sources
          </button>
          <button
            className={`source-pill ${sourceFilter === 'local' ? 'active' : ''}`}
            onClick={() => setSourceFilter('local')}
            type="button"
          >
            AssignHub Native
          </button>
          <button
            className={`source-pill ${sourceFilter === 'adzuna' ? 'active' : ''}`}
            onClick={() => setSourceFilter('adzuna')}
            type="button"
          >
            Adzuna Live Jobs
          </button>
          <div className="source-stats">
            <span>{localCount} local</span>
            <span>{adzunaCount} adzuna</span>
          </div>
        </div>

        {marketplaceNotice ? (
          <div className="marketplace-notice">
            <p>{marketplaceNotice}</p>
          </div>
        ) : null}

        <div className="marketplace-insights">
          {featuredCollections.map((collection) => (
            <article key={collection.title} className="insight-card">
              <div className="insight-value">{collection.value}</div>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
            </article>
          ))}
        </div>

        <div className="marketplace-filters">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Budget Range</label>
            <select
              className="filter-select"
              value={budgetRange}
              onChange={(event) => setBudgetRange(event.target.value)}
            >
              <option value="all">All Budgets</option>
              <option value="0-100">₹0 - ₹99</option>
              <option value="100-300">₹100 - ₹299</option>
              <option value="300-500">₹300 - ₹499</option>
              <option value="500+">₹500+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select
              className="filter-select"
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="filter-select"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Budget</option>
              <option value="deadline">Earliest Deadline</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="marketplace-search-shell">
          <div className="marketplace-search">
            <input
              type="text"
              placeholder="Search assignments, skills, or project styles..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="search-input"
            />
          </div>
          <div className="marketplace-chip-row">
            <span className="marketplace-chip">Top rate</span>
            <span className="marketplace-chip">Urgent</span>
            <span className="marketplace-chip">Long-term</span>
            <span className="marketplace-chip">Fixed-price</span>
          </div>
        </div>

        <div className="marketplace-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchAssignments} className="retry-btn" type="button">Retry</button>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <p>No assignments found matching your criteria.</p>
            </div>
          ) : (
            visibleAssignments.map((assignment) => {
              const providerName = assignment.provider?.name || assignment.clientName || 'Anonymous';
              const providerRating = assignment.provider?.rating || assignment.clientRating || '4.5';
              const applicationCount =
                assignment.applicationCount ?? assignment.applications?.length ?? 0;
              const isSaved = savedAssignments.includes(assignment._id);
              const budget = Number(assignment.budget) || 0;

              return (
                <article key={assignment._id} className="marketplace-card">
                  <div className="card-topbar">
                    <span className={`source-tag ${assignment.source || 'local'}`}>
                      {assignment.source === 'adzuna' ? 'Adzuna' : 'AssignHub'}
                    </span>
                    <button
                      className={`save-job-btn ${isSaved ? 'saved' : ''}`}
                      onClick={() => toggleSavedAssignment(assignment._id)}
                      type="button"
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <div className="card-badge">
                    <span className={`badge-category ${assignment.subject?.toLowerCase().replace(/\//g, '-') || 'general'}`}>
                      {assignment.subject || 'General'}
                    </span>
                    <span className={`badge-difficulty ${assignment.difficulty?.toLowerCase() || 'medium'}`}>
                      {assignment.difficulty || 'Medium'}
                    </span>
                    <span className="badge-budget">{getBudgetLabel(budget)}</span>
                  </div>

                  <h3 className="card-title">{assignment.title}</h3>
                  <p className="card-description">
                    {assignment.description || 'Detailed scope will be available when you open the full listing.'}
                  </p>

                  <div className="card-meta">
                    <span className="meta-item">Client {providerName}</span>
                    <span className="meta-item">Rating {providerRating}</span>
                  </div>

                  <div className="card-details">
                    <div className="detail-box">
                      <p className="detail-label">Budget</p>
                      <p className="detail-value">{formatCurrencyINR(budget)}</p>
                    </div>
                    <div className="detail-box">
                      <p className="detail-label">Timeline</p>
                      <p className="detail-value">
                        {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'Flexible'}
                      </p>
                    </div>
                    <div className="detail-box">
                      <p className="detail-label">Proposals</p>
                      <p className="detail-value">{applicationCount}</p>
                    </div>
                  </div>

                  <div className="card-actions">
                    {assignment.externalUrl ? (
                      <a
                        className="view-details-btn"
                        href={assignment.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Listing
                      </a>
                    ) : (
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/assignments/${assignment._id}/apply`)}
                        type="button"
                      >
                        View Details & Apply
                      </button>
                    )}
                    <button className="secondary-card-btn" type="button">
                      Invite to Shortlist
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {!loading && !error && filteredAssignments.length > visibleCount ? (
          <div className="load-more">
            <button
              className="load-more-btn"
              onClick={() => setVisibleCount((current) => current + 6)}
              type="button"
            >
              Load More Assignments
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Marketplace;
