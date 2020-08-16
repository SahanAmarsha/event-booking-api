const bcrypt = require("bcrypt");

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');


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

const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id
        }
    } catch (e) {
        throw e;
    }
}

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

    bookings: async () => {

        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        }catch (e) {
            throw e;
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
    },

    bookEvent: async args  => {

        const fetchedEvent = await Event.findOne({ _id: args.eventId });

        const booking = new Booking({
            user: '5f2af6ffabc7943244fcfd12',
            event: fetchedEvent
        })

        const result = await booking.save();

        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, result._doc.user),
            event: singleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };


    },

    cancelBooking: async args =>{
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator)
            };

            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (e) {
            throw e;
        }
    }

};
