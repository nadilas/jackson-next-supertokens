export const appInfo = {
  appName: 'SAML Jackson + SuperTokens',
  apiBasePath: '/api/auth',
  apiDomain: getApiDomain(),
  websiteDomain: getWebsiteDomain(),
  websiteBasePath: "/auth"
}

export function getApiDomain() {
  return `http://localhost:3000`
}

export function getWebsiteDomain() {
  return `http://localhost:3000`
}
