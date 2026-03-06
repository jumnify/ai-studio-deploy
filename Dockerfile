FROM node:20-alpine AS runtime

WORKDIR /app

# Kopieer de build output
COPY .output/ .output/

# Expose poort 3000 (Nuxt default)
EXPOSE 3000

# Start de Nuxt server
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
