#!/bin/bash
# steps to execute:
# chmod +x scripts/copy-prod-to-dev.sh
# ./scripts/copy-prod-to-dev.sh

# Define the production and development database URLs correctly
PROD_MONGO_URL="mongodb+srv://user:x96YNidVG8yTKrW@cluster0.ihrvp.mongodb.net/hvp"
DEV_MONGO_URL="mongodb://mongo-user:123456@localhost:27018/hvp-test"

# Dump the production database
echo "Dumping production database: $PROD_MONGO_URL"
mongodump --uri="$PROD_MONGO_URL" --out=./dump --db=hvp

if [ $? -ne 0 ]; then
    echo "Error: Failed to dump production database"
    exit 1
fi

# Optionally drop the development database before restoring
echo "Dropping development database: hvp-test"
mongosh hvp-test --eval "db.dropDatabase()"

# Restore the dump to the development database with --drop option
echo "Restoring to development database: $DEV_MONGO_URL"
mongorestore --uri="$DEV_MONGO_URL" --drop --authenticationDatabase=admin --nsInclude=hvp.* ./dump/hvp --noIndexRestore

if [ $? -ne 0 ]; then
    echo "Error: Failed to restore data to development database"
    exit 1
fi

# Clean up dump folder (optional)
echo "Cleaning up dump folder..."
rm -rf ./dump

echo "Database copy from production to development completed successfully."