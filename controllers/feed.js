const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator/check')

const io = require('../socket')
const Post = require('../models/post')
const User = require('../models/user')

exports.getPosts = async (req, res, next) => {
	const currentPage = req.query.page || 1
	const perPage = 2
	try {
		const totalItems = await Post.find().countDocuments()
		const posts = await Post.find()
			.populate('creator')
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * perPage)
			.limit(perPage)

		res.status(200).json({
			message: 'Fetched posts successfully.',
			posts: posts,
			totalItems: totalItems,
		})
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.createPost = async (req, res, next) => {
	const errors = validationResult(req).array()
	if (errors.length > 0) {
		console.log(errors)
		const error = new Error('Entered data is incorrect.')
		error.statusCode = 422
		return next(error)
	}
	if (!req.file) {
		const error = new Error('No image provided.')
		error.statusCode = 422
		return next(error)
	}
	const imageUrl = req.file ? '/' + req.file.path.replace('\\', '/') : null
	const title = req.body.title
	const content = req.body.content
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	})
	try {
		await post.save()
		const user = await User.findById(req.userId)
		user.posts.push(post)
		await user.save()
		io.getIO().emit('posts', {
			action: 'create',
			post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
		})
		res.status(201).json({
			message: 'Post created successfully!',
			post: post,
			creator: { _id: user._id, name: user.name },
		})
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.getPost = async (req, res, next) => {
	const postId = req.params.postId
	try {
		const post = await Post.findById(postId)
		if (!post) {
			const error = new Error('Could not find post.')
			error.statusCode = 404
			return next(error)
		}
		res.status(200).json({ message: 'Post fetched.', post: post })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.updatePost = async (req, res, next) => {
	const postId = req.params.postId
	const errors = validationResult(req).array()
	if (errors.length > 0) {
		const error = new Error('Validation failed, entered data is incorrect.')
		error.statusCode = 422
		return next(error)
	}
	const title = req.body.title
	const content = req.body.content
	let imageUrl = req.body.image
	if (req.file) {
		imageUrl = req.file ? '/' + req.file.path.replace('\\', '/') : null
	}
	if (!imageUrl) {
		const error = new Error('No file picked.')
		error.statusCode = 422
		return next(error)
	}
	try {
		const post = await Post.findById(postId).populate('creator')
		if (!post) {
			const error = new Error('Could not find post.')
			error.statusCode = 404
			return next(error)
		}
		if (post.creator._id.toString() !== req.userId) {
			const error = new Error('Not authorized!')
			error.statusCode = 403
			return next(error)
		}
		if (imageUrl !== post.imageUrl) {
			clearImage(post.imageUrl)
		}
		post.title = title
		post.imageUrl = imageUrl
		post.content = content
		const result = await post.save()
		io.getIO().emit('posts', { action: 'update', post: result })
		res.status(200).json({ message: 'Post updated!', post: result })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

exports.deletePost = async (req, res, next) => {
	const postId = req.params.postId
	try {
		const post = await Post.findById(postId)

		if (!post) {
			const error = new Error('Could not find post.')
			error.statusCode = 404
			return next(error)
		}
		if (post.creator.toString() !== req.userId) {
			const error = new Error('Not authorized!')
			error.statusCode = 403
			return next(error)
		}
		// Check logged in user
		clearImage(post.imageUrl)
		await Post.findByIdAndRemove(postId)

		const user = await User.findById(req.userId)
		user.posts.pull(postId)
		await user.save()
		io.getIO().emit('posts', { action: 'delete', post: postId })
		res.status(200).json({ message: 'Deleted post.' })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath)
	fs.unlink(filePath, (err) => console.log(err))
}
