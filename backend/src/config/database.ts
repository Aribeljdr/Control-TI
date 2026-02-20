import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodb.uri);

    console.log('✅ MongoDB conectado exitosamente a la base de datos: GestionTI');

    mongoose.connection.on('error', (error) => {
      console.error('❌ Error de conexión MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB desconectado correctamente');
  } catch (error) {
    console.error('❌ Error al desconectar MongoDB:', error);
  }
};
