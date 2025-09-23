// src/models/Administrador.ts
import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface IAdministrador extends Document {
    usuario_id: Types.ObjectId;
    permisos: string[];
    area: string;
    nivel: "SuperAdmin" | "admin_local";
    creado_en: Date;
    actualizado: Date;
}

const AdministradorSchema = new Schema<IAdministrador>({
    usuario_id: {type:Schema.Types.ObjectId, ref: "Usuario", required: true},
    permisos: {type:[String], required: true},
    area: {type:String, required:true},
    nivel: { type: String, enum: ["superadmin", "admin_local"], default: "admin_local" },
    creado_en: { type: Date, default: Date.now },
    actualizado: { type: Date, default: Date.now }   
});

AdministradorSchema.pre("save",function (next) {
    this.actualizado = new Date();
    next();
});

export default mongoose.model<IAdministrador>("Administrador", AdministradorSchema, "administradores");