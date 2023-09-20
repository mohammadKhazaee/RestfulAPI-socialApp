const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - imageUrl
 *         - content
 *         - creator
 *       properties:
 *         _id:
 *           type: string
 *           description: auto-generated mongodb objectId for each post
 *         title:
 *           type: string
 *           description: title for loging in to the app
 *         imageUrl:
 *           type: string
 *           description: url to address of an image which is stored in reposetory
 *         content:
 *           type: string
 *           description: content of the posts
 *         creator:
 *           type: string
 *           description: |
 *             refrence to the creator of the post by their mongodb _id.\
 *             it'll be automatically set to the current user's _id.
 *         createdAt:
 *           type: string
 *           description: |
 *             creation date and time.\
 *             automatically managed by db.
 *         updatedAt:
 *           type: string
 *           description: |
 *             update date and time.\
 *             automatically managed by db.
 *       example:
 *         _id: 64cb5078cfe3261af93c525b
 *         title: duck!
 *         imageUrl: images/1c2c8203-c923-4eda-bf99-0066285e61a4 - duck.avif
 *         content: duckyyyyyy
 *         creator: 64ca449daa7ac2b8188bbabe
 *         createdAt: 2023-08-03T07:00:08.423+00:00
 *         updatedAt: 2023-08-03T07:00:08.423+00:00
 */

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'UserSocial',
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('PostSocial', postSchema)
