var express = require('express');
var app = express();
app.set('port',process.env.PORT || 3000);

app.use(
  function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  }
);

app.use(
  function (err)
);