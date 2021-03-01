
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CitySchema = new Schema(
    {
	id: { type: Number, required: true },
	name: { type: String, required: true },
    state: { type: String, required: false },
	country: { type: String, required: false },
    coord: {
		lon: { type: Number, required: false },
		lat: { type: Number, required: false }
	}
    },
)

const City = mongoose.model('City', CitySchema, "city")
module.exports = City