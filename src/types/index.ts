/**Interface de géolocalisation */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**Interface pour l'entrée dans le journal de bord */
export interface Incident{
    id?: string;
    description: string;
    photoUri: string | null; //null pour pas d'image
    location: Coordinates | null; //null si y a pas 
    timestamp: number;
}

/**<T> permet de réutiliser la structure pour n'importe quel type de données */
export interface ApiResponse<T> {
    success: boolean; //si la requête réussi
    data?: T;
    error?: string;
}