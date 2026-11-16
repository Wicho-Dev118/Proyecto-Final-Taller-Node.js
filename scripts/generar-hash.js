const bcrypt = require('bcrypt');
const readline = require('readline/promises');

//? Crear interfaz para ingresar información
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function generarHash() {
    try{
        const password = await rl.question('Ingresa la contraseña del administrados: ');

        if(!password.trim()) {
            console.log('Error: La contraseña no puede estar vacía.');
            return;
        }

        //? Generar hash
        const hash = await bcrypt.hash(password, 12);

        console.log('\nHash generado correctamente: ');
        console.log(hash);
    
    
    } catch (error) {
        console.error('Error al generar el hash:', error.message)
    } finally {
        rl.close();
    }
}

generarHash();