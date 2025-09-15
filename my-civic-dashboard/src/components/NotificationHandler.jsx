import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const NotificationHandler = () => {
    const { token } = useAuth(); // Auth token, not device token

    useEffect(() => {
        const requestPermissionAndGetToken = async () => {
            if (token && 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        const vapidKey = "BLF7ymPIkdVMz_LGBBWjUhdIGsQnzxCDjyYOYtmAYM5x1BVfGtR1UsjYPjUL-w7XG1eUCFNQHkCIm9savvZthzk";
                        const fcmToken = await getToken(messaging, { vapidKey });

                        if (fcmToken) {
                            console.log('FCM Token:', fcmToken);
                            // Send this token to your server
                            await apiClient.post('/users/me/device-token', { device_token: fcmToken });
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    } else {
                        console.log('Unable to get permission to notify.');
                    }
                } catch (error) {
                    console.error('An error occurred while retrieving token. ', error);
                }
            }
        };

        requestPermissionAndGetToken();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            // Customize notification here
            alert(`Notification: ${payload.notification.title}\n${payload.notification.body}`);
        });

        return () => {
            unsubscribe();
        };

    }, [token]);

    return null; // This component does not render anything
};

export default NotificationHandler;
