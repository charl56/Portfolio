let targetItems = {
    characterZombie: {
        obj: './static/Models/Graveyard/OBJ_format/characterZombie.obj',      // Item
        mtl: './static/Models/Graveyard/OBJ_format/characterZombie.mtl',      // Item
        mesh: null,                                         // Données de l'affichage de l'item
        position: {                 // Position de l'item
            x: 0,
            y: 0,
            z: 0,
        },
        rotation: {                 // Rotation de l'item
            x: 0,
            y: Math.PI / 2,
            z: 0,
        },
        scale: 3,                    // Echelle de l'item 
    },
}

export default targetItems