package com.example.productmanagement.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadsLocation = Paths.get("uploads");

    public FileStorageService() {
        try {
            // Create uploads directory if it doesn't exist
            Files.createDirectories(uploadsLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    /**
     * Store a file and return its relative path
     */
    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }

            // Generate unique filename to avoid conflicts
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path destinationFile = uploadsLocation.resolve(uniqueFilename);

            // Copy file to destination
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path
            return "uploads/" + uniqueFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    /**
     * Delete a file given its path
     */
    public void deleteFile(String filePath) {
        try {
            if (filePath != null && !filePath.isEmpty()) {
                // Extract just the filename from the path
                String filename = filePath.replace("uploads/", "");
                Path fileToDelete = uploadsLocation.resolve(filename);
                Files.deleteIfExists(fileToDelete);
            }
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete file: " + filePath);
        }
    }
}
