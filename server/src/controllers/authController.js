const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendWelcomeEmail = require("../emails/sendWelcomeEmail");

//POST /auth/register - Registrar usuario
const registerUser = async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      role: "alumno",
    });

    await user.save();
    //const token = await user.generateAuthToken()  (Como no se autologuea tras crearse no es necesario)
    res.status(201).send({ user });
    await sendWelcomeEmail(user.email, user.name);
  } catch (e) {
    if (e.code === 11000 && e.keyPattern?.email) {
      return res.status(400).send({ error: "El correo ya está registrado" });
    }

    res.status(400).send({ error: e.message });
  }
};

//POST /auth/login - Iniciar Sesión
const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: "Credenciales inválidas" });
  }
};

//POST /auth/forgot-password - Recuperar contraseña. Envío de mail con token.
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    // Generar token seguro
    const token = crypto.randomBytes(20).toString("hex");

    // Guardar token y expiración (15 minutos)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Configurar email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email a enviar
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Recuperación de contraseña",
      text:
        `Hola ${user.name},\n\n` +
        `Recibimos una solicitud para restablecer tu contraseña.\n\n` +
        `Hacé clic en el siguiente enlace para cambiarla:\n\n` +
        `${process.env.FRONTEND_URL}/reset-password/${token}\n\n` +
        `Este enlace estará activo durante los próximos 15 minutos.\n\n` +
        `Si no solicitaste esto, ignorá el mensaje.`,
    };

    await transporter.sendMail(mailOptions);

    res.send({ message: "Correo de recuperación enviado con éxito" });
  } catch (e) {
    res.status(500).send({ error: "Error al enviar correo de recuperación" });
  }
};

// POST /auth/reset-password - Cambiar contraseña con token.
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Buscar al usuario con ese token y verificar que no haya expirado
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // aún no vencido, gt = "greater than"
    });

    if (!user) {
      return res.status(400).send({ error: "Token inválido o expirado" });
    }

    // Actualizar contraseña y eliminar el token de recuperación
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: "Contraseña actualizada correctamente" });
  } catch (e) {
    res.status(500).send({ error: "Error al restablecer la contraseña" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
