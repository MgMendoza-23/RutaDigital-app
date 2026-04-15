import React, { useState } from 'react';
import { 
    IonContent, IonPage, IonHeader, IonToolbar, IonButtons, 
    IonBackButton, IonTitle, IonButton, IonIcon, IonToast 
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { personCircleOutline } from 'ionicons/icons';
import '../css/SeleccionAsientos.css';
import { ReservaPayload } from '../models/types';

// Ícono SVG de un volante para el chofer
const VolanteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="2" x2="12" y2="10"></line><line x1="12" y1="14" x2="12" y2="22"></line><line x1="2" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="22" y2="12"></line>
  </svg>
);

const SeleccionAsientos: React.FC = () => {
    const location = useLocation<ReservaPayload>();
    const history = useHistory();
    
    const { ruta, horarioSeleccionado, precioTotal, totalPasajeros } = location.state || {};

    const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
    const [mensajeToast, setMensajeToast] = useState('');

    const asientosOcupados = ['1A', '1B', '4C', '4D', '7A']; 

    // Generador de la cuadrícula del autobús (10 filas, 4 columnas)
    const filas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const columnas = ['A', 'B', 'pasillo', 'C', 'D'];

    const manejarToqueAsiento = (asientoId: string) => {
        if (asientosOcupados.includes(asientoId)) return; // Si está ocupado, no hace nada

        if (asientosSeleccionados.includes(asientoId)) {
            // Si ya estaba seleccionado, lo desmarcamos
            setAsientosSeleccionados(asientosSeleccionados.filter(id => id !== asientoId));
        } else {
            // Si quiere seleccionar uno nuevo, validamos el límite
            if (asientosSeleccionados.length < (totalPasajeros || 1)) {
                setAsientosSeleccionados([...asientosSeleccionados, asientoId]);
            } else {
                setMensajeToast(`Solo puedes seleccionar ${totalPasajeros} asientos.`);
            }
        }
    };

    const avanzarConfirmacion = () => {
        // Validamos que haya elegido todos sus asientos
        if (asientosSeleccionados.length !== totalPasajeros) {
            setMensajeToast(`Por favor selecciona ${totalPasajeros} asientos.`);
            return;
        }

        console.log("Asientos apartados:", asientosSeleccionados);
        // Aquí lo mandaremos a la pantalla final de pago
        history.push({
            pathname: '/datos-del-contacto',
            state: {
                ...location.state,
                asientosSeleccionados: asientosSeleccionados,
            }
        });
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar color="primary">
                    <IonButtons slot="start"><IonBackButton defaultHref="/buscar-viajes" /></IonButtons>
                    <IonTitle>Selección de Asientos</IonTitle>
                    <IonButtons slot="end"><IonIcon icon={personCircleOutline} style={{ fontSize: '30px', marginRight: '15px' }} /></IonButtons>
                </IonToolbar>
                <div style={{ background: 'var(--ion-color-primary)', padding: '10px 20px', color: 'white', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        {ruta?.origen} ➔ {ruta?.destino} <br/>
                        <strong style={{ fontSize: '16px' }}>{horarioSeleccionado}</strong>
                    </p>
                </div>
            </IonHeader>

            <IonContent style={{ '--background': '#f4f5f8' }} className="ion-padding">
                
                {/* Indicador de progreso de selección */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', margin: '0 0 5px 0', color: '#333' }}>
                        Elige tus asientos
                    </h2>
                    <p style={{ margin: 0, color: '#666' }}>
                        Seleccionados: <strong>{asientosSeleccionados.length}</strong> de <strong>{totalPasajeros || 1}</strong>
                    </p>
                </div>

                {/* Leyenda Visual */}
                <div className="legend-container">
                    <div className="legend-item"><div className="legend-box disponible" style={{ backgroundColor: '#eef2f5', border: '1px solid #d1d9e0' }}></div> Disponible</div>
                    <div className="legend-item"><div className="legend-box seleccionado" style={{ backgroundColor: '#0f7e80' }}></div> Tu Elección</div>
                    <div className="legend-item"><div className="legend-box ocupado" style={{ backgroundColor: '#ffcccc' }}></div> Ocupado</div>
                </div>

                {/* EL AUTOBÚS */}
                <div className="bus-container">
                    <div className="bus-front">
                        <VolanteIcon />
                    </div>

                    <div className="seats-grid">
                        {filas.map(fila => (
                            columnas.map((columna, idx) => {
                                // Dibujamos el pasillo vacío
                                if (columna === 'pasillo') {
                                    return <div key={`pasillo-${fila}`} style={{ width: '40px' }}></div>;
                                }

                                const asientoId = `${fila}${columna}`;
                                const estaOcupado = asientosOcupados.includes(asientoId);
                                const estaSeleccionado = asientosSeleccionados.includes(asientoId);
                                
                                // Determinamos la clase CSS
                                let claseEstado = 'disponible';
                                if (estaOcupado) claseEstado = 'ocupado';
                                else if (estaSeleccionado) claseEstado = 'seleccionado';

                                return (
                                    <div 
                                        key={asientoId} 
                                        className={`seat ${claseEstado}`}
                                        onClick={() => manejarToqueAsiento(asientoId)}
                                    >
                                        {asientoId}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* Margen inferior para que no lo tape el botón flotante */}
                <div style={{ height: '100px' }}></div>

                {/* Toast de validación */}
                <IonToast
                    isOpen={!!mensajeToast}
                    message={mensajeToast}
                    duration={2000}
                    color="warning"
                    onDidDismiss={() => setMensajeToast('')}
                />
            </IonContent>

            {/* Panel Flotante Inferior de Cobro */}
            <div style={{ padding: '20px', backgroundColor: 'white', borderTop: '1px solid #eee', position: 'absolute', bottom: 0, width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ color: '#555', fontSize: '14px' }}>Total a pagar:</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f7e80' }}>${precioTotal || 0} MXN</span>
                </div>
                <IonButton 
                    expand="block" 
                    disabled={asientosSeleccionados.length !== totalPasajeros}
                    onClick={avanzarConfirmacion}
                    style={{ '--border-radius': '10px', '--background': '#0f7e80', height: '50px' }}
                >
                    Confirmar Asientos
                </IonButton>
            </div>
        </IonPage>
    );
};

export default SeleccionAsientos;