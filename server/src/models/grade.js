const mongoose = require('mongoose')

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  observations: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
})

const Grade = mongoose.model('Grade', gradeSchema)
module.exports = Grade