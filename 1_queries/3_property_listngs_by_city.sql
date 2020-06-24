-- When the users come to our home page, they are going to see a list of properties. They will be able to view the properties and filter them by location. They will be able to see all data about the property, including the average rating.

-- Show all details about properties located in Vancouver including their average rating.

-- Select all columns from the properties table for properties located in Vancouver, and the average rating for each property.
-- Order the results from lowest cost_per_night to highest cost_per_night.
-- Limit the number of results to 10.
-- Only show listings that have a rating >= 4 stars.
-- To build this incrementally, you can start by getting all properties without the average rating first.
-- We're only showing the id, title, start_date, and cost_per_night to save space on the screen

SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
    JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%Vancouver%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;

/* My wrong answer
-- SELECT properties.id, properties.title, properties.cost_per_night, AVG(property_reviews.rating)
-- FROM properties
--     JOIN reservations ON reservations.property_id = properties.id
--     JOIN property_reviews ON property_reviews.property_id = reservations.property_id
-- WHERE city='Vancouver'
-- GROUP BY properties.id, properties.title, properties.cost_per_night
-- HAVING AVG(property_reviews.rating) >= 4
-- LIMIT 10;
*/