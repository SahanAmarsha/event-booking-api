const bcrypt = require("bcrypt");

const Event = require('../../models/event');
const User = require('../../models/user');


const user = userId => {
    return User.findById(userId)
        .then( user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw (err);
        });
};

const events = eventIds => {
    return Event.find({
        _id: {$in: eventIds}
    })
        .then(events => {
            return events.map( event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)}
            });
        })
        .catch(err => {
            throw err;
        })
};

module.exports = {
    events: () => {
        return Event.find()
            .then(
                events => {
                    return events.map(
                        event => {
                            return {
                                ...event._doc,
                                _id: event.id,
                                date: new Date(event._doc.date).toISOString(),
                                creator: user.bind(this, event._doc.creator)
                            };
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
            date: new Date(args.eventInput.date),
            creator: '5f2af6ffabc7943244fcfd12'
        });

        let createdEvent;
        return event
            .save()
            .then(result => {
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                };
                console.log(result);
                return User.findById('5f2af6ffabc7943244fcfd12');


            })
            .then(user => {
                if(!user)
                {
                    throw new Error('User Does Not Exist.')
                }
                user.createdEvents.push(event)
            })
            .then(result => {

                return createdEvent;
            })
            .catch(err => {
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

}