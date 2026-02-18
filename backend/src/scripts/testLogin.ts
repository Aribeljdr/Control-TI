import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config/env';

const testLogin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Conectado a MongoDB');

    // Buscar el usuario
    const user = await User.findOne({ username: 'soporteti' }).select('+password');

    if (!user) {
      console.log('❌ Usuario no encontrado');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('\n📋 Información del usuario:');
    console.log('👤 Username:', user.username);
    console.log('📧 Email:', user.email);
    console.log('🔐 Rol:', user.role);
    console.log('✅ Activo:', user.isActive);
    console.log('🔑 Password hash:', user.password.substring(0, 30) + '...');

    // Probar la contraseña
    const testPassword = 'admin123';
    const isValid = await user.comparePassword(testPassword);

    console.log('\n🧪 Probando login:');
    console.log('🔑 Password a probar:', testPassword);
    console.log('✅ Resultado:', isValid ? '✅ CORRECTO' : '❌ INCORRECTO');

    if (isValid) {
      console.log('\n🎉 El login debería funcionar correctamente con:');
      console.log('   Usuario: soporteti');
      console.log('   Contraseña: admin123');
    } else {
      console.log('\n❌ ERROR: La contraseña no coincide');
      console.log('   Ejecuta: npm run delete-admin && npm run create-admin');
    }

    await mongoose.disconnect();
    console.log('\n✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogin();
