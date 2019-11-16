-- DROP SCHEMA IF EXISTS mainCatalog CASCADE;

CREATE SCHEMA IF NOT EXISTS mainCatalog AUTHORIZATION zjahplxb;

CREATE TABLE mainCatalog.catalog
(
    id SERIAL PRIMARY KEY,
    organizationname VARCHAR(128),
    schemaname VARCHAR(24),
    schemaowner VARCHAR(24),
    createddate TIMESTAMP NOT NULL,
    expirationdate TIMESTAMP NOT NULL
);

CREATE TABLE mainCatalog.account
(
    id SERIAL PRIMARY KEY,
    "usernameHash" CHARACTER(64),
    "passwordHash" CHARACTER(64),
    "sessionId" CHARACTER(36)
);