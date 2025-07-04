const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  timestamps: true
})

// Evita inscripciones duplicadas
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true })

const Enrollment = mongoose.model('Enrollment', enrollmentSchema)
module.exports = Enrollment