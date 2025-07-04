const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Enrollment = require("./enrollment");
const Grade = require("./grade");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["superadmin", "profesor", "alumno"],
      default: "alumno",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, //Me dice cuando fue creado y/o actualizado, no se pide pero lo veo muy útil
  }
);

// Método de instancia para generar un token JWT y guardarlo en el modelo.

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//Método estático para verificar las credenciales de login.

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No se encontró el usuario");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Contraseña incorrecta");
  }

  return user;
};

//Middleware para hashear la contraseña antes de guardar.

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

/* userSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc) {
    if (doc.role === "alumno") {
      await Enrollment.deleteMany({ student: doc._id });
      await Grade.deleteMany({ student: doc._id });
      console.log(
        `Se eliminaron inscripciones y calificaciones del alumno ${doc.name}`
      );
    }
  }
); */

const User = mongoose.model("User", userSchema);
module.exports = User;
