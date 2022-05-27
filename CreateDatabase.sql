Configuration sequelize

Lancer le serveur mySql avec la commande : mysql.server start

CREATE DATABASE nom base de donné;
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nom_base_de_donné. * TO 'newuser'@'localhost';
USE Groupomania;

une fois connecté les tables se chargerons automatiquement