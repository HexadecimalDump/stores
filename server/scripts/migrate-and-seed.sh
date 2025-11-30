#!/bin/sh

# Conditionally run migrations if the environment variable is set
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    # Adjust this command if your migration script is different
    npm run migration:run
    if [ $? -ne 0 ]; then
        echo "Migrations failed to run. Exiting."
        exit 1
    fi
    echo "Migrations complete."
fi

# Execute the main command passed to the container (the CMD in the Dockerfile)
exec "$@"
