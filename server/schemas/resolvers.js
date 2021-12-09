const { User, Thought } = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

/*
A resolver can accept four arguments in the following order
1. parent - this is if we used nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed the nested resolver function.
2. args - this is an object of all of the values passed into a query or mutation request as parameters
3. context - if we were to need the same data to be accessible by all resolvers, such as a logged-in user's status or API access token, this data will come through this context parameter as an object
4. info - This will contain extra information about an operation's current state
 */

const resolvers = {
    Query: {
        //context defined in server.js and utils/auth.js
        me: async(parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends')
            
                return userData
            }
            
            throw new AuthenticationError('Not logged in')
        },
        //parent is a placeholder parameter, we need something in that first parameter's spot so we can access the username argument
        //the ternary operator checks if username exists, if it does, we set params to an object with a username key set to that value. if it doesn't we simply return an empty object
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            //the sort() method returns the data in descending order
            //we pass the ternary object into the find() method
            return Thought.find(params).sort({ createdAt: -1 })
        },

        //get single thought
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id })
        },

        //get all users
        users: async () => {
            return User.find()
                //the __v omits the property
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts')
        },

        //get a user by username
        user: async(parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts')
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user)
          
            return { token, user };
        },
        login: async(parent, { email, password}) => {
            const user = await User.findOne({ email })

            if(!user) {
                throw new AuthenticationError('Incorrect credentials')
            }

            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }

            const token = signToken(user)

            return { token, user };

        },
        addThought: async(parent, args, context) => {
            if(context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username })

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id }},
                    //Remember, without the { new: true } flag, Mongo would return the original document instead of the updated document
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in!')
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    //be sure to copy the _id property from one of the test thoughts you created
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username}}},
                    { new: true, runValidators: true }
                )

                return updatedThought
            }

            throw new AuthenticationError('You need to be logged in!')
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    //A user can't be friends with the same person twice, so use addToSet instead of push
                    { $addToSet: { friends: friendId }},
                    { new: true }
                ).populate('friends')

                return updatedUser
            }

            throw new AuthenticationError('You need to be logged in!')
        }
    }
}

module.exports = resolvers