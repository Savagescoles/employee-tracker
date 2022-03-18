const path = require('path');
const fs = require('fs');
const connection = require('./db/connection');
let mysql = require('mysql');
let inquirer = require("inquirer");

connection.connect(function (err) {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  init();
});

//Something to catch the eye but basically just some art on the banner
function init() {
  console.log(`---**---**-----**----**-----**------**---**-----**----**-----`)
  console.log(`----**---**----**----**---**-----**----**-----**-----*--***--`)
  console.log(`!!!!!Welcome to Super Hero Micro Managing Employee Market!!!!`)
  console.log(`-**---**----**----**---**-----**----**-----**-----*--***-`)
  console.log(`---**---**-----**----**-----**------**---**-----**----**-----`)
  whatsNext();
}
// Scrolling wheel of options for user to choose from
function whatsNext() {
  inquirer.prompt([{
    type: "list",
    name: "arrayOptions",
    message: "What would you like to do?",
    choices: [
      {
        name: "View all your Super Hero Employees",
        value: "VIEW_EMPLOYEES"
      },
      {
        name: "View all your available Super Hero roles",
        value: "VIEW_ROLES"
      },
      {
        name: "View all available Super Hero Departments",
        value: "VIEW_DEPT"

      }, {
        name: "Add a Super Hero employee",
        value: "ADD_EMPLOYEE"
      },
      {
        name: "Update a Super Employee",
        value: "UPDATE_EMP"
      },
      {
        name: "Add an available Super Hero Role",
        value: "ADD_ROLE"
      },
      {
        name: "Add an available Super Hero Department",
        value: "ADD_DEPT"
      }

    ]
  }]).then(({ arrayOptions: arrayOptions }) => {
    if (arrayOptions === "VIEW_EMPLOYEES") {
      viewEmployee()
    } else if (arrayOptions === "ADD_EMPLOYEE") {
      addSuperHeroEmployee()
    } else if (arrayOptions === "ADD_ROLE") {
      addSuperHeroRoles();
    } else if (arrayOptions === "UPDATE_EMP") {
      updateSuperHeroEmployees();
    }
    else if (arrayOptions === "ADD_DEPT") {
      addSuperHeroDept()
    }
    else if (arrayOptions === "VIEW_ROLES") {
      viewRoles()
    }
    else if (arrayOptions === "VIEW_DEPT") {
      viewDepartments()
    }
    else if (arrayOptions === "UPDATE_ROLE") {
      updateSuperHeroRole()
    }
  })
}

function viewDepartments() {
  console.log("Selecting all departments...\n");
  connection.query("SELECT id AS `ID`, department AS `Department` FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
    areYouFinished();

  });
}
function viewRoles() {
  console.log("Selecting all roles...\n");
  connection.query("SELECT title AS `Title`, salary AS `Salary`, depId AS `Department Id` FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);
    areYouFinished();

  });
}
function viewEmployee() {
  console.log("Selecting all employees...\n");
  connection.query("SELECT firstName AS `First Name`, lastName AS `Last Name`, roleId AS `Role Id` FROM employees", function (err, res) {
    if (err) throw err;
    console.table(res);
    areYouFinished();

  });
}
// add DATA - Name, Role
function updateSuperHeroRole() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    const roles = res.map(element => {
      return element.id
    })
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is their first name?"
        },
        {
          name: "lastName",
          type: "input",
          message: "What is their last name?"
        },
        {
          name: "roleId",
          type: "list",
          message: "What is their role id?",
          choices: roles
        }

      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO employees SET ?",
          answer,
          function (err) {
            if (err) throw err;
            console.log(`${answer.firstName} ${answer.lastName} was added successfully`);
            areYouFinished();
          }
        );
      });
  })
}
function addSuperHeroEmployee() {
  connection.query("SELECT id, title from roles", function (err, res) {
    if (err) throw err;
    const roles = res.map(element => element.title)
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the new employees first name?"
      },{
        name: "lastName",
        type: "input",
        message: "What is the new employees last name?"
      }, {
        name: "roles",
        type: "list",
        message: "What is the title of their role?",
        choices: roles
      }
    ]).then(answers => {
      const chosenRole = res.find(element => {
        return element.title === answers.roles
      });
      console.log(chosenRole.id);
      const newEmployee = {
        firstName: answers.firstName,
        lastName: answers.lastName,
        roleId: chosenRole.id
      };
      connection.query("INSERT INTO employees SET ?", newEmployee, (err, success) => {
        if (err) throw err;
        console.log(`${newEmployee.firstName} was added successfully`);
        areYouFinished();
      })

    })

  })

}
function updateSuperHeroEmployees() {
  connection.query("Select * from employees", function (err, res) {
    if (err) throw err;
    //new list of first and last names
    const names = res.map(element => {
      return `${element.id}: ${element.firstName} ${element.lastName}`
    })
    connection.query("SELECT title, id from roles", function(err, success) {
      if (err) throw err;
      const roles = success.map(element => element.title);  
      inquirer.prompt([
        {
          name: "who",
          type: "list",
          choices: names,
          message: "Who would you like to update?"
        }, {
          name: "roles",
          type: "list",
          message: "What is the title of their new Super role?",
          choices: roles
        }
      ]).then(answers => {
        console.log(answers);
        const empIdToUpdate = answers.who.split(":")[0];
        console.log(empIdToUpdate)
        const chosenRole = success.find(element => {
          return element.title === answers.roles
        });
        console.log(chosenRole.id);
        connection.query("UPDATE employees SET roleId=? where id=?", [chosenRole.id, empIdToUpdate], function(err, yay) {
          if (err) throw err;
          console.log(`role successfully changed`)
          areYouFinished();
        })
        
      })
    })
  })

}

function addHero() {
  // get role data
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    const lastName = res.map(element => {
      return element.lastName
    })
    inquirer
      .prompt([
        // role dependant on role data
        {
          name: "lastName",
          type: "list",
          message: "Who's role would you like to update?",
          choices: lastName
        },
        {
          name: "newRole",
          type: "input",
          message: "What is their new SUPER role?"
        }
      ])
      .then(function (answer) {
        "UPDATE employees SET roleId = newRole WHERE condition;"
        connection.query(
          "INSERT INTO employees SET ?",
          answer,
          function (err) {
            if (err) throw err;
            console.log(`${answer.lastName}  was added successfully`);
            areYouFinished();
          }
        );
      });
  })
}
function addSuperHeroDept() {
  // role data
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    const departments = res.map(element => {
      return element.id
    })
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "What is their new cool department?"
        }

      ])
      .then(function (answer) {
        //insert new item in db
        connection.query(
          "INSERT INTO departments SET ?",
          answer,
          function (err) {
            if (err) throw err;
            console.log(`${answer.department} was added successfully`);
            areYouFinished();
          }
        );
      });
  })
}
function addSuperHeroRoles() {
  // Role Data
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    const departments = res.map(element => {
      return element.id
    })
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is their cool title?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is their *averageish* salary?"
        },
        {
          name: "depId",
          type: "list",
          message: "What is their department id?",
          choices: departments
        }

      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO roles SET ?",
          answer,
          function (err) {
            if (err) throw err;
            console.log(`${answer.title} was added successfully`);
            areYouFinished();
          }
        );
      });
  })
}

function areYouFinished() {
  inquirer.prompt([
    {
      type: "list",
      name: "continue",
      message: "Would you like to continue micro managing?",
      choices: [
        {
          name: "Yes",
          value: true
        },
        {
          name: "No",
          value: false
        }
      ]
    }
  ]).then(function (answers) {
    if (answers.continue) {
      whatsNext()
    } else {
      console.log(`May the force be with you, thank you for micro managing your Employees`);
      process.exit();
    }
  })
}


