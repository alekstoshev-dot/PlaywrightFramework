const { spawnSync } = require('node:child_process');
const path = require('node:path');
const task = process.argv[2];
if (!['spotlessCheck', 'spotlessApply'].includes(task))
  throw new Error('Unsupported formatting task');
const windows = process.platform === 'win32';
const wrapper = windows ? 'gradlew.bat' : './gradlew';
const result = spawnSync(
  windows ? 'cmd.exe' : 'sh',
  windows ? ['/d', '/c', wrapper, task, '--no-daemon'] : [wrapper, task, '--no-daemon'],
  { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' },
);
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
