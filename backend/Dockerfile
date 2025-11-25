FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables (override in docker-compose)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/lapGalaxy?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=1234

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
