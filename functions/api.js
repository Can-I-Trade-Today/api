const yahooFinance = require("yahoo-finance");

const express = require("express");
const serverless = require("serverless-http");
const app = express();

function GetSma(quotes, from, length) {
  let sma = 0;
  for (let i = from; i < from + length; i++) {
    sma += quotes[i].close;
  }
  sma /= length;
  return sma;
}

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
      let sma10_cur = GetSma(quotes, 0, 10);
      let sma20_cur = GetSma(quotes, 0, 20);

      let sma10_prev = GetSma(quotes, 1, 10);
      let sma20_prev = GetSma(quotes, 1, 20);

      var result = {
        SMA_10_Current: sma10_cur,
        SMA_20_Current: sma20_cur,
        SMA_10_Previous: sma10_prev,
        SMA_20_Previous: sma20_prev,
        SMA_10_IsRising: sma10_cur > sma10_prev,
        SMA_20_IsRising: sma20_cur > sma20_prev,
        Quotes: quotes,
      };
      res.end(JSON.stringify(result));
    }
  );
});

module.exports.handler = serverless(app);
