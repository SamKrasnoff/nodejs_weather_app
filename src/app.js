const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, 'templates/partials')
app.set('view engine','hbs')
app.set('views', path.join(__dirname, 'templates/views'));
app.use(express.static('public'))
hbs.registerPartials(partialsPath)

app.get('',(req, res) => {
    res.render('index',{
        title: 'Weather App',
        name: 'Sam Krasnoff'
    })
})
app.get('/about',(req,res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Sam Krasnoff'
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "Address required"
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error: "Error Occured"
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: "Error Occured"
                })
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', () => {
    if(!req.query.search){
        return res.send({
            error: "Search term required"
        })
    }
    res.send({
        products: []
    })
})

app.get('/help', (req,res) => {
    res.render('help',{
        title: 'Help',
        helper: 'This is a help message for anyone that needs to see it.',
        name: 'Sam Krasnoff'
    })
})

app.get('/help/*', (req, res) => {
    res.render('catchall',{
        title: 'Error 404',
        name: 'Sam Krasnoff',
        error: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('catchall',{
        title: 'Error 404',
        name: 'Sam Krasnoff',
        error: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})