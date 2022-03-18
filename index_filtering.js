/*jshint esversion: 9 */
require("dotenv").config();
const { Console } = require("console");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const data = require("./data.json"); // only read once

// First filtering
function filterDataFirst(data) {
  let dataFiltered = {};
  let dataFilteredAll = [];
  //   const regexp = /(^ids=\"$)?[0-9]\w+/g;
  const regexp = /(?!.*ids=)[0-9]+/g;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (
        data[key]["post_content"].includes("ids=") &&
        !data[key]["post_type"].includes("revision")
      ) {
        dataFiltered = {
          ...dataFiltered,
          ID: data[key]["ID"],
          post_title: data[key]["post_title"],
          post_name: data[key]["post_name"],
          post_date: data[key]["post_date"],
          post_content: data[key]["post_content"].match(regexp),
        };
        dataFilteredAll = [...dataFilteredAll, dataFiltered];
      }
    }
  }
  return dataFilteredAll;
}
// First filtering end

// save JSON Object
const jsonContent = JSON.stringify(filteredDataFirst);
console.log(jsonContent);
fs.writeFile("output.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }
  console.log("JSON file has been saved.");
});
// save JSON Object end
