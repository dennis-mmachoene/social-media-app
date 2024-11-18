-- Create the database
CREATE DATABASE IF NOT EXISTS social_media_app;

-- Use the created database
USE social_media_app;

-- Create the `users` table
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(100) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `isAdmin` TINYINT(1) DEFAULT 0,
  `profilePicture` VARCHAR(255),
  `coverPicture` VARCHAR(255),
  `about` TEXT,
  `livesin` VARCHAR(255),
  `worksAt` VARCHAR(255),
  `country` VARCHAR(255),
  `relationship` VARCHAR(50),
  `followers` JSON,
  `following` JSON,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Create the `posts` table
CREATE TABLE `posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `description` TEXT,
  `likes` JSON,
  `image` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
