-- 🚨 FINAL FULL DATABASE SETUP (v2 - Fixed Constraints & Demo Data)
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. CLEANUP
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS needs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    full_name TEXT,
    role TEXT CHECK (role IN ('Admin', 'NGO', 'Volunteer', 'Donor', 'Beneficiary')),
    points INTEGER DEFAULT 0,
    phone TEXT,
    city TEXT,
    state TEXT
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    type TEXT,
    action_url TEXT
);

-- REPORTS TABLE
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable to prevent breakages
    type TEXT,
    description TEXT,
    category TEXT,
    urgency TEXT CHECK (urgency IN ('critical', 'high', 'medium', 'low')),
    status TEXT CHECK (status IN ('pending', 'verified', 'resolved', 'open', 'active')),
    latitude FLOAT,
    longitude FLOAT,
    city TEXT,
    state TEXT,
    address TEXT,
    image_url TEXT,
    people_affected INTEGER
);

-- NEEDS TABLE
CREATE TABLE needs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    category TEXT,
    quantity TEXT,
    urgency TEXT CHECK (urgency IN ('critical', 'high', 'medium', 'low')),
    status TEXT CHECK (status IN ('active', 'fulfilled', 'expired')),
    state TEXT,
    city TEXT
);

-- TASKS TABLE
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    points INTEGER DEFAULT 0,
    city TEXT,
    state TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL
);

-- DONATIONS TABLE
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    quantity TEXT,
    amount DECIMAL(10,2),
    status TEXT CHECK (status IN ('available', 'pledged', 'collected', 'delivered')),
    pickup_city TEXT,
    pickup_state TEXT,
    pickup_address TEXT,
    visiting_time TEXT,
    available_time TEXT,
    ngo_name TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable
    image_url TEXT
);

-- 3. INSERT DEMO USERS (Fixed UUIDs for consistency)
INSERT INTO users (id, email, password, role, full_name, phone, state, city, points) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@ngo.org', 'pass', 'NGO', 'Aditi Rao', '9000000001', 'Maharashtra', 'Mumbai', 120),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'rahul@volunteer.com', 'pass', 'Volunteer', 'Rahul Sharma', '9000000002', 'Delhi', 'New Delhi', 350),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'priya@donor.com', 'pass', 'Donor', 'Priya Verma', '9000000003', 'Karnataka', 'Bangalore', 50),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'amit.patel@ex.com', 'pass', 'Volunteer', 'Amit Patel', '9000000004', 'Gujarat', 'Ahmedabad', 100),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'sara.khan@ex.com', 'pass', 'Donor', 'Sara Khan', '9000000005', 'Maharashtra', 'Mumbai', 150);

-- 4. INSERT DATA

-- Reports
INSERT INTO reports (user_id, type, description, urgency, status, state, city, latitude, longitude, address, image_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Flood Alert', 'Yamuna water level rising', 'critical', 'verified', 'Delhi', 'Delhi', 28.7041, 77.1025, 'ITO Bridge Area, Delhi', 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Medical Camp', 'Medicine shortage in Sabarmati area', 'high', 'verified', 'Gujarat', 'Ahmedabad', 23.0225, 72.5714, 'Sabarmati Slums, Ahmedabad', 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Cyclone Relief', 'Coastal protection needed', 'high', 'verified', 'Maharashtra', 'Mumbai', 19.0760, 72.8777, 'Dharavi Sector 5, Mumbai', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80');

-- Needs
INSERT INTO needs (user_id, title, category, quantity, urgency, status, state, city) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Blankets', 'Clothes', '500', 'high', 'active', 'Delhi', 'Delhi'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Tarpaulins', 'Shelter', '200', 'critical', 'active', 'Maharashtra', 'Mumbai');

-- Donations
INSERT INTO donations (user_id, title, description, category, quantity, status, pickup_city, pickup_state, ngo_name, visiting_time, image_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Ration Boxes', 'Rice, Dal and Oil for 10 families', 'Food', '10 Boxes', 'available', 'Mumbai', 'Maharashtra', 'Helping Hands NGO', '10 AM - 4 PM', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Winter Jackets', 'New jackets for children', 'Clothes', '25 Units', 'available', 'Bangalore', 'Karnataka', 'Care India', '11 AM - 6 PM', 'https://images.unsplash.com/photo-1551488831-00ddcb2c60bf?auto=format&fit=crop&w=800&q=80');

-- Tasks
INSERT INTO tasks (title, description, status, priority, points, city, state, deadline, assigned_to) VALUES 
('Distribute Blankets', 'Night drive for homeless', 'pending', 'high', 100, 'Delhi', 'Delhi', NOW() + INTERVAL '2 days', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');

-- 5. STORAGE POLICIES (RUN THESE TO FIX IMAGE UPLOAD ERRORS)
-- Run these one by one if they fail together

-- Enable Public Access for the 'reports' bucket
-- Note: Make sure the bucket 'reports' is created in the UI first!
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload to 'reports'
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'reports');

-- Allow anyone to view 'reports'
DROP POLICY IF EXISTS "Public View" ON storage.objects;
CREATE POLICY "Public View" ON storage.objects 
FOR SELECT USING (bucket_id = 'reports');

-- 6. DISABLE RLS FOR ALL TABLES (CRITICAL FOR DEMO TO WORK WITHOUT AUTH COMPLICATIONS)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE needs DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

