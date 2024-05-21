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
    },
    {
      type: 'list',
      name: 'choice2',
      message: 'How the bot should display the image:',
      choices: [
        'Top left to bottom right (default)',
        'Random'
      ]
    },
    {
      type: 'confirm',
      name: 'choice3',
      message: 'The bot should replace transparent pixels (default: false)?',
      default: false
    }
  ];

  try {
    const settings = {
      recurence: 'one-time',
      display: 'top-left-to-bottom-right',
      erase: true
    }
    const answers = await inquirer.prompt(questions);
    if (answers.choice === 'One time (default)')
      settings.recurence = 'one-time';
    else
      settings.recurence = 'infinite';

    if (answers.choice2 === 'Top left to bottom right (default)')
      settings.display = 'top-left-to-bottom-right';
    else
      settings.display = 'random';

    settings.erase = answers.choice3;
    return settings;
  } catch (error) {
    console.error('Error displaying question:', error);
  }
}

module.exports = displayQuestion;
