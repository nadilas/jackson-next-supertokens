#!/bin/bash
# using https://mocksaml.com/api/saml/sso
# !! This certificate generation is only required if you want to run your own mock-saml instance
[[ ! -f public.crt ]] && openssl req -x509 -newkey rsa:2048 -keyout key.pem -out public.crt -sha256 -days 365000 -nodes \

sed -i -e "s|PUBLIC_KEY=REPLACE|PUBLIC_KEY=$(cat public.crt | base64)|" docker-compose-mock-saml.yml \
 && sed -i -e "s|PRIVATE_KEY=REPLACE|PRIVATE_KEY=$(cat key.pem | base64)|" docker-compose-mock-saml.yml \
 && echo "Edited env vars in docker-compose-mock-saml.yml for mock-saml service"
