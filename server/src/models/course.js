const mongoose = require("mongoose");
const Enrollment = require("./enrollment"); 
const Grade = require("./grade");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Programación",
        "Diseño",
        "Marketing",
        "Idiomas",
        "Negocios",
        "Música",
        "Otro",
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ["Inicial", "Intermedio", "Avanzado"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    maxStudents: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Middleware para eliminar inscripciones y calificaciones al borrar un curso
courseSchema.pre("findOneAndDelete", async function (next) {
  const courseId = this.getQuery()._id;

  // Eliminamos inscripciones relacionadas
  await Enrollment.deleteMany({ course: courseId });

  // Eliminamos calificaciones relacionadas
  await Grade.deleteMany({ course: courseId });

  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
