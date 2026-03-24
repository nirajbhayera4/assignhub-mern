const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
const ADZUNA_COUNTRY = (process.env.ADZUNA_COUNTRY || 'us').toLowerCase();

const mapDifficulty = (salaryMax, contractTime) => {
  if (salaryMax >= 120000 || contractTime === 'full_time') {
    return 'Hard';
  }

  if (salaryMax >= 60000 || contractTime === 'part_time') {
    return 'Medium';
  }

  return 'Easy';
};

const mapBudget = (job) => {
  const salaryMax = Number(job.salary_max || 0);
  const salaryMin = Number(job.salary_min || 0);

  if (salaryMax > 0 && salaryMin > 0) {
    return Math.round((salaryMax + salaryMin) / 2);
  }

  return salaryMax || salaryMin || 1;
};

const mapAdzunaJobToAssignment = (job) => {
  const budget = mapBudget(job);

  return {
    _id: `adzuna-${job.id}`,
    title: job.title,
    description: job.description,
    subject: job.category?.label || 'Real World Jobs',
    difficulty: mapDifficulty(Number(job.salary_max || 0), job.contract_time),
    budget,
    deadline: null,
    applications: [],
    applicationCount: 0,
    provider: {
      name: job.company?.display_name || 'Hiring Company',
      rating: 4.7,
    },
    source: {
      platform: 'Adzuna',
      externalId: job.id,
    },
    externalUrl: job.redirect_url,
    createdAt: job.created || new Date().toISOString(),
    location: job.location?.display_name || '',
    contractType: job.contract_type || '',
    contractTime: job.contract_time || '',
    skills: [],
  };
};

const fetchAdzunaMarketplaceAssignments = async ({
  search,
  subject,
  limit = 12,
}) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    const error = new Error('Adzuna integration is not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY.');
    error.statusCode = 503;
    throw error;
  }

  const page = 1;
  const resultsPerPage = Math.max(1, Math.min(Number(limit) || 12, 20));
  const url = new URL(`${ADZUNA_BASE_URL}/${ADZUNA_COUNTRY}/search/${page}`);

  url.searchParams.set('app_id', appId);
  url.searchParams.set('app_key', appKey);
  url.searchParams.set('results_per_page', String(resultsPerPage));
  url.searchParams.set('content-type', 'application/json');

  if (search) {
    url.searchParams.set('what', search);
  }

  if (subject) {
    url.searchParams.set('category', subject);
  }

  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload?.message || 'Adzuna marketplace request failed.');
    error.statusCode = response.status || 502;
    throw error;
  }

  const jobs = Array.isArray(payload?.results) ? payload.results : [];

  return jobs.map(mapAdzunaJobToAssignment);
};

module.exports = {
  fetchAdzunaMarketplaceAssignments,
};
