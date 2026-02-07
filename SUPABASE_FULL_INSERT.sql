
-- =========================================================================================
-- COMPLETE DEMO DATA (ALL ROLES, IMAGES, REPORTS, TASKS)
-- Run this in Supabase SQL Editor.
-- =========================================================================================

-- Note: We assume the 'public.users' table is already linked to AUTH. But for DEMO PURPOSES, 
-- we can insert "Profile Data" for users that might sign up later, or just mock data to show in Admin Panel.

-- 1. INSERT MOCK USERS (These won't be able to login unless you create Auth accounts with same EMAIL)
-- But they will appear in your "Admin > Users" list if you build one.
INSERT INTO public.users (id, email, name, role)
VALUES 
(gen_random_uuid(), 'admin@ngo.org', 'Aditi Rao (Admin)', 'NGO'),
(gen_random_uuid(), 'rahul@volunteer.com', 'Rahul Sharma', 'Volunteer'),
(gen_random_uuid(), 'priya@donor.com', 'Priya Verma', 'Donor'),
(gen_random_uuid(), 'vikram@volunteer.com', 'Vikram Singh', 'Volunteer'),
(gen_random_uuid(), 'sneha@donor.com', 'Sneha Gupta', 'Donor');


-- 2. INSERT REPORTS (Needy People)
-- Using LOCAL paths/Public URLs relative to your frontend deployment
INSERT INTO public.reports (image_url, description, latitude, longitude, urgency, status)
VALUES
('/demo-images/kids_study.jpg', 'Slum children need basic study materials (notebooks, pencils).', 28.6129, 77.2293, 'low', 'open'),
('/demo-images/homeless.jpg', 'Homeless family with small kids needs winter blankets near Connaught Place.', 28.6328, 77.2197, 'high', 'open'),
('/demo-images/elderly_food.jpg', 'Elderly man living alone needs weekly food ration support.', 28.5677, 77.2433, 'medium', 'verified'),
('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80', 'Group of daily wage workers out of work, need dry ration kits.', 28.6500, 77.2300, 'high', 'resolved');


-- 3. INSERT TASKS (Missions for Volunteers)
INSERT INTO public.tasks (title, description, type, latitude, longitude, points, status)
VALUES 
('Food Pickup at Haldirams', 'Pickup 20 packaged meals and deliver to Shelter A.', 'pickup', 28.6304, 77.2177, 50, 'pending'),
('Medicine Drop: Insulin', 'Urgent insulin delivery to Mrs. Sharma (Senior Citizen).', 'delivery', 28.5685, 77.2408, 100, 'pending'),
('Verify Needy Report #12', 'Go to location and verify if family still needs blankets.', 'verification', 28.6520, 77.1910, 30, 'pending'),
('Teach Math: Weekend Class', 'Volunteer needed to teach basic math to 10 kids at Hope Center.', 'volunteering', 28.5244, 77.1855, 150, 'pending'),
('Stray Dog Feeding Drive', 'Join the team to feed street dogs in Indiranagar sector.', 'volunteering', 28.6400, 77.2200, 20, 'pending');


-- 4. INSERT DONATIONS (Items available from Donors)
INSERT INTO public.donations (title, description, category, quantity, pickup_address, status)
VALUES 
('Rice Bags (5kg)', 'Basmati rice surplus from wedding function.', 'Food', '10 Bags', 'Sector 18, Noida', 'available'),
('School Books (Class 10)', 'Old NCERT books (Maths, Science) for donation.', 'Education', '15 Sets', 'Lajpat Nagar, Delhi', 'available'),
('Men Winter Jackets', 'Size M & L, slightly used but dry cleaned.', 'Clothes', '5 Jackets', 'MG Road, Gurgaon', 'available'),
('Woolen Blankets', 'New blankets for winter drive.', 'Essentials', '50 Pcs', 'Chandni Chowk, Delhi', 'pledged'),
('Leftover Catering Food', 'Dal, Roti, and Rice for 50 people. Fresh.', 'Food', '50 Meals', 'Banquet Hall, Dwarka', 'available');


-- 5. INSERT MESSAGES (Contact Form Inquiries)
INSERT INTO public.messages (firstName, lastName, email, message)
VALUES 
('Rohan', 'Das', 'rohan.d@gmail.com', 'I have a van and can help with bulk food transport on weekends.'),
('Anjali', 'Mehta', 'anjali.m@corporate.com', 'Our company wants to sponsor 100 school kits. Please contact us.'),
('Suresh', 'Raina', 'suresh.r@example.com', 'The map location seems slightly off for my report. Can I edit it?');
