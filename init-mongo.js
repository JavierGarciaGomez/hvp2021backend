print("MONGO_INITDB_ROOT_USERNAME: " + process.env.MONGO_INITDB_ROOT_USERNAME);
print("MONGO_INITDB_ROOT_PASSWORD: " + process.env.MONGO_INITDB_ROOT_PASSWORD);

db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [{ role: "root", db: "admin" }],
});
