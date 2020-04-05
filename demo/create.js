const program = require('commander');


program
  .version(require('../package.json').version, '-v, --version')
  .command('create <name>')
  .description('Create a new project')
  .action(name => {
    console.log(name);
  })

  program.parse(process.argv); 
