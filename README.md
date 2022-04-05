# Prerequisites

- A running docker instance

# Running the demo

## Demo project:

1. Bring up the application:
    ```shell
    yarn dev
    // or
    npm run dev
    ```
2. Open [http://localhost:3000](http://localhost:3000) for the web application

## BYO mock-saml instance

1. Execute setup to create a certificate for the mock SAML provider:
    ```shell
     ./setup.sh
    ```
3. Run project:
    ```shell
    yarn dev-mock-saml
    // or
    npm run dev-mock-saml
    ```
4. Open [http://localhost:3000](http://localhost:3000) for the web application

# Jackson Admin UI

Logging in to the admin UI is as simple as:
1. Visit Jackson UI [http://localhost:5225](http://localhost:5225)
2. Open MailDev at [http://localhost:1080](http://localhost:1080) and click on the sign in link in the intercepted e-mail 
