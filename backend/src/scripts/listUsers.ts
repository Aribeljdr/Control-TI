import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config/env';

const listUsers = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Conectado a MongoDB');

    const users = await User.find();

    console.log('\n========================================');
    console.log(`📋 USUARIOS EN LA BASE DE DATOS (${users.length})`);
    console.log('========================================\n');

    if (users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos');
      console.log('Ejecuta: npm run create-admin\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Usuario:`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Username: ${user.username}`);
        console.log(`   🔐 Role: ${user.role}`);
        console.log(`   ✅ Activo: ${user.isActive ? 'Sí' : 'No'}`);
        console.log(`   📅 Creado: ${user.createdAt}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

listUsers();
