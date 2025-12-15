import mockData from './mock-data';

/** Your Lambda endpoints (from serverless info) */
const AUTH_URL = 'https://vzrkz05uzc.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url';
const GET_EVENTS_URL = 'https://vzrkz05uzc.execute-api.eu-central-1.amazonaws.com/dev/api/get-events';
const GET_TOKEN_URL = 'https://vzrkz05uzc.execute-api.eu-central-1.amazonaws.com/dev/api/token';

/** Extract unique locations from events */
export const extractLocations = (events) => {
  const locations = events?.map((e) => e.location) ?? [];
  return [...new Set(locations)];
};

/** Clean ?code=... off the URL after login */
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    window.history.pushState('', '', newurl);
  } else {
    newurl = `${window.location.protocol}//${window.location.host}`;
    window.history.pushState('', '', newurl);
  }
};

/** Exchange Google auth code for access token (uses GET_TOKEN_URL) */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(`${GET_TOKEN_URL}/${encodeCode}`);
  const { access_token } = await response.json();
  if (access_token) localStorage.setItem('access_token', access_token);
  return access_token;
};

/** Verify an access token is still valid */
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  return response.json();
};

/** Get (or kick off getting) an access token (uses AUTH_URL) */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    await localStorage.removeItem('access_token');

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    // No code yet? redirect to Google via your auth server
    if (!code) {
      const response = await fetch(AUTH_URL);
      const { authUrl } = await response.json();
      window.location.href = authUrl; // redirect; returns null in tests
      return null;
    }

    // We have a code → exchange for token
    return getToken(code);
  }

  // Token already valid
  return accessToken;
};

/** Fetch events: mock on localhost, real API otherwise (uses GET_EVENTS_URL) */
export const getEvents = async () => {
  if (window.location.href.startsWith('http://localhost')) {
    return mockData;
  }

  const token = await getAccessToken();
  if (!token) return [];

  removeQuery();
  const url = `${GET_EVENTS_URL}/${token}`;
  const response = await fetch(url);
  const result = await response.json();
  return result?.events ?? [];
};
