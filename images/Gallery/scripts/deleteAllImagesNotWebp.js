const { pathFolder } = require('./globalConfig');

const fs = require('fs');
const path = require('path');

// Chemin du dossier contenant les images à supprimer
const folderPath = pathFolder;

// Extensions valides pour les images
const validExtensions = ['.jpg', '.jpeg', '.png'];

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Erreur lors de la lecture du dossier :', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();

        if (validExtensions.includes(ext)) {
            const filePath = path.join(folderPath, file);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Erreur lors de la suppression de ${file} :`, err);
                } else {
                    console.log(`Fichier supprimé : ${filePath}`);
                }
            });
        }
    });
});
