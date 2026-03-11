import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { IncidentReportScreen } from './src/screens/IncidentReportScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Affichage de ton écran de formulaire */}
      <IncidentReportScreen />
      
      {/* Barre d'état (heure, batterie) automatique selon le thème */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});