/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const exec = require('child_process').exec;
const fs = require('fs');

const FOAHrirData = {
  variableName: 'OmnitoneFOAHrirBase64',
  outputPath: ['src/resources', 'test/resources'],
  filename: 'omnitone-foa-hrir-base64.js',
  sources: [
    'src/resources/omnitone-foa-1.wav',
    'src/resources/omnitone-foa-2.wav',
  ],
};

const SOAHrirData = {
  variableName: 'OmnitoneSOAHrirBase64',
  outputPath: ['src/resources', 'test/resources'],
  filename: 'omnitone-soa-hrir-base64.js',
  sources: [
    'src/resources/omnitone-soa-1.wav',
    'src/resources/omnitone-soa-2.wav',
    'src/resources/omnitone-soa-3.wav',
    'src/resources/omnitone-soa-4.wav',
    'src/resources/omnitone-soa-5.wav',
  ],
};

const TOAHrirData = {
  variableName: 'OmnitoneTOAHrirBase64',
  outputPath: ['src/resources', 'test/resources'],
  filename: 'omnitone-toa-hrir-base64.js',
  sources: [
    'src/resources/omnitone-toa-1.wav',
    'src/resources/omnitone-toa-2.wav',
    'src/resources/omnitone-toa-3.wav',
    'src/resources/omnitone-toa-4.wav',
    'src/resources/omnitone-toa-5.wav',
    'src/resources/omnitone-toa-6.wav',
    'src/resources/omnitone-toa-7.wav',
    'src/resources/omnitone-toa-8.wav',
  ],
};

exec('src/resources/sox-hrir-script.sh', (error, stdout, stderr) => {
  if (stderr) {
    console.log(`${stderr}`);
  }

  console.log(`${stdout}`);
  console.log('[omnitone:build-hrir] Generating Base64-encoded HRIR data...');

  [FOAHrirData, SOAHrirData, TOAHrirData].forEach((hrirData) => {
    let content = 'const ' + hrirData.variableName + ' = [\n';
    hrirData.sources.forEach((path) => {
      const file = fs.readFileSync(path);
      const encodedData = new Buffer(file).toString('base64');
      content += '"' + encodedData + '",\n';
    });
    content += '];\n\n';
    content += 'module.exports = ' + hrirData.variableName + ';\n';

    // Write Base64-encoded HRIR files to src/ and test/.
    hrirData.outputPath.forEach((path) => {
      console.log(' - ' + path + '/' + hrirData.filename);
      fs.writeFileSync(path + '/' + hrirData.filename, content);
    });
  });

  // Clean up intermediate files.
  exec('rm src/resources/omnitone-*.wav');
  console.log('[omnitone:build-hrir] Generating Base64-encoded HRIR data '
              + 'completed.');
});
