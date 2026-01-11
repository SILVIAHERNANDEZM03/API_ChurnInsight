# 1. Imagen base con Java 17
FROM eclipse-temurin:17-jdk-jammy

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar el JAR generado
COPY target/*.jar app.jar

# 4. Exponer el puerto de Spring Boot
EXPOSE 8080

# 5. Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
