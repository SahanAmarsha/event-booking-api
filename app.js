const express = require("express");
const bodyParser = require('body-parser');
const  graphqlHttp  = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
        
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        
        schema {
            query: RootQuery 
            mutation: RootMutation
        }
        
        `),
    rootValue: {
        events: () => {
            return Event.find().then(
                events => {
                    return events.map(
                        event => {
                            return { ...event._doc};
                        }
                    )
                }
            ).catch(

            )
        },
        createEvent: (args) => {
            const event = new Event
            ({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });

            return event.save().then(result => {
                console.log(result);
                return{...result._doc};
            }).catch(err => {
                console.log(err);
                throw (err);
            });
        },
        createUser: (args) => {
            return User.findOne({
                email: args.userInput.email
            }).then(user => {
             if(user)
             {
                 throw new Error('User Exists already.')
             }
                return bcrypt.hash(args.userInput.password, 12)
            })
                .then(hashedPwd => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPwd
                    });

                    return user.save();
                })
                .then(result => {
                    console.log(result);
                    return {...result._doc};
                })
                .catch(err => {
                    throw err;
                });


        }

    },
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

