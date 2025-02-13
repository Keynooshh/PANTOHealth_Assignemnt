// Connect to the MongoDB instance
db = db.getSiblingDB("x-ray-collection");

// Create the 'signals' collection
db.createCollection("signals");

// Create the 'x-ray-data' collection
db.createCollection("x-ray-data");

// Log success
print(
  'Database "x-ray-collection" and collections "signals" and "x-ray-data" created successfully.'
);
