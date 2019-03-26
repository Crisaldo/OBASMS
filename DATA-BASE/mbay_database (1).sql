-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2019 at 04:46 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mbay_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `addons_walkin_tbl`
--

CREATE TABLE `addons_walkin_tbl` (
  `addons_walkin_id` int(11) NOT NULL,
  `amenity_id` int(11) DEFAULT NULL,
  `walkin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `admin_tbl`
--

CREATE TABLE `admin_tbl` (
  `admin_id` int(11) NOT NULL,
  `admin_desc` varchar(45) DEFAULT NULL,
  `admin_username` varchar(45) DEFAULT NULL,
  `admin_password` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin_tbl`
--

INSERT INTO `admin_tbl` (`admin_id`, `admin_desc`, `admin_username`, `admin_password`) VALUES
(1, 'main_admin', 'admin', 'admin'),
(2, 'front_desk', 'frontdesk', 'admin'),
(3, 'receptionist', 'receptionist', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `amenities_reservation_tbl`
--

CREATE TABLE `amenities_reservation_tbl` (
  `amenity_reservation_id` int(11) NOT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `number_ofGuest` int(11) DEFAULT NULL,
  `total_fee` float DEFAULT NULL,
  `paid_status` tinyint(4) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `date_only` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `amenities_reservation_tbl`
--

INSERT INTO `amenities_reservation_tbl` (`amenity_reservation_id`, `cust_id`, `number_ofGuest`, `total_fee`, `paid_status`, `date`, `date_only`) VALUES
(22, 58, 1, 750, 1, 'March 24, 2019 07:18 PM', '2019-03-24'),
(23, 58, 1, 750, 1, 'March 24, 2019 07:19 PM', '2019-03-24');

-- --------------------------------------------------------

--
-- Table structure for table `customer_tbl`
--

CREATE TABLE `customer_tbl` (
  `cust_id` int(11) NOT NULL,
  `cust_fname` varchar(80) DEFAULT NULL,
  `cust_mname` varchar(45) DEFAULT NULL,
  `cust_lname` varchar(45) DEFAULT NULL,
  `cust_gender` varchar(45) DEFAULT NULL,
  `cust_birthMonth` varchar(45) DEFAULT NULL,
  `cust_birthDate` varchar(45) DEFAULT NULL,
  `cust_birthYear` varchar(45) DEFAULT NULL,
  `cust_contact_no` varchar(11) DEFAULT NULL,
  `vat_exempt_id` int(11) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL,
  `medical_history` varchar(1000) DEFAULT NULL,
  `cust_address` varchar(200) DEFAULT NULL,
  `cust_type` tinyint(4) DEFAULT NULL,
  `vat_exempt_id_no` varchar(45) DEFAULT NULL,
  `cust_pic` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_tbl`
--

INSERT INTO `customer_tbl` (`cust_id`, `cust_fname`, `cust_mname`, `cust_lname`, `cust_gender`, `cust_birthMonth`, `cust_birthDate`, `cust_birthYear`, `cust_contact_no`, `vat_exempt_id`, `delete_stats`, `medical_history`, `cust_address`, `cust_type`, `vat_exempt_id_no`, `cust_pic`) VALUES
(58, 'Crisaldo', 'Ibay', 'Santos', 'Male', '01', '22', '1999', '09132123123', NULL, 0, 'qewqewqe', '1811 Int. 36 Bo Sta Maria Pedro Gil Paco Manila', 1, NULL, 'customer-1553612616255.jpg'),
(120, 'Jonalyn', '', 'Ebrda', 'Female', '04', '02', '1999', '09053908132', NULL, 0, '', 'Quezon City', 0, '', NULL),
(121, 'Norme', '', 'Penaverde', 'Female', '02', '06', '1996', '09053908131', NULL, 0, '', 'Sta. Mesa', 0, '', NULL),
(131, 'aaaaa', '', 'aaaaa', 'Male', '', 'undefined', 'undefined', '97878978978', NULL, 0, 'awawaw', 'hjkh', 1, '', 'customer-1553614549873.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `freebies_promo_tbl`
--

CREATE TABLE `freebies_promo_tbl` (
  `freebies_promo_id` int(11) NOT NULL,
  `promobundle_id` int(11) DEFAULT NULL,
  `equivalent_points` int(11) DEFAULT NULL,
  `freebies_promo_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `freebies_tbl`
--

CREATE TABLE `freebies_tbl` (
  `freebies_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `equivalent_points` varchar(45) DEFAULT NULL,
  `freebies_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `giftcertificate_tbl`
--

CREATE TABLE `giftcertificate_tbl` (
  `gc_id` int(11) NOT NULL,
  `gc_name` varchar(45) DEFAULT NULL,
  `gc_value` int(11) DEFAULT NULL,
  `gc_price` int(11) DEFAULT NULL,
  `gc_refCode` varchar(45) DEFAULT NULL,
  `release_stats` tinyint(4) DEFAULT NULL,
  `date_sold` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `giftcertificate_tbl`
--

INSERT INTO `giftcertificate_tbl` (`gc_id`, `gc_name`, `gc_value`, `gc_price`, `gc_refCode`, `release_stats`, `date_sold`) VALUES
(87, 'Spa GC', 1000, 1000, '6cgpx', 3, '2019-03-15'),
(88, 'Spa GC', 1000, 1000, '198l0e', 2, '2019-03-15'),
(89, 'Spa GC', 1000, 1000, 'k7pzq4v', 2, '2019-03-15'),
(90, 'Spa GC', 1000, 1000, 'vv1kne', 2, '2019-03-14'),
(91, 'Spa GC', 1000, 1000, '5o60tt', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `giftcert_payment_tbl`
--

CREATE TABLE `giftcert_payment_tbl` (
  `gc_payment_id` int(11) NOT NULL,
  `services_availed_id` int(11) DEFAULT NULL,
  `payment_date` varchar(45) DEFAULT NULL,
  `gc_id` int(11) DEFAULT NULL,
  `cust_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `loyalty_tbl`
--

CREATE TABLE `loyalty_tbl` (
  `member_id` int(11) NOT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `member_username` varchar(45) DEFAULT NULL,
  `member_password` varchar(45) DEFAULT NULL,
  `member_points` double DEFAULT NULL,
  `membership_validity` varchar(45) DEFAULT NULL,
  `paid_status` tinyint(4) DEFAULT NULL,
  `member_card_id` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `loyalty_tbl`
--

INSERT INTO `loyalty_tbl` (`member_id`, `cust_id`, `member_username`, `member_password`, `member_points`, `membership_validity`, `paid_status`, `member_card_id`) VALUES
(1, 58, 'crissy', '1234', 800, NULL, 1, '0002934073'),
(6, 131, 'aaaa', 'aaaaa', 0, 'undefined', 0, '0010999930');

-- --------------------------------------------------------

--
-- Table structure for table `medical_history_tbl`
--

CREATE TABLE `medical_history_tbl` (
  `medhist_id` int(11) NOT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `med_history` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `package_tbl`
--

CREATE TABLE `package_tbl` (
  `package_id` int(11) NOT NULL,
  `package_name` varchar(45) DEFAULT NULL,
  `package_price` float DEFAULT NULL,
  `package_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL,
  `package_duration` varchar(45) DEFAULT NULL,
  `package_points` float DEFAULT NULL,
  `package_maxPerson` int(11) DEFAULT NULL,
  `package_equivalentPoints` float DEFAULT NULL,
  `package_roomIncluded` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `package_tbl`
--

INSERT INTO `package_tbl` (`package_id`, `package_name`, `package_price`, `package_availability`, `delete_stats`, `package_duration`, `package_points`, `package_maxPerson`, `package_equivalentPoints`, `package_roomIncluded`) VALUES
(3, 'package #1', 3000, 0, 0, '240', 90, 1, 90, 11),
(4, 'package', 2500, 0, 0, '200', 60, 1, 60, 11);

-- --------------------------------------------------------

--
-- Table structure for table `payment_loyalty_trans_tbl`
--

CREATE TABLE `payment_loyalty_trans_tbl` (
  `payment_loyalty_id` int(11) NOT NULL,
  `loyalty_id` int(11) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_amount` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payment_tbl`
--

CREATE TABLE `payment_tbl` (
  `payment_id` int(11) NOT NULL,
  `services_availed_id` int(11) DEFAULT NULL,
  `payment_type` varchar(45) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `payment_date` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment_tbl`
--

INSERT INTO `payment_tbl` (`payment_id`, `services_availed_id`, `payment_type`, `amount`, `cust_id`, `payment_date`) VALUES
(60, 92, NULL, 750, 58, '2019-03-16'),
(61, 94, NULL, 2000, 121, '2019-03-18');

-- --------------------------------------------------------

--
-- Table structure for table `points_payment_tbl`
--

CREATE TABLE `points_payment_tbl` (
  `points_payment_id` int(11) NOT NULL,
  `services_availed_id` int(11) DEFAULT NULL,
  `payment_date` varchar(45) DEFAULT NULL,
  `total_points` varchar(45) DEFAULT NULL,
  `cust_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `promo_bundle_tbl`
--

CREATE TABLE `promo_bundle_tbl` (
  `promobundle_id` int(11) NOT NULL,
  `promobundle_name` varchar(45) DEFAULT NULL,
  `promobundle_price` float DEFAULT NULL,
  `promobundle_valid_from` varchar(45) DEFAULT NULL,
  `promobundle_valid_until` varchar(45) DEFAULT NULL,
  `promobundle_availability` tinyint(4) DEFAULT NULL,
  `promobundle_maxPerson` int(11) DEFAULT NULL,
  `promobundle_duration` varchar(45) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL,
  `promobundle_points` float DEFAULT NULL,
  `promobundle_equivalentPoints` float DEFAULT NULL,
  `promobundle_roomIncluded` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `promo_bundle_tbl`
--

INSERT INTO `promo_bundle_tbl` (`promobundle_id`, `promobundle_name`, `promobundle_price`, `promobundle_valid_from`, `promobundle_valid_until`, `promobundle_availability`, `promobundle_maxPerson`, `promobundle_duration`, `delete_stats`, `promobundle_points`, `promobundle_equivalentPoints`, `promobundle_roomIncluded`) VALUES
(1, 'promo', 1600, '20190319', '20190320', 0, 1, '3', 0, 80, 80, NULL),
(2, 'Summer Promo', 2000, '20190328', '20190501', 0, 2, '120', 0, 20, 23, 11);

-- --------------------------------------------------------

--
-- Table structure for table `room_in_service_tbl`
--

CREATE TABLE `room_in_service_tbl` (
  `room_in_service_tbl` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `walkin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `room_in_service_tbl`
--

INSERT INTO `room_in_service_tbl` (`room_in_service_tbl`, `room_id`, `walkin_id`) VALUES
(45, 9, 185),
(46, 8, 186);

-- --------------------------------------------------------

--
-- Table structure for table `room_tbl`
--

CREATE TABLE `room_tbl` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(45) DEFAULT NULL,
  `room_type_id` int(11) DEFAULT NULL,
  `room_rate` float DEFAULT NULL,
  `room_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` varchar(45) DEFAULT NULL,
  `bed_qty` int(11) DEFAULT NULL,
  `room_gender` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `room_tbl`
--

INSERT INTO `room_tbl` (`room_id`, `room_name`, `room_type_id`, `room_rate`, `room_availability`, `delete_stats`, `bed_qty`, `room_gender`) VALUES
(8, 'Common Room for Girls', 2, 0, 0, '0', 17, 2),
(9, 'Common Room for Boys', 2, 0, 0, '0', 20, 1),
(10, 'Private Room for 2', 6, 150, 1, '0', 2, 3),
(11, 'Hexa Room', 6, 500, 0, '0', 6, 3),
(13, 'wew', 6, 23, 1, '1', 2323, NULL),
(14, 'sample', 2, 150.99, 1, '1', 20, NULL),
(15, 'wqe', 6, 123123, 1, '1', 232, 2),
(16, 'Friends Room', 6, 100, 0, '0', 19, 3);

-- --------------------------------------------------------

--
-- Table structure for table `room_type_tbl`
--

CREATE TABLE `room_type_tbl` (
  `room_type_id` int(11) NOT NULL,
  `room_type_desc` varchar(45) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `room_type_tbl`
--

INSERT INTO `room_type_tbl` (`room_type_id`, `room_type_desc`, `delete_stats`) VALUES
(1, 'aa', 1),
(2, 'Common Room', 0),
(3, 'Deluxe Room', 1),
(4, 'Private Room', 1),
(5, 'aaa', 1),
(6, 'Private Room', 0),
(7, 'www', 1),
(8, 'aaa', 1),
(9, 'www', 1),
(10, 'ass', 1);

-- --------------------------------------------------------

--
-- Table structure for table `services_availed_tbl`
--

CREATE TABLE `services_availed_tbl` (
  `service_availed_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `services_availed_tbl`
--

INSERT INTO `services_availed_tbl` (`service_availed_id`, `transaction_id`) VALUES
(92, 185),
(93, 185),
(94, 186),
(95, 186);

-- --------------------------------------------------------

--
-- Table structure for table `services_tbl`
--

CREATE TABLE `services_tbl` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(200) DEFAULT NULL,
  `service_type_id` int(11) DEFAULT NULL,
  `service_duration_id` int(11) DEFAULT NULL,
  `service_price` double DEFAULT NULL,
  `service_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL,
  `service_points` float DEFAULT NULL,
  `service_equivalentPoints` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `services_tbl`
--

INSERT INTO `services_tbl` (`service_id`, `service_name`, `service_type_id`, `service_duration_id`, `service_price`, `service_availability`, `delete_stats`, `service_points`, `service_equivalentPoints`) VALUES
(49, 'Body Massage', 16, 22, 750, 0, 0, 24.5, 25.5),
(50, 'Foot massage ', 17, 21, 849.5, 0, 0, 30.5, 31.3),
(51, 'Happy Ending', 16, 21, -1000, 1, 1, -1, -500),
(53, '2', 17, 22, -10, 1, 1, 2, 2),
(54, '2', 19, 21, -10, 1, 1, 2, 2),
(55, 'w', 17, 22, 0, 1, 1, 2, 2),
(56, 'Head Massage', 19, 21, 1500, 0, 0, 25, 25),
(57, 'Relaxing Head Massage', 19, 21, 2000, 0, 0, 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `service_duration_tbl`
--

CREATE TABLE `service_duration_tbl` (
  `service_duration_id` int(11) NOT NULL,
  `service_duration_desc` varchar(45) DEFAULT NULL,
  `service_duration_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `service_duration_tbl`
--

INSERT INTO `service_duration_tbl` (`service_duration_id`, `service_duration_desc`, `service_duration_availability`, `delete_stats`) VALUES
(21, '60', 0, 0),
(22, '120', 0, 0),
(23, '90', 1, 0),
(24, '30', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `service_in_package_tbl`
--

CREATE TABLE `service_in_package_tbl` (
  `service_in_package_id` int(11) NOT NULL,
  `service_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `service_in_package_tbl`
--

INSERT INTO `service_in_package_tbl` (`service_in_package_id`, `service_id`, `package_id`) VALUES
(1, 49, 3),
(2, 56, 3),
(3, 50, 3),
(4, 49, 4),
(5, 50, 4);

-- --------------------------------------------------------

--
-- Table structure for table `service_in_promo_tbl`
--

CREATE TABLE `service_in_promo_tbl` (
  `service_in_promo_id` int(11) NOT NULL,
  `promobundle_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `service_in_promo_tbl`
--

INSERT INTO `service_in_promo_tbl` (`service_in_promo_id`, `promobundle_id`, `service_id`) VALUES
(1, 1, 49),
(2, 1, 50),
(3, 2, 49),
(4, 2, 56);

-- --------------------------------------------------------

--
-- Table structure for table `service_type_tbl`
--

CREATE TABLE `service_type_tbl` (
  `service_type_id` int(11) NOT NULL,
  `service_type_desc` varchar(45) DEFAULT NULL,
  `service_type_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `service_type_tbl`
--

INSERT INTO `service_type_tbl` (`service_type_id`, `service_type_desc`, `service_type_availability`, `delete_stats`) VALUES
(16, 'Body Massage', 1, 0),
(17, 'Foot Massage', 0, 0),
(18, 'Hand Massage', 0, 0),
(19, 'Head massage', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `specialty_tbl`
--

CREATE TABLE `specialty_tbl` (
  `specialty_id` int(11) NOT NULL,
  `specialty_desc` varchar(45) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specialty_tbl`
--

INSERT INTO `specialty_tbl` (`specialty_id`, `specialty_desc`, `delete_stats`) VALUES
(1, '', 1),
(2, 'Foot Massage', 1),
(3, '', 1),
(4, 'Hand Massage', 0),
(12, 'wwww', 1),
(13, 'aaaa', 1),
(14, 'Ventosa', 1),
(15, 'as', 1),
(16, 'ventosa', 0),
(17, 'Swedish Massage', 0),
(18, 'Head Massage', 0);

-- --------------------------------------------------------

--
-- Table structure for table `therapist_account_tbl`
--

CREATE TABLE `therapist_account_tbl` (
  `account_id` int(11) NOT NULL,
  `therapist_id` int(11) DEFAULT NULL,
  `therapist_username` varchar(45) DEFAULT NULL,
  `therapist_password` varchar(45) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `therapist_account_tbl`
--

INSERT INTO `therapist_account_tbl` (`account_id`, `therapist_id`, `therapist_username`, `therapist_password`, `delete_stats`) VALUES
(1, 96, 'heide01', 'heide0123', 0),
(2, 97, 'jonafe', '12345678', 0);

-- --------------------------------------------------------

--
-- Table structure for table `therapist_attendance_tbl`
--

CREATE TABLE `therapist_attendance_tbl` (
  `attendance_id` int(11) NOT NULL,
  `therapist_id` int(11) DEFAULT NULL,
  `therapist_datetime_in` varchar(45) DEFAULT NULL,
  `therapist_reserved` tinyint(4) DEFAULT NULL,
  `doneService_count` varchar(45) DEFAULT NULL,
  `availability` tinyint(4) DEFAULT NULL,
  `in_service` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `therapist_attendance_tbl`
--

INSERT INTO `therapist_attendance_tbl` (`attendance_id`, `therapist_id`, `therapist_datetime_in`, `therapist_reserved`, `doneService_count`, `availability`, `in_service`) VALUES
(39, 95, NULL, NULL, NULL, 0, NULL),
(40, 96, NULL, 0, '0', 0, NULL),
(41, 97, NULL, 0, '0', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `therapist_in_service_tbl`
--

CREATE TABLE `therapist_in_service_tbl` (
  `therapist_in_service_id` int(11) NOT NULL,
  `therapist_id` int(11) DEFAULT NULL,
  `walkin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `therapist_in_service_tbl`
--

INSERT INTO `therapist_in_service_tbl` (`therapist_in_service_id`, `therapist_id`, `walkin_id`) VALUES
(156, 97, 185),
(157, 97, 186);

-- --------------------------------------------------------

--
-- Table structure for table `therapist_specialty_tbl`
--

CREATE TABLE `therapist_specialty_tbl` (
  `therapist_specialty_id` int(11) NOT NULL,
  `therapist_id` int(11) DEFAULT NULL,
  `specialty_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `therapist_specialty_tbl`
--

INSERT INTO `therapist_specialty_tbl` (`therapist_specialty_id`, `therapist_id`, `specialty_id`) VALUES
(273, 95, 4),
(274, 95, 16),
(275, 96, 4),
(276, 96, 16),
(277, 97, 4),
(278, 97, 17),
(279, 97, 18);

-- --------------------------------------------------------

--
-- Table structure for table `therapist_tbl`
--

CREATE TABLE `therapist_tbl` (
  `therapist_id` int(11) NOT NULL,
  `therapist_fname` varchar(45) DEFAULT NULL,
  `therapist_mname` varchar(45) DEFAULT NULL,
  `therapist_lname` varchar(45) DEFAULT NULL,
  `therapist_contact_no` varchar(20) DEFAULT NULL,
  `therapist_birthMonth` varchar(45) DEFAULT NULL,
  `therapist_gender` varchar(45) DEFAULT NULL,
  `therapist_address` varchar(200) DEFAULT NULL,
  `therapist_specialty_id` int(11) DEFAULT NULL,
  `therapist_availability` tinyint(4) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL,
  `therapist_birthDate` varchar(45) DEFAULT NULL,
  `therapist_birthYear` varchar(45) DEFAULT NULL,
  `therapist_shift` varchar(45) DEFAULT NULL,
  `therapist_licenseExpiration` date DEFAULT NULL,
  `release_comm` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `therapist_tbl`
--

INSERT INTO `therapist_tbl` (`therapist_id`, `therapist_fname`, `therapist_mname`, `therapist_lname`, `therapist_contact_no`, `therapist_birthMonth`, `therapist_gender`, `therapist_address`, `therapist_specialty_id`, `therapist_availability`, `delete_stats`, `therapist_birthDate`, `therapist_birthYear`, `therapist_shift`, `therapist_licenseExpiration`, `release_comm`) VALUES
(95, 'heide', '', 'ausena', '09123123213', '08', 'Female', 'sa marikina', NULL, 1, 1, '05', '1998', 'First', '2017-08-30', 0),
(96, 'heide', '', 'ausena', '09131312111', '01', 'Female', 'sa marikina', NULL, 0, 0, '06', '2000', 'First', '2019-04-25', 2),
(97, 'Ebrada', '', 'Jona', '09105385355', '01', 'Female', 'Quezon City', NULL, 0, 0, '03', '1995', 'First', '2025-12-25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `utilities_tbl`
--

CREATE TABLE `utilities_tbl` (
  `utilities_id` int(11) NOT NULL,
  `company_name` varchar(200) DEFAULT NULL,
  `company_logo` varchar(200) DEFAULT NULL,
  `opening_time` varchar(45) DEFAULT NULL,
  `closing_time` varchar(45) DEFAULT NULL,
  `max_guest` int(11) DEFAULT NULL,
  `membership_validity` varchar(45) DEFAULT NULL,
  `membership_fee` float DEFAULT NULL,
  `entrance_fee` float DEFAULT NULL,
  `reservation_forfeitTime` varchar(45) DEFAULT NULL,
  `firstShift_timeStart` varchar(45) DEFAULT NULL,
  `firstShift_timeEnd` varchar(45) DEFAULT NULL,
  `secondShift_timeStart` varchar(45) DEFAULT NULL,
  `secondShift_timeEnd` varchar(45) DEFAULT NULL,
  `reservation_timeAllowance` varchar(45) DEFAULT NULL,
  `therapist_commission` varchar(45) DEFAULT NULL,
  `amenity_cancellation` varchar(45) DEFAULT NULL,
  `official_receipt_num` varchar(45) DEFAULT NULL,
  `vat` varchar(45) DEFAULT NULL,
  `company_address` varchar(200) DEFAULT NULL,
  `locker_quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='	';

--
-- Dumping data for table `utilities_tbl`
--

INSERT INTO `utilities_tbl` (`utilities_id`, `company_name`, `company_logo`, `opening_time`, `closing_time`, `max_guest`, `membership_validity`, `membership_fee`, `entrance_fee`, `reservation_forfeitTime`, `firstShift_timeStart`, `firstShift_timeEnd`, `secondShift_timeStart`, `secondShift_timeEnd`, `reservation_timeAllowance`, `therapist_commission`, `amenity_cancellation`, `official_receipt_num`, `vat`, `company_address`, `locker_quantity`) VALUES
(1, 'Mbay Health Spa', 'company_logo-1539722174614.jpg', '13:30', '1:00 AM', 6, '24', 600, 750, '15', '1:00 PM', '6:05 PM', '6:00 PM', '1:00 AM', '30', '30', '30', '0000000000', '12', '778 Quirino Ave, Malate, Manila City, 1000 Metro Manila', 25);

-- --------------------------------------------------------

--
-- Table structure for table `vat_exempted_tbl`
--

CREATE TABLE `vat_exempted_tbl` (
  `vat_exempt_id` int(11) NOT NULL,
  `vat_exempt_desc` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vat_exempted_tbl`
--

INSERT INTO `vat_exempted_tbl` (`vat_exempt_id`, `vat_exempt_desc`) VALUES
(1, 'PWD'),
(2, 'Senior Citizen');

-- --------------------------------------------------------

--
-- Table structure for table `walkin_queue_tbl`
--

CREATE TABLE `walkin_queue_tbl` (
  `walkin_id` int(11) NOT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `walkin_start_time` varchar(45) DEFAULT NULL,
  `walkin_end_time` varchar(45) DEFAULT NULL,
  `walkin_status` tinyint(4) DEFAULT NULL,
  `walkin_total_amount` float DEFAULT NULL,
  `walkin_lock_no` varchar(45) DEFAULT NULL,
  `walkin_date` date DEFAULT NULL,
  `walkin_total_points` varchar(45) DEFAULT NULL,
  `walkin_payment_status` tinyint(4) DEFAULT NULL,
  `walkin_indicator` tinyint(4) DEFAULT NULL,
  `bed_occupied_boys` int(11) DEFAULT NULL,
  `bed_occupied_girls` int(11) DEFAULT NULL,
  `delete_stats` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `walkin_queue_tbl`
--

INSERT INTO `walkin_queue_tbl` (`walkin_id`, `cust_id`, `walkin_start_time`, `walkin_end_time`, `walkin_status`, `walkin_total_amount`, `walkin_lock_no`, `walkin_date`, `walkin_total_points`, `walkin_payment_status`, `walkin_indicator`, `bed_occupied_boys`, `bed_occupied_girls`, `delete_stats`) VALUES
(185, 58, '01:01 PM', '03:01 PM', NULL, 750, '1', '2019-03-16', '24.50', 1, 2, 1, 0, 0),
(186, 121, '01:18 PM', '02:18 PM', NULL, 2000, 'undefined', '2019-03-18', '10.00', 1, 2, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `walkin_services_tbl`
--

CREATE TABLE `walkin_services_tbl` (
  `walkin_serv_id` int(11) NOT NULL,
  `walkin_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `promobundle_id` int(11) DEFAULT NULL,
  `bed_occupied` int(11) DEFAULT NULL,
  `service_total_quantity` int(11) DEFAULT NULL,
  `service_total_duration` varchar(45) DEFAULT NULL,
  `service_total_price` float DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `walkin_services_tbl`
--

INSERT INTO `walkin_services_tbl` (`walkin_serv_id`, `walkin_id`, `service_id`, `promobundle_id`, `bed_occupied`, `service_total_quantity`, `service_total_duration`, `service_total_price`, `package_id`) VALUES
(286, 185, 49, NULL, 0, 1, '02:00', 750, NULL),
(287, 186, 57, NULL, 0, 1, '01:00', 2000, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addons_walkin_tbl`
--
ALTER TABLE `addons_walkin_tbl`
  ADD PRIMARY KEY (`addons_walkin_id`),
  ADD KEY `addons_walkin_id_idx` (`walkin_id`);

--
-- Indexes for table `admin_tbl`
--
ALTER TABLE `admin_tbl`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `amenities_reservation_tbl`
--
ALTER TABLE `amenities_reservation_tbl`
  ADD PRIMARY KEY (`amenity_reservation_id`),
  ADD KEY `cust_id_amenity_idx` (`cust_id`);

--
-- Indexes for table `customer_tbl`
--
ALTER TABLE `customer_tbl`
  ADD PRIMARY KEY (`cust_id`),
  ADD KEY `vat_exempt_id_idx` (`vat_exempt_id`);

--
-- Indexes for table `freebies_promo_tbl`
--
ALTER TABLE `freebies_promo_tbl`
  ADD PRIMARY KEY (`freebies_promo_id`),
  ADD KEY `promobundle_freebies_id_idx` (`promobundle_id`);

--
-- Indexes for table `freebies_tbl`
--
ALTER TABLE `freebies_tbl`
  ADD PRIMARY KEY (`freebies_id`),
  ADD KEY `service_id_idx` (`service_id`);

--
-- Indexes for table `giftcertificate_tbl`
--
ALTER TABLE `giftcertificate_tbl`
  ADD PRIMARY KEY (`gc_id`);

--
-- Indexes for table `giftcert_payment_tbl`
--
ALTER TABLE `giftcert_payment_tbl`
  ADD PRIMARY KEY (`gc_payment_id`),
  ADD KEY `gc_services_id_idx` (`services_availed_id`),
  ADD KEY `gc_id_services_idx` (`gc_id`),
  ADD KEY `cust_services_id_idx` (`cust_id`);

--
-- Indexes for table `loyalty_tbl`
--
ALTER TABLE `loyalty_tbl`
  ADD PRIMARY KEY (`member_id`),
  ADD KEY `cust_id_idx` (`cust_id`);

--
-- Indexes for table `medical_history_tbl`
--
ALTER TABLE `medical_history_tbl`
  ADD PRIMARY KEY (`medhist_id`),
  ADD KEY `cust_id_idx` (`cust_id`);

--
-- Indexes for table `package_tbl`
--
ALTER TABLE `package_tbl`
  ADD PRIMARY KEY (`package_id`),
  ADD KEY `room_included_idx` (`package_roomIncluded`);

--
-- Indexes for table `payment_loyalty_trans_tbl`
--
ALTER TABLE `payment_loyalty_trans_tbl`
  ADD PRIMARY KEY (`payment_loyalty_id`),
  ADD KEY `loyalty_id_payment_idx` (`loyalty_id`);

--
-- Indexes for table `payment_tbl`
--
ALTER TABLE `payment_tbl`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payment_services_availed_id_idx` (`services_availed_id`),
  ADD KEY `payment_cust_id_idx` (`cust_id`);

--
-- Indexes for table `points_payment_tbl`
--
ALTER TABLE `points_payment_tbl`
  ADD PRIMARY KEY (`points_payment_id`),
  ADD KEY `services_availed_id_points_idx` (`services_availed_id`),
  ADD KEY `cust_id_idx` (`cust_id`);

--
-- Indexes for table `promo_bundle_tbl`
--
ALTER TABLE `promo_bundle_tbl`
  ADD PRIMARY KEY (`promobundle_id`),
  ADD KEY `room_included_in_promo_idx` (`promobundle_roomIncluded`);

--
-- Indexes for table `room_in_service_tbl`
--
ALTER TABLE `room_in_service_tbl`
  ADD PRIMARY KEY (`room_in_service_tbl`),
  ADD KEY `room_id_in_service_idx` (`room_id`),
  ADD KEY `walkin_id_in_service_idx` (`walkin_id`);

--
-- Indexes for table `room_tbl`
--
ALTER TABLE `room_tbl`
  ADD PRIMARY KEY (`room_id`),
  ADD KEY `room_type_id_idx` (`room_type_id`);

--
-- Indexes for table `room_type_tbl`
--
ALTER TABLE `room_type_tbl`
  ADD PRIMARY KEY (`room_type_id`);

--
-- Indexes for table `services_availed_tbl`
--
ALTER TABLE `services_availed_tbl`
  ADD PRIMARY KEY (`service_availed_id`),
  ADD KEY `service_availed_transaction_id_idx` (`transaction_id`);

--
-- Indexes for table `services_tbl`
--
ALTER TABLE `services_tbl`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `service_type_id_idx` (`service_type_id`),
  ADD KEY `service_duration_id_idx` (`service_duration_id`);

--
-- Indexes for table `service_duration_tbl`
--
ALTER TABLE `service_duration_tbl`
  ADD PRIMARY KEY (`service_duration_id`);

--
-- Indexes for table `service_in_package_tbl`
--
ALTER TABLE `service_in_package_tbl`
  ADD PRIMARY KEY (`service_in_package_id`),
  ADD KEY `service_id_idx` (`service_id`),
  ADD KEY `package_id_idx` (`package_id`);

--
-- Indexes for table `service_in_promo_tbl`
--
ALTER TABLE `service_in_promo_tbl`
  ADD PRIMARY KEY (`service_in_promo_id`),
  ADD KEY `service_id_idx` (`service_id`),
  ADD KEY `serv_in_promo_promobundle_id_idx` (`promobundle_id`);

--
-- Indexes for table `service_type_tbl`
--
ALTER TABLE `service_type_tbl`
  ADD PRIMARY KEY (`service_type_id`);

--
-- Indexes for table `specialty_tbl`
--
ALTER TABLE `specialty_tbl`
  ADD PRIMARY KEY (`specialty_id`);

--
-- Indexes for table `therapist_account_tbl`
--
ALTER TABLE `therapist_account_tbl`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `therapist_id_idx` (`therapist_id`);

--
-- Indexes for table `therapist_attendance_tbl`
--
ALTER TABLE `therapist_attendance_tbl`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `thera_id_idx` (`therapist_id`);

--
-- Indexes for table `therapist_in_service_tbl`
--
ALTER TABLE `therapist_in_service_tbl`
  ADD PRIMARY KEY (`therapist_in_service_id`),
  ADD KEY `thera_id_idx` (`therapist_id`),
  ADD KEY `walkin_serv_id_in_idx` (`walkin_id`);

--
-- Indexes for table `therapist_specialty_tbl`
--
ALTER TABLE `therapist_specialty_tbl`
  ADD PRIMARY KEY (`therapist_specialty_id`),
  ADD KEY `therapist_id_idx` (`therapist_id`),
  ADD KEY `specialty_id_idx` (`specialty_id`);

--
-- Indexes for table `therapist_tbl`
--
ALTER TABLE `therapist_tbl`
  ADD PRIMARY KEY (`therapist_id`);

--
-- Indexes for table `utilities_tbl`
--
ALTER TABLE `utilities_tbl`
  ADD PRIMARY KEY (`utilities_id`);

--
-- Indexes for table `vat_exempted_tbl`
--
ALTER TABLE `vat_exempted_tbl`
  ADD PRIMARY KEY (`vat_exempt_id`);

--
-- Indexes for table `walkin_queue_tbl`
--
ALTER TABLE `walkin_queue_tbl`
  ADD PRIMARY KEY (`walkin_id`),
  ADD KEY `walkin_queue_cust_id_idx` (`cust_id`);

--
-- Indexes for table `walkin_services_tbl`
--
ALTER TABLE `walkin_services_tbl`
  ADD PRIMARY KEY (`walkin_serv_id`),
  ADD KEY `walkin_reserv_walkin_id_idx` (`walkin_id`),
  ADD KEY `walkin_reserv_service_id_idx` (`service_id`),
  ADD KEY `walkin_reserv_promobundle_id_idx` (`promobundle_id`),
  ADD KEY `walkin_reserv_package_id_idx` (`package_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_tbl`
--
ALTER TABLE `admin_tbl`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `amenities_reservation_tbl`
--
ALTER TABLE `amenities_reservation_tbl`
  MODIFY `amenity_reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `customer_tbl`
--
ALTER TABLE `customer_tbl`
  MODIFY `cust_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `freebies_promo_tbl`
--
ALTER TABLE `freebies_promo_tbl`
  MODIFY `freebies_promo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `freebies_tbl`
--
ALTER TABLE `freebies_tbl`
  MODIFY `freebies_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `giftcertificate_tbl`
--
ALTER TABLE `giftcertificate_tbl`
  MODIFY `gc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `giftcert_payment_tbl`
--
ALTER TABLE `giftcert_payment_tbl`
  MODIFY `gc_payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loyalty_tbl`
--
ALTER TABLE `loyalty_tbl`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `medical_history_tbl`
--
ALTER TABLE `medical_history_tbl`
  MODIFY `medhist_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `package_tbl`
--
ALTER TABLE `package_tbl`
  MODIFY `package_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_loyalty_trans_tbl`
--
ALTER TABLE `payment_loyalty_trans_tbl`
  MODIFY `payment_loyalty_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_tbl`
--
ALTER TABLE `payment_tbl`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `points_payment_tbl`
--
ALTER TABLE `points_payment_tbl`
  MODIFY `points_payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promo_bundle_tbl`
--
ALTER TABLE `promo_bundle_tbl`
  MODIFY `promobundle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `room_in_service_tbl`
--
ALTER TABLE `room_in_service_tbl`
  MODIFY `room_in_service_tbl` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `room_tbl`
--
ALTER TABLE `room_tbl`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `room_type_tbl`
--
ALTER TABLE `room_type_tbl`
  MODIFY `room_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `services_availed_tbl`
--
ALTER TABLE `services_availed_tbl`
  MODIFY `service_availed_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `services_tbl`
--
ALTER TABLE `services_tbl`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `service_duration_tbl`
--
ALTER TABLE `service_duration_tbl`
  MODIFY `service_duration_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `service_in_package_tbl`
--
ALTER TABLE `service_in_package_tbl`
  MODIFY `service_in_package_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `service_in_promo_tbl`
--
ALTER TABLE `service_in_promo_tbl`
  MODIFY `service_in_promo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_type_tbl`
--
ALTER TABLE `service_type_tbl`
  MODIFY `service_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `specialty_tbl`
--
ALTER TABLE `specialty_tbl`
  MODIFY `specialty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `therapist_account_tbl`
--
ALTER TABLE `therapist_account_tbl`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `therapist_attendance_tbl`
--
ALTER TABLE `therapist_attendance_tbl`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `therapist_in_service_tbl`
--
ALTER TABLE `therapist_in_service_tbl`
  MODIFY `therapist_in_service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=158;

--
-- AUTO_INCREMENT for table `therapist_specialty_tbl`
--
ALTER TABLE `therapist_specialty_tbl`
  MODIFY `therapist_specialty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=280;

--
-- AUTO_INCREMENT for table `therapist_tbl`
--
ALTER TABLE `therapist_tbl`
  MODIFY `therapist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `vat_exempted_tbl`
--
ALTER TABLE `vat_exempted_tbl`
  MODIFY `vat_exempt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `walkin_queue_tbl`
--
ALTER TABLE `walkin_queue_tbl`
  MODIFY `walkin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `walkin_services_tbl`
--
ALTER TABLE `walkin_services_tbl`
  MODIFY `walkin_serv_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=288;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addons_walkin_tbl`
--
ALTER TABLE `addons_walkin_tbl`
  ADD CONSTRAINT `addons_walkin_id` FOREIGN KEY (`walkin_id`) REFERENCES `walkin_queue_tbl` (`walkin_id`) ON UPDATE CASCADE;

--
-- Constraints for table `customer_tbl`
--
ALTER TABLE `customer_tbl`
  ADD CONSTRAINT `vat_exempt_id` FOREIGN KEY (`vat_exempt_id`) REFERENCES `vat_exempted_tbl` (`vat_exempt_id`) ON UPDATE CASCADE;

--
-- Constraints for table `freebies_promo_tbl`
--
ALTER TABLE `freebies_promo_tbl`
  ADD CONSTRAINT `promobundle_freebies_id` FOREIGN KEY (`promobundle_id`) REFERENCES `promo_bundle_tbl` (`promobundle_id`) ON UPDATE CASCADE;

--
-- Constraints for table `freebies_tbl`
--
ALTER TABLE `freebies_tbl`
  ADD CONSTRAINT `service_id` FOREIGN KEY (`service_id`) REFERENCES `services_tbl` (`service_id`) ON UPDATE CASCADE;

--
-- Constraints for table `giftcert_payment_tbl`
--
ALTER TABLE `giftcert_payment_tbl`
  ADD CONSTRAINT `cust_services_id` FOREIGN KEY (`cust_id`) REFERENCES `customer_tbl` (`cust_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `gc_id_services` FOREIGN KEY (`gc_id`) REFERENCES `giftcertificate_tbl` (`gc_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `gc_services_id` FOREIGN KEY (`services_availed_id`) REFERENCES `services_availed_tbl` (`service_availed_id`) ON UPDATE CASCADE;

--
-- Constraints for table `loyalty_tbl`
--
ALTER TABLE `loyalty_tbl`
  ADD CONSTRAINT `cust_id` FOREIGN KEY (`cust_id`) REFERENCES `customer_tbl` (`cust_id`) ON UPDATE CASCADE;

--
-- Constraints for table `medical_history_tbl`
--
ALTER TABLE `medical_history_tbl`
  ADD CONSTRAINT `medhist_cust_id` FOREIGN KEY (`cust_id`) REFERENCES `customer_tbl` (`cust_id`) ON UPDATE CASCADE;

--
-- Constraints for table `package_tbl`
--
ALTER TABLE `package_tbl`
  ADD CONSTRAINT `room_included` FOREIGN KEY (`package_roomIncluded`) REFERENCES `room_tbl` (`room_id`) ON UPDATE CASCADE;

--
-- Constraints for table `payment_loyalty_trans_tbl`
--
ALTER TABLE `payment_loyalty_trans_tbl`
  ADD CONSTRAINT `loyalty_id_payment` FOREIGN KEY (`loyalty_id`) REFERENCES `loyalty_tbl` (`member_id`) ON UPDATE CASCADE;

--
-- Constraints for table `payment_tbl`
--
ALTER TABLE `payment_tbl`
  ADD CONSTRAINT `payment_cust_id` FOREIGN KEY (`cust_id`) REFERENCES `customer_tbl` (`cust_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_services_availed_id` FOREIGN KEY (`services_availed_id`) REFERENCES `services_availed_tbl` (`service_availed_id`) ON UPDATE CASCADE;

--
-- Constraints for table `points_payment_tbl`
--
ALTER TABLE `points_payment_tbl`
  ADD CONSTRAINT `cust_id_payment` FOREIGN KEY (`cust_id`) REFERENCES `customer_tbl` (`cust_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `services_availed_id_points` FOREIGN KEY (`services_availed_id`) REFERENCES `services_availed_tbl` (`service_availed_id`) ON UPDATE CASCADE;

--
-- Constraints for table `promo_bundle_tbl`
--
ALTER TABLE `promo_bundle_tbl`
  ADD CONSTRAINT `room_included_in_promo` FOREIGN KEY (`promobundle_roomIncluded`) REFERENCES `room_tbl` (`room_id`) ON UPDATE CASCADE;

--
-- Constraints for table `room_in_service_tbl`
--
ALTER TABLE `room_in_service_tbl`
  ADD CONSTRAINT `room_id_in_service` FOREIGN KEY (`room_id`) REFERENCES `room_tbl` (`room_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `walkin_id_in_service` FOREIGN KEY (`walkin_id`) REFERENCES `walkin_queue_tbl` (`walkin_id`) ON UPDATE CASCADE;

--
-- Constraints for table `room_tbl`
--
ALTER TABLE `room_tbl`
  ADD CONSTRAINT `room_type_id` FOREIGN KEY (`room_type_id`) REFERENCES `room_type_tbl` (`room_type_id`) ON UPDATE CASCADE;

--
-- Constraints for table `services_availed_tbl`
--
ALTER TABLE `services_availed_tbl`
  ADD CONSTRAINT `service_availed_walkin_id` FOREIGN KEY (`transaction_id`) REFERENCES `walkin_queue_tbl` (`walkin_id`) ON UPDATE CASCADE;

--
-- Constraints for table `services_tbl`
--
ALTER TABLE `services_tbl`
  ADD CONSTRAINT `service_duration_id` FOREIGN KEY (`service_duration_id`) REFERENCES `service_duration_tbl` (`service_duration_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `service_type_id` FOREIGN KEY (`service_type_id`) REFERENCES `service_type_tbl` (`service_type_id`) ON UPDATE CASCADE;

--
-- Constraints for table `service_in_package_tbl`
--
ALTER TABLE `service_in_package_tbl`
  ADD CONSTRAINT `package_id` FOREIGN KEY (`package_id`) REFERENCES `package_tbl` (`package_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `service_in_package_id` FOREIGN KEY (`service_id`) REFERENCES `services_tbl` (`service_id`) ON UPDATE CASCADE;

--
-- Constraints for table `service_in_promo_tbl`
--
ALTER TABLE `service_in_promo_tbl`
  ADD CONSTRAINT `serv_in_promo_promobundle_id` FOREIGN KEY (`promobundle_id`) REFERENCES `promo_bundle_tbl` (`promobundle_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `serv_in_promo_service_id` FOREIGN KEY (`service_id`) REFERENCES `services_tbl` (`service_id`) ON UPDATE CASCADE;

--
-- Constraints for table `therapist_account_tbl`
--
ALTER TABLE `therapist_account_tbl`
  ADD CONSTRAINT `account_therapist_id` FOREIGN KEY (`therapist_id`) REFERENCES `therapist_tbl` (`therapist_id`) ON UPDATE CASCADE;

--
-- Constraints for table `therapist_attendance_tbl`
--
ALTER TABLE `therapist_attendance_tbl`
  ADD CONSTRAINT `thera_id` FOREIGN KEY (`therapist_id`) REFERENCES `therapist_tbl` (`therapist_id`) ON UPDATE CASCADE;

--
-- Constraints for table `therapist_in_service_tbl`
--
ALTER TABLE `therapist_in_service_tbl`
  ADD CONSTRAINT `thera_id_in` FOREIGN KEY (`therapist_id`) REFERENCES `therapist_tbl` (`therapist_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `walkin_serv_id_in` FOREIGN KEY (`walkin_id`) REFERENCES `walkin_queue_tbl` (`walkin_id`) ON UPDATE CASCADE;

--
-- Constraints for table `therapist_specialty_tbl`
--
ALTER TABLE `therapist_specialty_tbl`
  ADD CONSTRAINT `specialty_id` FOREIGN KEY (`specialty_id`) REFERENCES `specialty_tbl` (`specialty_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `therapist_id` FOREIGN KEY (`therapist_id`) REFERENCES `therapist_tbl` (`therapist_id`) ON UPDATE CASCADE;

--
-- Constraints for table `walkin_queue_tbl`
--
ALTER TABLE `walkin_queue_tbl`
  ADD CONSTRAINT `walkin_queue_cust_id` FOREIGN KEY (`cust_id`) REFERENCES `customer_tbl` (`cust_id`) ON UPDATE CASCADE;

--
-- Constraints for table `walkin_services_tbl`
--
ALTER TABLE `walkin_services_tbl`
  ADD CONSTRAINT `walkin_reserv_package_id` FOREIGN KEY (`package_id`) REFERENCES `package_tbl` (`package_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `walkin_reserv_promobundle_id` FOREIGN KEY (`promobundle_id`) REFERENCES `promo_bundle_tbl` (`promobundle_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `walkin_reserv_service_id` FOREIGN KEY (`service_id`) REFERENCES `services_tbl` (`service_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `walkin_reserv_walkin_id` FOREIGN KEY (`walkin_id`) REFERENCES `walkin_queue_tbl` (`walkin_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
