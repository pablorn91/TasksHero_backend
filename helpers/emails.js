import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //información del email
    const info = await transport.sendMail({
        from: '"TasksHero - Administrador de Proyectos" <cuentas@taskshero.com>',
        to: email,
        subject: "TasksHero - Confirma tu cuenta",
        text: "Comprueba tu cuenta en Taskshero",
        html: `<p>Hola: ${nombre}. Comprueba tu cuenta en TasksHero</p>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
        <p>Si no creaste esta cuenta puedes ignorar este correo</p>
        
        `
    })
}

export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //información del email
    const info = await transport.sendMail({
        from: '"TasksHero - Administrador de Proyectos" <cuentas@taskshero.com>',
        to: email,
        subject: "TasksHero - Reestablece tu password",
        text: "Reestablece tu password",
        html: `<p>Hola: ${nombre}. Has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        <p>Si no solicitaste esto puedes ignorar este correo</p>
        
        `
    })
}
