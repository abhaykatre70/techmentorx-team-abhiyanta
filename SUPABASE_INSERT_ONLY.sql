
-- ============================================================
-- INSERT DEMO DATA (INDIAN CONTEXT)
-- Run this in Supabase SQL Editor to populate your app
-- ============================================================

-- 1. INSERT DONATIONS (Available items for pickup)
INSERT INTO public.donations (title, description, category, quantity, pickup_address, status)
VALUES 
('Rice Bags (5kg)', 'Basmati rice surplus from wedding function.', 'Food', '10 Bags', 'Sector 18, Noida', 'available'),
('School Books (Class 10)', 'Old NCERT books (Maths, Science) for donation.', 'Education', '15 Sets', 'Lajpat Nagar, Delhi', 'available'),
('Men Winter Jackets', 'Size M & L, slightly used but dry cleaned.', 'Clothes', '5 Jackets', 'MG Road, Bangalore', 'available'),
('Woolen Blankets', 'New blankets for winter drive.', 'Essentials', '50 Pcs', 'Chandni Chowk, Delhi', 'pledged'),
('Leftover Catering Food', 'Dal, Roti, and Rice for 50 people. Fresh.', 'Food', '50 Meals', 'Banquet Hall, Pune', 'available');

-- 2. INSERT MESSAGES (Contact Form entries)
INSERT INTO public.messages (firstName, lastName, email, message)
VALUES 
('Rahul', 'Sharma', 'rahul.sharma@example.com', 'I want to volunteer for the upcoming food drive in Delhi. How can I join?'),
('Priya', 'Verma', 'priya.v@ngo.org', 'We are an registered NGO "Hope India". We would like to partner with your platform.'),
('Vikram', 'Singh', 'vikram.s@example.com', 'Reported a bug in the mobile view of the dashboard. Please check.');

-- 3. INSERT TASKS (Missions for Volunteers - if table exists)
-- If "tasks" table doesn't exist yet, run the CREATE TABLE script first.
INSERT INTO public.tasks (title, description, type, latitude, longitude, points, status)
VALUES 
('Food Pickup at Connaught Place', 'Pickup 20 meals from Haldirams for distribution.', 'pickup', 28.6304, 77.2177, 50, 'pending'),
('Medicine Delivery to Grandma', 'Deliver insulin to Mrs. Sharma in Lajpat Nagar.', 'delivery', 28.5685, 77.2408, 100, 'pending'),
('Blanket Drive in Karol Bagh', 'Distribute 50 blankets to homeless shelter.', 'verification', 28.6520, 77.1910, 30, 'pending'),
('Teaching Kids at NGO', 'Teach basic math to 10 kids at Hope Foundation, Mumbai.', 'volunteering', 19.0760, 72.8777, 150, 'pending'),
('Stray Dog Feeding', 'Feed street dogs in Indiranagar, Bangalore.', 'volunteering', 12.9716, 77.5946, 20, 'pending');

-- 4. INSERT REPORTS (Needy People - if table exists)
INSERT INTO public.reports (image_url, description, latitude, longitude, urgency, status)
VALUES
('https://images.unsplash.com/photo-1541976844346-a6a8d660f9d1?auto=format&fit=crop&w=800&q=80', 'Slum area kids need notebooks and pencils.', 28.6100, 77.2300, 'low', 'open'),
('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80', 'Homeless family needs winter clothes near Railway Station.', 28.6425, 77.2205, 'high', 'open'),
('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80', 'Elderly man needs food in Sector 18 park.', 28.5700, 77.3200, 'medium', 'verified');
