import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Coordinates } from '../types'; // Assure-toi que ce chemin est bon

interface LocationMapProps {
  onLocationFound: (coords: Coordinates) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({ onLocationFound }) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Demander la permission au premier plan
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission refusée. Impossible de vous localiser.');
          setLoading(false);
          return;
        }

        // 1. On tente le cache (rapide)
        let currentLocation = await Location.getLastKnownPositionAsync({});

        // 2. Si vide, on demande au GPS (Optimisé pour Android)
        if (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({
            // 👉 LA LIGNE MAGIQUE POUR DÉBLOQUER ANDROID :
            accuracy: Location.Accuracy.Balanced, 
        });
        }

        // 3. On extrait les coordonnées
        const coords: Coordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        };
        // Mettre à jour l'affichage et faire remonter au parent
        setLocation(coords);
        onLocationFound(coords);

      } catch (error) {
        setErrorMsg('Erreur lors de la récupération du signal GPS.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Affichage : Tant que la LoccurrentLocation n'est pas trouvée
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Recherche du signal GPS...</Text>
      </View>
    );
  }

  // Affichage : En cas d'erreur ou de refus
  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Affichage : Carte centrée avec le marqueur rouge
  return (
    <View style={styles.container}>
      {location && (
        <MapView
        style={{ width: '100%', height: '100%' }} 
        initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }}
        >
          <Marker
            coordinate={location}
            pinColor="red"
            title="Lieu de l'incident"
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250, // Hauteur d'environ 250px demandée
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  center: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
});