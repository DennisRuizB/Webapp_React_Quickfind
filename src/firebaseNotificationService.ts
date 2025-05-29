import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { messaging } from './firebase';
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore';

const db = getFirestore();

// Solicitar permisos y obtener token FCM
export const requestNotificationPermission = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            try {
                const token = await getToken(messaging, {
                    vapidKey: 'BJWotEToPHHpg4XVl2bGy6NeZcP9FFcvdcVd49U4GIzSVm_XoiVvZjmV6n7YsMd-ZY6hljWF5NG4LFfLxTUPHhE' // Obtén esto de la consola Firebase
                });

                if (token) {
                    console.log('Token FCM:', token);
                    // Guarda el token en tu servidor asociado al usuario actual
                    await sendTokenToServer(token);
                    return token;
                } else {
                    console.log('No se pudo obtener el token');
                    return null;
                }
            } catch (error) {
                console.error('Error al obtener el token:', error);
                return null;
            }
        } else {
            console.log('Permiso denegado para notificaciones');
            return null;
        }
    } catch (error) {
        console.error('Error al solicitar permisos:', error);
        return null;
    }
};

// Configurar para recibir mensajes en primer plano
export const setupForegroundNotifications = (
    callback?: (payload: MessagePayload) => void
): (() => void) => {
    const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);

        // Crear una notificación nativa
        if (Notification.permission === 'granted' && payload.notification) {
            const { title, body } = payload.notification;
            new Notification(title || 'Nueva notificación', {
                body,
                icon: '/logo192.png'
            });
        }

        // Ejecutar callback con la información de la notificación
        if (callback && typeof callback === 'function') {
            callback(payload);
        }
    });

    return unsubscribe;
};

// Enviar token al servidor
const sendTokenToServer = async (token: string): Promise<void> => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Guardar token directamente en Firestore
        await setDoc(
            doc(db, 'fcmTokens', userId),
            {
                tokens: arrayUnion(token),
                lastUpdated: new Date().toISOString()
            },
            { merge: true } // Para no sobrescribir tokens existentes
        );

        console.log('Token guardado en Firestore correctamente');
    } catch (error) {
        console.error('Error al guardar el token en Firestore:', error);
    }
};