const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

let problem = process.env.CF_PROBLEM.substring(
  process.env.CF_PROBLEM.split('/', 4).join('/').length + 1
);

problem = problem.replace('/problem/', '');

console.log('######################################');
console.log(`\nProblem: Codeforces-${problem}`);
console.log('\nPlease wait for Codeforces Server Response...');

if (!fs.existsSync('./Problems')) {
  fs.mkdirSync('./Problems');
}

let getTestCaseFromProblemHtml = (html) => {
  const $ = cheerio.load(html);

  var dir = `./Problems/${problem}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.copyFileSync(`./template.cpp`, `${dir}/${problem}.cpp`);
  data = [];

  $('div.output').each((i, elem) => {
    str = $(elem).text().trim();
    str = str.substring('Output'.length);
    str = str.trim();

    data[i] = {
      ...data[i],
      correct_answers: [str],
    };
  });
  $('div.input').each((i, elem) => {
    str = $(elem).text().trim();
    str = str.substring('Output'.length);
    str = str.trim();
    data[i] = {
      ...data[i],
      test: `${str}\n`,
    };
  });
  fs.writeFile(`${dir}/${problem}.cpp:tests`, JSON.stringify(data), function (
    err
  ) {
    if (err) {
      console.log(err);
    }
    console.log(`Problem ${dir.substring(dir.lastIndexOf('/') + 1)} saved!`);
  });
};

axios
  .get(process.env.CF_PROBLEM)
  .then((response) => {
    getTestCaseFromProblemHtml(response.data);
  })
  .catch((err) => console.log(err));
