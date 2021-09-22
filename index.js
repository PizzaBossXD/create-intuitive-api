#! /usr/bin/env node

const { spawn } = require('child_process');

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: create-intuitive-api name-of-api
`);
}

const repoURL = 'https://github.com/PizzaBossXD/intuitive-api.git';

runCommand('git', ['clone', repoURL, name])
  .then(() => {
    return runCommand('rm', ['-rf', `${name}/.git`]);
  }).then(() => {
    console.log('Installing needed dependencies using npm...');
    return runCommand('npm', ['install'], {
      cwd: process.cwd() + '/' + name
    });
  }).then(() => {
    console.log(`Successfully installed Intuitive API in directory ${name}`);
    console.log('');
    console.log('You may start by running:');
    console.log(`cd ${name}`);
    console.log('And then:');
    console.log('npm run dev');
    console.log('Happy Intuitive Hacking! :)');
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    spawned.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    spawned.on('close', () => {
      resolve();
    });
  });
}