import axios from 'axios';
import { Incident, ApiResponse } from '../types'; // Importe tes interfaces

// Création de l'instance centralisée
const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // URL de base 
  timeout: 10000, // 10 secondes 
  headers: { 
    'Content-Type': 'application/json' 
  }
});

/**
 * Fonction pour soumettre un incident
 * @param data - L'objet incident à envoyer
 * @returns Une promesse respectant l'interface ApiResponse
 */
export const submitIncident = async (data: Incident): Promise<ApiResponse<Incident>> => {
  try {
    // Appel POST sur /posts via l'instance
    const response = await apiClient.post<Incident>('/posts', data);

    // Axios encapsule la réponse dans .data
    // On retourne un objet conforme à ApiResponse 
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    // En cas d'erreur (réseau, timeout, 404, etc.)
    return {
      success: false,
      error: error.message || "Une erreur est survenue lors de l'envoi."
    };
  }
};