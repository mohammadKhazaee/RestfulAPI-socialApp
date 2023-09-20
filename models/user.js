const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: auto-generated mongodb objectId for each user
 *         email:
 *           type: string
 *           description: email for loging in to the app
 *         name:
 *           type: string
 *           description: user's name which will be shown on the app
 *         password:
 *           type: string
 *           description: user's password
 *         status:
 *           type: string
 *           description: an status message which users set
 *           default: I am new!
 *         posts:
 *           type: array
 *           items:
 *             type: string
 *             description: refrence to the post in Post collection
 *           description: array of ids of all posts which the user written sent
 *       example:
 *         _id: 64ca914ee2a33844942621b3
 *         email: test@test.com
 *         password: 123456
 *         name: Raid Gear
 *         status: I am raid gear
 *         posts: [64cb75aa8bca723742ad74d2, 64cb799c46ced3520feabd61, 64cb79bf3cad56073381258b]
 */

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: 'I am new!',
	},
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'PostSocial',
		},
	],
})

module.exports = mongoose.model('UserSocial', userSchema)
