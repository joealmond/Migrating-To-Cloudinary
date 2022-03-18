/*jshint esversion: 9 */
require("dotenv").config();
const { Console } = require("console");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const filteredData = require("./output.json"); // only read once

// merging two jason tables based on common key. The tables where exported from MySQL relational database
for (let i = 0; i < filteredData.length; i++) {
  for (let l = 0; l < filteredData[i].post_content.length; l++) {
    for (let index = 0; index < data.length; index++) {
      if (data[index]["ID"] == filteredData[i].post_content[l]) {
        filteredData[i].post_content[l] = data[index].guid;
      }
    }
  }
}
// console.log(filteredData);
// merging the tables end

// save JSON Object
const jsonContent = JSON.stringify(filteredData);
console.log(jsonContent);
fs.writeFile("result.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }
  console.log("JSON file has been saved.");
});
// save JSON Object end
