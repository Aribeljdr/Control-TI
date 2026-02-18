import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config/env';

const createAdminUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ username: 'soporteti' });

    if (existingAdmin) {
      console.log('⚠️  El usuario "soporteti" ya existe');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Rol:', existingAdmin.role);
      console.log('✅ Activo:', existingAdmin.isActive);
    } else {
      // Crear usuario admin
      const adminUser = await User.create({
        username: 'soporteti',
        email: 'soporteti@empresa.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      });

      console.log('✅ Usuario administrador creado exitosamente');
      console.log('👤 Usuario: soporteti');
      console.log('🔑 Contraseña: admin123');
      console.log('📧 Email:', adminUser.email);
      console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
    }

    await mongoose.disconnect();
    console.log('\n✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdminUser();
