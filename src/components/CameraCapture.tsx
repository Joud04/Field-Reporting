import React, { useRef } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface CameraCaptureProps {
  onPictureTaken: (uri: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onPictureTaken }) => {
  // 1. Récupérer le statut des permissions de la caméra
  const [permission, requestPermission] = useCameraPermissions();
  
  // 2. Créer une ref pour piloter la caméra
  const cameraRef = useRef<CameraView>(null);

  // 3. Gestion de l'état des permissions
  if (!permission) {
    // La permission est en train de charger
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    // La permission est refusée ou pas encore demandée
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          L'application a besoin d'accéder à votre caméra pour prendre une photo.
        </Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  // 4. Logique de capture de la photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // On prend la photo avec une qualité réduite (0.5) comme demandé dans le TP
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        
        if (photo) {
          // On renvoie l'URI de l'image au composant parent
          onPictureTaken(photo.uri); 
        }
      } catch (error) {
        console.error("Erreur lors de la capture :", error);
      }
    }
  };

  // 5. L'interface de la caméra en plein écran (ou dans son conteneur)
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Le bouton rond superposé pour déclencher la photo */}
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.innerCircle} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

// 6. Les styles du composant
const styles = StyleSheet.create({
  container: {
    height: 400, // Hauteur fixe pour la caméra
    backgroundColor: 'black',
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    padding: 10,
    width: 70,
    height: 70,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  innerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
  }
});