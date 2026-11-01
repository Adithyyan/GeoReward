-- PostgreSQL Database Schema for Refer & Win
-- Compatible with Neon Serverless PostgreSQL and PostgreSQL 13+

-- Enable pgcrypto for gen_random_uuid() if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: referrals
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) DEFAULT 'Site Visitor',
    mobile VARCHAR(20) DEFAULT 'N/A',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy DECIMAL(10, 2),
    location_name VARCHAR(255),
    ip_address VARCHAR(100),
    type VARCHAR(50) DEFAULT 'referral',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on created_at for fast descending queries
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals (created_at DESC);

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast admin login
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (email);
