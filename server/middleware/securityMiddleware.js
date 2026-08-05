const helmet = require("helmet");
const cors = require("cors");

const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
};

module.exports = securityMiddleware;
