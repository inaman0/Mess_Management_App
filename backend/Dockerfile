# Use an official OpenJDK 21 base image
FROM openjdk:21-jdk-slim

# Copy the .jar file into the container
COPY target/travel_app.jar travel_app.jar

# Set environment variables directly
ENV DB_SERVER=172.16.202.128
ENV DB_PORT=23019

# Expose the port your application will run on (adjust if necessary)
EXPOSE 8082

# Command to run the .jar file when the container starts
CMD ["java", "-jar", "travel_app.jar"]
