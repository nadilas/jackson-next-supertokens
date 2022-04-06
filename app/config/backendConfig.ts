import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './appInfo'
import { TypeInput } from "supertokens-node/types";
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword'
import axios from 'axios'

const jacksonApiUrl = 'http://jackson:5225'
const jacksonAuthUrl = 'http://localhost:5225'

export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
      connectionURI: "http://supertoken:3567"
    },
    appInfo,
    recipeList: [
      ThirdPartyEmailPassword.init({
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              authorisationUrlGET: async (input) => {
                input.userContext.request = input.options.req.original
                return originalImplementation.authorisationUrlGET!(input);
              },
              thirdPartySignInUpPOST: async (input) => {
                input.userContext.request = input.options.req.original
                return originalImplementation.thirdPartySignInUpPOST!(input);
              },
            };
          },
        },
        providers: [
          {
            id: "saml-jackson",
            get: (redirectURI, authCodeFromRequest, userContext) => {
              let request = userContext.request;
              let tenant = request === undefined ? "" : request.query.tenant;
              let product = request === undefined ? "" : request.query.product;
              let client_id = encodeURI(`tenant=${tenant}&product=${product}`)
              return {
                accessTokenAPI: {
                  url: `${jacksonApiUrl}/api/oauth/token`,
                  params: {
                    client_id,
                    client_secret: "dummy",
                    grant_type: "authorization_code",
                    redirect_uri: redirectURI!,
                    code: authCodeFromRequest!,
                  }
                },
                authorisationRedirect: {
                  url: `${jacksonAuthUrl}/api/oauth/authorize`,
                  params: {
                    client_id
                  }
                },
                getClientId: () => {
                  return client_id;
                },
                getProfileInfo: async (accessTokenAPIResponse) => {
                  const profile = await axios({
                    method: 'get',
                    url: `${jacksonApiUrl}/api/oauth/userinfo`,
                    headers: {
                      Authorization: `Bearer ${accessTokenAPIResponse.access_token}`,
                    },
                  });
                  const info = {
                    id: profile.data.id,
                    email: {
                      id: profile.data.email,
                      isVerified: true
                    }
                  }
                  console.log(`created profile info`, info)
                  return info
                }
              }
            }
          }
        ]
      }),
      SessionNode.init(),
    ],
    isInServerlessEnv: true,
  }
}
