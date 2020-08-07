const express = require("express");
const bodyParser = require('body-parser');
const  graphqlHttp  = require('express-graphql').graphqlHTTP;
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolver/index');

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fc9by.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose
    .connect( uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() =>{
        app.listen(3000);
    })
    .catch(err => console.log( err ));

mongoose.connection.on('connected',()=>{
    console.log("mongoose is connected");
});

