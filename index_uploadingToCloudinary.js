/*jshint esversion: 9 */
require("dotenv").config();
const { Console } = require("console");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const dataResult = require("./result.json"); // only read once

let title;
let singleData;
let array = [];
let result;
let file;
let directory; // Cloudinary does not support special caracters in dir!
let l;
let i;
const cloudinaryImageUploadMethod = async (
  file,
  title,
  singleData,
  l,
  i,
  counter,
  galcount
) => {
  return new Promise((resolve) => {
    // Cludinary upload
    result = cloudinary.uploader.upload(
      file,
      {
        unique_filename: false,
        timeout: 60000,
        folder: directory,
        use_filename: true,
      },
      function (error, res) {
        try {
          resolve(
            array.push({
              title: title,
              origin: singleData,
              url: res.secure_url,
              id: res.public_id,
            })
          );
        } catch {
          console.log("Writing raw version...");
          result = cloudinary.uploader.upload(
            file,
            {
              resource_type: "raw",
              unique_filename: false,
              timeout: 60000,
              folder: directory,
              use_filename: true,
            },
            function (error, res) {
              try {
                resolve(
                  array.push({
                    title: title,
                    origin: singleData,
                    url: res.secure_url,
                    id: res.public_id,
                    isCorrupt: "yes",
                  })
                );
              } catch {
                console.log("Could not repair...");
                array.push({
                  error: "Could not repair...",
                  fileOrigin: file,
                });
              }
              // save JSON Object
              if (l >= dataResult[i].post_content.length - 1) {
                let jsonContent = JSON.stringify(array);
                fs.writeFile(
                  "dataUpload.json",
                  jsonContent,
                  "utf8",
                  function (err) {
                    if (err) {
                      console.log(
                        "An error occured while writing JSON Object to File."
                      );
                      return console.log(err);
                    }
                    console.log("JSON file has been saved.");
                  }
                );
                // save JSON Object end
              }
              if (error) return new Error(error);
            }
          );
        }
        // save JSON Object
        if (l >= dataResult[i].post_content.length - 1) {
          let jsonContent = JSON.stringify(array);
          fs.writeFile("dataUpload.json", jsonContent, "utf8", function (err) {
            if (err) {
              console.log(
                "An error occured while writing JSON Object to File."
              );
              return console.log(err);
            }
            console.log("JSON file has been saved.");
          });
          // save JSON Object end
        }
        if (error) return new Error(error);
      }
    );
  });
};
let counter = 0;
let galcount = 0;
let time = 3000;
const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const delayingForLoop = async () => {
  for (i = 0; i < dataResult.length; i++) {
    singleData = dataResult[i];
    title = dataResult[i].post_title;
    directory = `uploads/${title}`;
    for (l = 0; l < dataResult[i].post_content.length; l++) {
      file = dataResult[i].post_content[l];
      counter++;
      cloudinaryImageUploadMethod(file, title, singleData, l, i);
      console.log(dataResult.length, counter, galcount, file, title);
    }
    galcount++;

    await delay(time);
    console.log("wait");
  }
};
delayingForLoop();
