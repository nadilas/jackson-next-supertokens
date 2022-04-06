import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import {useSessionContext} from 'supertokens-auth-react/lib/build/recipe/session'
import {useEffect, useState} from 'react'

export const ThirdPartyEmailPasswordAuthNoSSR = dynamic(
  new Promise((res) =>
    res(ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth)
  ) as any,
  {ssr: false}
)

interface HomeProps {
}

const Home: NextPage<HomeProps> = () => {
  const {userId, accessTokenPayload} = useSessionContext()
  const [userData, setUserData] = useState(undefined)
  useEffect(() => {
    fetch('/api/user').then(udata => udata.json().then(u => setUserData(u)))
  }, [])
  const logout = async () => {
    await ThirdPartyEmailPassword.signOut()
    window.location.href = '/'
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>SAML Jackson & Supertokens Demo</title>
        <meta name="description" content="SAML Jackson & Supertokens Demo"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>User</h2>
            <p>{userId}</p>
          </div>

          <div className={styles.card}>
            <h2>User data</h2>
            <pre>{JSON.stringify(userData, null, '  ')}</pre>
          </div>

          <div className={styles.card}>
            <h2>Access token payload</h2>
            <pre>{JSON.stringify(accessTokenPayload, null, '  ')}</pre>
          </div>
        </div>

        <p>
          <button onClick={logout}>Logout</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
        </a>
      </footer>
    </div>
  )
}

export const ProtectedHome: NextPage<HomeProps> = (props) => {
  return (
    <ThirdPartyEmailPasswordAuthNoSSR>
      <Home {...props} />
    </ThirdPartyEmailPasswordAuthNoSSR>
  )
}

export default ProtectedHome

