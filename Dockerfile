FROM node:24.22.2-alpine3.24 AS build
WORKDIR /app

# Dependencies first, so that this layer is cached until the lock file changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Versione del tag di rilascio (X.Y.Z), passata dalla CI; vuota nelle build senza tag.
ARG APP_VERSION=""
ENV APP_VERSION=${APP_VERSION}
# Build the site, then compute the CSP hashes of its inline scripts.
RUN npm run build && node scripts/generate-csp.mjs

FROM nginxinc/nginx-unprivileged:1.30.6-alpine AS runtime
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/.generated/csp.conf /etc/nginx/snippets/csp.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080
