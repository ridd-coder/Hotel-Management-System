-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_management
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_type` varchar(50) DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `availability_status` varchar(20) DEFAULT NULL,
  `hotel_id` int DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`hotel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'Single',2000.00,'Available',1),(2,'Single',2100.00,'Booked',1),(3,'Double',3500.00,'Available',1),(4,'Double',3600.00,'Booked',1),(5,'Suite',6000.00,'Booked',1),(6,'Suite',6500.00,'Available',1),(7,'Single',1800.00,'Booked',2),(8,'Single',1900.00,'Booked',2),(9,'Double',3200.00,'Booked',2),(10,'Double',3300.00,'Available',2),(11,'Suite',5500.00,'Booked',2),(12,'Suite',5800.00,'Booked',2),(13,'Single',1500.00,'Available',3),(14,'Single',1600.00,'Available',3),(15,'Double',2800.00,'Available',3),(16,'Double',2900.00,'Booked',3),(17,'Suite',5000.00,'Booked',3),(18,'Suite',5200.00,'Available',3),(19,'Deluxe King',8000.00,'Available',1),(20,'Deluxe Twin',7500.00,'Available',1),(21,'Suite',15000.00,'Available',1),(22,'Presidential Suite',30000.00,'Available',1),(23,'Standard Room',6000.00,'Available',2),(24,'Executive Room',9500.00,'Available',2),(25,'Luxury Suite',18000.00,'Available',2),(26,'Premium Room',9000.00,'Available',3),(27,'Luxury Suite',20000.00,'Available',3),(28,'Royal Suite',35000.00,'Available',3),(29,'Premium Room',9000.00,'Available',4),(30,'Luxury Suite',18000.00,'Available',4),(31,'Royal Suite',32000.00,'Available',4),(32,'Standard Room',6500.00,'Available',5),(33,'Executive Room',9500.00,'Booked',5),(34,'Suite',16000.00,'Available',5),(35,'Deluxe Room',7000.00,'Available',6),(36,'Business Suite',12000.00,'Available',6),(37,'Presidential Suite',28000.00,'Available',6);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 18:53:26
