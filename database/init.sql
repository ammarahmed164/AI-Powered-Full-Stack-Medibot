-- ===========================================
-- MediBot Database Initialization Script
-- PostgreSQL 15+
-- ===========================================
-- Run this script to create the database
-- and initial setup
-- ===========================================

-- -------------------------------------------
-- Step 1: Create Database
-- -------------------------------------------

-- Note: Run these commands as superuser (postgres)
-- psql -U postgres -f init.sql

-- Drop database if exists (CAUTION: This will delete all data)
-- DROP DATABASE IF EXISTS medibot;

-- Create database
CREATE DATABASE medibot
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- -------------------------------------------
-- Step 2: Create Database User
-- -------------------------------------------

-- Create user (change password in production!)
-- DROP USER IF EXISTS medibot_user;

CREATE USER medibot_user WITH PASSWORD 'MediBot@Secure2024!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medibot TO medibot_user;

-- -------------------------------------------
-- Step 3: Connect to Database
-- -------------------------------------------

\c medibot

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO medibot_user;

-- -------------------------------------------
-- Step 4: Run Schema Script
-- -------------------------------------------

-- Execute the main schema file
\i schema.sql

-- -------------------------------------------
-- Step 5: Grant Table Privileges
-- -------------------------------------------

-- Grant all privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO medibot_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO medibot_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO medibot_user;

-- -------------------------------------------
-- Step 6: Create Read-Only User (Optional)
-- For analytics and reporting
-- -------------------------------------------

-- CREATE USER medibot_reader WITH PASSWORD 'ReadOnly@2024!';
-- GRANT CONNECT ON DATABASE medibot TO medibot_reader;
-- GRANT USAGE ON SCHEMA public TO medibot_reader;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO medibot_reader;

-- -------------------------------------------
-- Step 7: Verify Setup
-- -------------------------------------------

-- Show all tables
\dt

-- Show all users
\du

-- Show database info
SELECT 
    datname as database_name,
    pg_encoding_to_char(encoding) as encoding,
    datcollate as collation,
    datctype as character_type
FROM pg_database 
WHERE datname = 'medibot';

-- -------------------------------------------
-- Step 8: Test Connection
-- -------------------------------------------

-- Test connection as medibot_user
-- psql -U medibot_user -d medibot -c "SELECT COUNT(*) FROM diseases;"

-- ===========================================
-- Database Initialization Complete!
-- ===========================================

-- Default Credentials:
-- Admin Email: admin@medibot.com
-- Admin Password: Admin@123
-- 
-- CHANGE THESE IMMEDIATELY IN PRODUCTION!
-- ===========================================
