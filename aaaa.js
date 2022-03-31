#! /usr/bin/env node

const { spawn } = require("child_process");

const name = process.argv[2];

const typescript = process.argv[3];

if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: create-intuitive-api name-of-api
`);
}

if (
  typescript.toLowerCase().startsWith("--ts") ||
  typescript.toLowerCase().startsWith("--typescript")
)
  console.log(`TypeScript mode enabled! ✅`);

const repoURL =
  typescript.toLowerCase().startsWith("--ts") ||
  typescript.toLowerCase().startsWith("--typescript")
    ? "https://github.com/PizzaBossXD/intuitive-api-ts.git"
    : "https://github.com/PizzaBossXD/intuitive-api.git";

runCommand("git", ["clone", repoURL, name])
  .then(() => {
    try {
      return runCommand("rm", ["-rf", `${name}/.git`]).catch((error) => {
        console.log(error);

        return runCommand("del", [`${name}/.git`]).catch((error) => {
          console.log("Could not delete .git folder.");
        });
      });
    } catch (error) {
      console.log(error);

      return runCommand("del", [`${name}/.git`]).catch((error) => {
        console.log("Could not delete .git folder.");
      });
    }
  })
  .then(() => {
    console.log("Installing needed dependencies using npm...");
    return runCommand("npm", ["install"], {
      cwd: process.cwd() + "/" + name,
    });
  })
  .then(() => {
    console.log(`Successfully installed Intuitive API in directory ${name}`);
    console.log("");
    console.log("You may start by running:");
    console.log(`cd ${name}`);
    console.log("And then:");
    console.log("npm run dev");
    console.log("Happy Intuitive Hacking! :)");
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    spawned.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    spawned.on("close", () => {
      resolve();
    });
  });
}
