package com.example.productmanagement.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Configure ModelMapper settings
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT) // Strict matching for field names
                .setSkipNullEnabled(true) // Skip null values when mapping
                .setAmbiguityIgnored(true); // Ignore ambiguous mappings
        
        return modelMapper;
    }
}
