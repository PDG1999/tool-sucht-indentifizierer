# Multi-stage Dockerfile für SAMEBI Stress-Checker
# Optimiert für verschiedene Sprachen und Produktions-Deployment

# Build Stage
FROM node:18-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package-Dateien kopieren für besseres Caching
COPY package*.json ./

# Dependencies installieren
RUN npm ci --only=production && npm cache clean --force

# Source-Code kopieren
COPY . .

# Build-Argument für Sprache
ARG LANGUAGE=es
ARG API_URL=https://api.samebi.net
ARG GA_TRACKING_ID=G-XXXXXXXXX

# Environment Variables für Build setzen
ENV VITE_LANGUAGE=${LANGUAGE}
ENV VITE_API_URL=${API_URL}
ENV VITE_GA_TRACKING_ID=${GA_TRACKING_ID}

# Sprachspezifischen HTML-Index auswählen
RUN if [ "$LANGUAGE" = "de" ]; then \
        cp index.de.html index.html; \
    elif [ "$LANGUAGE" = "en" ]; then \
        cp index.en.html index.html; \
    fi

# Application builden
RUN npm run build

# Production Stage
FROM nginx:alpine AS production

# Nginx-Konfiguration kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Port exponieren
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]

