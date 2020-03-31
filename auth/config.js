import Oidc from 'oidc-client'

const oidcSettings = {
  authority: `${process.env.AUTH_AUTHORITY}`,
  client_id: `${process.env.AUTH_ID}`,
  redirect_uri: `${process.env.AUTH_URL}/auth/callback`,
  registration_uri: `${process.env.AUTH_AUTHORITY}/protocol/openid-connect/registrations`,
  silent_redirect_uri: `${process.env.AUTH_URL}/auth/silent`,
  response_type: `${process.env.AUTH_TYPE}`,
  scope: `${process.env.AUTH_SCOPE}`,
  post_logout_redirect_uri: `${process.env.AUTH_URL}/auth/logout`,
  userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
  monitorSession: false,
}

export default oidcSettings
