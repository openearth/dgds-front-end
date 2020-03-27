const oidcSettings = {
  authority: 'https://accounts.deltares.nl/auth/realms/liferay-portal/',
  client_id: 'dsd-frontend',
  redirect_uri: 'http://localhost:3000/auth/callback',
  registration_uri: 'https://accounts.deltares.nl/auth/realms/liferay-portal/protocol/openid-connect/registrations',
  silent_redirect_uri: 'http://localhost:3000/auth/silent',
  response_type: 'id_token',
  scope: 'openid email profile',
  post_logout_redirect_uri: 'http://localhost:3000/auth/logout',
  automaticSilentRenew: true
}

export default oidcSettings
