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
-- Table structure for table `guest`
--

DROP TABLE IF EXISTS `guest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest` (
  `guest_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text,
  `id_proof` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`guest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest`
--

LOCK TABLES `guest` WRITE;
/*!40000 ALTER TABLE `guest` DISABLE KEYS */;
INSERT INTO `guest` VALUES (1,'Rahul Sharma','9000000001','rahul@gmail.com','Mumbai, India','Aadhar','$2b$10$687f6da20de59091e67f594827cdee268125feb3aed1c3bad77d0'),(2,'Priya Patel','9000000002','priya@gmail.com','Ahmedabad, India','Passport','$2b$10$0a8b8dfad3f637d7d30fed7b108c5c5986c4775d14cab26ec9279'),(3,'Amit Kumar','9000000003','amit@gmail.com','Delhi, India','PAN','$2b$10$1fec7401b302e76333629c9f68415b7718769e072f0613e547261'),(4,'Neha Verma','9000000004','neha@gmail.com','Pune, India','Aadhar','$2b$10$52bb41e361c045dbae49829780ea82cd2fca3a3fe4ea168aabc0a'),(5,'Amit Sharma','9876543211','amit@example.com','Delhi','Aadhar123','$2b$10$1fec7401b302e76333629c9f68415b7718769e072f0613e547261'),(6,'Neha Verma','9876543212','neha@example.com','Mumbai','Passport456','$2b$10$52bb41e361c045dbae49829780ea82cd2fca3a3fe4ea168aabc0a'),(7,'Rohan Patel','9876543213','rohan@example.com','Ahmedabad','Aadhar789','$2b$10$9ebf60103a6b23931c8d4005b99244a80aeef8d61eed08e393924'),(8,'Priya Nair','9876543214','priya@example.com','Kerala','VoterID321','$2b$10$0a8b8dfad3f637d7d30fed7b108c5c5986c4775d14cab26ec9279'),(9,'Ram','8294805907','ramsds31@gmail.com','rahul@gmail.com','Aadhar','$2b$10$nK68D.4YBbTc9tiApgdDnuihML1RkRO.ZDPQ3B9ayPbmlMEKN58pC');
/*!40000 ALTER TABLE `guest` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 18:53:25
