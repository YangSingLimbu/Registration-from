const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const apikey = process.env.api;
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function (req, res) {
  const { firstName, lastName, email, confirmEmail } = req.body;

  if (email !== confirmEmail) {
    res.sendFile(__dirname + "/public/failuare.html");
  }

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const listId = "454a4bf446";
  const url = `https://us10.api.mailchimp.com/3.0/lists/${listId}`;
  const options = {
    method: "POST",
    auth: `YangSing:${apikey}`,
  };

  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/success.html");
    } else {
      res.sendFile(__dirname + "/public/failuare.html");
    }

    response.on("data", function (data) {});
  });

  request.write(jsonData);
  request.end();
});

app.post("/failuare", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening at port 3000");
});

module.exports = app;
