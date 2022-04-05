import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import supertokens from 'supertokens-node'
import NextCors from "nextjs-cors";
import {backendConfig} from '../../config/backendConfig'

supertokens.init(backendConfig())

export default async function user(req: any, res: any) {

  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  });

  // we first verify the session
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next)
    },
    req, res
  )
  // if it comes here, it means that the session verification was successful


  return res.json({
    note:
      'Fetch data from your application by using verifySession middleware',
    userId: req.session.getUserId(),
    sessionHandle: req.session.getHandle(),
    userDataInAccessToken: req.session.getAccessTokenPayload(),
  })
}
