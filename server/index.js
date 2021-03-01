const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https');


const db = require('./db')

const app = express()
const apiPort = 8000

const City = require('./models/city')
const apiKey = require('./apiKey.json')
const appID = apiKey.appID

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/api/listCountries', (req, res) => {
	City.find().distinct("country", { country: { $nin : ["", null] } }, (err, data) => {
		data.sort()
		console.log(data)
		if (err || !data) {
			console.log(err)
            return res.status(404).json({
                err,
                message: 'Country not found!',
            })
        }
		return res.status(200).json({ data })
	})
})

app.post('/api/listCities', (req, res) => {
	console.log(req.body.country)
	City.find({country: req.body.country}).distinct("name", (err, data) => {
		if (err || !data) {
			console.log(err)
            return res.status(404).json({
                err,
                message: 'City not found!',
            })
        }
        console.log(data)
		return res.status(200).json({ data })
	})
})

app.post('/api/city', (request, res) => {
	var url = "https://api.openweathermap.org/data/2.5/weather?q=" + request.body.city + "&appid=" + appID + "&units=imperial"
	https.get(url, (resp) => {
		let data = ''

		resp.on('data', (chunk) => {
			data += chunk
		})

		resp.on('end', () => {
			if (!data) {
				return res.status(500).json({
	            	message: 'API Error!',
	        	})
			}
			console.log(data)
			return res.status(200).json({ success: true, data: JSON.parse(data) })
		})

		}).on("error", (err) => {
			console.error('Error:', error); 
			return res.status(500).json({
	            err,
	            message: 'API Error!',
	        })
		})
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
