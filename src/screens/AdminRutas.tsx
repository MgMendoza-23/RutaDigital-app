import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonIcon, IonList, IonItem, IonLabel,
  IonToast, IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonMenuButton, 
  IonHeader, IonToolbar, IonTitle, IonSelect, IonSelectOption, IonChip
} from '@ionic/react';
import { trash, createOutline, calendarOutline, timeOutline, addOutline, closeCircleOutline } from 'ionicons/icons';

// importamos archivo css
import '../CSS/variables.css';

/*
Funciones en Archivo Functions.Admin.ts

-> Crear ruta
-> Obtener rutas
-> Eliminar ruta
-> Actualizar ruta


*/
const CIUDADES_DISPONIBLES = [
  "Palenque, Chiapas",
  "Tenosique, Tabasco",
  "Balancan, Tabasaco",
  "Emiliano Zapata, Tabasco",
  "Villahermosa, Tabasco",
  "Escarsega, Tabasco",
  "Comitan, Chiapas"
];



// obteniendo el modelo de datos de las rutas
import { Ruta } from "../models/types";
import { crearRuta, obtenerRutas, eliminarRuta, actualizarRuta } from '../services/Functions.Admin';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminRutas: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [nuevaHora, setNuevaHora] = useState('');
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    precio: '',
    duracion: '',
    horarios: [] as string[],
    fecha_salida: new Date().toISOString()
  });

  useEffect(() => {
    cargarRutas();
  }, []);

  const cargarRutas = async () => {
    const { data } = await obtenerRutas();
    if (data) setRutas(data as Ruta[]);
  };

  const agregarHorario = () => {
    if (nuevaHora && !form.horarios.includes(nuevaHora)) {
      const horariosActualizados = [...form.horarios, nuevaHora].sort();
      setForm({ ...form, horarios: horariosActualizados});
      setNuevaHora('');
    }
  };

  const quitarHorario = (horaAQuitar: string) => {
    setForm({ ...form, horarios: form.horarios.filter(h => h !== horaAQuitar)});
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
      duracion: form.duracion ? form.duracion : undefined,
      horarios: form.horarios,
      fecha_salida: form.fecha_salida 
    };

    let resultado;
    
    // Agregamos un console.log para espiar qué nos responde Supabase
    if (modoEdicion) {
      console.log("Intentando actualizar ruta ID:", modoEdicion);
      resultado = await actualizarRuta(modoEdicion, nuevaRuta);
      
      if (resultado.error) console.error("Erro de Supabase al actualizar ruta:", resultado.error);
      setMensaje(resultado.error ? "Error al actualizar" : "Ruta actualizada correctamente");
    } else {
      console.log("Intentando crear ruta:", nuevaRuta);
      resultado = await crearRuta(nuevaRuta);

      if (resultado.error) console.error("Erro de Supabase al crear ruta:", resultado.error);
      setMensaje(resultado.error ? "Error al crear" : "Ruta creada exitosamente");
    }

  
    if (!resultado.error) {
      await cargarRutas(); 
      limpiarFormulario();
    }
    setMostrarToast(true);
  };

  const manejarEliminar = async (id: number) => {
    const { error } = await eliminarRuta(id);
    if (error) {
      setMensaje("Error al eliminar: " + error.message);
    } else {
      setMensaje("Ruta eliminada");
      cargarRutas();
    }
    setMostrarToast(true);
  };

  const cargarParaEditar = (ruta: Ruta) => {
    setModoEdicion(ruta.id!); 
    setForm({
        origen: ruta.origen,
        destino: ruta.destino,
        precio: ruta.precio.toString(),
        duracion: ruta.duracion || '',
        horarios: ruta.horarios || [],
        fecha_salida: ruta.fecha_salida || new Date().toISOString() 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarFormulario = () => {
    setModoEdicion(null); 
    setForm({ origen: '', destino: '', precio: '', duracion: '', horarios: [], fecha_salida: new Date().toISOString() });
  };

  const formatearFechaVisual = (fechaIso?: string) => {
    if (!fechaIso) return "Sin fecha";
    try {
        const parsedDate = parseISO(fechaIso);
        // Validamos que la fecha no esté corrupta
        if (isNaN(parsedDate.getTime())) return "Fecha inválida";
        return format(parsedDate, "dd - MMM - yyyy", { locale: es });
    } catch {
        return "Fecha inválida";
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Administrar Rutas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{'--background': '#f4f5f8'}}>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0, color: 'var(--ion-color-primary)' }}>
            {modoEdicion ? " Editar Ruta" : " Nueva Ruta"}
          </h2>
          
          <IonList lines="none" style={{padding: 0}}>
            <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee'}}>
              <IonIcon icon={createOutline} slot="start" color="medium"/>
              <IonSelect
                placeholder="Origen" 
                value={form.origen} 
                onIonChange={e => setForm({...form, origen: e.detail.value})} 
                interface="action-sheet"
                style={{with: '100%'}}>

                  {CIUDADES_DISPONIBLES.map(ciudad => (
                    <IonSelectOption key={"origen-" + ciudad} value={ciudad}>
                      {ciudad}
                    </IonSelectOption>
                  ))}
                </IonSelect>
            </IonItem>

            <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee'}}>
              <IonIcon icon={createOutline} slot="start" color="medium"/>
              <IonSelect 
                placeholder="Destino" 
                value={form.destino} 
                onIonChange={e => setForm({...form, destino: e.detail.value})} 
                interface="action-sheet"
                style={{with: '100%'}}>

                  {CIUDADES_DISPONIBLES
                  .filter(ciudad => ciudad !== form.origen)
                  .map(ciudad => (
                    <IonSelectOption key={"destino-" + ciudad} value={ciudad}>
                      {ciudad}
                    </IonSelectOption>
                  ))}
                </IonSelect>
            </IonItem>

            <div style={{ display: 'flex', gap: '10px' }}>
                <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee', flex: 1}}>
                <IonLabel position="stacked">Precio ($)</IonLabel>
                <IonInput 
                    type="number" 
                    placeholder="0.00" 
                    value={form.precio} 
                    onIonChange={e => setForm({...form, precio: (e.detail.value as string) || ''})} 
                />
                </IonItem>
                <IonItem className="input-card" style={{'--background': 'white', margin: '10px 0', border:'1px solid #eee', flex: 1}}>
                  <IonIcon icon={timeOutline} slot="start" style={{marginTop: '25px'}} color="medium"/>
                  <IonLabel position="stacked">Duración</IonLabel>
                  <IonInput 
                      type="time"
                      value={form.duracion} 
                      onIonChange={e => setForm({...form, duracion: (e.detail.value as string) || ''})} 
                  />
                </IonItem>
            </div>

            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginTop: '15px', border: '1px solid #eee' }}>
                <IonLabel style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>
                    Horarios de Salida
                </IonLabel>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1, background: 'white', borderRadius: '8px', border: '1px solid #ddd', padding: '0 10px' }}>
                        <IonInput 
                            type="time" 
                            value={nuevaHora} 
                            onIonChange={e => setNuevaHora((e.detail.value as string) || '')}
                        />
                    </div>
                    <IonButton onClick={agregarHorario} disabled={!nuevaHora} style={{ '--border-radius': '8px' }}>
                        <IonIcon icon={addOutline} slot="icon-only" />
                    </IonButton>
                </div>

                {/* Mostrar las horas que se han agregado */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {form.horarios.length === 0 ? (
                        <span style={{ fontSize: '13px', color: '#999' }}>No has agregado horarios</span>
                    ) : (
                        form.horarios.map(hora => (
                            <IonChip key={hora} color="primary" style={{ margin: 0 }}>
                                <IonLabel>{hora}</IonLabel>
                                <IonIcon icon={closeCircleOutline} onClick={() => quitarHorario(hora)} />
                            </IonChip>
                        ))
                    )}
                </div>
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
                        onIonChange={e => setForm({...form, fecha_salida: stringOrArrayToString(e.detail.value)})}
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
              <div className="price-badge">${ruta.precio}</div>
              
              <div className="timeline-container">
                  <div className="point-origen">{ruta.origen}</div>
                  <div className="point-destino">{ruta.destino}</div>
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
    return val as string;
};

export default AdminRutas;