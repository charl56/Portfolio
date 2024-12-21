const fs = require("fs");
const path = require("path");

function generatePhotoList(directory, outputFile) {
    // Extensions d'image reconnues
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"];

    // Lire les fichiers du dossier
    const photos = fs.readdirSync(directory)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return validExtensions.includes(ext);
        })
        .map(file => ({ name: `/${file}` })); // Formater chaque fichier

    // Écrire la liste dans un fichier JSON
    fs.writeFileSync(outputFile, JSON.stringify(photos, null, 4), "utf8");

    console.log(`Fichier JSON généré : ${outputFile}`);
}

// Exemple d'utilisation
const photosDirectory = "./"; // Remplacez par le chemin du dossier
const outputJson = "photos.json"; // Nom du fichier JSON de sortie

generatePhotoList(photosDirectory, outputJson);
