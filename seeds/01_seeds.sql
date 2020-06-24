-- Seed users table --
INSERT INTO users
    (name, email, password)
VALUES
    ('John Doe', 'jdoe@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
    ('Ashley Smith', 'asmith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
    ('Octavia Mantle', 'omantle@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
    ('Julian Kennedy', 'jkennedy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
    ('Sue Luna', 'sluna@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
    ('Dominic Parks', 'dparks@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
    ('Etta West', 'ewest@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

-- Seed properties table --
INSERT INTO properties
    (owner_id, title, description, thumbnail_photo_url,cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES
    (1, 'Speed lamp', 'description', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg', 34599, 3, 3, 5, 'Canada', '1000 K.L.O. Road', 'Kelowna', 'British Columbia', 'A3X 6T5'),
    (2, 'Mission Hill', 'description', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg', 29578, 2, 2, 4, 'Canada', '123 Jasmine Road', 'Vancouver', 'British Columbia', 'A9U 6V8'),
    (5, 'Asgard', 'description', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg', 'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg', 15899, 2, 2, 3, 'Canada', '543 Naomi Road', 'Halifax', 'Nova Scotia', 'R6U 2W4');

-- Seed reservations table --
INSERT INTO reservations
    (guest_id, property_id, start_date, end_date)
VALUES
    (1, 2, '2018-09-11', '2018-09-26'),
    (2, 2, '2019-01-04', '2019-02-01'),
    (3, 3, '2021-10-01', '2021-10-14');

-- Seed property_reviews table --
INSERT INTO property_reviews
    (guest_id, property_id, reservation_id, rating, message)
VALUES
    (1, 2, 1, 4, 'messages'),
    (2, 2, 2, 5, 'superb!'),
    (3, 3, 3, 3, 'it is good!');
