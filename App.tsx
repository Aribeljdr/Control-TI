import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { EquipmentDetail } from './pages/EquipmentDetail';
import { Reports } from './pages/Reports';
import { BitacoraTI } from './pages/BitacoraTI';
import { ManualesTI } from './pages/ManualesTI';
import { ServiciosContrasenas } from './pages/ServiciosContrasenas';
import { RespaldoDatos } from './pages/RespaldoDatos';
import { EnConstruccion } from './pages/EnConstruccion';
import { LoadingScreen } from './components/LoadingScreen';
import { usePersistence } from './hooks/usePersistence';

// Login / Splash / Intro se conservan en sus archivos pero no se enrutan en esta versión.
// Para reactivar autenticación: restaurar las rutas comentadas y el ProtectedRoute.

const AppRoutes: React.FC<{ persistence: ReturnType<typeof usePersistence> }> = ({ persistence }) => {
  if (persistence.loading) {
    return <LoadingScreen message="Cargando datos del sistema..." />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <Dashboard equipments={persistence.equipments} />
        </Layout>
      } />

      <Route path="/inventario" element={
        <Layout>
          <Inventory
            equipments={persistence.equipments}
            onAddEquipment={persistence.addEquipment}
            onUpdateEquipment={persistence.updateEquipment}
            onDeleteEquipment={persistence.deleteEquipment}
          />
        </Layout>
      } />

      <Route path="/equipo/:id" element={
        <Layout>
          <EquipmentDetail
            equipments={persistence.equipments}
            maintenances={persistence.maintenances}
            onAddMaintenance={persistence.addMaintenance}
          />
        </Layout>
      } />

      <Route path="/bitacora" element={
        <Layout>
          <BitacoraTI
            bitacora={persistence.bitacora}
            onSaveDay={persistence.saveBitacoraDay}
          />
        </Layout>
      } />

      <Route path="/manuales" element={
        <Layout>
          <ManualesTI
            folders={persistence.folders}
            manuals={persistence.manuals}
            onSaveFolders={persistence.setFolders}
            onSaveManuals={persistence.setManuals}
          />
        </Layout>
      } />

      <Route path="/servicios" element={
        <Layout>
          <ServiciosContrasenas
            categories={persistence.credCategories}
            records={persistence.credentials}
            onSaveCategories={persistence.saveCredCategories}
            onSaveRecords={persistence.saveCredentials}
          />
        </Layout>
      } />

      <Route path="/respaldo" element={
        <Layout>
          <RespaldoDatos />
        </Layout>
      } />

      <Route path="/reportes" element={
        <Layout>
          <Reports equipments={persistence.equipments} />
        </Layout>
      } />

      <Route path="/construccion" element={
        <Layout>
          <EnConstruccion />
        </Layout>
      } />

      {/* Cualquier ruta desconocida → Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const persistence = usePersistence();

  return (
    <Router>
      <AppRoutes persistence={persistence} />
    </Router>
  );
};

export default App;
