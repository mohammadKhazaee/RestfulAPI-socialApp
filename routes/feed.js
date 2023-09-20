const express = require('express')
const { body } = require('express-validator/check')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Feeds
 *     description: Post related routes
 *   - name: Auths
 *     description: user authentication routes
 */

/**
 * @swagger
 * /feed/posts:
 *   get:
 *     tags: [Feeds]
 *     summary: Returns a fixed number of posts for the specified page
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: the page selected in pagination
 *     responses:
 *       200:
 *         description: the list of the posts of the current page
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Fetched posts successfully.
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 totalItems:
 *                   type: integer
 *                   example: 2
 *       401:
 *         description: happens when not authenticated user tried to access the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
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

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts)

/**
 * @swagger
 * /feed/post:
 *   post:
 *     tags: [Feeds]
 *     summary: Creates new post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: new post
 *               content:
 *                 type: string
 *                 example: this is new post conents
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post is created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Post created successfully!
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *                 creator:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64ca449daa7ac2b8188bbabe
 *                     name:
 *                       type: string
 *                       example: mohammad
 *
 *       422:
 *         description: happens when user fills inputs incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: No image provided.
 *       401:
 *         description: happens when not authenticated user tried to access the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
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

// POST /feed/post
router.post(
	'/post',
	isAuth,
	[body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
	feedController.createPost
)

/**
 * @swagger
 * /feed/post/{postId}:
 *   get:
 *     tags: [Feeds]
 *     summary: Returns specified post with postId
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         description: id of the post you wanna fetch
 *     responses:
 *       200:
 *         description: returns post with success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Post fetched.
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: happens when postId is wrong or app cant find the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: No image provided.
 *       401:
 *         description: happens when not authenticated user tried to access the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
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

// GET /feed/post/:postId
router.get('/post/:postId', isAuth, feedController.getPost)

/**
 * @swagger
 * /feed/post/{postId}:
 *   put:
 *     tags: [Feeds]
 *     summary: Returns updates an specified post
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         description: id of the post you wanna fetch
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: update post
 *               content:
 *                 type: string
 *                 example: this is updated post contents
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: returns updated post with success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Post updated!
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: happens when postId is wrong or app cant find the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: No image provided.
 *       403:
 *         description: happens when user haven't created the post and can't edit or delete post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: No image provided.
 *       401:
 *         description: happens when not authenticated user tried to access the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
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

// PUT /feed/post/:postId
router.put(
	'/post/:postId',
	isAuth,
	[body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
	feedController.updatePost
)

/**
 * @swagger
 * /feed/post/{postId}:
 *   delete:
 *     tags: [Feeds]
 *     summary: Deletes an specified post
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         description: id of the post you wanna fetch
 *     responses:
 *       200:
 *         description: returns a success message after delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Post updated!
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: happens when postId is wrong or app can't find the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: No image provided.
 *       403:
 *         description: happens when user haven't created the post and can't edit or delete post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: No image provided.
 *       401:
 *         description: happens when not authenticated user tried to access the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Not authenticated.
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

// DELETE /feed/post/:postId
router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router
