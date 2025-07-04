const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (to, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Akademi" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Bienvenido a Akademi",
    html: `<h2>Hola ${name}!</h2>
           <p>Gracias por registrarte en <strong>Akademi</strong>. Ya puedes comenzar a explorar los cursos disponibles.</p>
           <p>¡Te deseamos mucho éxito!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de bienvenida enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar correo de bienvenida:", error.message);
  }
};

module.exports = sendWelcomeEmail;
