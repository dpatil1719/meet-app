import mockData from './mock-data';

/** Return unique list of locations from events */
export const extractLocations = (events) => {
  const extracted = events.map((e) => e.location);
  return [...new Set(extracted)];
};

/** Verify an access token with Google */
const checkToken = async (accessToken) => {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  return res.json();
};

/** Clean query params (e.g., ?code=...) from the URL */
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.pushState('', '', newurl);
  } else {
    newurl = window.location.protocol + '//' + window.location.host;
    window.history.pushState('', '', newurl);
  }
};

/** Exchange auth code for access token via your Lambda */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const res = await fetch(
    'https://vzrkz05uzc.execute-api.eu-central-1.amazonaws.com/dev/api/token' + '/' + encodeCode
  );
  const { access_token } = await res.json();
  if (access_token) localStorage.setItem('access_token', access_token);
  return access_token;
};

/** Get (or fetch) a valid access token */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck?.error) {
    await localStorage.removeItem('access_token');

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (!code) {
      // redirect user to Google consent via your Lambda
      const response = await fetch(
        'https://vzrkz05uzc.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url'
      );
      const { authUrl } = await response.json();
      window.location.href = authUrl;
      return null;
    }
    return getToken(code);
  }

  return accessToken;
};

/** Fetch events: mock data on localhost, real data when deployed */
export const getEvents = async () => {
  if (window.location.href.startsWith('http://localhost')) {
    return mockData; // keeps Jest tests & local dev fast
  }

  const token = await getAccessToken();
  if (!token) return [];

  removeQuery();
  const url =
    'https://vzrkz05uzc.execute-api.eu-central-1.amazonaws.com/dev/api/get-events' +
    '/' +
    token;

  const res = await fetch(url);
  const result = await res.json();
  return result?.events ?? [];
};
