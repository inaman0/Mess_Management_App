#!/bin/bash

# Stop and remove the existing container if it exists
docker stop travel_app_backend
docker rm travel_app_backend

# Rebuild the Docker image
docker build -t travel_app_backend .

# Run the new container
docker run -d -p 8082:8081 --name travel_app_backend travel_app_backend

echo "Container restarted successfully."
