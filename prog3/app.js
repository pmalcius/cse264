// Paulius Malcius - pam226

const express = require("express");
const path = require("path");

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.resolve(__dirname, "public")));

let month = 0;
let year = 0;

function genCalendar(month, year, req, res) {
  function calcLastDayOfMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  function isToday(m, d, y) {
    const today = new Date();
    return m === today.getMonth() + 1 && y === today.getFullYear() && d === today.getDate();
  }

  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let header_string = `${monthNames[month]} ${year}`;

  let calendar_string = "";

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDay = calcLastDayOfMonth(month, year);
  let dayCounter = 1;

  for (let row = 0; row < 6; row++) {
    calendar_string += "<tr>";
    for (let col = 0; col < 7; col++) {
      if ((row === 0 && col < firstDay) || dayCounter > lastDay) {
        calendar_string += "<td></td>";
      } else {
        const cellClass = isToday(month, dayCounter, year) ? "today" : "";
        calendar_string += `<td class="${cellClass}">${dayCounter}</td>`;
        dayCounter++;
      }
    }
    calendar_string += "</tr>";
  }

  res.render("index", {
    header: header_string,
    calendar: calendar_string
  });
}

app.get("/calendar", function(req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  } else {
    let today = new Date();
    month = today.getMonth() + 1;
    year = today.getFullYear();
  }
  genCalendar(month, year, req, res);
});

app.get("/backmonth", function(req, res) {
  month--;
  if (month < 1) {
    month = 12;
    year--;
  }
  genCalendar(month, year, req, res);
});

app.get("/forwardmonth", function(req, res) {
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }
  genCalendar(month, year, req, res);
});

app.get("/backyear", function(req, res) {
  year--;
  genCalendar(month, year, req, res);
});

app.get("/forwardyear", function(req, res) {
  year++;
  genCalendar(month, year, req, res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
