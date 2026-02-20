import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonIcon, IonList, IonItem, IonLabel,
  IonToast, IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle
} from '@ionic/react';
import { trash, createOutline, calendarOutline, timeOutline } from 'ionicons/icons';
import { crearRuta, obtenerRutas, eliminarRuta, actualizarRuta, Ruta } from '../services/supabase';
import '../theme/variables.css';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminRutas: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);

  const [modoEdicion, setModoEdicion] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    precio: '',
    duracion: '',
    fecha_salida: new Date().toISOString()
  });

  useEffect(() => {
    cargarRutas();
  }, []);

  const cargarRutas = async () => {
    setCargando(true);
    const { data } = await obtenerRutas();
    if (data) setRutas(data as Ruta[]);
    setCargando(false);
  };


  const manejarGuardar = async () => {
    if (!form.origen || !form.destino || !form.precio || !form.fecha_salida) {
      setMensaje("Por favor completa los campos obligatorios");
      setMostrarToast(true);
      return;
    }

    const nuevaRuta: Ruta = {
      origen: form.origen,
      destino: form.destino,
      precio: parseFloat(form.precio),
      duracion: form.duracion, 
      fecha_salida: form.fecha_salida     };

    let resultado;
    if (modoEdicion) {
      // MODO ACTUALIZAR
      resultado = await actualizarRuta(modoEdicion, nuevaRuta);
      setMensaje(resultado.error ? "Error al actualizar" : "Ruta actualizada correctamente");
    } else {
      // MODO CREAR
      resultado = await crearRuta(nuevaRuta);
      setMensaje(resultado.error ? "Error al crear" : "Ruta creada exitosamente");
    }

    if (!resultado.error) {
      cargarRutas();
      limpiarFormulario();
    }
    setMostrarToast(true);
  };

  // ELIMINAR
  const manejarEliminar = async (id: string) => {
    const { error } = await eliminarRuta(id);
    if (error) {
      setMensaje("Error al eliminar: " + error.message);
    } else {
      setMensaje("Ruta eliminada");
      cargarRutas();
    }
    setMostrarToast(true);
  };

  // mover datos al formulario para hacer update a ruta existente
  const cargarParaEditar = (ruta: Ruta) => {
    setModoEdicion(ruta.id!); // usando id para modificar ruta despues
    setForm({
        origen: ruta.origen,
        destino: ruta.destino,
        precio: ruta.precio.toString(),
        duracion: ruta.duracion,
        fecha_salida: ruta.fecha_salida || new Date().toISOString() 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para resetear datos del formulario
  const limpiarFormulario = () => {
    setModoEdicion(null); 
    setForm({ origen: '', destino: '', precio: '', duracion: '', fecha_salida: new Date().toISOString() });
  };

  // --- formateo de fecha para que se vea mejor por dia mes año
  const formatearFechaVisual = (fechaIso?: string) => {
    if (!fechaIso) return "Sin fecha";
    try {
        return format(parseISO(fechaIso), "dd - MMM - yyyy", { locale: es });
    } catch (e) {
        return "Fecha inválida";
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/login" /></IonButtons>
          <IonTitle>Administrar Rutas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{'--background': '#f4f5f8'}}>

        
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0, color: 'var(--ion-color-primary)' }}>
            {modoEdicion ? " Editar Ruta" : " Nueva Ruta"}
          </h2>
          
          <IonList lines="none" style={{padding: 0}}>
            {/* Origen */}
            <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee'}}>
              <IonIcon icon={createOutline} slot="start" color="medium"/>
              <IonInput 
                placeholder="Origen" 
                value={form.origen} 
                onIonChange={e => setForm({...form, origen: e.detail.value!})} 
              />
            </IonItem>

      
            <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee'}}>
              <IonIcon icon={createOutline} slot="start" color="medium"/>
              <IonInput 
                placeholder="Destino" 
                value={form.destino} 
                onIonChange={e => setForm({...form, destino: e.detail.value!})} 
              />
            </IonItem>

            
            <div style={{ display: 'flex', gap: '10px' }}>
                <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee', flex: 1}}>
                <IonLabel position="stacked">Precio ($)</IonLabel>
                <IonInput 
                    type="number" 
                    placeholder="0.00" 
                    value={form.precio} 
                    onIonChange={e => setForm({...form, precio: e.detail.value!})} 
                />
                </IonItem>
                <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee', flex: 1}}>
                  <IonIcon icon={timeOutline} slot="start" style={{marginTop: '25px'}} color="medium"/>
                  <IonLabel position="stacked">Duración Texto</IonLabel>
                  <IonInput 
                      placeholder="ej: 00:00:00" 
                      value={form.duracion} 
                      onIonChange={e => setForm({...form, duracion: e.detail.value!})} 
                  />
                </IonItem>
            </div>

            
            <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee'}}>
                 <IonIcon icon={calendarOutline} slot="start" color="medium"/>
                 <IonLabel>Fecha de Salida</IonLabel>
                 
                 <IonDatetimeButton datetime="datetime-salida"></IonDatetimeButton>

                 
                 <IonModal keepContentsMounted={true}>
                    <IonDatetime 
                        id="datetime-salida" 
                        presentation="date-time" 
                        preferWheel={true} 
                        value={form.fecha_salida}
                        onIonChange={e => setForm({...form, fecha_salida: stringOrArrayToString(e.detail.value!)})}
                    ></IonDatetime>
                </IonModal>
            </IonItem>

          </IonList>

          
          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              
              <IonButton expand="block" onClick={manejarGuardar} style={{flex: 2, '--border-radius': '10px'}}>
                  {modoEdicion ? "Actualizar Ruta" : "Crear Ruta"}
              </IonButton>
              
              
              {modoEdicion && (
                 <IonButton expand="block" color="medium" fill="outline" onClick={limpiarFormulario} style={{flex: 1, '--border-radius': '10px'}}>
                     Cancelar
                 </IonButton>
              )}
          </div>
        </div>

        <hr style={{ borderTop: '1px solid #ddd', margin: '30px 0' }} />

        
        <h3 style={{ fontFamily: 'serif', marginLeft: '10px' }}>Rutas Existentes ({rutas.length})</h3>
        
        {rutas.map((ruta) => (
  
          <div key={ruta.id} className="admin-route-card">
              
              
              <div className="price-badge">
                  ${ruta.precio}
              </div>

              
              <div className="timeline-container">
                  <div className="point-origen">
                      {ruta.origen}
                  </div>
                  <div className="point-destino">
                      {ruta.destino}
                  </div>
              </div>
              
              
              <div className="route-date-footer">
                  {formatearFechaVisual(ruta.fecha_salida)}
              </div>

              
              <div className="card-actions">
                  
                  <IonButton 
                      size="small" 
                      fill="outline" 
                      color="primary" 
                      style={{'--border-radius':'20px'}}
                      onClick={() => cargarParaEditar(ruta)}
                  >
                      <IonIcon icon={createOutline} slot="start" />
                      Editar
                  </IonButton>

                  
                  <IonButton 
                      size="small" 
                      fill="outline" 
                      color="danger"
                      style={{'--border-radius':'20px'}}
                      onClick={() => manejarEliminar(ruta.id!)}
                  >
                      <IonIcon icon={trash} slot="start" />
                      Eliminar
                  </IonButton>
              </div>
          </div>

        ))}

        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={mensaje}
          duration={2000}
          color={mensaje.includes("Error") || mensaje.includes("Por favor") ? "warning" : "success"}
        />
      </IonContent>
    </IonPage>
  );
};


const stringOrArrayToString = (val: string | string[] | null | undefined): string => {
    if (!val) return new Date().toISOString();
    if (Array.isArray(val)) return val[0];
    return val;
};

export default AdminRutas;