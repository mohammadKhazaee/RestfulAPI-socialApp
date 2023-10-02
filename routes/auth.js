const express = require('express')
const { body } = require('express-validator/check')

const User = require('../models/user')
const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

/**
 * @swagger
 * /auth/signup:
 *   put:
 *     tags: [Auths]
 *     summary: Returns signing up in the app
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: testp@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               name:
 *                 type: string
 *                 example: John kambizi
 *     responses:
 *       201:
 *         description: the list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: 'User created!'
 *                 userId:
 *                   type: string
 *                   default: 64ca914ee2a33844942621b3
 *       422:
 *         description: happens when user enters wrong input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Validation failed.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         example: body
 *                       param:
 *                         type: string
 *                         example: password
 *                       value:
 *                         type: string
 *                         example: 123fr4
 *                       msg:
 *                         type: string
 *                         example: Invalid value
 *       500:
 *         description: server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */

// PUT /auth/signup
router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('E-Mail address already exists!')
					}
				})
			})
			.normalizeEmail({ gmail_remove_dots: false }),
		body('password').trim().isLength({ min: 5 }),
		body('name').trim().not().isEmpty(),
	],
	authController.signup
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auths]
 *     summary: Logs in the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: m.khazaee.p@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: returns web token and user's id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   default: jwt - long hashed string
 *                 userId:
 *                   type: string
 *                   default: 64ca914ee2a33844942621b3
 *       401:
 *         description: happens when user enters wrong input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Wrong password!
 *       500:
 *         description: server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */

// POST /auth/login
router.post('/login', authController.login)

/**
 * @swagger
 * /auth/status:
 *   get:
 *     tags: [Auths]
 *     summary: Returns user's status
 *     responses:
 *       200:
 *         description: returns web token and user's id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: I am new!
 *       401:
 *         description: happens when not authenticated user tried to access route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
 *       404:
 *         description: happens when server cant find user for any reason
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: User not found.
 *       500:
 *         description: server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */

// GET /auth/status
router.get('/status', isAuth, authController.getUserStatus)

/**
 * @swagger
 * /auth/status:
 *   patch:
 *     tags: [Auths]
 *     summary: Changes user's status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: I am offline!
 *     responses:
 *       200:
 *         description: Returns success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated.
 *       401:
 *         description: happens when not authenticated user tried to access route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
 *       404:
 *         description: happens when server cant find user for any reason
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: User not found.
 *       500:
 *         description: server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */

// PATCH /auth/status
router.patch(
	'/status',
	isAuth,
	[body('status').trim().not().isEmpty()],
	authController.updateUserStatus
)

module.exports = router
