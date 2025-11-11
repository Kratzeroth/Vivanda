<<<<<<< HEAD
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vivanda
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id_banner` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) DEFAULT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_banner`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Descuento en toda la tienda','images/banners/offert1.png',1,'2025-11-02 18:30:26'),(2,'Descuentos en audífonos','images/banners/offert2.png',1,'2025-11-02 18:30:26'),(3,'50% off en smartphones y tablets','images/banners/offert3.png',1,'2025-11-02 18:30:26'),(7,'50% prueba','images/banners/6907ae4dc104c.jpg',0,'2025-11-02 19:13:23');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_carrito`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,2,'2025-09-23 21:02:01'),(2,5,'2025-09-24 05:22:28'),(3,6,'2025-10-23 01:38:36');
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_detalle`
--

DROP TABLE IF EXISTS `carrito_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_detalle` (
  `id_carrito` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  PRIMARY KEY (`id_carrito`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `carrito_detalle_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`),
  CONSTRAINT `carrito_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_detalle`
--

LOCK TABLES `carrito_detalle` WRITE;
/*!40000 ALTER TABLE `carrito_detalle` DISABLE KEYS */;
INSERT INTO `carrito_detalle` VALUES (1,3,1),(2,11,3),(2,25,2);
/*!40000 ALTER TABLE `carrito_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Frutas y Verduras','Frutas y verduras frescas de temporada','images/categorias/frutas.png'),(2,'Carnes, Aves y Pescados','Variedad de carnes, aves y pescados frescos','images/categorias/carnes.png'),(3,'Desayunos','Cereales, avenas, mantequillas y más para tu desayuno','images/categorias/desayunos.png'),(4,'Lácteos y Huevos','Leche, yogures, quesos y huevos frescos','images/categorias/lacteos.png'),(5,'Quesos y Fiambres','Quesos madurados y embutidos selectos','images/categorias/quesos.png'),(6,'Abarrotes','Arroz, fideos, aceites y productos básicos','images/categorias/abarrotes.png'),(7,'Panadería y Pastelería','Pan fresco, tortas y postres','images/categorias/panaderia.png'),(8,'Pollo Rostizado y Comidas Preparadas','Pollos a la brasa y platos listos para llevar','images/categorias/pollo.png'),(9,'Congelados','Verduras, carnes y comidas congeladas','images/categorias/congelados.png'),(10,'Bebidas','Jugos, gaseosas y aguas embotelladas','images/categorias/bebidas.png'),(11,'Vinos y Licores','Vinos, cervezas y bebidas alcohólicas','images/categorias/vinos.png'),(12,'Limpieza','Productos de limpieza para el hogar','images/categorias/limpieza.png'),(13,'Cuidado Personal y Salud','Artículos de higiene y cuidado personal','images/categorias/cuidado.png'),(14,'Cuidado del Bebé','Pañales, fórmulas y accesorios para el bebé','images/categorias/bebe.png'),(15,'Mascotas','Alimentos y accesorios para mascotas','images/categorias/mascotas.png'),(16,'Tecnología','Laptops, smartphones y más dispositivos','images/categorias/tecnologia.png'),(17,'Electrohogar','Electrodomésticos grandes y pequeños','images/categorias/electrohogar.png'),(18,'Muebles','Muebles para sala, comedor y más','images/categorias/muebles.png'),(19,'Dormitorio','Camas, colchones y accesorios de descanso','images/categorias/dormitorio.png'),(20,'Decohogar','Decoración y accesorios para el hogar','images/categorias/decohogar.png'),(21,'Juguetes y Juegos','Juguetes educativos y de entretenimiento','images/categorias/juguetes.png'),(22,'Deportes','Artículos y accesorios deportivos','images/categorias/deportes.png'),(23,'Bebé e Infantil','Juguetes, muebles y productos infantiles','images/categorias/bebe_infantil.png'),(24,'Belleza','Cosméticos, maquillaje y cuidado personal','images/categorias/belleza.png'),(25,'Librería y Oficina','Útiles escolares y de oficina','images/categorias/libreria.png'),(26,'Automotriz','Accesorios y productos para tu auto','images/categorias/auto.png'),(27,'Mejoramiento del Hogar','Herramientas y materiales para mejoras','images/categorias/hogar.png');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_logs`
--

DROP TABLE IF EXISTS `chatbot_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbot_logs` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `pregunta` text DEFAULT NULL,
  `respuesta` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `chatbot_logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_logs`
--

LOCK TABLES `chatbot_logs` WRITE;
/*!40000 ALTER TABLE `chatbot_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatbot_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_cliente_usuario` (`id_usuario`),
  CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Andrea','Sanchez','924582277','andrea12@gmail.com','2025-09-12 02:39:27',3),(3,'Rafael','Dominguez','923974159','rafad@gmail.com','2025-09-12 02:47:00',4),(4,'Diego','Tataje','957842658','diegot1@gmail.com','2025-09-24 05:22:04',5),(5,'Elias','Urbano','906497249','ursam26@gmail.com','2025-09-25 19:20:57',6);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `canal` enum('web','redes_sociales','tienda_fisica') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_compra`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,1,'tienda_fisica',120.50,'Compra de productos materno-infantiles; incluye leche orgánica y pañales en promoción.','2025-09-12 03:17:57');
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credenciales`
--

DROP TABLE IF EXISTS `credenciales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credenciales` (
  `id_credencial` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_credencial`),
  UNIQUE KEY `username` (`username`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `credenciales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credenciales`
--

LOCK TABLES `credenciales` WRITE;
/*!40000 ALTER TABLE `credenciales` DISABLE KEYS */;
INSERT INTO `credenciales` VALUES (1,1,'elias_admin','$2y$10$OYWlzk6KDZTWs//Pj1ovjeHrWQrvBcsMYgF36RM94iOuZgqW0Ykqi',1),(2,2,'pepe1','$2y$10$EYdT3aIYjVUoB2iZaZOpD./6wXcqq6WBrK2F.gjBp6pTJZPE2WrBG',1),(3,3,'andrea12','$2y$10$VNkIU.xP/k59oNJZbyyLeefiGF1FvKh7H4v8rgWjUXZosCs.z3yrS',1),(4,4,'rafad','$2y$10$MypPRYBLNeFMnlkjqKAGR.u9Fu6o/zUHz8Ywyoi0yC2jgN9AHzW5i',1),(5,5,'diegot1','$2y$10$lTQKo47vKDf.Xf77KssbaO19I.QNsIvUQXe5918xl6nYEo2mbpiqu',1),(6,6,'ursam26','$2y$10$g.RvB/iyiwOdeHvDtE2jf.c6ID2N0WUNEReimM2JxJ5/jfVdE8QC2',1);
/*!40000 ALTER TABLE `credenciales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_favorito`),
  UNIQUE KEY `unique_favorito` (`id_usuario`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (62,6,2,'2025-11-02 00:10:56');
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_registros`
--

DROP TABLE IF EXISTS `historial_registros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_registros` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historial`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historial_registros_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_registros`
--

LOCK TABLES `historial_registros` WRITE;
/*!40000 ALTER TABLE `historial_registros` DISABLE KEYS */;
INSERT INTO `historial_registros` VALUES (1,2,'registro','Usuario registrado en el sistema','2025-09-12 02:03:53'),(2,2,'login','Inicio de sesión exitoso','2025-09-12 02:04:09'),(3,1,'login','Inicio de sesión exitoso','2025-09-12 02:04:25'),(4,1,'login','Inicio de sesión exitoso','2025-09-12 02:17:03'),(5,1,'login','Inicio de sesión exitoso','2025-09-12 02:17:54'),(6,2,'login','Inicio de sesión exitoso','2025-09-12 02:18:08'),(7,1,'login','Inicio de sesión exitoso','2025-09-12 02:18:56'),(8,1,'registro_cliente','El administrador registró al cliente con correo: andrea12@gmail.com','2025-09-12 02:39:27'),(9,3,'registro','Usuario registrado en el sistema','2025-09-12 02:41:33'),(10,1,'login','Inicio de sesión exitoso','2025-09-12 02:45:27'),(11,1,'registro_cliente','El administrador registró al cliente con correo: vazquesj@gmail.com','2025-09-12 02:46:04'),(12,4,'registro','Usuario registrado en el sistema','2025-09-12 02:47:00'),(13,1,'login','Inicio de sesión exitoso','2025-09-12 02:57:25'),(14,1,'registro_compra','El administrador registró una compra para el cliente 1 en canal tienda_fisica','2025-09-12 03:17:57'),(15,1,'login','Inicio de sesión exitoso','2025-09-19 02:11:49'),(16,2,'login','Inicio de sesión exitoso','2025-09-19 02:12:13'),(17,1,'login','Inicio de sesión exitoso','2025-09-19 02:18:21'),(18,2,'login','Inicio de sesión exitoso','2025-09-19 02:32:43'),(19,1,'login','Inicio de sesión exitoso','2025-09-22 22:09:30'),(20,2,'login','Inicio de sesión exitoso','2025-09-22 22:09:37'),(21,2,'login','Inicio de sesión exitoso','2025-09-22 22:39:09'),(22,3,'login_fallido','Credenciales inválidas','2025-09-22 22:39:46'),(23,3,'login_fallido','Credenciales inválidas','2025-09-22 22:39:48'),(24,3,'login_fallido','Credenciales inválidas','2025-09-22 22:39:51'),(25,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:09'),(26,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:12'),(27,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:14'),(28,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:17'),(29,2,'login','Inicio de sesión exitoso','2025-09-22 22:40:28'),(30,2,'login','Inicio de sesión exitoso','2025-09-23 17:53:06'),(31,2,'login','Inicio de sesión exitoso','2025-09-23 17:59:51'),(32,2,'login','Inicio de sesión exitoso','2025-09-23 20:01:05'),(33,2,'login','Inicio de sesión exitoso','2025-09-23 20:06:39'),(34,2,'login','Inicio de sesión exitoso','2025-09-23 20:10:47'),(35,2,'login','Inicio de sesión exitoso','2025-09-23 20:23:28'),(36,2,'login','Inicio de sesión exitoso','2025-09-23 20:29:04'),(37,2,'login','Inicio de sesión exitoso','2025-09-23 20:33:34'),(38,2,'login','Inicio de sesión exitoso','2025-09-23 21:22:48'),(39,2,'login','Inicio de sesión exitoso','2025-09-23 21:40:05'),(40,2,'login','Inicio de sesión exitoso','2025-09-24 00:18:42'),(41,5,'registro','Usuario registrado en el sistema','2025-09-24 05:22:04'),(42,5,'login','Inicio de sesión exitoso','2025-09-24 05:22:16'),(43,5,'login_fallido','Credenciales inválidas','2025-09-25 18:06:01'),(44,5,'login','Inicio de sesión exitoso','2025-09-25 18:06:11'),(45,5,'login','Inicio de sesión exitoso','2025-09-25 18:22:29'),(46,5,'login','Inicio de sesión exitoso','2025-09-25 18:36:05'),(47,6,'registro','Usuario registrado en el sistema','2025-09-25 19:20:57'),(48,5,'login','Inicio de sesión exitoso','2025-09-25 19:37:42'),(49,5,'login','Inicio de sesión exitoso','2025-09-25 19:39:33'),(50,5,'login','Inicio de sesión exitoso','2025-09-25 19:45:01'),(51,5,'login','Inicio de sesión exitoso','2025-09-25 19:45:50'),(52,5,'login','Inicio de sesión exitoso','2025-09-25 20:12:36'),(53,5,'login','Inicio de sesión exitoso','2025-09-25 20:13:11'),(54,5,'login','Inicio de sesión exitoso','2025-09-25 22:57:14'),(55,5,'login','Inicio de sesión exitoso','2025-09-25 22:58:34'),(56,5,'login','Inicio de sesión exitoso','2025-09-25 23:19:53'),(57,1,'login_fallido','Credenciales inválidas','2025-09-25 23:20:49'),(58,1,'login','Inicio de sesión exitoso','2025-09-25 23:20:53'),(59,5,'login','Inicio de sesión exitoso','2025-09-26 00:24:20'),(60,5,'login','Inicio de sesión exitoso','2025-09-26 00:25:45'),(61,5,'login','Inicio de sesión exitoso','2025-10-01 18:24:17'),(62,5,'login','Inicio de sesión exitoso','2025-10-01 18:28:41'),(63,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:14'),(64,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:16'),(65,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:18'),(66,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:27'),(67,6,'login_fallido','Credenciales inválidas','2025-10-16 21:03:08'),(68,6,'login_fallido','Credenciales inválidas','2025-10-16 21:03:12'),(69,6,'login','Inicio de sesión exitoso','2025-10-16 21:03:15'),(70,5,'login','Inicio de sesión exitoso','2025-10-21 23:37:53'),(71,5,'login','Inicio de sesión exitoso','2025-10-21 23:47:38'),(72,5,'login','Inicio de sesión exitoso','2025-10-21 23:54:22'),(73,5,'login','Inicio de sesión exitoso','2025-10-21 23:54:40'),(74,5,'login','Inicio de sesión exitoso','2025-10-21 23:55:39'),(75,5,'login','Inicio de sesión exitoso','2025-10-21 23:56:18'),(76,5,'login','Inicio de sesión exitoso','2025-10-21 23:59:25'),(77,5,'login','Inicio de sesión exitoso','2025-10-22 00:01:08'),(78,6,'login','Inicio de sesión exitoso','2025-10-22 00:03:22'),(79,5,'login','Inicio de sesión exitoso','2025-10-22 01:40:33'),(80,6,'login','Inicio de sesión exitoso','2025-10-23 01:32:32'),(81,5,'login','Inicio de sesión exitoso','2025-10-23 21:15:39'),(82,6,'login','Inicio de sesión exitoso','2025-10-23 21:33:24'),(83,5,'login','Inicio de sesión exitoso','2025-11-01 21:03:20'),(84,6,'login','Inicio de sesión exitoso','2025-11-01 21:18:02'),(85,6,'login','Inicio de sesión exitoso','2025-11-01 21:40:28'),(86,6,'login','Inicio de sesión exitoso','2025-11-01 22:17:56'),(87,6,'login','Inicio de sesión exitoso','2025-11-02 01:22:46'),(88,5,'login','Inicio de sesión exitoso','2025-11-02 01:22:51'),(89,1,'login','Inicio de sesión exitoso','2025-11-02 01:31:46'),(90,1,'login','Inicio de sesión exitoso','2025-11-02 01:31:46'),(91,1,'login','Inicio de sesión exitoso','2025-11-02 01:31:47'),(92,1,'login_fallido','Credenciales inválidas','2025-11-02 01:31:53'),(93,1,'login_fallido','Credenciales inválidas','2025-11-02 01:42:19'),(94,NULL,'login_fallido','Credenciales inválidas','2025-11-02 01:43:23'),(95,NULL,'login_fallido','Credenciales inválidas','2025-11-02 01:43:24'),(96,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:43:28'),(97,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:43:31'),(98,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:22'),(99,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:23'),(100,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:39'),(101,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:39'),(102,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:55'),(103,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:56'),(104,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:57'),(105,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:48:17'),(106,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:48:19'),(107,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:27'),(108,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:31'),(109,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:57'),(110,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:57'),(111,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:49:40'),(112,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:50:22'),(113,NULL,'login','Inicio de sesión exitoso','2025-11-02 02:27:03'),(114,NULL,'login','Inicio de sesión exitoso','2025-11-02 17:02:13'),(115,NULL,'login_fallido','Credenciales inválidas','2025-11-02 18:35:13'),(116,NULL,'login_fallido','Credenciales inválidas','2025-11-02 18:35:21'),(117,1,'login','Inicio de sesión exitoso','2025-11-02 18:36:26'),(118,1,'login','Inicio de sesión exitoso','2025-11-02 18:55:28'),(119,6,'login','Inicio de sesión exitoso','2025-11-02 19:41:17');
/*!40000 ALTER TABLE `historial_registros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `stock_actual` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_inventario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opiniones`
--

DROP TABLE IF EXISTS `opiniones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opiniones` (
  `id_opinion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_opinion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `opiniones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `opiniones_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opiniones`
--

LOCK TABLES `opiniones` WRITE;
/*!40000 ALTER TABLE `opiniones` DISABLE KEYS */;
INSERT INTO `opiniones` VALUES (1,3,1,5,'Manzanas frescas y muy dulces, excelente calidad.','2025-09-23 03:25:16'),(2,6,2,4,'El pedido llegó rápido y en buen estado. La pechuga estaba fresca y bien presentada.','2025-10-23 20:58:17'),(3,6,3,5,'La avena llegó en perfectas condiciones y es de buena calidad. El empaque estaba intacto.','2025-10-23 20:58:34');
/*!40000 ALTER TABLE `opiniones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `metodo_pago` enum('tarjeta','yape','plin','efectivo') DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','exitoso','fallido') DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'tarjeta',31.90,'2025-10-23 02:33:09','exitoso'),(2,2,'tarjeta',5.50,'2025-10-23 03:57:40','exitoso'),(3,3,'tarjeta',46.80,'2025-11-01 22:53:00','exitoso'),(4,4,'tarjeta',70.60,'2025-11-01 23:00:39','exitoso');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiracion` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES (1,'ursam26@gmail.com','ae6b1cf20a6ea0fb13385882d6bc8df961f4c9d48391e712b995ec95d8947fb1','2025-09-25 22:21:33'),(2,'ursam26@gmail.com','0d62eb6e8cf917e13883db1cb4cd297ff2368d70b8382feb76b524b20ea115e6','2025-09-25 22:21:36'),(3,'ursam26@gmail.com','13453d1eb7b1fa8e77b2cd2acf5b2c2e0512f515f9179989896ca06afdafe3aa','2025-09-25 22:28:45'),(4,'ursam26@gmail.com','dcffbe098537e96e8d3ad842a03b133ae2049b3eae504db4e0eff2bd222ada0b','2025-09-25 22:33:08'),(5,'ursam26@gmail.com','3a06d22c93c7bf494fd323bcd22e0599fa5942c8cfdbfa6f5d4b91346cf3cf43','2025-09-25 22:35:42'),(6,'ursam26@gmail.com','8282cf7804c00978004ef8b9a4e1c0f5ed714d08ccc3bb2ce7a1470e371194b3','2025-09-25 22:45:20'),(7,'ursam26@gmail.com','df4c3cd47d6748e338f91cd7e7b6dbed327f24f17592b8a7aef56ff838c3ee61','2025-09-25 22:56:39'),(8,'ursam26@gmail.com','f10b419c9e815b9f39325e87dba09fd8149005818e863c263e065a15ac1392f3','2025-09-26 01:57:53'),(9,'ursam26@gmail.com','6fee84382b625916b4efa47ddb200e81701146cffd544340562462abef1d0aca','2025-09-26 02:21:12'),(10,'ursam26@gmail.com','276598024424568a785797d5d8f700c39492453ed8a0694ccb949e13cb5f916b','2025-09-26 02:24:36'),(11,'ursam26@gmail.com','5f5330430e5f77728a33de6677471654f3406fb5e109ed08adccdedc4a70b1d5','2025-09-26 03:24:37'),(12,'ursam26@gmail.com','2d0f8a28e598583d890d921e563a8667a241ad988a75dd78b439d3ae83cfa041','2025-10-01 21:14:50'),(13,'ursam26@gmail.com','8f3c18d0323626a20b69672dc288570420e95bd1701357ed089bacf1211b7f2f','2025-10-01 21:28:50');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalle`
--

DROP TABLE IF EXISTS `pedido_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalle` (
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `pedido_detalle_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `pedido_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalle`
--

LOCK TABLES `pedido_detalle` WRITE;
/*!40000 ALTER TABLE `pedido_detalle` DISABLE KEYS */;
INSERT INTO `pedido_detalle` VALUES (1,2,1,18.90),(1,3,2,6.50),(2,1,1,5.50),(3,7,2,3.50),(3,11,2,19.90),(4,5,2,14.90),(4,6,1,24.90),(4,12,1,15.90);
/*!40000 ALTER TABLE `pedido_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `estado` enum('pendiente','en_camino','enviado','entregado','cancelado') DEFAULT 'pendiente',
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,6,'2025-10-23 02:33:09','2025-10-23 05:00:00','entregado',31.90),(2,6,'2025-10-23 03:57:40','2025-10-31 05:00:00','en_camino',5.50),(3,6,'2025-11-01 22:53:00','2025-11-02 02:02:13','cancelado',46.80),(4,6,'2025-11-01 23:00:39','2025-11-04 05:00:39','pendiente',70.60);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_promocion`
--

DROP TABLE IF EXISTS `producto_promocion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_promocion` (
  `id_producto` int(11) NOT NULL,
  `id_promocion` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_promocion`),
  KEY `id_promocion` (`id_promocion`),
  CONSTRAINT `producto_promocion_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `producto_promocion_ibfk_2` FOREIGN KEY (`id_promocion`) REFERENCES `promociones` (`id_promocion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_promocion`
--

LOCK TABLES `producto_promocion` WRITE;
/*!40000 ALTER TABLE `producto_promocion` DISABLE KEYS */;
INSERT INTO `producto_promocion` VALUES (16,5);
/*!40000 ALTER TABLE `producto_promocion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `destacado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,'Manzana Roja','Manzanas frescas y jugosas de temporada',5.55,'images/productos/manzana.png','2025-09-24 02:25:06',0),(2,2,'Pechuga de Pollo','Pechuga fresca sin piel ni hueso',18.90,'images/productos/pollo.png','2025-09-24 02:25:06',1),(3,3,'Avena Tradicional 500g','Avena fortificada ideal para desayuno',6.50,'images/productos/avena.png','2025-09-24 02:25:06',0),(4,4,'Yogurt Fresa 1L','Yogurt sabor fresa en envase familiar',8.90,'images/productos/yogurt.png','2025-09-24 02:25:06',1),(5,5,'Queso Edam 250g','Queso madurado tipo Edam',14.90,'images/productos/queso.png','2025-09-24 02:25:06',0),(6,6,'Arroz Extra 5kg','Arroz de grano largo extra',24.90,'images/productos/arroz.png','2025-09-24 02:25:06',0),(7,7,'Pan Ciabatta','Pan artesanal horneado del día',3.50,'images/productos/pan.png','2025-09-24 02:25:06',0),(8,8,'Pollo a la Brasa Entero','Pollo rostizado con papas y ensalada',39.90,'images/productos/brasa.png','2025-09-24 02:25:06',0),(9,9,'Choclo Congelado 1kg','Choclo desgranado congelado',12.50,'images/productos/choclo.png','2025-09-24 02:25:06',0),(10,10,'Coca Cola 1.5L','Bebida gaseosa Coca Cola 1.5 litros',7.00,'images/productos/gaseosa.png','2025-09-24 02:25:06',0),(11,11,'Vino Tinto Borgoña 750ml','Vino de mesa semidulce',19.90,'images/productos/vino.png','2025-09-24 02:25:06',1),(12,12,'Detergente en Polvo 1kg','Detergente multiusos para ropa',15.90,'images/productos/detergente.png','2025-09-24 02:25:06',0),(13,13,'Cepillo Dental Suave','Cepillo dental con cerdas suaves',6.90,'images/productos/cepillo.png','2025-09-24 02:25:06',0),(14,14,'Pañales Huggies x30','Pañales Huggies recién nacido ultra suave',34.90,'images/productos/panales.png','2025-09-24 02:25:06',1),(15,15,'Pedigree 2kg','Alimento balanceado Pedigree para perros adultos',28.90,'images/productos/pedigree.png','2025-09-24 02:25:06',0),(16,16,'Laptop HP','Laptop HP Core i5 8GB RAM 256GB SSD',2199.00,'images/productos/laptop_hp.png','2025-09-24 02:25:06',1),(17,17,'Refrigeradora 300L','Refrigeradora no frost de dos puertas',1499.00,'images/productos/refrigeradora.png','2025-09-24 02:25:06',1),(18,18,'Sofá 3 Plazas','Sofá tapizado en tela gris',899.00,'images/productos/sofa.png','2025-09-24 02:25:06',0),(19,19,'Colchón 2 Plazas','Colchón ortopédico de resortes',1200.00,'images/productos/colchon.png','2025-09-24 02:25:06',0),(20,20,'Juego de Vasos 6pz','Set de vasos de vidrio templado',29.90,'images/productos/vasos.png','2025-09-24 02:25:06',0),(21,21,'Lego Classic 500pz','Bloques de construcción creativos',199.00,'images/productos/lego.png','2025-09-24 02:25:06',0),(22,22,'Pelota de Fútbol','Balón oficial talla 5',89.90,'images/productos/pelota.png','2025-09-24 02:25:06',0),(23,23,'Cuna de Madera','Cuna infantil con barandas desmontables',499.00,'images/productos/cuna.png','2025-09-24 02:25:06',0),(24,24,'Labial Matte','Labial mate de larga duración',39.90,'images/productos/labial.png','2025-09-24 02:25:06',0),(25,25,'Cuaderno A4 100 hojas','Cuaderno rayado tamaño A4',12.50,'images/productos/cuaderno.png','2025-09-24 02:25:06',0),(26,26,'Aceite de Motor 20W50','Aceite premium para motores 1L',49.90,'images/productos/aceite_motor.png','2025-09-24 02:25:06',0),(27,27,'Taladro Eléctrico 600W','Taladro eléctrico con percusión',395.00,'images/productos/1762057674_taladro.webp','2025-09-24 02:25:06',0),(29,10,'Agua Mineral San Luis 500ml','Agua mineral natural sin gas. Botella de 500 ml ideal para llevar.',1.50,'images/productos/1762057716_agua-san-luis-sin-gas-625ml-5024-default-1.jpg','2025-11-02 04:28:36',0);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones` (
  `id_promocion` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `descuento_porcentaje` decimal(5,2) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_promocion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (5,'Promoción Laptop HP','30% de descuento en la Laptop HP por dos meses',30.00,'2025-10-23','2025-12-23',1),(6,'Descuento de Primavera en Frutas','Obtén un 20% de descuento en todas las frutas. Promoción válida por tiempo limitado',20.00,'2025-11-01','2025-11-03',1);
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Acceso total al sistema'),(2,'Usuario','Acceso limitado');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_roles`
--

DROP TABLE IF EXISTS `usuario_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_roles` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_roles_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `usuario_roles_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_roles`
--

LOCK TABLES `usuario_roles` WRITE;
/*!40000 ALTER TABLE `usuario_roles` DISABLE KEYS */;
INSERT INTO `usuario_roles` VALUES (1,1,'2025-09-12 02:02:38'),(2,2,'2025-09-12 02:03:53'),(3,2,'2025-09-12 02:41:33'),(4,2,'2025-09-12 02:47:00'),(5,2,'2025-09-24 05:22:04'),(6,2,'2025-09-25 19:20:57');
/*!40000 ALTER TABLE `usuario_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Elias','Urbano','999888777','elias.admin@gmail.com',NULL,'2025-09-12 02:02:25'),(2,'Pepe','Perez','957428615','pepe1@gmail.com',NULL,'2025-09-12 02:03:53'),(3,'Andrea','Sanchez','924582277','andrea12@gmail.com',NULL,'2025-09-12 02:41:33'),(4,'Rafael','Dominguez','923974159','rafad@gmail.com',NULL,'2025-09-12 02:47:00'),(5,'Diego','Tataje','957842658','diegot1@gmail.com',NULL,'2025-09-24 05:22:04'),(6,'Elias','Urbano','906497244','ursam26@gmail.com','uploads/perfiles/69067a7fe8778_h1.png','2025-09-25 19:20:57');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02 14:43:52
=======
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vivanda
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id_banner` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) DEFAULT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_banner`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Descuento en toda la tienda','images/banners/offert1.png',1,'2025-11-02 18:30:26'),(2,'Descuentos en audífonos','images/banners/offert2.png',1,'2025-11-02 18:30:26'),(3,'50% off en smartphones y tablets','images/banners/offert3.png',1,'2025-11-02 18:30:26'),(7,'50% prueba','images/banners/6907ae4dc104c.jpg',0,'2025-11-02 19:13:23');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_carrito`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,2,'2025-09-23 21:02:01'),(2,5,'2025-09-24 05:22:28'),(3,6,'2025-10-23 01:38:36');
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_detalle`
--

DROP TABLE IF EXISTS `carrito_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_detalle` (
  `id_carrito` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  PRIMARY KEY (`id_carrito`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `carrito_detalle_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`),
  CONSTRAINT `carrito_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_detalle`
--

LOCK TABLES `carrito_detalle` WRITE;
/*!40000 ALTER TABLE `carrito_detalle` DISABLE KEYS */;
INSERT INTO `carrito_detalle` VALUES (1,3,1),(2,11,3),(2,25,2);
/*!40000 ALTER TABLE `carrito_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Frutas y Verduras','Frutas y verduras frescas de temporada','images/categorias/frutas.png'),(2,'Carnes, Aves y Pescados','Variedad de carnes, aves y pescados frescos','images/categorias/carnes.png'),(3,'Desayunos','Cereales, avenas, mantequillas y más para tu desayuno','images/categorias/desayunos.png'),(4,'Lácteos y Huevos','Leche, yogures, quesos y huevos frescos','images/categorias/lacteos.png'),(5,'Quesos y Fiambres','Quesos madurados y embutidos selectos','images/categorias/quesos.png'),(6,'Abarrotes','Arroz, fideos, aceites y productos básicos','images/categorias/abarrotes.png'),(7,'Panadería y Pastelería','Pan fresco, tortas y postres','images/categorias/panaderia.png'),(8,'Pollo Rostizado y Comidas Preparadas','Pollos a la brasa y platos listos para llevar','images/categorias/pollo.png'),(9,'Congelados','Verduras, carnes y comidas congeladas','images/categorias/congelados.png'),(10,'Bebidas','Jugos, gaseosas y aguas embotelladas','images/categorias/bebidas.png'),(11,'Vinos y Licores','Vinos, cervezas y bebidas alcohólicas','images/categorias/vinos.png'),(12,'Limpieza','Productos de limpieza para el hogar','images/categorias/limpieza.png'),(13,'Cuidado Personal y Salud','Artículos de higiene y cuidado personal','images/categorias/cuidado.png'),(14,'Cuidado del Bebé','Pañales, fórmulas y accesorios para el bebé','images/categorias/bebe.png'),(15,'Mascotas','Alimentos y accesorios para mascotas','images/categorias/mascotas.png'),(16,'Tecnología','Laptops, smartphones y más dispositivos','images/categorias/tecnologia.png'),(17,'Electrohogar','Electrodomésticos grandes y pequeños','images/categorias/electrohogar.png'),(18,'Muebles','Muebles para sala, comedor y más','images/categorias/muebles.png'),(19,'Dormitorio','Camas, colchones y accesorios de descanso','images/categorias/dormitorio.png'),(20,'Decohogar','Decoración y accesorios para el hogar','images/categorias/decohogar.png'),(21,'Juguetes y Juegos','Juguetes educativos y de entretenimiento','images/categorias/juguetes.png'),(22,'Deportes','Artículos y accesorios deportivos','images/categorias/deportes.png'),(23,'Bebé e Infantil','Juguetes, muebles y productos infantiles','images/categorias/bebe_infantil.png'),(24,'Belleza','Cosméticos, maquillaje y cuidado personal','images/categorias/belleza.png'),(25,'Librería y Oficina','Útiles escolares y de oficina','images/categorias/libreria.png'),(26,'Automotriz','Accesorios y productos para tu auto','images/categorias/auto.png'),(27,'Mejoramiento del Hogar','Herramientas y materiales para mejoras','images/categorias/hogar.png');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_logs`
--

DROP TABLE IF EXISTS `chatbot_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbot_logs` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `pregunta` text DEFAULT NULL,
  `respuesta` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `chatbot_logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_logs`
--

LOCK TABLES `chatbot_logs` WRITE;
/*!40000 ALTER TABLE `chatbot_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatbot_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_cliente_usuario` (`id_usuario`),
  CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Andrea','Sanchez','924582277','andrea12@gmail.com','2025-09-12 02:39:27',3),(3,'Rafael','Dominguez','923974159','rafad@gmail.com','2025-09-12 02:47:00',4),(4,'Diego','Tataje','957842658','diegot1@gmail.com','2025-09-24 05:22:04',5),(5,'Elias','Urbano','906497249','ursam26@gmail.com','2025-09-25 19:20:57',6);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `canal` enum('web','redes_sociales','tienda_fisica') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_compra`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,1,'tienda_fisica',120.50,'Compra de productos materno-infantiles; incluye leche orgánica y pañales en promoción.','2025-09-12 03:17:57');
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credenciales`
--

DROP TABLE IF EXISTS `credenciales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credenciales` (
  `id_credencial` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_credencial`),
  UNIQUE KEY `username` (`username`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `credenciales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credenciales`
--

LOCK TABLES `credenciales` WRITE;
/*!40000 ALTER TABLE `credenciales` DISABLE KEYS */;
INSERT INTO `credenciales` VALUES (1,1,'elias_admin','$2y$10$OYWlzk6KDZTWs//Pj1ovjeHrWQrvBcsMYgF36RM94iOuZgqW0Ykqi',1),(2,2,'pepe1','$2y$10$EYdT3aIYjVUoB2iZaZOpD./6wXcqq6WBrK2F.gjBp6pTJZPE2WrBG',1),(3,3,'andrea12','$2y$10$VNkIU.xP/k59oNJZbyyLeefiGF1FvKh7H4v8rgWjUXZosCs.z3yrS',1),(4,4,'rafad','$2y$10$MypPRYBLNeFMnlkjqKAGR.u9Fu6o/zUHz8Ywyoi0yC2jgN9AHzW5i',1),(5,5,'diegot1','$2y$10$lTQKo47vKDf.Xf77KssbaO19I.QNsIvUQXe5918xl6nYEo2mbpiqu',1),(6,6,'ursam26','$2y$10$g.RvB/iyiwOdeHvDtE2jf.c6ID2N0WUNEReimM2JxJ5/jfVdE8QC2',1);
/*!40000 ALTER TABLE `credenciales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_favorito`),
  UNIQUE KEY `unique_favorito` (`id_usuario`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (62,6,2,'2025-11-02 00:10:56');
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_registros`
--

DROP TABLE IF EXISTS `historial_registros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_registros` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historial`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historial_registros_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_registros`
--

LOCK TABLES `historial_registros` WRITE;
/*!40000 ALTER TABLE `historial_registros` DISABLE KEYS */;
INSERT INTO `historial_registros` VALUES (1,2,'registro','Usuario registrado en el sistema','2025-09-12 02:03:53'),(2,2,'login','Inicio de sesión exitoso','2025-09-12 02:04:09'),(3,1,'login','Inicio de sesión exitoso','2025-09-12 02:04:25'),(4,1,'login','Inicio de sesión exitoso','2025-09-12 02:17:03'),(5,1,'login','Inicio de sesión exitoso','2025-09-12 02:17:54'),(6,2,'login','Inicio de sesión exitoso','2025-09-12 02:18:08'),(7,1,'login','Inicio de sesión exitoso','2025-09-12 02:18:56'),(8,1,'registro_cliente','El administrador registró al cliente con correo: andrea12@gmail.com','2025-09-12 02:39:27'),(9,3,'registro','Usuario registrado en el sistema','2025-09-12 02:41:33'),(10,1,'login','Inicio de sesión exitoso','2025-09-12 02:45:27'),(11,1,'registro_cliente','El administrador registró al cliente con correo: vazquesj@gmail.com','2025-09-12 02:46:04'),(12,4,'registro','Usuario registrado en el sistema','2025-09-12 02:47:00'),(13,1,'login','Inicio de sesión exitoso','2025-09-12 02:57:25'),(14,1,'registro_compra','El administrador registró una compra para el cliente 1 en canal tienda_fisica','2025-09-12 03:17:57'),(15,1,'login','Inicio de sesión exitoso','2025-09-19 02:11:49'),(16,2,'login','Inicio de sesión exitoso','2025-09-19 02:12:13'),(17,1,'login','Inicio de sesión exitoso','2025-09-19 02:18:21'),(18,2,'login','Inicio de sesión exitoso','2025-09-19 02:32:43'),(19,1,'login','Inicio de sesión exitoso','2025-09-22 22:09:30'),(20,2,'login','Inicio de sesión exitoso','2025-09-22 22:09:37'),(21,2,'login','Inicio de sesión exitoso','2025-09-22 22:39:09'),(22,3,'login_fallido','Credenciales inválidas','2025-09-22 22:39:46'),(23,3,'login_fallido','Credenciales inválidas','2025-09-22 22:39:48'),(24,3,'login_fallido','Credenciales inválidas','2025-09-22 22:39:51'),(25,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:09'),(26,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:12'),(27,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:14'),(28,3,'login_fallido','Credenciales inválidas','2025-09-22 22:40:17'),(29,2,'login','Inicio de sesión exitoso','2025-09-22 22:40:28'),(30,2,'login','Inicio de sesión exitoso','2025-09-23 17:53:06'),(31,2,'login','Inicio de sesión exitoso','2025-09-23 17:59:51'),(32,2,'login','Inicio de sesión exitoso','2025-09-23 20:01:05'),(33,2,'login','Inicio de sesión exitoso','2025-09-23 20:06:39'),(34,2,'login','Inicio de sesión exitoso','2025-09-23 20:10:47'),(35,2,'login','Inicio de sesión exitoso','2025-09-23 20:23:28'),(36,2,'login','Inicio de sesión exitoso','2025-09-23 20:29:04'),(37,2,'login','Inicio de sesión exitoso','2025-09-23 20:33:34'),(38,2,'login','Inicio de sesión exitoso','2025-09-23 21:22:48'),(39,2,'login','Inicio de sesión exitoso','2025-09-23 21:40:05'),(40,2,'login','Inicio de sesión exitoso','2025-09-24 00:18:42'),(41,5,'registro','Usuario registrado en el sistema','2025-09-24 05:22:04'),(42,5,'login','Inicio de sesión exitoso','2025-09-24 05:22:16'),(43,5,'login_fallido','Credenciales inválidas','2025-09-25 18:06:01'),(44,5,'login','Inicio de sesión exitoso','2025-09-25 18:06:11'),(45,5,'login','Inicio de sesión exitoso','2025-09-25 18:22:29'),(46,5,'login','Inicio de sesión exitoso','2025-09-25 18:36:05'),(47,6,'registro','Usuario registrado en el sistema','2025-09-25 19:20:57'),(48,5,'login','Inicio de sesión exitoso','2025-09-25 19:37:42'),(49,5,'login','Inicio de sesión exitoso','2025-09-25 19:39:33'),(50,5,'login','Inicio de sesión exitoso','2025-09-25 19:45:01'),(51,5,'login','Inicio de sesión exitoso','2025-09-25 19:45:50'),(52,5,'login','Inicio de sesión exitoso','2025-09-25 20:12:36'),(53,5,'login','Inicio de sesión exitoso','2025-09-25 20:13:11'),(54,5,'login','Inicio de sesión exitoso','2025-09-25 22:57:14'),(55,5,'login','Inicio de sesión exitoso','2025-09-25 22:58:34'),(56,5,'login','Inicio de sesión exitoso','2025-09-25 23:19:53'),(57,1,'login_fallido','Credenciales inválidas','2025-09-25 23:20:49'),(58,1,'login','Inicio de sesión exitoso','2025-09-25 23:20:53'),(59,5,'login','Inicio de sesión exitoso','2025-09-26 00:24:20'),(60,5,'login','Inicio de sesión exitoso','2025-09-26 00:25:45'),(61,5,'login','Inicio de sesión exitoso','2025-10-01 18:24:17'),(62,5,'login','Inicio de sesión exitoso','2025-10-01 18:28:41'),(63,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:14'),(64,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:16'),(65,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:18'),(66,NULL,'login_fallido','Credenciales inválidas','2025-10-16 21:01:27'),(67,6,'login_fallido','Credenciales inválidas','2025-10-16 21:03:08'),(68,6,'login_fallido','Credenciales inválidas','2025-10-16 21:03:12'),(69,6,'login','Inicio de sesión exitoso','2025-10-16 21:03:15'),(70,5,'login','Inicio de sesión exitoso','2025-10-21 23:37:53'),(71,5,'login','Inicio de sesión exitoso','2025-10-21 23:47:38'),(72,5,'login','Inicio de sesión exitoso','2025-10-21 23:54:22'),(73,5,'login','Inicio de sesión exitoso','2025-10-21 23:54:40'),(74,5,'login','Inicio de sesión exitoso','2025-10-21 23:55:39'),(75,5,'login','Inicio de sesión exitoso','2025-10-21 23:56:18'),(76,5,'login','Inicio de sesión exitoso','2025-10-21 23:59:25'),(77,5,'login','Inicio de sesión exitoso','2025-10-22 00:01:08'),(78,6,'login','Inicio de sesión exitoso','2025-10-22 00:03:22'),(79,5,'login','Inicio de sesión exitoso','2025-10-22 01:40:33'),(80,6,'login','Inicio de sesión exitoso','2025-10-23 01:32:32'),(81,5,'login','Inicio de sesión exitoso','2025-10-23 21:15:39'),(82,6,'login','Inicio de sesión exitoso','2025-10-23 21:33:24'),(83,5,'login','Inicio de sesión exitoso','2025-11-01 21:03:20'),(84,6,'login','Inicio de sesión exitoso','2025-11-01 21:18:02'),(85,6,'login','Inicio de sesión exitoso','2025-11-01 21:40:28'),(86,6,'login','Inicio de sesión exitoso','2025-11-01 22:17:56'),(87,6,'login','Inicio de sesión exitoso','2025-11-02 01:22:46'),(88,5,'login','Inicio de sesión exitoso','2025-11-02 01:22:51'),(89,1,'login','Inicio de sesión exitoso','2025-11-02 01:31:46'),(90,1,'login','Inicio de sesión exitoso','2025-11-02 01:31:46'),(91,1,'login','Inicio de sesión exitoso','2025-11-02 01:31:47'),(92,1,'login_fallido','Credenciales inválidas','2025-11-02 01:31:53'),(93,1,'login_fallido','Credenciales inválidas','2025-11-02 01:42:19'),(94,NULL,'login_fallido','Credenciales inválidas','2025-11-02 01:43:23'),(95,NULL,'login_fallido','Credenciales inválidas','2025-11-02 01:43:24'),(96,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:43:28'),(97,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:43:31'),(98,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:22'),(99,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:23'),(100,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:39'),(101,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:39'),(102,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:55'),(103,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:56'),(104,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:47:57'),(105,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:48:17'),(106,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:48:19'),(107,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:27'),(108,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:31'),(109,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:57'),(110,1,'login_fallido','Credenciales inválidas','2025-11-02 01:48:57'),(111,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:49:40'),(112,NULL,'login','Inicio de sesión exitoso','2025-11-02 01:50:22'),(113,NULL,'login','Inicio de sesión exitoso','2025-11-02 02:27:03'),(114,NULL,'login','Inicio de sesión exitoso','2025-11-02 17:02:13'),(115,NULL,'login_fallido','Credenciales inválidas','2025-11-02 18:35:13'),(116,NULL,'login_fallido','Credenciales inválidas','2025-11-02 18:35:21'),(117,1,'login','Inicio de sesión exitoso','2025-11-02 18:36:26'),(118,1,'login','Inicio de sesión exitoso','2025-11-02 18:55:28'),(119,6,'login','Inicio de sesión exitoso','2025-11-02 19:41:17');
/*!40000 ALTER TABLE `historial_registros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `stock_actual` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_inventario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opiniones`
--

DROP TABLE IF EXISTS `opiniones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opiniones` (
  `id_opinion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_opinion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `opiniones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `opiniones_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opiniones`
--

LOCK TABLES `opiniones` WRITE;
/*!40000 ALTER TABLE `opiniones` DISABLE KEYS */;
INSERT INTO `opiniones` VALUES (1,3,1,5,'Manzanas frescas y muy dulces, excelente calidad.','2025-09-23 03:25:16'),(2,6,2,4,'El pedido llegó rápido y en buen estado. La pechuga estaba fresca y bien presentada.','2025-10-23 20:58:17'),(3,6,3,5,'La avena llegó en perfectas condiciones y es de buena calidad. El empaque estaba intacto.','2025-10-23 20:58:34');
/*!40000 ALTER TABLE `opiniones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `metodo_pago` enum('tarjeta','yape','plin','efectivo') DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','exitoso','fallido') DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'tarjeta',31.90,'2025-10-23 02:33:09','exitoso'),(2,2,'tarjeta',5.50,'2025-10-23 03:57:40','exitoso'),(3,3,'tarjeta',46.80,'2025-11-01 22:53:00','exitoso'),(4,4,'tarjeta',70.60,'2025-11-01 23:00:39','exitoso');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiracion` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES (1,'ursam26@gmail.com','ae6b1cf20a6ea0fb13385882d6bc8df961f4c9d48391e712b995ec95d8947fb1','2025-09-25 22:21:33'),(2,'ursam26@gmail.com','0d62eb6e8cf917e13883db1cb4cd297ff2368d70b8382feb76b524b20ea115e6','2025-09-25 22:21:36'),(3,'ursam26@gmail.com','13453d1eb7b1fa8e77b2cd2acf5b2c2e0512f515f9179989896ca06afdafe3aa','2025-09-25 22:28:45'),(4,'ursam26@gmail.com','dcffbe098537e96e8d3ad842a03b133ae2049b3eae504db4e0eff2bd222ada0b','2025-09-25 22:33:08'),(5,'ursam26@gmail.com','3a06d22c93c7bf494fd323bcd22e0599fa5942c8cfdbfa6f5d4b91346cf3cf43','2025-09-25 22:35:42'),(6,'ursam26@gmail.com','8282cf7804c00978004ef8b9a4e1c0f5ed714d08ccc3bb2ce7a1470e371194b3','2025-09-25 22:45:20'),(7,'ursam26@gmail.com','df4c3cd47d6748e338f91cd7e7b6dbed327f24f17592b8a7aef56ff838c3ee61','2025-09-25 22:56:39'),(8,'ursam26@gmail.com','f10b419c9e815b9f39325e87dba09fd8149005818e863c263e065a15ac1392f3','2025-09-26 01:57:53'),(9,'ursam26@gmail.com','6fee84382b625916b4efa47ddb200e81701146cffd544340562462abef1d0aca','2025-09-26 02:21:12'),(10,'ursam26@gmail.com','276598024424568a785797d5d8f700c39492453ed8a0694ccb949e13cb5f916b','2025-09-26 02:24:36'),(11,'ursam26@gmail.com','5f5330430e5f77728a33de6677471654f3406fb5e109ed08adccdedc4a70b1d5','2025-09-26 03:24:37'),(12,'ursam26@gmail.com','2d0f8a28e598583d890d921e563a8667a241ad988a75dd78b439d3ae83cfa041','2025-10-01 21:14:50'),(13,'ursam26@gmail.com','8f3c18d0323626a20b69672dc288570420e95bd1701357ed089bacf1211b7f2f','2025-10-01 21:28:50');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalle`
--

DROP TABLE IF EXISTS `pedido_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalle` (
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `pedido_detalle_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `pedido_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalle`
--

LOCK TABLES `pedido_detalle` WRITE;
/*!40000 ALTER TABLE `pedido_detalle` DISABLE KEYS */;
INSERT INTO `pedido_detalle` VALUES (1,2,1,18.90),(1,3,2,6.50),(2,1,1,5.50),(3,7,2,3.50),(3,11,2,19.90),(4,5,2,14.90),(4,6,1,24.90),(4,12,1,15.90);
/*!40000 ALTER TABLE `pedido_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `estado` enum('pendiente','en_camino','enviado','entregado','cancelado') DEFAULT 'pendiente',
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,6,'2025-10-23 02:33:09','2025-10-23 05:00:00','entregado',31.90),(2,6,'2025-10-23 03:57:40','2025-10-31 05:00:00','en_camino',5.50),(3,6,'2025-11-01 22:53:00','2025-11-02 02:02:13','cancelado',46.80),(4,6,'2025-11-01 23:00:39','2025-11-04 05:00:39','pendiente',70.60);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_promocion`
--

DROP TABLE IF EXISTS `producto_promocion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_promocion` (
  `id_producto` int(11) NOT NULL,
  `id_promocion` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_promocion`),
  KEY `id_promocion` (`id_promocion`),
  CONSTRAINT `producto_promocion_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `producto_promocion_ibfk_2` FOREIGN KEY (`id_promocion`) REFERENCES `promociones` (`id_promocion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_promocion`
--

LOCK TABLES `producto_promocion` WRITE;
/*!40000 ALTER TABLE `producto_promocion` DISABLE KEYS */;
INSERT INTO `producto_promocion` VALUES (16,5);
/*!40000 ALTER TABLE `producto_promocion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `destacado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,'Manzana Roja','Manzanas frescas y jugosas de temporada',5.55,'images/productos/manzana.png','2025-09-24 02:25:06',0),(2,2,'Pechuga de Pollo','Pechuga fresca sin piel ni hueso',18.90,'images/productos/pollo.png','2025-09-24 02:25:06',1),(3,3,'Avena Tradicional 500g','Avena fortificada ideal para desayuno',6.50,'images/productos/avena.png','2025-09-24 02:25:06',0),(4,4,'Yogurt Fresa 1L','Yogurt sabor fresa en envase familiar',8.90,'images/productos/yogurt.png','2025-09-24 02:25:06',1),(5,5,'Queso Edam 250g','Queso madurado tipo Edam',14.90,'images/productos/queso.png','2025-09-24 02:25:06',0),(6,6,'Arroz Extra 5kg','Arroz de grano largo extra',24.90,'images/productos/arroz.png','2025-09-24 02:25:06',0),(7,7,'Pan Ciabatta','Pan artesanal horneado del día',3.50,'images/productos/pan.png','2025-09-24 02:25:06',0),(8,8,'Pollo a la Brasa Entero','Pollo rostizado con papas y ensalada',39.90,'images/productos/brasa.png','2025-09-24 02:25:06',0),(9,9,'Choclo Congelado 1kg','Choclo desgranado congelado',12.50,'images/productos/choclo.png','2025-09-24 02:25:06',0),(10,10,'Coca Cola 1.5L','Bebida gaseosa Coca Cola 1.5 litros',7.00,'images/productos/gaseosa.png','2025-09-24 02:25:06',0),(11,11,'Vino Tinto Borgoña 750ml','Vino de mesa semidulce',19.90,'images/productos/vino.png','2025-09-24 02:25:06',1),(12,12,'Detergente en Polvo 1kg','Detergente multiusos para ropa',15.90,'images/productos/detergente.png','2025-09-24 02:25:06',0),(13,13,'Cepillo Dental Suave','Cepillo dental con cerdas suaves',6.90,'images/productos/cepillo.png','2025-09-24 02:25:06',0),(14,14,'Pañales Huggies x30','Pañales Huggies recién nacido ultra suave',34.90,'images/productos/panales.png','2025-09-24 02:25:06',1),(15,15,'Pedigree 2kg','Alimento balanceado Pedigree para perros adultos',28.90,'images/productos/pedigree.png','2025-09-24 02:25:06',0),(16,16,'Laptop HP','Laptop HP Core i5 8GB RAM 256GB SSD',2199.00,'images/productos/laptop_hp.png','2025-09-24 02:25:06',1),(17,17,'Refrigeradora 300L','Refrigeradora no frost de dos puertas',1499.00,'images/productos/refrigeradora.png','2025-09-24 02:25:06',1),(18,18,'Sofá 3 Plazas','Sofá tapizado en tela gris',899.00,'images/productos/sofa.png','2025-09-24 02:25:06',0),(19,19,'Colchón 2 Plazas','Colchón ortopédico de resortes',1200.00,'images/productos/colchon.png','2025-09-24 02:25:06',0),(20,20,'Juego de Vasos 6pz','Set de vasos de vidrio templado',29.90,'images/productos/vasos.png','2025-09-24 02:25:06',0),(21,21,'Lego Classic 500pz','Bloques de construcción creativos',199.00,'images/productos/lego.png','2025-09-24 02:25:06',0),(22,22,'Pelota de Fútbol','Balón oficial talla 5',89.90,'images/productos/pelota.png','2025-09-24 02:25:06',0),(23,23,'Cuna de Madera','Cuna infantil con barandas desmontables',499.00,'images/productos/cuna.png','2025-09-24 02:25:06',0),(24,24,'Labial Matte','Labial mate de larga duración',39.90,'images/productos/labial.png','2025-09-24 02:25:06',0),(25,25,'Cuaderno A4 100 hojas','Cuaderno rayado tamaño A4',12.50,'images/productos/cuaderno.png','2025-09-24 02:25:06',0),(26,26,'Aceite de Motor 20W50','Aceite premium para motores 1L',49.90,'images/productos/aceite_motor.png','2025-09-24 02:25:06',0),(27,27,'Taladro Eléctrico 600W','Taladro eléctrico con percusión',395.00,'images/productos/1762057674_taladro.webp','2025-09-24 02:25:06',0),(29,10,'Agua Mineral San Luis 500ml','Agua mineral natural sin gas. Botella de 500 ml ideal para llevar.',1.50,'images/productos/1762057716_agua-san-luis-sin-gas-625ml-5024-default-1.jpg','2025-11-02 04:28:36',0);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones` (
  `id_promocion` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `descuento_porcentaje` decimal(5,2) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_promocion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (5,'Promoción Laptop HP','30% de descuento en la Laptop HP por dos meses',30.00,'2025-10-23','2025-12-23',1),(6,'Descuento de Primavera en Frutas','Obtén un 20% de descuento en todas las frutas. Promoción válida por tiempo limitado',20.00,'2025-11-01','2025-11-03',1);
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Acceso total al sistema'),(2,'Usuario','Acceso limitado');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_roles`
--

DROP TABLE IF EXISTS `usuario_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_roles` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_roles_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `usuario_roles_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_roles`
--

LOCK TABLES `usuario_roles` WRITE;
/*!40000 ALTER TABLE `usuario_roles` DISABLE KEYS */;
INSERT INTO `usuario_roles` VALUES (1,1,'2025-09-12 02:02:38'),(2,2,'2025-09-12 02:03:53'),(3,2,'2025-09-12 02:41:33'),(4,2,'2025-09-12 02:47:00'),(5,2,'2025-09-24 05:22:04'),(6,2,'2025-09-25 19:20:57');
/*!40000 ALTER TABLE `usuario_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Elias','Urbano','999888777','elias.admin@gmail.com',NULL,'2025-09-12 02:02:25'),(2,'Pepe','Perez','957428615','pepe1@gmail.com',NULL,'2025-09-12 02:03:53'),(3,'Andrea','Sanchez','924582277','andrea12@gmail.com',NULL,'2025-09-12 02:41:33'),(4,'Rafael','Dominguez','923974159','rafad@gmail.com',NULL,'2025-09-12 02:47:00'),(5,'Diego','Tataje','957842658','diegot1@gmail.com',NULL,'2025-09-24 05:22:04'),(6,'Elias','Urbano','906497244','ursam26@gmail.com','uploads/perfiles/69067a7fe8778_h1.png','2025-09-25 19:20:57');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02 14:43:52
>>>>>>> acc9175cbfe9fae9344e3e7919f6401ff71d3436
