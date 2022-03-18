USE employee_db;

INSERT INTO departments (id, department) VALUES ("1", "Worlds Strongest Man");
INSERT INTO departments (id, department) VALUES ("2", "Worlds Fastest Person");
INSERT INTO departments (id, department) VALUES ("3", "Professional Painter");


INSERT INTO roles (id, title, salary, depId) VALUES ("1", "Big Kahuna", "80000", "1");
INSERT INTO roles (id, title, salary, depId) VALUES ("2", "Meteor Man", "50000", "2");
INSERT INTO roles (id, title, salary, depId) VALUES ("3", "Cocktail Waiter", "40000", "3");


INSERT INTO employees (id, firstName, lastName, roleId, managerId) VALUES ("1", "Alexis", "Mozo", "1", NULL);
INSERT INTO employees (id, firstName, lastName, roleId, managerId) VALUES ("2", "Schrestha", "Bipin", "1", "1");
INSERT INTO employees (id, firstName, lastName, roleId, managerId) VALUES ("3", "Absolute", "Vodka", "2", "4");