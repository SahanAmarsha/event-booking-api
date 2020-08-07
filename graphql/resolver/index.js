const bcrypt = require("bcrypt");

const Event = require('../../models/event');
const User = require('../../models/user');


const user = async userId => {
    try{
        const user = await User.findById(userId);

            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }


    } catch (e) {
        throw(e);
    }


};

const events = async eventIds => {
    try{

        const events = await Event.find({
            _id: {$in: eventIds}
        });


        return events.map( event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)}
        });


    }catch (e) {
        throw(e);
    }

};

module.exports = {
    events: async () => {
        try{
            const events = await Event.find();

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


        } catch (e) {
            throw (e);
        }

    },

    createEvent: async (args) => {
        try{
            const event = new Event
            ({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5f2d7130e856c74d343ba0e9'
            });

            let createdEvent;
            const result = await event
                .save()

            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            console.log(result);
            const extUser = await User.findById('5f2af6ffabc7943244fcfd12');


            if(!extUser)
            {
                return new Error('User Does Not Exist.')
            }
            extUser.createdEvents.push(event);
            await extUser.save();
            return createdEvent;
        } catch (e) {
            throw (e);
        }


    },

    createUser: async (args) => {
        try{
            const extUser = await User.findOne({
                email: args.userInput.email
            });


            if(extUser)
            {
                return new Error('User Exists already.')
            }

            const hashedPwd =  await bcrypt.hash(args.userInput.password, 12);


            const user = new User({
                email: args.userInput.email,
                password: hashedPwd
            });

            const result = await user.save();


            console.log(result);
            return {...result._doc};

        } catch (e) {
            throw e;
        }
    }

}