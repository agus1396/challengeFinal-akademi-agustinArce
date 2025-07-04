const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token // Por si quiere hacer logout individual
        req.user = user // Le pasa el usuario verificado a la ruta

        console.log('Auth Mid reqUser: ', req.user)
        next()
    } catch (e) {
        res.status(401).send({ error: 'No autorizado. Por favor, inicie sesión.' })
    }
}

module.exports = auth
