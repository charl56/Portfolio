export const weapons = {
    pistol: {
        obj: './static/Models/Weapon_Pack/pistol.obj',      // Arme
        mtl: './static/Models/Weapon_Pack/pistol.mtl',      // Arme
        mesh: null,                                         // Données de l'affichage de l'arme
        ammo: {                                                     // Pareil pour la munition correspodante
            obj: './static/Models/Weapon_Pack/ammo_pistol.obj',
            mtl: './static/Models/Weapon_Pack/ammo_pistol.mtl',
            mesh: null,
        },
        parameters: {                           // Parametres de l'armes    
            positionAimY: 0.12,                     // Position en mode visé
            positionNotAim: 0,                      // Position non visé
            shootTimer: 100,                        // Cadence de tire
            loadTimer: 2000,                        // Temps de chargement
            loader: 15,                             // Balles par chargeur
            remainBullets: 15,                      // Balles restantes dans le chargeur
            remainLoaders: 5,                        // Chargeurs restants
        }
    },
    pistolSilencer: {
        obj: './static/Models/Weapon_Pack/pistolSilencer.obj',
        mtl: './static/Models/Weapon_Pack/pistolSilencer.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_pistol.obj',
            mtl: './static/Models/Weapon_Pack/ammo_pistol.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.12,
            positionNotAim: 0,
            shootTimer: 100,
            loadTimer: 2000,
            loader: 15,
            remainBullets: 15,
            remainLoaders: 5,
        }
    },
    shotgun: {
        obj: './static/Models/Weapon_Pack/shotgun.obj',
        mtl: './static/Models/Weapon_Pack/shotgun.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_shotgun.obj',
            mtl: './static/Models/Weapon_Pack/ammo_shotgun.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.1,
            positionNotAim: 0,
            shootTimer: 500,
            loadTimer: 2000,
            loader: 8,
            remainBullets: 8,
            remainLoaders: 5,
        }
    },
    uzi:{
        obj: './static/Models/Weapon_Pack/uzi.obj',
        mtl: './static/Models/Weapon_Pack/uzi.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_uzi.obj',
            mtl: './static/Models/Weapon_Pack/ammo_uzi.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.15,
            positionNotAim: 0,
            shootTimer: 100,
            loadTimer: 1500,
            loader: 30,
            remainBullets: 30,
            remainLoaders: 4,
        }
    },
    uziLong:{
        obj: './static/Models/Weapon_Pack/uziLong.obj',
        mtl: './static/Models/Weapon_Pack/uziLong.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_uzi.obj',
            mtl: './static/Models/Weapon_Pack/ammo_uzi.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.15,
            positionNotAim: 0,
            shootTimer: 100,
            loadTimer: 1500,
            loader: 30,
            remainBullets: 30,
            remainLoaders: 4,
        }
    },
    uziLongSilencer: {
        obj: './static/Models/Weapon_Pack/uziLongSilencer.obj',
        mtl: './static/Models/Weapon_Pack/uziLongSilencer.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_uzi.obj',
            mtl: './static/Models/Weapon_Pack/ammo_uzi.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.15,
            positionNotAim: 0,
            shootTimer: 100,
            loadTimer: 1500,
            loader: 30,
            remainBullets: 30,
            remainLoaders: 4,
        }
    },
    machinegun: {
        obj: './static/Models/Weapon_Pack/machinegun.obj',
        mtl: './static/Models/Weapon_Pack/machinegun.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_machinegun.obj',
            mtl: './static/Models/Weapon_Pack/ammo_machinegun.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.15,
            positionNotAim: 0,
            shootTimer: 100,
            loadTimer: 2000,
            loader: 30,
            remainBullets: 30,
            remainLoaders: 4,
        }
    },
    sniper: {
        obj: './static/Models/Weapon_Pack/sniper.obj',
        mtl: './static/Models/Weapon_Pack/sniper.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_sniper.obj',
            mtl: './static/Models/Weapon_Pack/ammo_sniper.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.09,
            positionNotAim: 0,
            shootTimer: 1200,
            loadTimer: 3000,
            loader: 5,
            remainBullets: 5,
            remainLoaders: 5,
        }
    },
    sniperCamo: {
        obj: './static/Models/Weapon_Pack/sniperCamo.obj',
        mtl: './static/Models/Weapon_Pack/sniperCamo.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_sniper.obj',
            mtl: './static/Models/Weapon_Pack/ammo_sniper.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.09,
            positionNotAim: 0,
            shootTimer: 1200,
            loadTimer: 3000,
            loader: 5,
            remainBullets: 5,
            remainLoaders: 5,
        }
    },
    rocketlauncher: {
        obj: './static/Models/Weapon_Pack/rocketlauncher.obj',
        mtl: './static/Models/Weapon_Pack/rocketlauncher.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_rocket.obj',
            mtl: './static/Models/Weapon_Pack/ammo_rocket.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.17,
            positionNotAim: 0,
            shootTimer: 2000,
            loadTimer: 2000,
            loader: 2,
            remainBullets: 2,
            remainLoaders: 5,
        }
    },
    rocketlauncherModern: {
        obj: './static/Models/Weapon_Pack/rocketlauncherModern.obj',
        mtl: './static/Models/Weapon_Pack/rocketlauncherModern.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_rocketModern.obj',
            mtl: './static/Models/Weapon_Pack/ammo_rocketModern.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.17,
            positionNotAim: 0,
            shootTimer: 2000,
            loadTimer: 2000,
            loader: 2,
            remainBullets: 2,
            remainLoaders: 5,
        }
    },
    flamethrower: {
        obj: './static/Models/Weapon_Pack/flamethrower.obj',
        mtl: './static/Models/Weapon_Pack/flamethrower.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/grenade.obj',
            mtl: './static/Models/Weapon_Pack/grenade.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.17,
            positionNotAim: 0,
            shootTimer: 200,
            loadTimer: 2000,
            loader: 10,
            remainBullets: 10,
            remainLoaders: 5,
        }
    },
    turkey: {
        obj: './static/Models/Food/OBJ_format/turkey.obj',
        mtl: './static/Models/Food/OBJ_format/turkey.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Food/OBJ_format/bacon.obj',
            mtl: './static/Models/Food/OBJ_format/bacon.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.12,
            positionNotAim: 0,
            shootTimer: 1000,
            loadTimer: 200,
            loader: 10,
            remainBullets: 10,
            remainLoaders: 5,
        }
    },
    wholeHam: {
        obj: './static/Models/Food/OBJ_format/bacon.obj',
        mtl: './static/Models/Food/OBJ_format/bacon.mtl',
        mesh: null,
        ammo: {
            obj: './static/Models/Weapon_Pack/ammo_rocketModern.obj',
            mtl: './static/Models/Weapon_Pack/ammo_rocketModern.mtl',
            mesh: null,
        },
        parameters: {
            positionAimY: 0.12,
            positionNotAim: 0,
            shootTimer: 1000,
            loadTimer: 200,
            loader: 10,
            remainBullets: 10,
            remainLoaders: 5,
        }
    }
}

export default weapons