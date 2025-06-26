
const isProd = import.meta.env.PROD;

import ranaAlSolLocal from "../assets/videos/ranaAlSol.mp4";
import marTranquiloLocal from "../assets/videos/marTranquilo.mp4";
import marRoca1Local from "../assets/videos/marRoca1.mp4";
import barquitoLocal from "../assets/videos/barquito.mp4";
import ciudadCosteraLocal from "../assets/videos/ciudadCostera.mp4";
import gaviotasLocal from "../assets/videos/gaviotas.mp4";
import libroLocal from "../assets/videos/libro.mp4";
import marOrillaLocal from "../assets/videos/marOrilla.mp4";
import jovenFrenteMarLocal from "../assets/videos/jovenFrenteMar.mp4";
import niñosSkateLocal from "../assets/videos/niñosSkate.mp4";

const baseRemote = "https://res.cloudinary.com/tu-usuario/video/upload/v123456";

export const videos = {
  ranaAlSol: isProd ? `${baseRemote}/ranaAlSol.mp4` : ranaAlSolLocal,
  marTranquilo: isProd ? `${baseRemote}/marTranquilo.mp4` : marTranquiloLocal,
  marRoca1: isProd ? `${baseRemote}/marRoca1.mp4` : marRoca1Local,
    barquito: isProd ? `${baseRemote}/barquito.mp4` : barquitoLocal,
    ciudadCostera: isProd ? `${baseRemote}/ciudadCostera.mp4` : ciudadCosteraLocal,
    gaviotas: isProd ? `${baseRemote}/gaviotas.mp4` : gaviotasLocal,
    libro: isProd ? `${baseRemote}/libro.mp4` : libroLocal,
    marOrilla: isProd ? `${baseRemote}/marOrilla.mp4` : marOrillaLocal,
    jovenFrenteMar: isProd ? `${baseRemote}/jovenFrenteMar.mp4` : jovenFrenteMarLocal,
    niñosSkate: isProd ? `${baseRemote}/niñosSkate.mp4` : niñosSkateLocal
    
};
