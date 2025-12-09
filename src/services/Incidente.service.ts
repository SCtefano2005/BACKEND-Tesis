import { error } from "console";
import Incidente, { IIncidente } from "../models/Incidente";
import Usuario, { IUsuario } from "../models/Usuario";
import { IncidenteResponse, ObtenerTodosIncidentes } from "../Responses/Incidentes/Incidente.r";

interface CrearIncidenteData extends Partial<IIncidente> {
  dni: string; // lo que enviará el cliente
}

//Crea Incidente
export const crearIncidente = async (data: CrearIncidenteData): Promise<IncidenteResponse> => {
  try {
    const { dni, ...restoData } = data;

    const usuario: IUsuario | null = await Usuario.findOne({ identificacion: dni });

    if (!usuario) {
      throw new Error("No se encontró un usuario con el DNI proporcionado");
    }

    const nuevoIncidente = new Incidente({
      UsuarioConductorID: usuario._id,
      estado: "Pendiente",
      ...restoData
    });

    await nuevoIncidente.save();

    return {
      mensaje: "Incidente registrado correctamente"
    };

  } catch (error) {
    throw new Error("Error al crear el incidente: " + error);
  }
};


export const obtenerIncidenteporId = async (id_incidente: string) => {
  try {
    const incidente = await Incidente.findById(id_incidente)
      .populate("UsuarioConductorID"); // trae el documento del usuario relacionado

    if (!incidente) {
      throw new Error("No se encontró el incidente");
    }

    return incidente; // devuelve el documento completo con todos los campos y metadatos
  } catch (error: any) {
    console.error("Error al buscar incidente:", error);
    throw new Error("Error al buscar incidente: " + error.message);
  }
};




export const actualizarestado = async (id_incidente: string, estado: string) => {
  try{
    const IncidenteActualizado = await Incidente.findByIdAndUpdate(id_incidente, { estado: estado }, {new : true});
    if (!IncidenteActualizado) {
      throw new Error("Incidente no encontrado");
    }
    return {
      mensaje: "Se cambio el estado satisfactoriamente"
    };
  } catch (error) {
    throw new Error("Error al cambiar el estado ");
  }
  
};



export const obtenerIncidentes = async (): Promise<ObtenerTodosIncidentes[]> => {
  try {
    const incidentes = await Incidente.find().populate("UsuarioConductorID");

    const respuesta: ObtenerTodosIncidentes[] = incidentes.map((i: any) => ({
      _id: i._id.toString(),
      tipo: i.tipo,
      estado: i.estado,

      // ✔ Formato perfecto para Leaflet
      ubicacion: {
        lat: i.latitud,
        lng: i.longitud
      },

      UsuarioConductorId: {
        identificacion: i.UsuarioConductorID.identificacion,
        nombreyapellido: `${i.UsuarioConductorID.datos_personal.nombres} ${i.UsuarioConductorID.datos_personal.apellidos}`,
        telefono: i.UsuarioConductorID.datos_personal.telefono
      }
    }));

    return respuesta;

  } catch (error) {
    throw new Error("Error al obtener incidentes: " + error);
  }
};

export const obtenerIncidentesPorConductor = async (dni: string): Promise<IIncidente[]> => {
  try {
    const usuario = await Usuario.findOne({ identificacion: dni });

    if (!usuario) {
      throw new Error("No se encontró usuario con ese DNI");
    }

    return await Incidente.find({ UsuarioConductorID: usuario._id })
      .populate("UsuarioConductorID");

  } catch (error) {
    throw new Error("Error al obtener incidentes del conductor: " + error);
  }
};


export const eliminarIncidente = async (id: string): Promise<void> => {
  try {
    await Incidente.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error al eliminar el incidente: " + error);
  }
};
