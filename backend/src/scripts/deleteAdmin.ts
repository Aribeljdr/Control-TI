import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config/env';

const deleteAdmin = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Conectado a MongoDB');

    const result = await User.deleteOne({ username: 'soporteti' });

    if (result.deletedCount > 0) {
      console.log('========================================');
      console.log('✅ Usuario "soporteti" eliminado');
      console.log('========================================');
      console.log('Ahora ejecuta: npm run create-admin');
    } else {
      console.log('⚠️  El usuario "soporteti" no existe en la base de datos');
    }

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteAdmin();
