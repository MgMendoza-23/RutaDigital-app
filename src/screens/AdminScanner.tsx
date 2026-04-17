import React, { useState, useEffect } from 'react';
import { 
    IonPage, IonButtons, IonMenuButton, 
    IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonSpinner
} from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, scanOutline, refreshOutline, personCircleOutline } from 'ionicons/icons';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { buscarBoletoQR } from '../services/adminService';
import { Reserva } from '../models/types';

const AdminEscaner: React.FC = () => {
    const [escaneando, setEscaneando] = useState(true);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [resultado, setResultado] = useState<Reserva | null>(null);
    const [errorBoleto, setErrorBoleto] = useState('');

    useEffect(() => {
        // Configuramos el escáner si está en modo "escaneando"
        if (!escaneando) return;

        const scanner = new Html5QrcodeScanner(
            "lector-qr", 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        scanner.render(
            async (textoDecodificado) => {
                scanner.clear(); 
                setEscaneando(false);
                validarBoleto(textoDecodificado);
            },
            (error) => {
                console.error("Error al escanear QR:", error);
                // Ignoramos los errores de lectura (pasan en cada frame que no ve un QR)
            }
        );

        // Limpieza cuando el componente se destruye
        return () => {
            scanner.clear().catch(e => console.error("Error limpiando escáner", e));
        };
    }, [escaneando]);

    const validarBoleto = async (textoQR: string) => {
        setCargandoDatos(true);
        setErrorBoleto('');
        setResultado(null);

        // Asumimos que el QR guarda el ID de la reserva. Si guarda JSON, habría que parsearlo.
        let idBusqueda = textoQR;
        try {
            // Por si el QR tiene formato JSON (dependiendo de cómo lo hayas creado en BoletoDigital)
            if (textoQR.includes('{')) {
                const json = JSON.parse(textoQR);
                idBusqueda = json.id || textoQR;
            }
            else if (textoQR.includes('ID:') && textoQR.includes('|')) {
                const partes = textoQR.split('|');
                const parteId = partes.find(p => p.startsWith('ID:'));

                if (parteId) {
                    idBusqueda = parteId.replace('ID:', '');
                }
            }
        } catch (e) {
            console.error("Error intentando leer el formato del QR", e);
        }

        const { data, error } = await buscarBoletoQR(idBusqueda);
        
        setCargandoDatos(false);

        if (error || !data) {
            setErrorBoleto('Boleto no encontrado en el sistema o código inválido.');
        } else if (data.estado !== 'confirmado') {
            setErrorBoleto(`Este boleto está marcado como: ${data.estado.toUpperCase()}`);
        } else {
            setResultado(data as Reserva);
        }
    };

    const limpiarEscaneo = () => {
        setResultado(null);
        setErrorBoleto('');
        setEscaneando(true);
    };

    return (
        <IonPage>
            <div className="curved-header-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center' }}>
          <IonButtons>
            <IonMenuButton color="light" />
          </IonButtons>
          <div className="header-title">
            <h2>RutaDigital</h2>
            <div className="header-subtitle">ESCANEAR ABORDAJE</div>
          </div>
          <IonIcon icon={personCircleOutline} style={{ fontSize: '35px', color: 'white' }} />
        </div>
      </div>

            <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
                
                {escaneando ? (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2 style={{ color: '#333' }}>Apunta al Código QR</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Solicita el Boleto Digital al pasajero</p>
                        
                        {/* Contenedor donde se insertará la cámara */}
                        <div id="lector-qr" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}></div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        
                        {cargandoDatos && (
                            <div>
                                <IonSpinner name="crescent" color="primary" />
                                <p>Verificando base de datos...</p>
                            </div>
                        )}

                        {errorBoleto && !cargandoDatos && (
                            <IonCard style={{ background: '#ffeeee', border: '1px solid #ffcccc' }}>
                                <IonCardContent>
                                    <IonIcon icon={closeCircleOutline} style={{ fontSize: '60px', color: 'red' }} />
                                    <h2 style={{ color: 'red', fontWeight: 'bold' }}>Boleto Inválido</h2>
                                    <p style={{ color: '#333' }}>{errorBoleto}</p>
                                    <IonButton expand="block" color="danger" onClick={limpiarEscaneo} style={{ marginTop: '15px' }}>
                                        <IonIcon slot="start" icon={refreshOutline} /> Intentar de nuevo
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        )}

                        {resultado && !cargandoDatos && (
                            <IonCard style={{ background: '#eeffee', border: '1px solid #ccffcc' }}>
                                <IonCardContent>
                                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '60px', color: 'green' }} />
                                    <h2 style={{ color: 'green', fontWeight: 'bold' }}>Boleto VÁLIDO</h2>
                                    <hr style={{ borderColor: '#ccffcc', margin: '15px 0' }}/>
                                    
                                    <div style={{ textAlign: 'left', color: '#333', fontSize: '16px' }}>
                                        <p><strong>Pasajero:</strong> {resultado.nombre_responsable}</p>
                                        <p><strong>Asientos:</strong> {String(resultado.asientos).replace(/[{}[\]"]/g, '')}</p>
                                        <p><strong>Horario:</strong> {resultado.horario}</p>
                                        <p><strong>Total pagado:</strong> ${resultado.total_pago}</p>
                                    </div>

                                    <IonButton expand="block" color="success" onClick={limpiarEscaneo} style={{ marginTop: '20px' }}>
                                        <IonIcon slot="start" icon={scanOutline} /> Escanear Siguiente
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        )}
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default AdminEscaner;