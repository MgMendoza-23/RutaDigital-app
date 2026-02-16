import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonCard, IonCardContent,
  IonToast
} from '@ionic/react';
import { crearRuta, obtenerRutas, eliminarRuta, cerrarSesion, Ruta } from '../services/supabase';
import { trash, logOut } from 'ionicons/icons';
import { IonIcon } from '@ionic/react'; 
import { useHistory } from 'react-router-dom';



const AdminRutas: React.FC = () => {
  const history = useHistory(); 
  // Estado para el formulario (usando la interfaz Ruta)
  const [nuevaRuta, setNuevaRuta] = useState<Ruta>({
    origen: '',
    destino: '',
    precio: 0,
    duracion: '',
    horarios: [] 
  });
  // Función para Salir
  const manejarLogout = async () => {
    await cerrarSesion();
    history.push('/'); 
  };

  // Estado para la lista de rutas
  const [listaRutas, setListaRutas] = useState<Ruta[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [mostrarToast, setMostrarToast] = useState(false);

  // Cargar rutas al entrar a la página
  useEffect(() => {
    cargarRutas();
  }, []);

  const cargarRutas = async () => {
    const { data, error } = await obtenerRutas();
    if (data) {
      setListaRutas(data);
    } else {
      console.error(error);
    }
  };

  const guardar = async () => {
    if (!nuevaRuta.origen || !nuevaRuta.destino || !nuevaRuta.precio) {
      setMensaje("Por favor llena todos los campos obligatorios");
      setMostrarToast(true);
      return;
    }

    const rutaAGuardar = {
      ...nuevaRuta,
      horarios: [{ salida: "08:00", llegada: "09:00", cupo: 40 }]
    };

    const { error } = await crearRuta(rutaAGuardar);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
    } else {
      setMensaje("¡Ruta creada exitosamente!");
      setNuevaRuta({ origen: '', destino: '', precio: 0, duracion: '', horarios: [] }); 
      cargarRutas(); 
    }
    setMostrarToast(true);
  };

  // Función para manejar el click en eliminar
  const borrar = async (id: number | undefined) => {
    if (!id) return; 

    if (!window.confirm('¿Seguro que quieres eliminar esta ruta?')) return;

    const { error } = await eliminarRuta(id);

    if (error) {
      setMensaje("Error al eliminar: " + error.message);
    } else {
      setMensaje("Ruta eliminada correctamente");
      cargarRutas(); 
    }
    setMostrarToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin - Alta de Rutas</IonTitle>
          {/* Botón de Cerrar Sesión */}
        <IonButton slot="end" onClick={manejarLogout}>
          <IonIcon icon={logOut} />
        </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Nueva Ruta</h2>
        
        <IonItem>
          <IonLabel position="stacked">Origen (*)</IonLabel>
          <IonInput 
            value={nuevaRuta.origen} 
            onIonChange={e => setNuevaRuta({...nuevaRuta, origen: e.detail.value!})} 
            placeholder="Ej: Emiliano Zapata"
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Destino (*)</IonLabel>
          <IonInput 
            value={nuevaRuta.destino} 
            onIonChange={e => setNuevaRuta({...nuevaRuta, destino: e.detail.value!})} 
            placeholder="Ej: Balancán"
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Precio ($)</IonLabel>
          <IonInput 
            type="number" 
            value={nuevaRuta.precio} 
            onIonChange={e => setNuevaRuta({...nuevaRuta, precio: parseFloat(e.detail.value!)})} 
            placeholder="0.00"
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Duración</IonLabel>
          <IonInput 
            value={nuevaRuta.duracion} 
            onIonChange={e => setNuevaRuta({...nuevaRuta, duracion: e.detail.value!})} 
            placeholder="Ej: 1h 30m"
          ></IonInput>
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={guardar}>
          Guardar Ruta
        </IonButton>

        <hr />

        <h3>Rutas Registradas</h3>
        <IonList>
          {listaRutas.map((ruta, index) => (
            <IonCard key={index}>
              <IonCardContent>
                <h2>🚍 {ruta.origen} ➝ {ruta.destino}</h2>
                <p><strong>Precio:</strong> ${ruta.precio}</p>
                <p><strong>Duración:</strong> {ruta.duracion}</p>
                {/* Botón de Eliminar */}
                <IonButton 
                  color="danger" 
                  fill="outline" 
                  size="small" 
                  onClick={() => borrar(ruta.id)}
                  style={{ marginTop: '10px' }}
                >
                  <IonIcon slot="start" icon={trash} />
                  Eliminar
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        <IonToast
          isOpen={mostrarToast}
          onDidDismiss={() => setMostrarToast(false)}
          message={mensaje}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminRutas;