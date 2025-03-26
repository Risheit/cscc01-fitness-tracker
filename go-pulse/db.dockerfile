# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 postgres:17-alpine

ARG POSTGRES_DB="go-pulse"
ARG POSTGRES_USER="postgres"
ARG POSTGRES_PASSWORD

ENV POSTGRES_DB ${POSTGRES_DB}
ENV PGUSER ${POSTGRES_USER} 
ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}

EXPOSE 5432
ENV PORT=5432

WORKDIR /

COPY ./src/app/db/init.sql /docker-entrypoint-initdb.d/init.sql