package com.example.productmanagement.repository;

import com.example.productmanagement.model.HeroImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroImageRepository extends JpaRepository<HeroImage, Integer> {
    List<HeroImage> findByActiveTrueOrderByDisplayOrderAsc();
}
