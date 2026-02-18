import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { Splash } from './pages/Splash';
import { Intro } from './pages/Intro';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingScreen } from './components/LoadingScreen';
import { usePersistence } from './hooks/usePersistence';

const AppRoutes: React.FC<{ persistence: ReturnType<typeof usePersistence> }> = ({ persistence }) => {
  const location = useLocation();
  const isPublicRoute = ['/splash', '/intro', '/login'].includes(location.pathname);

  if (persistence.loading && !isPublicRoute) {
    return <LoadingScreen message="Cargando datos del sistema..." />;
  }

  if (persistence.error && !isPublicRoute) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error al cargar datos</h2>
          <p className="text-slate-600 mb-4">{persistence.error}</p>
          <p className="text-sm text-slate-500">Verifica que el backend esté corriendo en http://localhost:5000</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas Públicas de Inicio */}
      <Route path="/splash" element={<Splash />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/login" element={<Login onLoginSuccess={persistence.loadAllData} />} />

      {/* Rutas Privadas Protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard equipments={persistence.equipments} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventario" element={
        <ProtectedRoute>
          <Layout>
            <Inventory
              equipments={persistence.equipments}
              onAddEquipment={persistence.addEquipment}
              onUpdateEquipment={persistence.updateEquipment}
              onDeleteEquipment={persistence.deleteEquipment}
            />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/equipo/:id" element={
        <ProtectedRoute>
          <Layout>
            <EquipmentDetail equipments={persistence.equipments} maintenances={persistence.maintenances} onAddMaintenance={persistence.addMaintenance} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/bitacora" element={
        <ProtectedRoute>
          <Layout>
            <BitacoraTI bitacora={persistence.bitacora} onSaveDay={persistence.saveBitacoraDay} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/manuales" element={
        <ProtectedRoute>
          <Layout>
            <ManualesTI folders={persistence.folders} manuals={persistence.manuals} onSaveFolders={persistence.setFolders} onSaveManuals={persistence.setManuals} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/servicios" element={
        <ProtectedRoute>
          <Layout>
            <ServiciosContrasenas categories={persistence.credCategories} records={persistence.credentials} onSaveCategories={persistence.saveCredCategories} onSaveRecords={persistence.saveCredentials} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/respaldo" element={
        <ProtectedRoute>
          <Layout>
            <RespaldoDatos />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/reportes" element={
        <ProtectedRoute>
          <Layout>
            <Reports equipments={persistence.equipments} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/construccion" element={
        <ProtectedRoute>
          <Layout>
            <EnConstruccion />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Redirección por defecto al Splash */}
      <Route path="*" element={<Navigate to="/splash" replace />} />
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
