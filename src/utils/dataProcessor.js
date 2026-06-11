/**
 * KCET Compass - Data Processor
 * Handles loading, filtering, probability calculation, and analysis of cutoff data.
 */

let cachedData = null;

// Branch code to display name
const BRANCH_DISPLAY = {
  'CS': 'Computer Science Engineering',
  'IE': 'Information Science Engineering',
  'AI': 'Artificial Intelligence',
  'CA': 'Computer Science (AI & ML)',
  'AD': 'Artificial Intelligence & Data Science',
  'EC': 'Electronics & Communication',
  'EE': 'Electrical Engineering',
  'ME': 'Mechanical Engineering',
  'CE': 'Civil Engineering',
  'BT': 'Bio Technology',
  'CH': 'Chemical Engineering',
  'IM': 'Industrial Engineering & Management',
  'ET': 'Electronics & Telecommunication',
  'EI': 'Electronics & Instrumentation',
  'SE': 'Aerospace Engineering',
  'MR': 'Mechatronics',
  'TX': 'Textile Technology',
  'ST': 'Silk Technology',
  'AU': 'Automobile Engineering',
  'MD': 'Medical Electronics',
  'RI': 'Robotics & AI',
  'DS': 'Data Science',
};

// Branch filter mapping (user selection -> branch codes)
const BRANCH_FILTER_MAP = {
  'Computer Science Engineering': ['CS'],
  'Information Science Engineering': ['IE'],
  'Artificial Intelligence & Machine Learning': ['AI', 'CA'],
  'Artificial Intelligence & Data Science': ['AD'],
  'Electronics & Communication': ['EC', 'ET', 'EI'],
  'Electrical Engineering': ['EE'],
  'Mechanical Engineering': ['ME'],
  'Civil Engineering': ['CE'],
};

export async function loadData() {
  if (cachedData) return cachedData;
  try {
    const response = await fetch('/data/all_cutoffs.json');
    if (!response.ok) throw new Error('Failed to load data');
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
}

export function getCutoffForCategory(record, category) {
  const val = record.cutoffs[category];
  if (val === null || val === undefined || val === '--') return null;
  return typeof val === 'string' ? parseInt(val) : val;
}

export function calculateProbability(rank, cutoff) {
  if (cutoff === null || cutoff === undefined) return null;
  const ratio = rank / cutoff;
  if (ratio <= 0.5) return 98;
  if (ratio <= 0.7) return 92;
  if (ratio <= 0.85) return 85;
  if (ratio <= 1.0) return 78;
  if (ratio <= 1.1) return 65;
  if (ratio <= 1.3) return 50;
  if (ratio <= 1.5) return 35;
  if (ratio <= 1.8) return 22;
  if (ratio <= 2.2) return 12;
  if (ratio <= 3.0) return 5;
  return 2;
}

export function getProbabilityCategory(probability) {
  if (probability === null) return 'unknown';
  if (probability >= 75) return 'highly-likely';
  if (probability >= 55) return 'likely';
  if (probability >= 30) return 'possible';
  return 'dream';
}

export function getProbabilityLabel(category) {
  const labels = {
    'highly-likely': 'Highly Likely',
    'likely': 'Likely',
    'possible': 'Possible',
    'dream': 'Dream',
    'unknown': 'Unknown',
  };
  return labels[category] || 'Unknown';
}

export function getProbabilityColor(category) {
  const colors = {
    'highly-likely': '#34C759',
    'likely': '#5AC8FA',
    'possible': '#FF9500',
    'dream': '#FF3B30',
    'unknown': '#999',
  };
  return colors[category] || '#999';
}

export function calculateTrend(records) {
  const sorted = [...records].sort((a, b) => a.year - b.year);
  if (sorted.length < 2) return { trend: 'stable', label: 'No Trend Data', icon: '→' };
  
  const cutoffs = sorted.map(r => {
    // Try to get GM cutoff to judge general trend for this branch
    return r.cutoffs['GM'] || r.cutoffs['1G'] || Object.values(r.cutoffs)[0];
  }).filter(c => c !== null && c !== undefined);
  
  if (cutoffs.length < 2) return { trend: 'stable', label: 'Stable', icon: '→' };
  
  const first = cutoffs[0];
  const last = cutoffs[cutoffs.length - 1];
  const change = ((last - first) / first) * 100;
  
  if (change < -10) {
    return { trend: 'increasing', label: 'Competition Increasing', icon: '↑' };
  } else if (change > 10) {
    return { trend: 'decreasing', label: 'Competition Decreasing', icon: '↓' };
  }
  return { trend: 'stable', label: 'Stable', icon: '→' };
}

export function getCollegeTier(gmCutoff) {
  if (gmCutoff === null || gmCutoff === undefined) return { tier: 3, label: 'Tier 3' };
  if (gmCutoff <= 5000) return { tier: 1, label: 'Tier 1' };
  if (gmCutoff <= 15000) return { tier: 1, label: 'Tier 1' };
  if (gmCutoff <= 30000) return { tier: 2, label: 'Tier 2' };
  if (gmCutoff <= 60000) return { tier: 2, label: 'Tier 2' };
  return { tier: 3, label: 'Tier 3' };
}

export function getRankTier(rank) {
  if (rank <= 5000) return { name: 'Top Tier', color: '#34C759' };
  if (rank <= 10000) return { name: 'Upper Tier', color: '#5AC8FA' };
  if (rank <= 25000) return { name: 'Middle Tier', color: '#FF9500' };
  if (rank <= 50000) return { name: 'Competitive Tier', color: '#FF6B35' };
  return { name: 'Mass Tier', color: '#FF3B30' };
}

export function analyzeResults(data, { rank, category, branch, city, round }) {
  const rankNum = parseInt(rank);
  const branchCodes = BRANCH_FILTER_MAP[branch] || [];
  const years = [...new Set(data.map(r => r.year))].sort((a, b) => b - a);
  
  let filtered = data.filter(r => r.round === parseInt(round));
  if (branch && branch !== 'All Branches') {
    filtered = filtered.filter(r => branchCodes.includes(r.branchCode));
  }
  if (city && city !== 'All Karnataka') {
    filtered = filtered.filter(r => r.city === city);
  }
  
  const groupKey = (r) => `${r.collegeCode}-${r.branchCode}`;
  const groups = {};
  
  filtered.forEach(r => {
    const key = groupKey(r);
    if (!groups[key]) {
      groups[key] = {
        collegeCode: r.collegeCode,
        collegeName: r.collegeName,
        city: r.city,
        branchCode: r.branchCode,
        branchName: r.branchName,
        records: [],
      };
    }
    groups[key].records.push(r);
  });
  
  const results = Object.values(groups).map(group => {
    group.records.sort((a, b) => a.year - b.year);
    const latestRecord = group.records[group.records.length - 1];
    const latestCutoff = getCutoffForCategory(latestRecord, category);
    
    const cutoffsByYear = {};
    group.records.forEach(r => {
      cutoffsByYear[r.year] = getCutoffForCategory(r, category);
    });
    
    const probability = latestCutoff ? calculateProbability(rankNum, latestCutoff) : null;
    const probCategory = getProbabilityCategory(probability);
    const trend = calculateTrend(group.records);
    const gmCutoff = latestRecord.cutoffs['GM'];
    const tier = getCollegeTier(gmCutoff);
    const difference = latestCutoff ? rankNum - latestCutoff : null;
    
    return {
      collegeCode: group.collegeCode,
      collegeName: group.collegeName,
      city: group.city,
      branchCode: group.branchCode,
      branchName: group.branchName || BRANCH_DISPLAY[group.branchCode] || group.branchCode,
      latestCutoff,
      cutoffsByYear,
      probability,
      probCategory,
      trend,
      tier,
      difference,
      latestYear: latestRecord.year,
      records: group.records,
    };
  });
  
  // Sort by probability (highest first), then by cutoff (lowest first) to prioritize better colleges
  results.sort((a, b) => {
    if (a.probability === null && b.probability === null) return 0;
    if (a.probability === null) return 1;
    if (b.probability === null) return -1;
    if (b.probability !== a.probability) return b.probability - a.probability;
    if (a.latestCutoff === null && b.latestCutoff === null) return 0;
    if (a.latestCutoff === null) return 1;
    if (b.latestCutoff === null) return -1;
    return a.latestCutoff - b.latestCutoff;
  });
  
  const grouped = {
    'highly-likely': results.filter(r => r.probCategory === 'highly-likely'),
    'likely': results.filter(r => r.probCategory === 'likely'),
    'possible': results.filter(r => r.probCategory === 'possible'),
    'dream': results.filter(r => r.probCategory === 'dream'),
  };
  
  return { results, grouped, years };
}

export function getBranchOpportunities(data, { rank, category, round }) {
  const rankNum = parseInt(rank);
  const years = [...new Set(data.map(r => r.year))].sort((a, b) => b - a);
  const latestYear = years[0];
  
  const filtered = data.filter(r => r.round === parseInt(round) && r.year === latestYear);
  const branchCounts = {};
  
  filtered.forEach(r => {
    const cutoff = getCutoffForCategory(r, category);
    if (cutoff !== null) {
      const branchName = BRANCH_DISPLAY[r.branchCode] || r.branchName || r.branchCode;
      if (!branchCounts[r.branchCode]) {
        branchCounts[r.branchCode] = {
          code: r.branchCode,
          name: branchName,
          total: 0,
          reachable: 0,
        };
      }
      branchCounts[r.branchCode].total++;
      if (calculateProbability(rankNum, cutoff) >= 30) {
        branchCounts[r.branchCode].reachable++;
      }
    }
  });
  
  return Object.values(branchCounts)
    .filter(b => b.total > 0)
    .sort((a, b) => b.reachable - a.reachable);
}

export function getCities(data) {
  const cities = [...new Set(data.map(r => r.city))].filter(c => c && c !== 'Other');
  return cities.sort();
}

export function getCollegesList(data) {
  const seen = new Set();
  const colleges = [];
  data.forEach(r => {
    if (!seen.has(r.collegeCode)) {
      seen.add(r.collegeCode);
      colleges.push({ code: r.collegeCode, name: r.collegeName, city: r.city });
    }
  });
  return colleges.sort((a, b) => a.name.localeCompare(b.name));
}

export function getDataStats(data) {
  return {
    totalRecords: data.length,
    colleges: new Set(data.map(r => r.collegeCode)).size,
    branches: new Set(data.map(r => r.branchCode)).size,
    years: [...new Set(data.map(r => r.year))].sort(),
    cities: new Set(data.map(r => r.city)).size,
  };
}
