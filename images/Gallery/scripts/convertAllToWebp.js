const { pathFolder } = require('./globalConfig');


const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Dossier source contenant les images
const inputFolder = pathFolder;
// Dossier cible où enregistrer les fichiers WebP
const outputFolder = pathFolder;

// Extensions valides pour les images
const validExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'];

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Erreur lors de la lecture du dossier source :', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (validExtensions.includes(ext)) {
            const inputPath = path.join(inputFolder, file);
            const outputPath = path.join(outputFolder, path.parse(file).name + '.webp');

            sharp(inputPath)
                .toFormat('webp', { quality: 85 }) // Ajustez la qualité si nécessaire
                .toFile(outputPath, (err) => {
                    if (err) {
                        console.error(`Erreur lors de la conversion de ${file} :`, err);
                    } else {
                        console.log(`Converti : ${file} -> ${outputPath}`);
                    }
                });
        }
    });
});
