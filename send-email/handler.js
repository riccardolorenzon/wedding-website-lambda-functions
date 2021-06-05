"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require("aws-sdk");
var ses = new aws.SES({
  region: "eu-west-1",
});

module.exports.sendEmail = (event, context, callback) => {
  var message = "";
  let event_json = JSON.parse(event.body);
  if (event_json['code'] != '12052017'){
    const response = {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: 'specified code is not correct',
      }),
    };
    callback(null, response);
    return;
  }
  for (var key in event_json) {
    message = message.concat(`${key}: ${event_json[key]} \n`);
  }
  var params = {
    Destination: {
      ToAddresses: ["riccardo.lorenzon@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: "Email from wedding website",
      },
    },
    Source: "info@filipasaidyes.com",
  };

  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log(err);
      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: err.message,
        }),
      };
      callback(null, response);
    } else {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "email sent",
        }),
      };
      console.log(data);
      callback(null, response);
    }
  });
};
