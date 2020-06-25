const { getPropertiesQueryStr } = require('./getPropertiesQueryStr');
const reservationsPropertiesHelper = (pool) => {
  /// Reservation
  /**
   * Get all reservations for a single user.
   * @param {string} guest_id The id of the user.
   * @return {Promise<[{}]>} A promise to the reservations.
   */
  const getAllReservations = function (guest_id, limit = 10) {
    const queryStr = `
    SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
        JOIN reservations ON reservations.property_id = properties.id
        JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1 AND
        now()::date > end_date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`;
    return pool.query(queryStr, [guest_id, limit]).then((dbRes) => {
      console.log(dbRes.rows);
      return dbRes.rows;
    });
  };

  /// Properties
  /**
   * Get all properties.
   * @param {{}} options An object containing query options.
   * @param {*} limit The number of results to return.
   * @return {Promise<[{}]>}  A promise to the properties.
   */
  const getAllProperties = function (options, limit = 10) {
    const queryObj = getPropertiesQueryStr(options, limit); // from getPropertiesQueryStr.js

    return pool
      .query(queryObj.queryStr, queryObj.queryVal)
      .then((dbRes) => dbRes.rows);
  };

  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  const addProperty = function (property) {
    const queryVal = [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
      property.country,
      property.street,
      property.city,
      property.province,
      property.post_code,
    ];
    const queryStr = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url,cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;

    return pool.query(queryStr, queryVal).then((dbRes) => {
      console.log(dbRes.rows);
      return dbRes.rows[0];
    });
  };

  return { getAllReservations, getAllProperties, addProperty };
};

module.exports = reservationsPropertiesHelper;
