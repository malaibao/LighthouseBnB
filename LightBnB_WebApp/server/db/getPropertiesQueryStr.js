const getPropertiesQueryStr = (options, limit) => {
  const queryVal = [];
  let queryStr = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id`;

  // Check if options obj contains city
  if (options.city) {
    queryVal.push(`%${options.city}%`);
    queryStr += `
    WHERE city LIKE $${queryVal.length} `;
  }

  // Check if option obj contains owner_id
  if (options.owner_id) {
    queryVal.push(options.owner_id);
    if (queryStr.includes('WHERE')) {
      queryStr += `AND properties.owner_id=$${queryVal.length}`;
    } else {
      queryStr += `
    WHERE properties.owner_id=$${queryVal.length}`;
    }
  }

  // Check if option obj contains minimum_price_night and maximum_price_night
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryVal.push(
      options.minimum_price_per_night,
      options.maximum_price_per_night
    );
    if (queryStr.includes('WHERE')) {
      queryStr += `AND properties.cost_per_night BETWEEN $${
        queryVal.length - 1
      } AND $${queryVal.length}`;
    } else {
      queryStr += `
        WHERE properties.cost_per_night BETWEEN $${queryVal.length - 1} AND $${
        queryVal.length
      }`;
    }
  }

  // add the GROUP BY clause
  queryStr += `
    GROUP BY properties.id`;

  // Check if options obj contains minimum rating
  if (options.minimum_rating) {
    queryVal.push(options.minimum_rating);
    queryStr += `
    HAVING avg(property_reviews.rating) >= $${queryVal.length}`;
  }

  // Push limit
  queryVal.push(limit);
  queryStr += `
    ORDER BY cost_per_night
    LIMIT $${queryVal.length};
    `;

  return { queryStr, queryVal };
};

module.exports = {
  getPropertiesQueryStr,
};
