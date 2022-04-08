import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'

export const frontendConfig = () => ({
  appInfo,
  recipeList: [
    ThirdPartyEmailPasswordReact.init({
      preAPIHook: async (context) => {
        let url = new URL(context.url)
        let action = context.action

        if (action === 'GET_AUTHORISATION_URL') {
          url.searchParams.append('tenant', 'boxyhq.com')
          url.searchParams.append('product', 'supertokens')
        }

        if (action === 'THIRD_PARTY_SIGN_IN_UP') {
          url.searchParams.append('tenant', 'boxyhq.com')
          url.searchParams.append('product', 'supertokens')
        }

        return {
          requestInit: context.requestInit,
          url: url.href
        }
      },

      signInAndUpFeature: {
        providers: [
          {
            id: 'saml-jackson',
            name: 'SAML Jackson'
          }
        ]
      }
    }),
    SessionReact.init()
  ]
})
