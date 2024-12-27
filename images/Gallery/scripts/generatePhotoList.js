const { pathFolder } = require('./globalConfig');

const fs = require("fs");
const path = require("path");

function generatePhotoList() {
    // Extensions d'image reconnues
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"];

    const outputJson = "photosList.json"; // Nom du fichier JSON de sortie

    
    // Lire les fichiers du dossier
    const photos = fs.readdirSync(pathFolder)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return validExtensions.includes(ext);
        })
        .map(file => ({ src: `/${file}` })); // Formater chaque fichier

    // Écrire la liste dans un fichier JSON
    fs.writeFileSync(outputJson, JSON.stringify(photos, null, 4), "utf8");

    console.log(`Fichier JSON généré : ${outputJson}`);
}


generatePhotoList();
