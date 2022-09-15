const yahooFinance = require("yahoo-finance");

const express = require("express");
const serverless = require("serverless-http");
const app = express();

app.get("/api/iwo", function (req, res) {
  var dateEnd = new Date();
  var dateStart = new Date();
  dateStart.setDate(dateStart.getDate() - 100);

  yahooFinance.historical(
    {
      symbol: "IWO",
      from: dateStart.toISOString().split("T")[0],
      to: dateEnd.toISOString().split("T")[0],
      period: "d",
    },
    function (err, quotes) {
      console.log(quotes);
      var sma10 = 0;
      var sma20 = 0;
      var sma50 = 0;
      for (let i = 0; i < 50; i++) {
        if (i < 10) {
          sma10 += quotes[i].close;
        }
        if (i < 20) {
          sma20 += quotes[i].close;
        }
        sma50 += quotes[i].close;
      }
      sma10 /= 10.0;
      sma20 /= 20.0;
      sma50 /= 50.0;
      var result = {
        SMA_10: sma10,
        SMA_20: sma20,
        SMA_50: sma50,
        Quotes: quotes,
      };
      res.end(JSON.stringify(result));
    }
  );
});

module.exports.handler = serverless(app);
