-- ============================================================
-- LuxeStay Hotel Management — Full Database Setup Script
-- Run this to create all tables and seed data
-- ============================================================

CREATE DATABASE IF NOT EXISTS `hotel_management`;
USE `hotel_management`;

SET FOREIGN_KEY_CHECKS = 0;

-- ── GUEST ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `guest`;
CREATE TABLE `guest` (
  `guest_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text,
  `id_proof` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`guest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

INSERT INTO `guest` (`guest_id`,`name`,`phone`,`email`,`address`,`id_proof`,`password`) VALUES
(1,'Rahul Sharma','9000000001','rahul@gmail.com','Mumbai, India','Aadhar','$2b$10$687f6da20de59091e67f594827cdee268125feb3aed1c3bad77d0'),
(2,'Priya Patel','9000000002','priya@gmail.com','Ahmedabad, India','Passport','$2b$10$0a8b8dfad3f637d7d30fed7b108c5c5986c4775d14cab26ec9279'),
(3,'Amit Kumar','9000000003','amit@gmail.com','Delhi, India','PAN','$2b$10$1fec7401b302e76333629c9f68415b7718769e072f0613e547261'),
(4,'Neha Verma','9000000004','neha@gmail.com','Pune, India','Aadhar','$2b$10$52bb41e361c045dbae49829780ea82cd2fca3a3fe4ea168aabc0a'),
(9,'Ram','8294805907','ramsds31@gmail.com','rahul@gmail.com','Aadhar','$2b$10$nK68D.4YBbTc9tiApgdDnuihML1RkRO.ZDPQ3B9ayPbmlMEKN58pC');

-- ── HOTEL ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `hotel`;
CREATE TABLE `hotel` (
  `hotel_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  PRIMARY KEY (`hotel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

INSERT INTO `hotel` VALUES
(1,'The Grand Palace','Mumbai, India','+91 22 1234 5678',4.8),
(2,'Sunrise Inn','Delhi, India','+91 11 8765 4321',4.3),
(3,'Blue Lagoon Resort','Goa, India','+91 83 2345 6789',4.6),
(4,'Mountain View Hotel','Shimla, India','+91 17 7654 3210',4.5),
(5,'Heritage Haveli','Jaipur, India','+91 14 1234 5678',4.7),
(6,'Backwater Bliss','Kochi, India','+91 48 4567 8901',4.4);

-- ── ROOM ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_type` varchar(50) DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `availability_status` varchar(20) DEFAULT NULL,
  `hotel_id` int DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`hotel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;

INSERT INTO `room` VALUES
(1,'Single',2000.00,'Available',1),(2,'Single',2100.00,'Booked',1),(3,'Double',3500.00,'Available',1),
(4,'Double',3600.00,'Booked',1),(5,'Suite',6000.00,'Booked',1),(6,'Suite',6500.00,'Available',1),
(7,'Single',1800.00,'Booked',2),(8,'Single',1900.00,'Booked',2),(9,'Double',3200.00,'Booked',2),
(10,'Double',3300.00,'Available',2),(11,'Suite',5500.00,'Booked',2),(12,'Suite',5800.00,'Booked',2),
(13,'Single',1500.00,'Available',3),(14,'Single',1600.00,'Available',3),(15,'Double',2800.00,'Available',3),
(16,'Double',2900.00,'Booked',3),(17,'Suite',5000.00,'Booked',3),(18,'Suite',5200.00,'Available',3),
(19,'Deluxe King',8000.00,'Available',1),(20,'Deluxe Twin',7500.00,'Available',1),
(21,'Suite',15000.00,'Available',1),(22,'Presidential Suite',30000.00,'Available',1),
(23,'Standard Room',6000.00,'Available',2),(24,'Executive Room',9500.00,'Available',2),
(25,'Luxury Suite',18000.00,'Available',2),(26,'Premium Room',9000.00,'Available',3),
(27,'Luxury Suite',20000.00,'Available',3),(28,'Royal Suite',35000.00,'Available',3),
(29,'Premium Room',9000.00,'Available',4),(30,'Luxury Suite',18000.00,'Available',4),
(31,'Royal Suite',32000.00,'Available',4),(32,'Standard Room',6500.00,'Available',5),
(33,'Executive Room',9500.00,'Booked',5),(34,'Suite',16000.00,'Available',5),
(35,'Deluxe Room',7000.00,'Available',6),(36,'Business Suite',12000.00,'Available',6),
(37,'Presidential Suite',28000.00,'Available',6);

-- ── SERVICE ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

INSERT INTO `service` VALUES
(1,'Airport Transfer',1500.00),
(2,'Breakfast',500.00),
(3,'Dinner',800.00),
(4,'Spa & Wellness',2000.00),
(5,'Swimming Pool Access',300.00),
(6,'Gym Access',250.00),
(7,'Room Service',400.00),
(8,'Laundry',350.00),
(9,'City Tour',1200.00),
(10,'Late Checkout',500.00),
(11,'Early Checkin',500.00),
(12,'Extra Bed',800.00),
(13,'Airport Pickup',1200.00),
(14,'Airport Drop',1200.00);

-- ── RESERVATION ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `guest_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `guest_id` (`guest_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`guest_id`) REFERENCES `guest` (`guest_id`) ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

INSERT INTO `reservation` VALUES
(1,1,2,'2026-03-10','2026-03-12','Confirmed',7000.00),
(2,2,5,'2026-03-15','2026-03-18','Pending',9600.00),
(3,3,7,'2026-03-20','2026-03-22','Confirmed',3000.00),
(4,4,10,'2026-03-25','2026-03-28','Confirmed',9900.00),
(5,1,2,'2026-02-02','2026-02-17','Pending',31500.00),
(6,1,1,'2025-03-10','2025-03-12','Confirmed',16000.00),
(7,2,5,'2025-03-15','2025-03-18','Pending',28500.00),
(8,3,8,'2025-04-01','2025-04-03','Confirmed',40000.00),
(9,1,11,'2026-02-20','2026-02-21','Pending',5500.00),
(10,9,2,'2026-02-09','2026-02-27','Pending',37800.00),
(11,9,11,'2026-03-11','2026-03-27','Pending',94500.00),
(12,9,33,'2026-02-10','2026-02-13','Confirmed',28500.00),
(13,9,2,'2026-03-20','2026-03-31','Confirmed',23100.00),
(14,9,8,'2026-02-10','2026-02-13','Confirmed',5700.00),
(15,9,7,'2026-02-09','2026-02-09','Confirmed',0.00),
(16,9,11,'2026-02-09','2026-02-10','Confirmed',8800.00);

-- ── PAYMENT ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(30) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `reservation` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

INSERT INTO `payment` VALUES
(1,1,7000.00,'Credit Card','Paid','2026-03-09'),
(2,2,9600.00,'UPI','Pending','2026-03-14'),
(3,3,3000.00,'Cash','Paid','2026-03-19'),
(4,4,9900.00,'Debit Card','Paid','2026-03-24'),
(5,6,16000.00,'UPI','Completed','2025-03-01'),
(6,7,28500.00,'Card','Pending','2025-03-05'),
(7,8,40000.00,'Cash','Completed','2025-03-08'),
(8,10,37800.00,'UPI','Completed','2026-02-08'),
(9,12,28500.00,'Card','Completed','2026-02-08'),
(10,13,23100.00,'Card','Completed','2026-02-08'),
(11,14,5700.00,'Card','Completed','2026-02-08'),
(12,15,0.00,'Card','Completed','2026-02-08'),
(13,16,8800.00,'UPI','Completed','2026-02-08');

-- ── BOOKING_SERVICES ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `booking_services`;
CREATE TABLE `booking_services` (
  `booking_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`booking_id`,`service_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `reservation` (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `booking_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `booking_services` VALUES
(1,1),(3,1),(1,2),(11,2),(2,3),(10,3),(2,4),(10,4),(11,4),(10,5),(3,6),(11,8),(11,9),(11,10),(16,13),(16,14);

-- ── STAFF ──────────────────────────────────────────────────
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `shift` varchar(20) DEFAULT NULL,
  `hotel_id` int DEFAULT NULL,
  PRIMARY KEY (`staff_id`),
  KEY `hotel_id` (`hotel_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`hotel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

INSERT INTO `staff` VALUES
(1,'Ramesh','Manager',45000.00,'Morning',1),
(2,'Suresh','Receptionist',22000.00,'Night',1),
(3,'Anita','Housekeeping',18000.00,'Morning',2),
(4,'Vikas','Chef',30000.00,'Evening',3);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database setup complete!' AS status;
