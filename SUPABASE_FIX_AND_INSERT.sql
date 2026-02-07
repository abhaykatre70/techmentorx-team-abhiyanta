
-- =================================================================
-- FIX AND INSERT DEMO DATA
-- This script relaxes constraints to allow Demo Users
-- =================================================================

-- 1. DROP FOREIGN KEY CONSTRAINT on public.users (if it exists)
-- This allows us to insert "Fake Users" that don't exist in Supabase Auth
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. INSERT MOCK USERS
-- We use static UUIDs so we can reference them in Reports/Tasks/Donations
INSERT INTO public.users (id, email, name, role)
VALUES 
('d0c2c0e0-0000-0000-0000-000000000001', 'admin@ngo.org', 'Aditi Rao (Admin)', 'NGO'),
('d0c2c0e0-0000-0000-0000-000000000002', 'rahul@volunteer.com', 'Rahul Sharma', 'Volunteer'),
('d0c2c0e0-0000-0000-0000-000000000003', 'priya@donor.com', 'Priya Verma', 'Donor'),
('d0c2c0e0-0000-0000-0000-000000000004', 'vikram@volunteer.com', 'Vikram Singh', 'Volunteer'),
('d0c2c0e0-0000-0000-0000-000000000005', 'sneha@donor.com', 'Sneha Gupta', 'Donor')
ON CONFLICT (id) DO NOTHING;


-- 3. INSERT REPORTS (Needy People)
-- Linked to 'Priya' (Donor)
INSERT INTO public.reports (reporter_id, image_url, description, latitude, longitude, urgency, status)
VALUES
('d0c2c0e0-0000-0000-0000-000000000003', '/demo-images/kids_study.jpg', 'Slum children need basic study materials (notebooks, pencils).', 28.6129, 77.2293, 'low', 'open'),
('d0c2c0e0-0000-0000-0000-000000000003', '/demo-images/homeless.jpg', 'Homeless family with small kids needs winter blankets near Connaught Place.', 28.6328, 77.2197, 'high', 'open'),
('d0c2c0e0-0000-0000-0000-000000000005', '/demo-images/elderly_food.jpg', 'Elderly man living alone needs weekly food ration support.', 28.5677, 77.2433, 'medium', 'verified'),
('d0c2c0e0-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80', 'Group of daily wage workers out of work, need dry ration kits.', 28.6500, 77.2300, 'high', 'resolved');


-- 4. INSERT TASKS (Missions for Volunteers)
-- Some unassigned, some assigned
INSERT INTO public.tasks (title, description, type, latitude, longitude, points, status, assigned_to)
VALUES 
('Food Pickup at Haldirams', 'Pickup 20 packaged meals and deliver to Shelter A.', 'pickup', 28.6304, 77.2177, 50, 'pending', NULL),
('Medicine Drop: Insulin', 'Urgent insulin delivery to Mrs. Sharma (Senior Citizen).', 'delivery', 28.5685, 77.2408, 100, 'pending', NULL),
('Verify Needy Report #12', 'Go to location and verify if family still needs blankets.', 'verification', 28.6520, 77.1910, 30, 'assigned', 'd0c2c0e0-0000-0000-0000-000000000002'),
('Teach Math: Weekend Class', 'Volunteer needed to teach basic math to 10 kids at Hope Center.', 'volunteering', 28.5244, 77.1855, 150, 'pending', NULL),
('Stray Dog Feeding Drive', 'Join the team to feed street dogs in Indiranagar sector.', 'volunteering', 28.6400, 77.2200, 20, 'pending', NULL);


-- 5. INSERT DONATIONS
-- Linked to Donors
INSERT INTO public.donations (donor_id, title, description, category, quantity, pickup_address, status)
VALUES 
('d0c2c0e0-0000-0000-0000-000000000003', 'Rice Bags (5kg)', 'Basmati rice surplus from wedding function.', 'Food', '10 Bags', 'Sector 18, Noida', 'available'),
('d0c2c0e0-0000-0000-0000-000000000003', 'School Books (Class 10)', 'Old NCERT books (Maths, Science) for donation.', 'Education', '15 Sets', 'Lajpat Nagar, Delhi', 'available'),
('d0c2c0e0-0000-0000-0000-000000000005', 'Men Winter Jackets', 'Size M & L, slightly used but dry cleaned.', 'Clothes', '5 Jackets', 'MG Road, Gurgaon', 'available'),
('d0c2c0e0-0000-0000-0000-000000000005', 'Woolen Blankets', 'New blankets for winter drive.', 'Essentials', '50 Pcs', 'Chandni Chowk, Delhi', 'pledged'),
('d0c2c0e0-0000-0000-0000-000000000003', 'Leftover Catering Food', 'Dal, Roti, and Rice for 50 people. Fresh.', 'Food', '50 Meals', 'Banquet Hall, Dwarka', 'available');


-- 6. INSERT MESSAGES
INSERT INTO public.messages (firstName, lastName, email, message)
VALUES 
('Rohan', 'Das', 'rohan.d@gmail.com', 'I have a van and can help with bulk food transport on weekends.'),
('Anjali', 'Mehta', 'anjali.m@corporate.com', 'Our company wants to sponsor 100 school kits. Please contact us.'),
('Suresh', 'Raina', 'suresh.r@example.com', 'The map location seems slightly off for my report. Can I edit it?');
