import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraCapture } from '../components/CameraCapture';
import { LocationMap } from '../components/LocationMap';
import { Coordinates } from '../types';

export const IncidentReportScreen: React.FC = () => {
  // 1. Les states pour stocker la photo et les coordonnées GPS
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);

  // 2. La fonction déclenchée par le bouton final
  const handleSave = () => {
    // On bloque si la photo manque
    if (!photoUri) {
      Alert.alert("Action requise", "Veuillez prendre une photo de l'incident.");
      return;
    }
    
    // On bloque si le GPS n'a pas encore trouvé la position
    if (!location) {
      Alert.alert("Action requise", "Veuillez attendre que la position GPS soit fixée sur la carte.");
      return;
    }

    // Si on arrive ici, tout est bon !
    Alert.alert("Succès", "Photo et position validées !");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Nouveau Signalement</Text>

      {/* --- PARTIE 1 : LA PHOTO --- */}
      <View style={styles.section}>
        <Text style={styles.label}>1. Preuve Photographique</Text>
        
        {photoUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.retakeButton} 
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.buttonText}>📷 Reprendre la photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraCapture onPictureTaken={(uri: string) => setPhotoUri(uri)} />
        )}
      </View>

      {/* --- PARTIE 2 : LE GPS --- */}
      <View style={styles.section}>
        <Text style={styles.label}>2. Localisation GPS</Text>
        
        <LocationMap onLocationFound={(coords: Coordinates) => setLocation(coords)} />
      </View>

      {/* --- PARTIE 3 : LE BOUTON VALIDER --- */}
      <TouchableOpacity 
        style={[styles.saveButton, (!photoUri || !location) && styles.disabledButton]} 
        onPress={handleSave}
        disabled={!photoUri || !location} // Empêche le clic si les données manquent
      >
        <Text style={styles.saveButtonText}>Valider les données</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 50 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  section: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  
  // Styles de la photo
  previewContainer: { alignItems: 'center' },
  previewImage: { width: '100%', height: 300, borderRadius: 10, backgroundColor: '#eee' },
  retakeButton: { marginTop: 15, backgroundColor: '#e74c3c', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  
  // Styles du bouton de validation
  saveButton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#bdc3c7' }, // Gris quand c'est bloqué
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});