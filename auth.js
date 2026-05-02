// Tesla Fleet API — OAuth 2.0 + PKCE Auth Handler
// https://developer.tesla.com/docs/fleet-api/authentication/overview

const TESLA_AUTH_URL = 'https://auth.tesla.com/oauth2/v3/authorize';
const TESLA_TOKEN_URL = 'https://auth.tesla.com/oauth2/v3/token';

async function startAuth() {
  const config = window.TESLA_CONFIG;
  if (!config) { alert('Missing config.js — copy config.example.js and fill in your credentials.'); return; }

  // Generate PKCE code verifier + challenge
  const verifier = generateVerifier();
  const challenge = await generateChallenge(verifier);
  const state = crypto.randomUUID();

  sessionStorage.setItem('pkce_verifier', verifier);
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.CLIENT_ID,
    redirect_uri: config.REDIRECT_URI,
    scope: 'openid vehicle_device_data vehicle_cmds offline_access',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  window.location.href = `${TESLA_AUTH_URL}?${params}`;
}

async function handleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!code) return;
  if (state !== sessionStorage.getItem('oauth_state')) {
    alert('OAuth state mismatch — possible CSRF attack.'); return;
  }

  const config = window.TESLA_CONFIG;
  const verifier = sessionStorage.getItem('pkce_verifier');

  const res = await fetch(TESLA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.CLIENT_ID,
      code,
      code_verifier: verifier,
      redirect_uri: config.REDIRECT_URI
    })
  });

  const data = await res.json();
  if (data.access_token) {
    sessionStorage.setItem('tesla_token', data.access_token);
    window.history.replaceState({}, '', '/');
    initDashboard(data.access_token);
  } else {
    alert('Token exchange failed: ' + JSON.stringify(data));
  }
}

// PKCE helpers
function generateVerifier() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function generateChallenge(verifier) {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Handle callback on page load if code param present
if (window.location.search.includes('code=')) handleCallback();
