const fs = require("fs");

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    return {};
  }
}

function writeJson(path, data) {
  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  readJson,
  writeJson
};