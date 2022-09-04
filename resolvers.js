const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.resolvers = {
    Query: {

        getUser: async (parent, args) => {
            return await User.find({});
        },
        getListing: async (parent, args) => {
            return await Listing.find({});
        },

        getBooking: async (parent, args) => {
            return await Booking.find({});
        },



        getListingCreatedByAdmin: async (parent, args) => {
            return await Listing.find({ "type": args.type });
        },


        getListingByName: async (parent, args) => {
            return await Listing.find({ "listing_title": args.listing_title });
        },
        getListingByCity: async (parent, args) => {
            return await Listing.find({ "city": args.city });
        },




        getUserByID: async (parent, args) => {
            return await User.findById(args.id);
        },

        getUserByUsername: async (parent, args) => {
            return await User.find({ "username": args.username });
        },

        getListingByID: async (parent, args) => {
            return await Listing.findById(args.id);
        },
        getBookingByID: async (parent, args) => {
            return await Booking.findById(args.id);
        },

        getBookingByUsername: async (parent, args) => {
            return await Booking.find({ "username": args.username })
        },


        userLoggedInBooking: async (parent, { username, password }) => {

            const user = await User.findOne({ username: username });


            if (!user) {
                throw new Error('User does not exist!');
            }

            const passwordDB = user.password;

            if (passwordDB != password) {
                throw new Error('Password is incorrect!');
            }


            return await Booking.find({ "username": user });
        },


        adminLoggedInListing: async (parent, { username }) => {

            const admin = await Listing.find({ username: username });

            if (!admin) {
                throw new Error('Admin does not exist!');
            }

            return await Listing.find({ "username": admin })
        },


    },

    Mutation: {

        // ***********************User Start***************************
        addUser: async (parent, { username, firstname, lastname, email, password, type }) => {

            const emailExpression = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            const isValidEmail = emailExpression.test(email.toLowerCase())

            if (!isValidEmail) {
                throw new Error("Email is not valid")
            }

            const oldUser = await User.findOne({ email })
            if (oldUser) {
                throw new Error(`${email} already exist`)
            }


            let newUser = new User({
                username: username,
                firstname: firstname,
                lastname: lastname,
                password: password,
                email: email.toLowerCase(),
                type: type,
            });

            const token = jwt.sign(
                { user_id: newUser._id, email, username },
                "UNSAFE_STRING",
                {
                    expiresIn: "1h"
                }

            )

            newUser.token = token


            return await newUser.save();
        },

        userLoggedIn: async (parent, { username, password }) => {

            const user = await User.findOne({ username: username });

            if (!user) {
                throw new Error('User does not exist!');
            }

            const passwordDB = user.password;
            console.log(passwordDB)
            console.log(password)


            if (passwordDB != password) {
                throw new Error('Password is incorrect!');
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                'somesupersecretkey',
                {
                    expiresIn: '1h'
                }
            );
            return { userId: user.id, username: user.username, password: user.password, token: token, tokenExpiration: 1 };
        },

        adminLoggedIn: async (parent, { username }) => {

            const user = await Listing.findOne({ username: username });

            if (!user) {
                throw new Error('User does not exist!');
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                'somesupersecretkey',
                {
                    expiresIn: '1h'
                }
            );
            return { userId: user.id, username: user.username, token: token, tokenExpiration: 1 };
        },

        updateUser: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return;
            }
            return await User.findOneAndUpdate(
                {
                    _id: args.id
                },
                {
                    $set: {
                        username: args.username,
                        firstname: args.firstname,
                        lastname: args.lastname,
                        password: await bcryct.hash(password, 10),
                        email: email,
                        type: type,
                        token: jwt.sign(
                            { user_id: newUser._id, email, username },
                            "UNSAFE_STRING",
                            {
                                expiresIn: "1h"
                            }

                        )
                    }
                }, { new: true }, (err, user) => {
                    if (err) {
                        console.log('Could not update user !');
                    } else {
                        return user
                    }
                }
            );
        },

        deleteUser: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return JSON.stringify({ status: false, "message": "No ID found" });
            }
            return await User.findByIdAndDelete(args.id)
        },

        // ***********************User End***************************


        // ***********************Listing Start***************************


        addListing: async (parent, args) => {
            console.log(args)
            const emailExpression = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            const isValidEmail = emailExpression.test(String(args.email).toLowerCase())

            if (!isValidEmail) {
                throw new Error("Email is not valid")
            }

            let newListing = new Listing({
                listing_id: args.listing_id,
                listing_title: args.listing_title,
                description: args.description,
                street: args.street,
                city: args.city,
                postal_code: args.postal_code,
                price: args.price,
                email: args.email,
                username: args.username,
                type: args.type,
                created: args.created,
                token: args.token
            });


            const token = jwt.sign(
                { user_id: newListing._id },
                "UNSAFE_STRING",
                {
                    expiresIn: "1h"
                }

            )

            newListing.token = token

            return await newListing.save();
        },


        updateListing: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return;
            }
            return await Listing.findOneAndUpdate(
                {
                    _id: args.id
                },
                {
                    $set: {
                        listing_id: args.listing_id,
                        listing_title: args.listing_title,
                        description: args.description,
                        street: args.street,
                        city: args.city,
                        postal_code: args.postal_code,
                        price: args.price,
                        email: args.email,
                        username: args.user_id,
                        type: args.type,
                        created: args.created,
                        token: args.token
                    }
                }, { new: true }, (err, listing) => {
                    if (err) {
                        console.log('Could not update listing !');
                    } else {
                        return listing
                    }
                }
            );
        },


        deleteListing: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return JSON.stringify({ status: false, "message": "No ID found" });
            }
            return await Listing.findByIdAndDelete(args.id)
        },



        // ***********************Listing End***************************




        // ***********************Booking start***************************


        addBooking: async (parent, args) => {

            let newBooking = new Booking({
                listing_id: args.listing_id,
                booking_id: args.booking_id,
                booking_date: args.booking_date,
                booking_start: args.booking_start,
                booking_end: args.booking_end,
                username: args.username,
            });
            return await newBooking.save();
        },



        updateBooking: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return;
            }
            return await Booking.findOneAndUpdate(
                {
                    _id: args.id
                },
                {
                    $set: {
                        listing_id: args.listing_id,
                        booking_id: args.booking_id,
                        booking_date: args.booking_date,
                        booking_start: args.booking_start,
                        booking_end: args.booking_end,
                        username: args.username,
                    }
                }, { new: true }, (err, booking) => {
                    if (err) {
                        console.log('Could not update booking');
                    } else {
                        return booking
                    }
                }
            );
        },
        deleteBooking: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return JSON.stringify({ status: false, "message": "No ID found" });
            }
            return await Booking.findByIdAndDelete(args.id)
        },


        // ***********************Booking End***************************

    }
}