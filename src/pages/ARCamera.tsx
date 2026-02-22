import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const ARCamera: React.FC = () => {
  const AR_URL = 'https://www.kivicube.com/scenes/esquaMpGktMhmCOXe0NZ18Ykc6IcpY4M';
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const openAR = async () => {
      try {
        if (Capacitor.getPlatform() === 'web') {
          // Web fallback: iframe inside app
          setIsLoading(false);
        } else {
          await Browser.open({
            url: AR_URL,
            presentationStyle: 'fullscreen'
          });
          setTimeout(() => window.history.back(), 500);
        }
      } catch (err) {
        console.error('Failed to open AR:', err);
        setHasError(true);
        setIsLoading(false);
      }
    };

    openAR();

    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/home">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>AR Experience</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {isLoading && !hasError && (
          <div style={styles.center}>
            <IonSpinner name="crescent" />
            <p>Launching AR Camera...</p>
            <p style={{ fontSize: 12, color: '#888' }}>
              Please allow camera access if prompted.
            </p>
          </div>
        )}

        {hasError && (
          <div style={styles.center}>
            <IonText color="danger">
              <p>Unable to load AR experience.</p>
              <p>Please check your camera permission or internet connection.</p>
            </IonText>
            <IonButton routerLink="/home" expand="block" style={{ marginTop: 16 }}>
              Go Back
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

const styles = {
  center: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center' as const
  }
};

export default ARCamera;