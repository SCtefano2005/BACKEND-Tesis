// Response despues de Crear Incidente
export interface IncidenteResponse {
    mensaje: string;

}

//Response para obtener todos los Incidentes
export interface ObtenerTodosIncidentes {
  _id: string;
  tipo: string;
  estado: string;

  ubicacion: {
    lat: number;
    lng: number;
  };

  UsuarioConductorId: {
    identificacion: string;
    nombreyapellido: string;
    telefono: string;
  };
}


export interface CambiarStatus{
    mensaje: string;
}
