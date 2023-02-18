import { CLIENT_ID } from './secret'

/**
 * @param {number} size
 */
function randomBytes(size: number) {
	return crypto.getRandomValues(new Uint8Array(size))
  }
  
  /**
   * @param {Uint8Array} bytes
   */
  function base64url(bytes: Uint8Array) {
	return btoa(String.fromCharCode(...bytes))
	  .replace(/=/g, '')
	  .replace(/\+/g, '-')
	  .replace(/\//g, '_')
  }
  
  /**
   * https://tools.ietf.org/html/rfc7636#section-4.2
   * @param {string} code_verifier
   */
  async function generateCodeChallenge(code_verifier: string) {
	const codeVerifierBytes = new TextEncoder().encode(code_verifier)
	const hashBuffer = await crypto.subtle.digest('SHA-256', codeVerifierBytes)
	return base64url(new Uint8Array(hashBuffer))
  }
  
  /**
   * @param {RequestInfo} input
   * @param {RequestInit} [init]
   */
  async function fetchJSON(input: string, init: RequestInit) {
	const response = await fetch(input, init)
	const body = await response.json()
	if (!response.ok) {
	  throw new ErrorResponse(response, body)
	}
	return body
  }
  
  class ErrorResponse extends Error {
	/**
	 * @param {Response} response
	 * @param {any} body
	 */
	status: number
	body: string

	constructor(response: Response, body: any) {
	  super(response.statusText)
	  this.status = response.status
	  this.body = body
	}
  }
  
  export async function beginLogin() {
	// https://tools.ietf.org/html/rfc7636#section-4.1
	const code_verifier = base64url(randomBytes(96))
	const state = base64url(randomBytes(96))
  
	const params = new URLSearchParams({
	  client_id: CLIENT_ID,
	  response_type: 'code',
	  redirect_uri: `${location.origin}/klub100/callback`,
	  code_challenge_method: 'S256',
	  code_challenge: await generateCodeChallenge(code_verifier),
	  state: state,
	  scope: 'user-modify-playback-state',
	})
  
	sessionStorage.setItem('code_verifier', code_verifier)
	sessionStorage.setItem('state', state)
  
	location.href = `https://accounts.spotify.com/authorize?${params}`
  }
  
  export async function completeLogin() {
	  const state = sessionStorage.getItem('state')
	  
	  const params = new URLSearchParams(location.search)
	  
	const code_verifier = sessionStorage.getItem('code_verifier')
	const code = params.get('code')

	if (params.has('error')) {
	  throw new Error(params.get('error') || 'Got error, but no error message. Something terrible probably happended')
	} else if (!params.has('state')) {
	  throw new Error('State missing from response')
	} else if (params.get('state') !== state) {
	  throw new Error('State mismatch')
	} else if (!code) {
	  throw new Error('Code missing from response')
	} else if (!code_verifier) {
		throw new Error('Cant find code verifier in local storage')
	}
  
	await createAccessToken({
	  grant_type: 'authorization_code',
	  code,
	  redirect_uri: `${location.origin}/klub100/callback`,
	  code_verifier: code_verifier,
	})
  }
  
  export function logout() {
	localStorage.removeItem('tokenSet')
  }
  
  /**
   * @param {RequestInfo} input
   */
  export async function fetchWithToken(input: string, init: RequestInit) {
	const accessToken = await getAccessToken()
  
	if (!accessToken) {
	  throw new ErrorResponse(new Response(undefined, { status: 401 }), {})
	}
  
	return fetchJSON(input, {
		...init,
		headers: { Authorization: `Bearer ${accessToken}` },
	})
  }
  
  /**
   * @param {Record<string, string>} params
   * @returns {Promise<string>}
   */
  async function createAccessToken(params: Record<string, string>): Promise<string> {
	const response = await fetchJSON('https://accounts.spotify.com/api/token', {
	  method: 'POST',
	  body: new URLSearchParams({
		client_id: CLIENT_ID,
		...params,
	  }),
	})
  
	const accessToken = response.access_token
	const expires_at = Date.now() + 1000 * response.expires_in
  
	localStorage.setItem('tokenSet', JSON.stringify({ ...response, expires_at }))
  
	return accessToken
  }
  
  /**
   * @returns {Promise<string>}
   */
  async function getAccessToken() {
	let tokenSet = JSON.parse(localStorage.getItem('tokenSet') || '')
  
	if (!tokenSet) return
  
	if (tokenSet.expires_at < Date.now()) {
	  tokenSet = await createAccessToken({
		grant_type: 'refresh_token',
		refresh_token: tokenSet.refresh_token,
	  })
	}
  
	return tokenSet.access_token
  }