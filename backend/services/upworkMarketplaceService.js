const UPWORK_GRAPHQL_URL =
  process.env.UPWORK_GRAPHQL_URL || 'https://api.upwork.com/graphql';

const buildSearchExpression = ({ search, subject }) => {
  const terms = [search, subject].filter(Boolean).map((value) => value.trim());
  return terms.length > 0 ? terms.join(' ') : undefined;
};

const mapDifficulty = (contractorTier) => {
  switch ((contractorTier || '').toUpperCase()) {
    case 'EXPERT':
      return 'Hard';
    case 'INTERMEDIATE':
      return 'Medium';
    case 'ENTRY_LEVEL':
      return 'Easy';
    default:
      return 'Medium';
  }
};

const mapBudget = (job) => {
  const fixedBudget = Number(job.amount?.amount || 0);
  const hourlyMax = Number(job.hourlyBudgetMax?.amount || 0);
  const hourlyMin = Number(job.hourlyBudgetMin?.amount || 0);

  return fixedBudget || hourlyMax || hourlyMin || 1;
};

const mapClientName = (client) => {
  const locationBits = [client?.location?.city, client?.location?.country].filter(Boolean);
  return locationBits.length > 0
    ? `Upwork Client (${locationBits.join(', ')})`
    : 'Upwork Client';
};

const mapUpworkJobToAssignment = (job) => ({
  _id: `upwork-${job.ciphertext || job.recno || job.title}`,
  title: job.title,
  description: job.description,
  subject: job.skills?.[0]?.prettyName || 'Upwork Marketplace',
  difficulty: mapDifficulty(job.contractorTier),
  budget: mapBudget(job),
  deadline: null,
  applications: [],
  applicationCount: 0,
  provider: {
    name: mapClientName(job.client),
    rating: job.client?.totalFeedback || 0,
  },
  source: {
    platform: 'Upwork',
    externalId: job.ciphertext || job.recno || null,
  },
  externalUrl: job.ciphertext
    ? `https://www.upwork.com/jobs/~${job.ciphertext}`
    : null,
  createdAt: job.createdDateTime || job.publishedDateTime || new Date().toISOString(),
  skills: (job.skills || []).map((skill) => skill.prettyName),
});

const fetchUpworkMarketplaceAssignments = async ({
  search,
  subject,
  limit = 12,
}) => {
  if (!process.env.UPWORK_ACCESS_TOKEN) {
    const error = new Error('Upwork marketplace integration is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const query = `
    query publicMarketplaceJobPostingsSearch($marketPlaceJobFilter: PublicMarketplaceJobPostingsSearchFilter!) {
      publicMarketplaceJobPostingsSearch(marketPlaceJobFilter: $marketPlaceJobFilter) {
        jobs {
          title
          createdDateTime
          type
          ciphertext
          description
          skills {
            prettyName
          }
          engagement
          amount {
            amount
            currencyCode
          }
          recno
          contractorTier
          client {
            totalHires
            totalPostedJobs
            totalReviews
            totalFeedback
          }
        }
        paging {
          total
          offset
          count
        }
      }
    }
  `;

  const variables = {
    marketPlaceJobFilter: {
      searchExpression_eq: buildSearchExpression({ search, subject }),
      paging: {
        start: 0,
        rows: Math.max(1, Math.min(Number(limit) || 12, 25)),
      },
    },
  };

  const response = await fetch(UPWORK_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.UPWORK_ACCESS_TOKEN}`,
      ...(process.env.UPWORK_ORG_ID
        ? { 'X-Upwork-API-TenantId': process.env.UPWORK_ORG_ID }
        : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    const error = new Error(
      payload.errors?.[0]?.message || 'Upwork marketplace request failed.'
    );
    error.statusCode = response.status || 502;
    throw error;
  }

  const jobs = payload.data?.publicMarketplaceJobPostingsSearch?.jobs || [];

  return jobs.map(mapUpworkJobToAssignment);
};

module.exports = {
  fetchUpworkMarketplaceAssignments,
};
