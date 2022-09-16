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
        canitradetoday: sma10_cur > sma10_prev && sma20_cur > sma20_prev && quotes[0].close > sma10_cur && quotes[0].close > sma20_cur
      }

      res.end("Can I Trade Today: " + (result.canitradetoday ? "Yes" : "No"));
    }
  );
});

module.exports.handler = serverless(app);
