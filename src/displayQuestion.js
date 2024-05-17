const inquirer = require('inquirer');

async function displayQuestion() {
  const questions = [
    {
      type: 'list',
      name: 'choice',
      message: 'Chose the number of times the bot should run:',
      choices: [
        'One time (default)',
        'Infinite (!! Carful with api rate limits !!)'
      ]
    }
  ];

  try {
    const answers = await inquirer.prompt(questions);
    if (answers.choice === 'One time (default)') {
      return { mode: 'one-time' };
    } else {
      return { mode: 'infinite' };
    }
  } catch (error) {
    console.error('Error displaying question:', error);
  }
}

module.exports = displayQuestion;
