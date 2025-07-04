// Requiere express y configura la app
const express = require('express')
const app = express()

//CORS
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3001', // El puerto del frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// Configura dotenv y conecta a MongoDB
require('dotenv').config()
require('./src/db/mongoose')

// Middleware para interpretar JSON
app.use(express.json())

// Rutas
const authRouter = require('./src/routers/auth')
app.use(authRouter)

const userRouter = require('./src/routers/user')
app.use(userRouter)

const courseRouter = require('./src/routers/course')
app.use(courseRouter)

const enrollmentRouter = require('./src/routers/enrollment') 
app.use(enrollmentRouter)

const gradeRouter = require('./src/routers/grade')
app.use(gradeRouter)

const adminRouter = require('./src/routers/admin');
app.use(adminRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente')
})

// Arranca el servidor
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`)
})