const inquirer = require('inquirer');

module.exports = function areYouFinished() {
    inquirer.prompt([
      {
        type: "list",
        name: "continue",
        message: "Are you done micro-managing??",
        choices: [
          {
            name: "Yes - Finally",
            value: true
          },
          {
            name: "(Evil Chuckle) never",
            value: false
          }
        ]
      }
    ]).then(function (answers) {
      if (answers.continue) {
        whatsNext()
      } else {
        console.log(`Goodbye`);
        process.exit();
      }
    })
  }