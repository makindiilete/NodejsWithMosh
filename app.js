const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db_init")();
require("./startup/config")();
require("./startup/joi_validate")();
require("./startup/prod")(app);

const port = process.env.PORT || 4000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
