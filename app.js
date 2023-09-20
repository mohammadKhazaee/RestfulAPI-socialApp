const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const helmet = require('helmet')
const compression = require('compression')

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const PORT = process.env.PORT
const LIARA_URL = process.env.LIARA_URL || 'localhost'
const DATABASE_URI = process.env.DATABASE_URI

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Social App API',
			description: 'A simple twitter-like app',
		},
		servers: [
			{
				url: `http://${LIARA_URL}:${PORT}`,
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ['./routes/*.js', './models/*.js'],
}

const specs = swaggerJsDoc(options)

const app = express()

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		cb(null, `${uuidv4()} - ${file.originalname}`)
	},
})

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/avif' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs, { explorer: true }))

app.use(helmet())
app.use(compression())
app.use(bodyParser.json()) // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next()
})

app.get('/', (req, res) => {
	res.send('<a href="/api-docs" style="text-align:center;display:block">/api-docs</a>')
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
	console.log(error)
	const status = error.statusCode || 500
	const message = error.message
	const data = error.data
	res.status(status).json({ message: message, data: data })
})

mongoose
	.connect(DATABASE_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then((result) => {
		const server = app.listen(PORT || 8080)
		const io = require('./socket').init(server)
		io.on('connection', (socket) => {
			console.log('Client connected to ' + LIARA_URL)
		})
	})
	.catch((err) => console.log(err))
