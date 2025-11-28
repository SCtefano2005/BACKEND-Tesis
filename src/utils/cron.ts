import cron from "node-cron";
import  { verificarInactividadViajesActivos } from "../services/coordenada.service";

cron.schedule("*/15 * * * *", async () => {
  try {
    await verificarInactividadViajesActivos();
  } catch (error) {
    console.error("Error en verificación de inactividad:", error);
  }
});
