DROP DATABASE IF EXISTS fun_to_do;

CREATE DATABASE fun_to_do COLLATE 'utf8mb4_general_ci';

USE fun_to_do;

CREATE TABLE users (
`id` INT(6) auto_increment primary KEY,
`name` VARCHAR(20) NOT NULL unique key,
`password` VARCHAR(20) NOT NULL,
`mail` VARCHAR(25) default NULL,
`date` DATETIME  NOT NULL,
`points` INT(9) default 0,
`authorize` INT(6) NOT null
);

CREATE TABLE authorization(
`id` INT(6) AUTO_INCREMENT PRIMARY KEY,
`name` VARCHAR(20) NOT null
);

USE fun_to_do;
CREATE TABLE comments(
`id` INT(9) auto_increment primary key,
`postId` INT(6) NOT NULL,
`userId` INT(6) NOT NULL,
`date` DATETIME  NOT NULL,
`text` text -- maybe need to change-- 
);

CREATE TABLE rate(
`postId` INT(6) NOT NULL PRIMARY KEY,
`rate` FLOAT(5) DEFAULT NULL
);
CREATE TABLE rates(
`id` INT(15) auto_increment primary key,
`postId` INT(6) NOT NULL,
`rate` FLOAT(5) DEFAULT NULL,
`userId` INT(6) NOT NULL
);
ALTER TABLE `rates`
	ADD UNIQUE INDEX `postId_userId` (`postId`, `userId`);

CREATE TABLE posts(
`id` INT(6) auto_increment primary key,
`text` longtext NOT NULL,
`date` DATETIME NOT NULL,
`userId` INT(6) NOT NULL,
`labels` longtext default NULL,
`title` VARCHAR(200) not NULL,
`age` TEXT DEFAULT NULL,
`time` TEXT DEFAULT NULL,
`materials` TEXT DEFAULT NULL 
);

CREATE TABLE post_images(
`id` INT(9) auto_increment primary KEY,
`name` VARCHAR(16),
`postId` INT(6) DEFAULT 0,
`date` DATETIME NOT NULL
);
CREATE TABLE comment_images(
`id` INT(9) auto_increment primary KEY,
`name` VARCHAR(16),
`commentId` INT(6) DEFAULT 0,
`date` DATETIME NOT NULL
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'a1b2c3d4';

FLUSH PRIVILEGES;

INSERT INTO authorization 
VALUES (DEFAULT,"user"),(DEFAULT,"manager");

INSERT INTO users 
VALUES (DEFAULT,"manager","manager","manager@gmail.com","2022-07-21" ,DEFAULT,2)
