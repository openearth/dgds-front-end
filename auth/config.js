import Oidc from 'oidc-client'

const oidcSettings = {
  authority: `${process.env.AUTH_AUTHORITY}`,
  client_id: `${process.env.AUTH_ID}`,
  redirect_uri: `${process.env.AUTH_URL}/${process.env.AUTH_LOGIN_URL}`,
  registration_uri: `${process.env.AUTH_AUTHORITY}/protocol/openid-connect/registrations`,
  silent_redirect_uri: `${process.env.AUTH_URL}/${process.env.AUTH_SILENT_URL}`,
  response_type: `${process.env.AUTH_TYPE}`,
  scope: `${process.env.AUTH_SCOPE}`,
  post_logout_redirect_uri: `${process.env.AUTH_URL}/${process.env.AUTH_LOGOUT_URL}`,
  automaticSilentRenew: true,
  userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
}

export default oidcSettings
