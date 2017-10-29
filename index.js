var _ = require('lodash')
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');

var implementation = require("./implementation.js")
var solutiondata = require('./data.js')
var imp = implementation.create(solutiondata);

// Construct a schema, using GraphQL schema language
var schema = require('./schema.js')

var builtSchema = buildSchema(schema);

var app = express();
app.use('/specifications/graphql', graphqlHTTP({
  schema: builtSchema,
  rootValue: imp.getRoot(),
  graphiql: true,
}));
app.listen(5000);
console.log('Running an API server at localhost:5000/specifications/graphql');
