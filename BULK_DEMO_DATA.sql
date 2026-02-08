-- 🚀 MASSIVE BULK DEMO DATA GENERATOR (100+ records for each)
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. CLEANUP PREVIOUS DATA (Optional but recommended for consistency)
TRUNCATE TABLE donations, tasks, reports, needs, notifications, users RESTART IDENTITY CASCADE;

-- 2. GENERATE 100+ USERS (NGOs, Volunteers, Donors)
-- Using a DO block to generate users with unique IDs
DO $$
DECLARE
    i INTEGER;
    role_type TEXT;
    email_addr TEXT;
    state_name TEXT;
    city_name TEXT;
    states TEXT[] := ARRAY['Delhi', 'Maharashtra', 'Karnataka', 'Gujarat', 'West Bengal', 'Tamil Nadu', 'Telangana', 'Rajasthan', 'Uttar Pradesh'];
    cities TEXT[] := ARRAY['New Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad', 'Kolkata', 'Chennai', 'Hyderabad', 'Jaipur', 'Lucknow'];
    roles TEXT[] := ARRAY['NGO', 'Volunteer', 'Donor', 'Beneficiary'];
BEGIN
    FOR i IN 1..120 LOOP
        role_type := roles[1 + (i % 4)];
        email_addr := 'user' || i || '@example.com';
        state_name := states[1 + (i % 9)];
        city_name := cities[1 + (i % 9)];
        
        INSERT INTO users (id, email, password, role, full_name, phone, state, city, points)
        VALUES (
            gen_random_uuid(),
            email_addr,
            'pass123',
            role_type,
            CASE 
                WHEN role_type = 'NGO' THEN 'NGO ' || city_name || ' Relief ' || i
                WHEN role_type = 'Volunteer' THEN 'Volunteer ' || i
                WHEN role_type = 'Donor' THEN 'Donor ' || i
                ELSE 'Beneficiary ' || i
            END,
            '9' || LPAD(i::text, 9, '0'),
            state_name,
            city_name,
            floor(random() * 500)
        );
    END LOOP;
END $$;

-- 3. GENERATE 100+ REPORTS
DO $$
DECLARE
    i INTEGER;
    u_id UUID;
    cat TEXT;
    urg TEXT;
    state_name TEXT;
    city_name TEXT;
    states TEXT[] := ARRAY['Delhi', 'Maharashtra', 'Karnataka', 'Gujarat', 'West Bengal', 'Tamil Nadu', 'Telangana', 'Rajasthan', 'Uttar Pradesh'];
    cities TEXT[] := ARRAY['New Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad', 'Kolkata', 'Chennai', 'Hyderabad', 'Jaipur', 'Lucknow'];
    cats TEXT[] := ARRAY['Emergency', 'Medical', 'Food', 'Shelter', 'Water'];
    urgs TEXT[] := ARRAY['critical', 'high', 'medium', 'low'];
BEGIN
    FOR i IN 1..150 LOOP
        -- Select a random user
        SELECT id INTO u_id FROM users ORDER BY random() LIMIT 1;
        state_name := states[1 + (i % 9)];
        city_name := cities[1 + (i % 9)];
        cat := cats[1 + (i % 5)];
        urg := urgs[1 + (i % 4)];
        
        INSERT INTO reports (user_id, type, description, category, urgency, status, state, city, address, latitude, longitude, image_url)
        VALUES (
            u_id,
            cat || ' Request ' || i,
            'Generic ' || cat || ' situation in ' || city_name || '. Immediate attention required.',
            cat,
            urg,
            'verified',
            state_name,
            city_name,
            i || ' Main Street, ' || city_name,
            20 + (random() * 10), -- Random India-ish lat
            70 + (random() * 15), -- Random India-ish long
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
        );
    END LOOP;
END $$;

-- 4. GENERATE 100+ DONATIONS
DO $$
DECLARE
    i INTEGER;
    u_id UUID;
    cat TEXT;
    state_name TEXT;
    city_name TEXT;
    ngo_val TEXT;
    states TEXT[] := ARRAY['Delhi', 'Maharashtra', 'Karnataka', 'Gujarat', 'West Bengal', 'Tamil Nadu', 'Telangana', 'Rajasthan', 'Uttar Pradesh'];
    cities TEXT[] := ARRAY['New Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad', 'Kolkata', 'Chennai', 'Hyderabad', 'Jaipur', 'Lucknow'];
    cats TEXT[] := ARRAY['Food', 'Clothes', 'Medical', 'Stationary', 'Shelter'];
BEGIN
    -- Get some NGOs
    FOR i IN 1..130 LOOP
        SELECT id INTO u_id FROM users WHERE role = 'Donor' ORDER BY random() LIMIT 1;
        SELECT full_name INTO ngo_val FROM users WHERE role = 'NGO' ORDER BY random() LIMIT 1;
        state_name := states[1 + (i % 9)];
        city_name := cities[1 + (i % 9)];
        cat := cats[1 + (i % 5)];
        
        INSERT INTO donations (user_id, title, description, category, quantity, status, pickup_city, pickup_state, pickup_address, ngo_name, visiting_time, amount, image_url)
        VALUES (
            u_id,
            cat || ' Donation ' || i,
            'Generous contribution of ' || cat || ' for those in need.',
            cat,
            (floor(random() * 50) + 10) || ' Units',
            'available',
            city_name,
            state_name,
            'Pickup point ' || i || ', ' || city_name,
            ngo_val,
            '10 AM - 6 PM',
            CASE WHEN random() > 0.7 THEN floor(random() * 5000) ELSE NULL END,
            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
        );
    END LOOP;
END $$;

-- 5. GENERATE 100+ TASKS
DO $$
DECLARE
    i INTEGER;
    vol_id UUID;
    state_name TEXT;
    city_name TEXT;
    states TEXT[] := ARRAY['Delhi', 'Maharashtra', 'Karnataka', 'Gujarat', 'West Bengal', 'Tamil Nadu', 'Telangana', 'Rajasthan', 'Uttar Pradesh'];
    cities TEXT[] := ARRAY['New Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad', 'Kolkata', 'Chennai', 'Hyderabad', 'Jaipur', 'Lucknow'];
BEGIN
    FOR i IN 1..110 LOOP
        SELECT id INTO vol_id FROM users WHERE role = 'Volunteer' ORDER BY random() LIMIT 1;
        state_name := states[1 + (i % 9)];
        city_name := cities[1 + (i % 9)];
        
        INSERT INTO tasks (title, description, status, priority, points, city, state, deadline, assigned_to)
        VALUES (
            'Relief Mission ' || i,
            'Coordinate distribution in ' || city_name,
            'pending',
            CASE WHEN i % 3 = 0 THEN 'urgent' WHEN i % 3 = 1 THEN 'high' ELSE 'medium' END,
            floor(random() * 200) + 50,
            city_name,
            state_name,
            NOW() + (random() * interval '7 days'),
            vol_id
        );
    END LOOP;
END $$;

-- 6. ADD SOME REAL TEST USERS FOR THE USER TO LOGIN
-- Delete if they already exist from the loop
DELETE FROM users WHERE email IN ('admin@ngo.org', 'rahul@volunteer.com', 'priya@donor.com');

INSERT INTO users (id, email, password, role, full_name, phone, state, city, points) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@ngo.org', 'pass', 'NGO', 'Aditi Rao (NGO Admin)', '9000000001', 'Maharashtra', 'Mumbai', 120),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'rahul@volunteer.com', 'pass', 'Volunteer', 'Rahul Sharma', '9000000002', 'Delhi', 'New Delhi', 350),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'priya@donor.com', 'pass', 'Donor', 'Priya Verma', '9000000003', 'Karnataka', 'Bangalore', 50);

-- 8. ADD SPECIFIC NGOs FOR DIFFERENT CITIES (For Testing Filtering)
INSERT INTO users (id, email, password, role, full_name, phone, state, city, points) VALUES
(gen_random_uuid(), 'mumbai.relief@ngo.org', 'pass123', 'NGO', 'Mumbai Relief Task Force', '9820012345', 'Maharashtra', 'Mumbai', 450),
(gen_random_uuid(), 'delhi.care@ngo.org', 'pass123', 'NGO', 'Delhi Care Foundation', '9810054321', 'Delhi', 'New Delhi', 380),
(gen_random_uuid(), 'bangalore.help@ngo.org', 'pass123', 'NGO', 'Bangalore Help NGO', '9845098765', 'Karnataka', 'Bangalore', 520);

-- 9. FINAL RLS DISABLE (VITAL)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE needs DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- 10. ENSURE STORAGE BUCKET IS PUBLIC
-- (Wait: Supabase requires bucket names to be unique globally? No, only per project)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Public View" ON storage.objects;
CREATE POLICY "Public View" ON storage.objects FOR SELECT USING (bucket_id = 'reports');

