# Etapa base
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Instala pnpm usando corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias en modo producción (sin devDependencies)
RUN pnpm install --frozen-lockfile --prod

# Etapa de build
FROM base AS build

# Copia el resto de la app y las dependencias instaladas
COPY . .

# Instala dependencias de desarrollo para el build
RUN pnpm install --frozen-lockfile

# Ejecuta el build
RUN pnpm run build

# Etapa final: solo archivos necesarios para producción
FROM node:20-slim AS production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

# Copia node_modules y el build desde la etapa de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# Si tienes archivos estáticos, agrégalos aquí
# COPY --from=build /app/public ./public

EXPOSE 3000

# Comando de arranque
CMD ["node", "build"]
