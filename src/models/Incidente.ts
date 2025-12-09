// src/models/Incidente.ts

import { Schema, model, Document, Types } from "mongoose";

export interface IIncidente extends Document {
    _id: Types.ObjectId;   
    UsuarioConductorID: Types.ObjectId;
    Descripcion?: string;
    tipo: 'Desastre Natural' | 'Falla Mecanica' | 'Accidente Automovilistico' | 'Retrasos';
    estado: 'Pendiente' | 'Revisado' | 'Solucionado';
    latitud: number;
    longitud: number;
    timestamp: Date;
}

const IncidenteSchema = new Schema<IIncidente>({
    UsuarioConductorID: { 
        type: Schema.Types.ObjectId, 
        ref: "Usuarios", 
        required: true,
        index: true
    },
    Descripcion: { 
        type: String, 
        required: false, 
        trim: true
    },
    tipo: { 
        type: String, 
        enum: ['Desastre Natural', 'Falla Mecanica', 'Accidente Automovilistico', 'Retrasos'],
        required: true 
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Revisado', 'Solucionado'],
        required: true,
        default: 'Pendiente'
    },
    latitud: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitud: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
},
{ timestamps: true }
);

export default model<IIncidente>("Incidente", IncidenteSchema);
