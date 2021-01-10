const express = require("express");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const faker = require("faker");

const articles = require("./fadeData").articles();

require("dotenv").config();

const { AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_NAMESPACE, PORT } = process.env;
const app = express();

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  throw new Error(
    "Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file"
  );
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors()); // Enable CORS

// Create middleware for checking the JWT
const jwtCheck = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer
  audience: AUTH0_AUDIENCE, // Available at Dashboard > APIs as "Identifier"
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.head("/", (req, res) => res.send("ok"));

// Create articles API endpoint
app.post(
  "/article",
  jwtCheck,
  jwtAuthz(["create:articles"], { customScopeKey: "permissions" }),
  function (req, res) {
    const article = req.body;

    // Determine id for new article
    var max = Math.max(...articles.map((elt) => elt.id));
    article.id = max + 1;
    article.date = faker.date.recent();

    // Associate the articles entry with the current user
    article.user_id = req.user[`${AUTH0_NAMESPACE}email`];

    // Append the article
    articles.push(req.body);

    // Send the response
    res.status(201).send(article);
  }
);

// Writer role: Get articles API endpoint
app.get(
  "/w-articles",
  jwtCheck,
  jwtAuthz(["review:articles"], { customScopeKey: "permissions" }),
  function (req, res) {
    // Get articles entries for this user
    var userEntries = articles.filter(
      (entry) => entry.user_id === req.user[`${AUTH0_NAMESPACE}email`]
    );

    //send the response
    res.status(200).send(userEntries);
  }
);

// Reader role: Get articles API endpoint
app.get(
  "/articles",
  jwtCheck,
  jwtAuthz(["read:articles"], { customScopeKey: "permissions" }),
  function (req, res) {
    console.log(req.user, req.user[`${AUTH0_NAMESPACE}email`]);
    //send the response
    res.status(200).send(articles);
  }
);

// Launch the API Server at localhost:8080
app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
