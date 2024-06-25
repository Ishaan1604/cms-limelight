// require('tests/auth')
// require('tests/policy')
// require('tests/userSide')
// require('tests/adminSide')
const { spawn } = require('child_process');

const tests = ['auth', 'policy', 'userSide', 'adminSide']

const runTestsSequentially = async (files) => {  
  for (const file of files) {
    await runTest(`tests/${file}`)
  }
  console.log('All tests completed.');
};

const runTest = (file) => {
  return new Promise((resolve, reject) => {
    console.log(`Running test file: ${file}`);
    const testProcess = spawn('npx', ['jest', file, '--detectOpenHandles']);

    testProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    testProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    testProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Test file ${file} failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
};
  
runTestsSequentially([...tests]).catch((err) => {
  console.error(err);
  process.exit(1);
});