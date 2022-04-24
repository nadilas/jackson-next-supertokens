import * as trpcNext from '@trpc/server/adapters/next'
import * as trpc from '@trpc/server'
import {SessionRequest} from 'supertokens-node/framework/express'
import SupertokensNode from 'supertokens-node'
import {backendConfig} from '../../../config/backendConfig'
import {superTokensNextWrapper} from 'supertokens-node/nextjs'
import {verifySession} from 'supertokens-node/recipe/session/framework/express'
import {TRPCError} from '@trpc/server'

SupertokensNode.init(backendConfig())

const createContext = async ({
                               req,
                               res
                             }: trpcNext.CreateNextContextOptions) => {
  await superTokensNextWrapper(
    async (next) => {
      // FIXME types are not yet accepted on supertokens
      return await verifySession({sessionRequired: false})(req as any, res as any, next)
    },
    req,
    res
  )

  return {
    req,
    res,
    session: (req as unknown as SessionRequest).session
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>

const createRouter = () => {
  return trpc
    .router<Context>()
}

const createProtectedRouter = () => {
  return trpc.router<Context>()
    .middleware(async ({ctx, next}) => {
      if (!ctx.session || !ctx.session?.getUserId()) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
      }
      return next()
    })
}

const userRouter = createProtectedRouter()
  .query('me', {
    async resolve({ctx}) {
      // FIXME session is deemed possible undefined
      const payload = ctx.session.getAccessTokenPayload()
      return {
        id: ctx.session.getUserId(),
        email: payload.profile.email
      }
    }
  })

const publicRouter = createRouter()
  .query('hello', {
    resolve() {
      return {text: 'world'}
    }
  })

const appRouter = trpc
  .router<Context>()
  // .transformer(superjson)
  .merge('user.', userRouter)
  .merge('public.', publicRouter)

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({error}) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  batching: {
    enabled: true
  }
})
