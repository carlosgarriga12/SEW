-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-12-2023 a las 11:55:32
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pizzeria`
--

-- --------------------------------------------------------
CREATE DATABASE pizzeria;

-- Seleccionar la base de datos
USE pizzeria;
--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `ID_Cliente` int(11) NOT NULL,
  `Nombre_Cliente` varchar(255) COLLATE utf8_spanish_ci DEFAULT NULL,
  `Direccion` varchar(255) COLLATE utf8_spanish_ci DEFAULT NULL,
  `Telefono` varchar(15) COLLATE utf8_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `ID_Ingrediente` int(11) NOT NULL,
  `Nombre_Ingrediente` varchar(255) COLLATE utf8_spanish_ci DEFAULT NULL,
  `Tipo` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pizza`
--

CREATE TABLE `pizza` (
  `ID_Pizza` int(11) NOT NULL,
  `Nombre_Pizza` varchar(255) COLLATE utf8_spanish_ci DEFAULT NULL,
  `Precio` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------


--
-- Estructura de tabla para la tabla `encargos`
--

CREATE TABLE `encargos` (
  `ID_Encargo` int(11) NOT NULL,
  `Fecha_Encargo` date DEFAULT NULL,
  `ID_Cliente` int(11) DEFAULT NULL,
  `ID_Pizza` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Total_Precio` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pizza_ingredientes`
--

CREATE TABLE `pizza_ingredientes` (
  `ID_Pizza` int(11) NOT NULL,
  `ID_Ingrediente` int(11) NOT NULL,
  `Cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`ID_Cliente`);

--
-- Indices de la tabla `encargos`
--
ALTER TABLE `encargos`
  ADD PRIMARY KEY (`ID_Encargo`),
  ADD KEY `ID_Cliente` (`ID_Cliente`),
  ADD KEY `ID_Pizza` (`ID_Pizza`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`ID_Ingrediente`);

--
-- Indices de la tabla `pizza`
--
ALTER TABLE `pizza`
  ADD PRIMARY KEY (`ID_Pizza`);

--
-- Indices de la tabla `pizza_ingredientes`
--
ALTER TABLE `pizza_ingredientes`
  ADD PRIMARY KEY (`ID_Pizza`,`ID_Ingrediente`),
  ADD KEY `ID_Ingrediente` (`ID_Ingrediente`);

--
-- Restricciones para tablas volcadas
--
ALTER TABLE `clientes`
  MODIFY `ID_Cliente` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pizza`
  MODIFY `ID_Pizza` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ingredientes`
  MODIFY `ID_Ingrediente` int(11) NOT NULL AUTO_INCREMENT;
--
-- Filtros para la tabla `encargos`
--
ALTER TABLE `encargos`
  ADD CONSTRAINT `encargos_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `clientes` (`ID_Cliente`),
  ADD CONSTRAINT `encargos_ibfk_2` FOREIGN KEY (`ID_Pizza`) REFERENCES `pizza` (`ID_Pizza`);

--
-- Filtros para la tabla `pizza_ingredientes`
--
ALTER TABLE `pizza_ingredientes`
  ADD CONSTRAINT `pizza_ingredientes_ibfk_1` FOREIGN KEY (`ID_Pizza`) REFERENCES `pizza` (`ID_Pizza`),
  ADD CONSTRAINT `pizza_ingredientes_ibfk_2` FOREIGN KEY (`ID_Ingrediente`) REFERENCES `ingredientes` (`ID_Ingrediente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
