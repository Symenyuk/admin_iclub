const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
const useragent = require('express-useragent');
const fs = require('fs');
let config = fs.readFileSync('config.json', 'utf8');
config = JSON.parse(config);

app.use(useragent.express());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// app.use(function(request, response){
//   if(!request.secure){
//     response.redirect("https://" + request.headers.host + request.url);
//   }
// });

// app.get("*", function(request, response){
//   response.redirect("https://" + request.headers.host + request.url);
// });

// NGINX REDIRECTING
// server {
//   listen 443 ssl;
//   server_name example.com www.example.com;

//   # ssl configuration
//   ssl on;
//   ssl_certificate /path/to/certificate.crt;
//   ssl_certificate_key /path/to/private.key;

//   if ($http_host = www.example.com) {
//     return 301 https://example.com$request_uri;
//   }
// }




sgMail.setApiKey(config.sendGridKey);

app.use(express.static('dist'));

const users = config.users;


app.post('/login', (req, res) => {
  let data = [];
  req.on('data', function (chunk) {
    data.push(chunk);
  });
  req.on('end', function () {
    if (!data.length) {
      res.writeHead(400, {"Content-Type": "text/plain"});
      res.end("Error. Need data");
      return;
    }
    data = Buffer.concat(data).toString();
    let loginData = JSON.parse(data);

    let currentUser = {};
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === loginData.username && users[i].password === loginData.password) {
        if (currentUser.username !== loginData.username) {
          currentUser = {
            username: users[i].username,
          };
          res.send(currentUser);
        }
        break;
      } else {
        res.status(401).send({error: 'Data not correct'});
      }
    }
  })
});

app.post('/send_mail', (req, res) => {
  let data = [];
  req.on('data', function (chunk) {
    data.push(chunk);
  });
  req.on('end', function () {
    if (!data.length) {
      res.writeHead(400, {"Content-Type": "text/plain"});
      res.end("Error. Need data");
      return;
    }
    data = Buffer.concat(data).toString();
    mailData = JSON.parse(data);

    const msg = {
      to: mailData.to,
      from: config.email,
      subject: mailData.subject,
      // text: mailData.body,
      // html: `${mailData.body}`,
      // html: `<a href="appiclub://invite?ref=999999" target="_blank">LINK</a>`,
      content: [
        {
          type: 'text/html', // text/html  application/json
          // value: '<a href="appiclub://invite?ref=999999" target="_blank">LINK</a> ksnknd  dsfsnf sdfsdfds fdsf',
          // value: '<a href="appip.iclub.vc/data/ref/gcdgggvffffgbv" target="_blank">LINK</a> ksnknd  dsfsnf sdfsdfds fdsf',
          value: mailData.body
        }
      ]
    };

    sgMail.send(msg, (error, info) => {
      if (error) {
        console.log('error', error);
      } else {
        res.status(200).json({
          message: 'successfuly sent!'
        })
      }
    });
  });
});

app.use((req, res) => {
  console.log('browser ', req.useragent.browser, ' os ', req.useragent.os);
  if (req.useragent.browser === 'Safari' && req.useragent.isDesktop === true) {
    res.sendFile(__dirname + '/safari.html');
  // } else if (req.useragent.browser === 'Chromium' || req.useragent.browser === 'Firefox' || req.useragent.browser === 'Chrome') {
  } else {
    res.sendFile(__dirname + '/dist/index.html');
  }
});

app.listen(config.front_port, () => {
  console.log('Server is running at port: ', config.front_port);
});
