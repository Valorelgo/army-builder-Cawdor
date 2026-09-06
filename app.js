// app.js

const db = {
    // ===== PERSONNAGES =====
    characters: [
        // ===== PERSONNAGES CAWDOR PIOUS =====
        {
            id: "char_word_keeper",
            name: "Word-keeper",
            stats: { M: '5"', WS: '3+', BS: '3+', S: 3, T: 3, W: 3, I: '3+', A: 2, Sv: '5+', Ld: 8, Cl: 8, Wil: 8, Int: 7 },
            type: ["Guerrier", "leader", "pious"],
            starting_xp: 61,
            starting_skill: "1 au choix dans les primaires",
            special_rules: ["Leader Pious : débloque la règle 'Without number'."],
            primary_skills: ["muscle", "savant"],
            secondary_skills: ["combat", "tir"],
            cost: 115,
            tactics_cards: 2
        },
        {
            id: "char_firebrand",
            name: "Firebrand",
            stats: { M: '5"', WS: '3+', BS: '3+', S: 3, T: 3, W: 2, I: '3+', A: 2, Sv: '5+', Ld: 7, Cl: 7, Wil: 6, Int: 7 },
            type: ["Guerrier", "champion", "pious"],
            starting_xp: 37,
            starting_skill: "1 au choix dans les primaires",
            special_rules: [],
            primary_skills: ["muscle", "combat"],
            secondary_skills: ["savant"],
            cost: 95,
            tactics_cards: 1
        },
        {
            id: "char_brethen",
            name: "Brethen",
            stats: { M: '5"', WS: '4+', BS: '4+', S: 3, T: 3, W: 1, I: '3+', A: 1, Sv: '6+', Ld: 6, Cl: 6, Wil: 6, Int: 6 },
            type: ["Guerrier", "ganger", "spécialiste", "pious"],
            starting_xp: 13,
            starting_skill: "selon spécialité",
            special_rules: [],
            primary_skills: ["combat"],
            secondary_skills: ["agilité", "muscle"],
            cost: 40
        },
        {
            id: "char_way_brethen",
            name: "Way-brethen",
            stats: { M: '6"', WS: '5+', BS: '5+', S: 3, T: 3, W: 1, I: '4+', A: 1, Sv: '6+', Ld: 5, Cl: 6, Wil: 6, Int: 5 },
            type: ["Guerrier", "prospect", "pious"],
            starting_xp: 4,
            starting_skill: "Clamber",
            special_rules: ["Équipé de base d'un ridge walker."],
            primary_skills: ["agilité"],
            secondary_skills: ["combat"],
            cost: 65,
            default_equipment: ["eq_ridge_walker"]
        },
        {
            id: "char_bonepicker",
            name: "Bonepicker",
            stats: { M: '6"', WS: '5+', BS: '5+', S: 3, T: 3, W: 1, I: '4+', A: 1, Sv: '6+', Ld: 5, Cl: 5, Wil: 5, Int: 5 },
            type: ["Guerrier", "prospect", "pious"],
            starting_xp: 1,
            starting_skill: "",
            special_rules: [],
            primary_skills: ["combat"],
            secondary_skills: ["agilité"],
            cost: 20
        },
        {
            id: "char_stig_shambler",
            name: "Stig-shambler",
            stats: { M: '4"', WS: '4+', BS: '4+', S: 5, T: 4, W: 4, I: '3+', A: 2, Sv: '6+', Ld: 6, Cl: 6, Wil: 6, Int: 5 },
            type: ["Guerrier", "brute", "pious", "solitaire"],
            starting_xp: 25,
            starting_skill: "Bulging biceps",
            special_rules: ["Armé directement d'un heavy club et d'un lance flamme lourd. Bloqué pour tout autre équipement."],
            primary_skills: ["muscle"],
            secondary_skills: ["tir"],
            cost: 240,
            default_weapons: ["wpn_heavy_club", "wpn_lance_flamme_lourd"],
            allowed_merc_weapons: [
                { id: "wpn_heavy_stubber_jumele_stig", cost_credits: 0, replaces: "wpn_lance_flamme_lourd" }
            ]
        },

        // ===== PERSONNAGES CAWDOR FANATIC =====
        {
            id: "char_redemptionist_priest",
            name: "Redemptionist priest",
            stats: { M: '5"', WS: '3+', BS: '3+', S: 3, T: 3, W: 3, I: '3+', A: 3, Sv: '5+', Ld: 8, Cl: 7, Wil: 9, Int: 7 },
            type: ["Guerrier", "leader", "fanatic"],
            starting_xp: 61,
            starting_skill: "1 au choix dans les primaires",
            special_rules: ["Leader Fanatic : débloque la règle 'Fanatical'."],
            primary_skills: ["combat", "savant"],
            secondary_skills: ["muscle", "ruse"],
            cost: 130,
            tactics_cards: 2
        },
        {
            id: "char_redemptionist_deacon",
            name: "Redemptionnist deacon",
            stats: { M: '5"', WS: '3+', BS: '3+', S: 3, T: 3, W: 2, I: '3+', A: 2, Sv: '5+', Ld: 7, Cl: 7, Wil: 8, Int: 9 },
            type: ["Guerrier", "champion", "fanatic"],
            starting_xp: 37,
            starting_skill: "1 au choix dans les primaires",
            special_rules: [],
            primary_skills: ["combat", "tir"],
            secondary_skills: ["savant"],
            cost: 130,
            tactics_cards: 1
        },
        {
            id: "char_redemptionist_brethen",
            name: "Redemptionnist brethen",
            stats: { M: '5"', WS: '4+', BS: '4+', S: 3, T: 3, W: 1, I: '3+', A: 1, Sv: '6+', Ld: 6, Cl: 7, Wil: 7, Int: 5 },
            type: ["Guerrier", "ganger", "spécialiste", "fanatic"],
            starting_xp: 13,
            starting_skill: "selon spécialité",
            special_rules: [],
            primary_skills: ["combat"],
            secondary_skills: ["ruse", "tir"],
            cost: 40
        },
        {
            id: "char_redemptionist_zealot",
            name: "Redemptionnist zealot",
            stats: { M: '6"', WS: '5+', BS: '5+', S: 3, T: 3, W: 1, I: '4+', A: 2, Sv: '6+', Ld: 5, Cl: 6, Wil: 5, Int: 5 },
            type: ["Guerrier", "prospect", "fanatic"],
            starting_xp: 1,
            starting_skill: "",
            special_rules: [],
            primary_skills: ["agilité"],
            secondary_skills: ["combat"],
            cost: 35
        },

        // ===== AUTRES / FAMILIERS =====
        {
            id: "char_shen_bird",
            name: "Shen bird",
            stats: { M: '7"', WS: '3+', BS: '6+', S: 2, T: 3, W: 1, I: '5+', A: 2, Sv: '6+', Ld: 6, Cl: 6, Wil: 6, Int: 4 },
            type: ["Guerrier", "bête", "volant", "familier"],
            starting_xp: 13,
            starting_skill: "Leash 6\", Berserker",
            special_rules: ["Rattaché à une figurine.", "Bloqué pour tout autre équipement."],
            primary_skills: ["agilité"],
            secondary_skills: ["combat"],
            cost: 75,
            default_weapons: ["wpn_beak_talons"]
        },

        // ===== MERCENAIRES CONSERVÉS =====
        {
            id: "merc_hive_scum", name: "Hive scum",
            stats: { M: '5"', WS: '4+', BS: '4+', S: 3, T: 3, W: 1, I: 3, A: 1, Sv: '6+', Ld: 6, Cl: 6, Wil: 6, Int: 6 },
            type: ["Guerrier", "ganger"], starting_xp: 0, cost: 30,
            special_rules: ["Armes/équipements pour hive scum max 60 pts.", "Ne gagne jamais d'expérience."]
        },
        {
            id: "merc_luthern_armbot", name: "Luthern armbot",
            stats: { M: '4"', WS: '3+', BS: '5+', S: 5, T: 5, W: 3, I: 2, A: 2, Sv: '4+', Ld: 6, Cl: 8, Wil: 6, Int: 5 },
            type: ["Guerrier", "brute"], starting_xp: 25, starting_skill: "Infiltrate", primary_skills: ["Muscle"], secondary_skills: ["Combat"], cost: 230,
            special_rules: ["Post cycle : travailler sur territoires possédés."], default_weapons: ["wpn_griffes_tunnel"],
            allowed_merc_weapons: [
                { id: "wpn_armbot_grav", cost_credits: 40 },
                { id: "wpn_armbot_melta", cost_credits: 70 }
            ]
        },
        {
            id: "merc_jotunn_ogryn", name: "Jotunn Ogryn",
            stats: { M: '5"', WS: '4+', BS: '5+', S: 5, T: 5, W: 3, I: 3, A: 2, Sv: '5+', Ld: 7, Cl: 8, Wil: 6, Int: 5 },
            type: ["Guerrier", "brute"], starting_xp: 25, starting_skill: "Headbutt", primary_skills: ["Muscle"], secondary_skills: ["Combat"], cost: 160,
            special_rules: ["Ne peut jamais être activé en activation de groupe."], default_weapons: ["wpn_poing_augmetic", "wpn_poing_augmetic"],
            allowed_merc_weapons: [
                { id: "wpn_arc_welder", cost_credits: 70, replaces: "wpn_poing_augmetic" },
                { id: "wpn_storm_welder", cost_credits: 70, replaces: "wpn_poing_augmetic" },
                { id: "wpn_spud_jacker", cost_credits: 20, replaces: "wpn_poing_augmetic" }
            ]
        },
        {
            id: "merc_rogue_doc", name: "Rogue doc",
            stats: { M: '5"', WS: '5+', BS: '5+', S: 2, T: 3, W: 1, I: 3, A: 1, Sv: '6+', Ld: 6, Cl: 8, Wil: 6, Int: 7 },
            type: ["Guerrier", "hanger-on"], starting_xp: 13, starting_skill: "Medicate", primary_skills: ["Savant"], secondary_skills: ["Agilité"], cost: 90,
            special_rules: ["Peut accompagner un guerrier en escorte médicale ou mise en place de bioniques."],
            default_weapons: ["wpn_stub_gun"], default_equipment: ["eq_kit_medical", "eq_medicrane"],
            allowed_merc_weapons: [
                { id: "wpn_laspistol", cost_credits: 5, replaces: "wpn_stub_gun" }
            ]
        },
        {
            id: "merc_ammo_jack", name: "Ammo-jack",
            stats: { M: '5"', WS: '4+', BS: '3+', S: 3, T: 3, W: 1, I: 2, A: 1, Sv: '5+', Ld: 6, Cl: 7, Wil: 7, Int: 7 },
            type: ["Guerrier", "hanger-on"], starting_xp: 13, starting_skill: "Munitioneer", primary_skills: ["Tir"], secondary_skills: ["Savant"], cost: 100,
            special_rules: ["Post cycle overcharge : Une arme gagne +1 S et instable."],
            default_weapons: ["wpn_epee_energetique", "wpn_pompe_combat"],
            allowed_merc_weapons: [
                { id: "wpn_boltgun", cost_credits: 15, replaces: "wpn_pompe_combat" },
                { id: "wpn_marteau_nrj", cost_credits: 0, replaces: "wpn_epee_energetique" }
            ]
        },
        {
            id: "merc_dome_runner", name: "Dome runner",
            stats: { M: '5"', WS: '5+', BS: '5+', S: 3, T: 3, W: 1, I: 4, A: 1, Sv: '6+', Ld: 6, Cl: 7, Wil: 7, Int: 7 },
            type: ["Guerrier", "hanger-on"], starting_xp: 13, starting_skill: "Catfall, Clamber", primary_skills: ["Agilité"], secondary_skills: ["Ruse"], cost: 50,
            special_rules: ["Déploiement : D3 alliés peuvent se déplacer de leur initiative avant T1."],
            default_weapons: ["wpn_stub_gun", "wpn_couteau_combat"],
            allowed_merc_weapons: [
                { id: "wpn_laspistol", cost_credits: 0, replaces: "wpn_stub_gun" },
                { id: "wpn_long_las", cost_credits: 35, replaces: "wpn_stub_gun" },
                { id: "wpn_hache", cost_credits: 15, replaces: "wpn_couteau_combat" }
            ]
        },
        {
            id: "merc_slopper", name: "Slopper",
            stats: { M: '4"', WS: '4+', BS: '4+', S: 3, T: 3, W: 1, I: 4, A: 1, Sv: '6+', Ld: 6, Cl: 7, Wil: 7, Int: 7 },
            type: ["Guerrier", "hanger-on", "soutien"], starting_xp: 13, primary_skills: ["Savant"], secondary_skills: ["Muscle"], cost: 45,
            special_rules: ["Post cycle : +20 crédits.", "1/partie : adversaire relance jet de blessures permanentes."],
            default_weapons: ["wpn_couteau_combat"]
        },
        {
            id: "merc_hive_watcher", name: "Hive watcher",
            stats: { M: '4"', WS: '5+', BS: '5+', S: 3, T: 3, W: 1, I: 4, A: 1, Sv: '6+', Ld: 6, Cl: 7, Wil: 7, Int: 8 },
            type: ["Guerrier", "hanger-on", "soutien"], starting_xp: 13, starting_skill: "Clamber, Lie low", primary_skills: ["Ruse"], secondary_skills: ["Agilité"], cost: 30,
            special_rules: ["Infiltration/renfort ennemis repoussés à +3\" des alliés."],
            default_weapons: ["wpn_laspistol"]
        },
        {
            id: "merc_rat_geant", name: "Rat géant",
            stats: { M: '5"', WS: '4+', BS: '5+', S: 3, T: 3, W: 1, I: 4, A: 1, Sv: '6+', Ld: 6, Cl: 7, Wil: 6, Int: 5 },
            type: ["guerrier", "bête", "familier"], starting_xp: 13, starting_skill: "Leash de 3\"", primary_skills: ["Agilité"], secondary_skills: ["Ruse"], cost: 45,
            special_rules: ["Leader/champion uniquement.", "Remplacé gratuitement si tué.", "Compte comme équipement"], default_weapons: ["wpn_morsure"]
        },
        {
            id: "merc_millisaur", name: "Millisaur",
            stats: { M: '6"', WS: '4+', BS: '5+', S: 3, T: 3, W: 2, I: 3, A: 2, Sv: '5+', Ld: 6, Cl: 6, Wil: 6, Int: 5 },
            type: ["guerrier", "bête", "familier"], starting_xp: 13, starting_skill: "Leash de 6\"", primary_skills: ["Combat"], secondary_skills: ["Agilité"], cost: 95,
            special_rules: ["Leader/champion uniquement.", "Déplacement sous infranchissable.", "Compte comme équipement"], default_weapons: ["wpn_gueule_crocs"]
        },
        {
            id: "merc_ripperjack", name: "Ripperjack",
            stats: { M: '7"', WS: '4+', BS: '6+', S: 3, T: 3, W: 2, I: 4, A: 2, Sv: '6+', Ld: 6, Cl: 8, Wil: 5, Int: 6 },
            type: ["guerrier", "bête", "familier"], starting_xp: 13, starting_skill: "Leash de 6\"", primary_skills: ["Muscle"], secondary_skills: ["Combat"], cost: 85,
            special_rules: ["Leader/champion uniquement.", "Ne peut assister/être assisté.", "Ennemi engagé avec test d'agilité pour fuir.", "Compte comme équipement"], default_weapons: ["wpn_dents"]
        }
    ],

    // ===== DICTIONNAIRE DES COMPETENCES =====
    skills: {
        agilite: [
            { id: "sk_chute_chat", name: "Catfall", desc: "Réduit le cran de distance verticale en cas de chute/saut. Test d'agilité pour ne pas être suppressed si non blessé/hors combat." },
            { id: "sk_grimper", name: "Clamber", desc: "Mouvement non divisé par deux en grimpant." },
            { id: "sk_esquive", name: "Dodge", desc: "Avant jet d'armure, sur un 6, ignore la blessure. Si gabarit, déplace de 2\" pour éviter." },
            { id: "sk_bond_prodigieux", name: "Mighty leap", desc: "Ignore les 2 premiers pouces de distance lors d'un saut (saut 4\" sans test)." },
            { id: "sk_jaillir", name: "Spring up", desc: "Si suppressed, test d'agilité. Si réussi, n'est plus suppressed." },
            { id: "sk_sprint", name: "Sprint", desc: "Action double : déplacement = Mouvement + (2 x Initiative)." }
        ],
        muscle: [
            { id: "sk_charge_taureau", name: "Bull charge", desc: "Attaque de charge : l'arme gagne knockback (6+) et +1 en Force." },
            { id: "sk_biceps_saillants", name: "Bulging biceps", desc: "Braced shot : déplacement d'Initiative en pouces avant ou après. Arme lourde au close : peut déclarer arme secondaire non lourde." },
            { id: "sk_redoutable", name: "Fearsome", desc: "Condition fearsome." },
            { id: "sk_machoire_acier", name: "Iron jaw", desc: "Endurance +2 si touché par arme sans AP." },
            { id: "sk_nerfs_acier", name: "Nerves of steel", desc: "Si touché au tir, test de cool : si réussi, non suppressed." },
            { id: "sk_instoppable", name: "Unstoppable", desc: "A l'activation, test de Willpower : si réussi, récupère 1 PV." }
        ],
        combat: [
            { id: "sk_berserker", name: "Berserker", desc: "Condition frénésie." },
            { id: "sk_maitre_combat", name: "Combat master", desc: "Pas de malus d'interférence pour toucher. Peut toujours assister quel que soit le nb d'ennemis." },
            { id: "sk_coup_boule", name: "Headbutt", desc: "Arme intégrée : engagé, F+1, L:1, attaques additionnelles (1)." },
            { id: "sk_coups_puissants", name: "Heavy blows", desc: "Arme lourde au close = +1 Force." },
            { id: "sk_pluie_coups", name: "Rain of blows", desc: "Si après une action d'attaque, le guerrier est toujours engagé, peut faire une action d'attaque gratuite en plus." },
            { id: "sk_combat_2_armes", name: "Two-weapon fighter", desc: "Fait 2 attaques avec son arme secondaire au lieu d'une." }
        ],
        ruse: [
            { id: "sk_backstab", name: "Backstab", desc: "Armes close gagnent Backstab. Si déjà acquis, Force +2 au lieu de +1." },
            { id: "sk_contre_attaque", name: "Counter-attack", desc: "Peut faire une attaque additionnelle quand un ennemi l'attaque, au même rang d'initiative que lui." },
            { id: "sk_coupe_gorge", name: "Cut-throat", desc: "Relance son D6 de coup de grâce." },
            { id: "sk_infiltration", name: "Infiltrate", desc: "Déploiement spécial : hors ligne de vue et à + de 9\" de tout ennemi." },
            { id: "sk_se_cacher", name: "Lie low", desc: "Si suppressed, inciblable au-delà de la portée courte des ennemis." },
            { id: "sk_overwatch", name: "Overwatch", desc: "Interrompt une action ennemie avec un tir en perdant son marqueur ready." }
        ],
        savant: [
            { id: "sk_connecte", name: "Connected", desc: "Visite le Trading Post avec 1 TP supplémentaire post-cycle (2 visites max)." },
            { id: "sk_recharge_rapide", name: "Fast reload", desc: "Recharge toutes ses armes d'un coup." },
            { id: "sk_volonte_fer", name: "Iron will", desc: "Soustrait 1 aux tests de bottle check du gang." },
            { id: "sk_soin", name: "Medicate", desc: "Action : un allié à 1\" qui n'est pas seriously injured récupère 1 PV." },
            { id: "sk_mentor", name: "Mentor", desc: "Si un allié à 6\" gagne 1 XP, test de Ld : si réussi, gagne 1 XP." },
            { id: "sk_munitions", name: "Munitioneer", desc: "Action distribution : alliés à 6\" font test d'Int, si réussi -> recharge gratuite." }
        ],
        tir: [
            { id: "sk_tir_rapide", name: "Fast shot", desc: "Peut faire 2 actions de tir pendant l'activation." },
            { id: "sk_pistolero", name: "Gunfighter", desc: "Peut tirer avec 2 armes de tir (léger) sur cibles différentes." },
            { id: "sk_tir_hanche", name: "Hip-shooting", desc: "Les armes de tir (non lourdes) gagnent le trait assaut." },
            { id: "sk_tireur_habile", name: "Marksman", desc: "+1 pour toucher les cibles entre portée courte et longue." },
            { id: "sk_tir_precision", name: "Precision shot", desc: "Sur un 6 naturel pour toucher, ignore l'armure (sauf explosion/tir rapide)." },
            { id: "sk_tireur_elite", name: "Sharpshooter", desc: "Aimed shot : +2 pour toucher au lieu de +1." }
        ],
        generique: [
            { id: "sk_hit_run", name: "Hit & run", desc: "Après action de combat, peut consolider (sortir de 1\") en finissant à +1\" des ennemis." },
            { id: "sk_inspirant", name: "Inspiring", desc: "Peut faire une action gratuite d'activation de groupe." },
            { id: "sk_juggernaut", name: "Juggernaut", desc: "Si touché au tir, suppressed uniquement si PV perdu ou effet du dé de blessure." },
            { id: "sk_regeneration", name: "Regeneration", desc: "Action : mouvement puis 4+ = récupère 1 PV." },
            { id: "sk_leash", name: "Leash de X\"", desc: "Portée pour familiers pour ignorer le test de panique." }
        ]
    },

    // ===== ARMES =====
   weapons: [
        // ARMES CAWDOR PIOUS & FANATIC
        { id: "wpn_autogun", name: "Autogun", profiles: [{ name: "Unique", SR: '8"', LR: '24"', S: 3, AP: "-", L: 1, traits: "tir rapide (1)" }], cost_credits: 20, cost_tp: 0, is_pious: true, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_autopistol", name: "Autopistol", profiles: [{ name: "Unique", SR: '8"', LR: '12"', S: 3, AP: "-", L: 1, traits: "léger, tir rapide (1)" }], cost_credits: 10, cost_tp: 0, is_pious: true, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_heavy_stubber", name: "Heavy stubber*", profiles: [{ name: "Unique", SR: '20"', LR: '40"', S: 4, AP: "-1", L: 1, traits: "lourd, tir rapide (2)" }], cost_credits: 70, cost_tp: 2, is_pious: true, is_fanatic: false },
        { id: "wpn_long_rifle", name: "Long rifle", profiles: [{ name: "Unique", SR: '24"', LR: '48"', S: 4, AP: "-1", L: 1, traits: "Knockback (6+)" }], cost_credits: 55, cost_tp: 1, is_pious: true, is_fanatic: false },
        { id: "wpn_stub_gun", name: "Stub gun", profiles: [{ name: "Unique", SR: '6"', LR: '12"', S: 3, AP: "-", L: 1, traits: "léger" }], cost_credits: 5, cost_tp: 0, is_pious: true, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_boltgun", name: "Boltgun", profiles: [{ name: "Unique", SR: '12"', LR: '24"', S: 4, AP: "-1", L: 2, traits: "tir rapide (1), munitions (3+)" }], cost_credits: 55, cost_tp: 2, is_pious: false, is_fanatic: false },
        { id: "wpn_bolt_pistol", name: "Bolt pistol", profiles: [{ name: "Unique", SR: '6"', LR: '12"', S: 4, AP: "-1", L: 2, traits: "tir rapide (1), munitions (3+), léger" }], cost_credits: 45, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_bolter_lourd", name: "Bolter lourd*", profiles: [{ name: "Unique", SR: '18"', LR: '36"', S: 5, AP: "-2", L: 2, traits: "munitions (3+), lourd, tir rapide (2)" }], cost_credits: 100, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_warpstorm_bolter", name: "Warpstorm bolter", profiles: [{ name: "Unique", SR: '12"', LR: '24"', S: 4, AP: "-1", L: 2, traits: "munitions (6+), tir rapide (1), rare (4+), maudit" }], cost_credits: 65, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_lance_flamme", name: "Lance flamme", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 4, AP: "-1", L: 1, traits: "munitions (6+), flammes (5+), gabarit" }], cost_credits: 70, cost_tp: 1, is_pious: true, is_fanatic: false },
        { id: "wpn_pist_lance_flamme", name: "Pistolet lance flamme", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 3, AP: "-", L: 1, traits: "munitions (6+), flammes (5+), gabarit, léger" }], cost_credits: 45, cost_tp: 1, is_pious: true, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_lance_flamme_lourd", name: "Lance flamme lourd*", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 5, AP: "-2", L: 1, traits: "munitions (6+), flammes (5+), gabarit" }], cost_credits: 95, cost_tp: 2, is_pious: true, is_fanatic: true },
        { id: "wpn_grav_gun", name: "Grav gun", profiles: [{ name: "Unique", SR: '9"', LR: '18"', S: "-", AP: "-", L: 2, traits: "munitions (5+), explosion (3\"), graviton pulse" }], cost_credits: 50, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_grav_pistol", name: "Grav pistol", profiles: [{ name: "Unique", SR: '4"', LR: '9"', S: "-", AP: "-", L: 2, traits: "munitions (5+), explosion (3\"), graviton pulse" }], cost_credits: 40, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_grenade_launcher", name: "Lance grenade", profiles: [
            { name: "Frag", SR: '6"', LR: '24"', S: 3, AP: "-", L: 1, traits: "munitions (4+), explosion (3\"), knockback (5+)" },
            { name: "Krak", SR: '6"', LR: '24"', S: 6, AP: "-2", L: 1, traits: "munitions (4+)" }
        ], cost_credits: 80, cost_tp: 1, is_pious: false, is_fanatic: true },
        { id: "wpn_lasgun", name: "Lasgun", profiles: [{ name: "Unique", SR: '16"', LR: '24"', S: 3, AP: "-", L: 1, traits: "" }], cost_credits: 15, cost_tp: 0, is_pious: false, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_laspistol", name: "Laspistol", profiles: [{ name: "Unique", SR: '8"', LR: '12"', S: 3, AP: "-", L: 1, traits: "léger" }], cost_credits: 5, cost_tp: 0, is_pious: false, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_long_las", name: "Long las", profiles: [{ name: "Unique", SR: '18"', LR: '36"', S: 4, AP: "-", L: 1, traits: "" }], cost_credits: 40, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_fuseur", name: "Fuseur", profiles: [{ name: "Unique", SR: '6"', LR: '12"', S: 8, AP: "-4", L: 3, traits: "munitions (6+), dommages (3)" }], cost_credits: 140, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_multifuseur", name: "Multifuseur*", profiles: [{ name: "Unique", SR: '12"', LR: '24"', S: 8, AP: "-4", L: 3, traits: "munitions (6+), dommages (3), lourd" }], cost_credits: 150, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_canon_plasma", name: "Canon plasma*", profiles: [{ name: "Unique", SR: '18"', LR: '36"', S: 6, AP: "-2", L: 2, traits: "munitions (6+), explosion (3\"), dommages (2), lourd, instable" }], cost_credits: 115, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_fusil_plasma", name: "Fusil plasma", profiles: [{ name: "Unique", SR: '12"', LR: '24"', S: 5, AP: "-2", L: 2, traits: "munitions (6+), dommages (2), tir rapide (1), instable" }], cost_credits: 85, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_pistolet_plasma", name: "Pistolet plasma", profiles: [{ name: "Unique", SR: '6"', LR: '12"', S: 5, AP: "-2", L: 2, traits: "munitions (6+), dommages (2), léger, instable" }], cost_credits: 70, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_couteau_lancer", name: "Couteau de lancer", profiles: [{ name: "Unique", SR: '6"', LR: '12"', S: "-", AP: "-", L: 1, traits: "munitions (3+), toxine (4+)" }], cost_credits: 10, cost_tp: 0, is_pious: false, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_rad_cannon", name: "Rad Cannon*", profiles: [{ name: "Unique", SR: '16"', LR: '32"', S: 3, AP: "-1", L: 1, traits: "munitions (4+), explosion (3\"), lourd, rad-phage" }], cost_credits: 55, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_rad_gun", name: "Rad gun", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 3, AP: "-1", L: 1, traits: "munitions (5+), gabarit, rad-phage" }], cost_credits: 60, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_lance_harpon", name: "Lance harpon*", profiles: [{ name: "Unique", SR: '6"', LR: '18"', S: 5, AP: "-3", L: 1, traits: "munitions (5+), attirer" }], cost_credits: 80, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_las_cutter", name: "Las cutter", profiles: [{ name: "Unique", SR: '2"', LR: '4"', S: 9, AP: "-2", L: 2, traits: "dommages (2), léger, tir unique" }], cost_credits: 80, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_laser_minage", name: "Laser de minage*", profiles: [{ name: "Unique", SR: '10"', LR: '14"', S: 9, AP: "-3", L: 3, traits: "munitions (5+), dommages (2), lourd" }], cost_credits: 125, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_pompe_combat", name: "Fusil à pompe de combat", profiles: [
            { name: "Salve", SR: '4"', LR: '12"', S: 4, AP: "-", L: 1, traits: "Knockback (6+)" },
            { name: "Déchiquetant", SR: "T", LR: "-", S: 3, AP: "-", L: 1, traits: "munitions (6+), tir rapide (1), déchiqueter (6+), gabarit" }
        ], cost_credits: 35, cost_tp: 1, is_pious: false, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_pompe_canon_scie", name: "Fusil à pompe à canon scié", profiles: [
            { name: "Dispersion", SR: '4"', LR: '8"', S: 2, AP: "-", L: 1, traits: "léger, tir rapide (1)" },
            { name: "Concentré", SR: '4"', LR: '8"', S: 4, AP: "-", L: 1, traits: "léger, knockback (6+)" }
        ], cost_credits: 30, cost_tp: 1, is_pious: true, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_fusil_pompe", name: "Fusil à pompe", profiles: [
            { name: "Dispersion", SR: '4"', LR: '8"', S: 3, AP: "-", L: 1, traits: "tir rapide (2)" },
            { name: "Concentré", SR: '8"', LR: '16"', S: 4, AP: "-", L: 1, traits: "knockback (5+)" },
            { name: "Executeur", SR: '4"', LR: '16"', S: 4, AP: "-2", L: 2, traits: "munitions (5+), knockback (5+)" },
            { name: "Retributeur", SR: '4"', LR: '8"', S: 4, AP: "-", L: 1, traits: "flammes (5+), tir rapide (2)" }
        ], cost_credits: 35, cost_tp: 0, is_pious: false, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_pistolet_aiguille", name: "Pistolet à aiguille", profiles: [{ name: "Unique", SR: '4"', LR: '9"', S: "-", AP: "-", L: 1, traits: "léger, toxine (3+)" }], cost_credits: 25, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_fusil_aiguille", name: "Fusil à aiguille", profiles: [{ name: "Unique", SR: '9"', LR: '18"', S: "-", AP: "-1", L: 1, traits: "toxine (3+)" }], cost_credits: 45, cost_tp: 2, is_pious: false, is_fanatic: false },
        { id: "wpn_fusil_web", name: "Fusil web", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 5, AP: "-", L: "-", traits: "munitions (6+), gabarit, toile" }], cost_credits: 65, cost_tp: 4, is_pious: false, is_fanatic: false },
        { id: "wpn_pistolet_web", name: "Pistolet web", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 4, AP: "-", L: "-", traits: "munitions (6+), gabarit, toile, léger" }], cost_credits: 50, cost_tp: 3, is_pious: false, is_fanatic: false },
        
        // GRENADES
        { id: "wpn_grenade_explo", name: "Grenade explosive", profiles: [{ name: "Unique", SR: "-", LR: '6"', S: 5, AP: "-1", L: 2, traits: "munitions (5+), explosion (5\"), knockback (5+), limité" }], cost_credits: 60, cost_tp: 2, is_pious: true, is_fanatic: true, counts_as_equip: true },
        { id: "wpn_grenade_gaz", name: "Grenade à gaz asphyxiant", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: "-", AP: "-", L: 1, traits: "munitions (5+), explosion (3\"), gaz, limité, toxine (3+)" }], cost_credits: 45, cost_tp: 1, is_pious: false, is_fanatic: false, counts_as_equip: true },
        { id: "wpn_charge_demo", name: "Charge de démolition", profiles: [{ name: "Unique", SR: "-", LR: '6"', S: 6, AP: "-3", L: 3, traits: "munitions (6+), explosion (5\"), dommages (2), limité" }], cost_credits: 85, cost_tp: 3, is_pious: false, is_fanatic: false, counts_as_equip: true },
        { id: "wpn_grenade_frag", name: "Grenades frag", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: 3, AP: "-", L: 1, traits: "munitions (4+), explosion (3\"), knockback (6+), limité" }], cost_credits: 30, cost_tp: 0, is_pious: true, is_fanatic: true, is_hive_scum: true, counts_as_equip: true },
        { id: "wpn_grenade_inc", name: "Grenades incendiaires", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: 3, AP: "-", L: 1, traits: "munitions (5+), explosion (5\"), flammes (5+), limité" }], cost_credits: 40, cost_tp: 2, is_pious: true, is_fanatic: true, counts_as_equip: true },
        { id: "wpn_grenade_krak", name: "Grenades krak", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: 6, AP: "-2", L: 1, traits: "munitions (4+), limité" }], cost_credits: 45, cost_tp: 1, is_pious: true, is_fanatic: true, is_hive_scum: true, counts_as_equip: true },
        { id: "wpn_grenade_phos", name: "Grenades à phosphore", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: 4, AP: "-2", L: 2, traits: "munitions (5+), explosion (3\"), flammes (5+), limité, instable" }], cost_credits: 65, cost_tp: 3, is_pious: false, is_fanatic: false, counts_as_equip: true },
        { id: "wpn_grenade_photon", name: "Grenades à photon", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: "-", AP: "-", L: "-", traits: "munitions (4+), explosion (5\"), flash, limité" }], cost_credits: 15, cost_tp: 1, is_pious: false, is_fanatic: false, counts_as_equip: true },
        { id: "wpn_grenade_plasma", name: "Grenades à plasma", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: 5, AP: "-1", L: 2, traits: "munitions (4+), explosions (3\"), dommages (2), limité, instable" }], cost_credits: 70, cost_tp: 3, is_pious: false, is_fanatic: false, counts_as_equip: true },
        { id: "wpn_grenade_rad", name: "Grenades rad", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: 2, AP: "-1", L: 1, traits: "munitions (4+), explosion (3\"), limité, rad-phage" }], cost_credits: 25, cost_tp: 1, is_pious: false, is_fanatic: false, counts_as_equip: true },
        { id: "wpn_grenade_fumi", name: "Grenades fumigène", profiles: [{ name: "Unique", SR: "-", LR: '9"', S: "-", AP: "-", L: "-", traits: "munitions (4+), explosion (3\"), limité, fumée" }], cost_credits: 15, cost_tp: 0, is_pious: false, is_fanatic: true, is_hive_scum: true, counts_as_equip: true },

        // ARMES CORPS À CORPS / MELEE
        { id: "wpn_hache_tron", name: "Hache tronçonneuse", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-1", L: 1, traits: "melee, déchiqueter (5+)" }], cost_credits: 20, cost_tp: 1, is_pious: false, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_epee_tron", name: "Epée tronçonneuse", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "melee, déchiqueter (5+), parade" }], cost_credits: 20, cost_tp: 1, is_pious: false, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_hache_nrj", name: "Hache énergétique", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-3", L: 1, traits: "brêche (5+), melee" }], cost_credits: 40, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_gantelet_nrj", name: "Gantelet énergétique", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+3", AP: "-3", L: 2, traits: "brêche (6+), commotion (5+), dommages (2), melee, encombrant" }], cost_credits: 105, cost_tp: 3, is_pious: false, is_fanatic: false },
        { id: "wpn_marteau_nrj", name: "Marteau énergétique", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-2", L: 2, traits: "brêche (6+), commotion (6+), melee" }], cost_credits: 40, cost_tp: 2, is_pious: false, is_fanatic: false },
        { id: "wpn_couteau_nrj", name: "Couteau énergétique", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-2", L: 1, traits: "backstab, brêche (6+), melee" }], cost_credits: 30, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_masse_nrj", name: "Masse énergétique", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+1", AP: "-2", L: 1, traits: "brêche (6+), commotion (6+), melee" }], cost_credits: 45, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_epee_nrj", name: "Epée énergétique", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-2", L: 1, traits: "brêche (6+), melee, parade" }], cost_credits: 40, cost_tp: 2, is_pious: false, is_fanatic: false },
        { id: "wpn_hache", name: "Hache", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-1", L: 1, traits: "melee" }], cost_credits: 15, cost_tp: 0, is_pious: true, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_couteau_combat", name: "Couteau de combat", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "backstab, melee" }], cost_credits: 5, cost_tp: 0, is_pious: true, is_fanatic: true, is_hive_scum: true },
        { id: "wpn_fleau", name: "Fléau", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "knockback (6+), melee" }], cost_credits: 10, cost_tp: 0, is_pious: true, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_masse", name: "Masse", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+1", AP: "-", L: 1, traits: "commotion (6+), melee" }], cost_credits: 20, cost_tp: 0, is_pious: true, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_hache_2m", name: "Hache à deux mains*", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+1", AP: "-1", L: 2, traits: "lourd, melee, encombrant" }], cost_credits: 40, cost_tp: 1, is_pious: true, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_marteau_2m", name: "Marteau à deux mains*", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S-1", AP: "-", L: 3, traits: "commotion (6+), lourd, melee, encombrant" }], cost_credits: 40, cost_tp: 1, is_pious: true, is_fanatic: false, is_hive_scum: true },
        { id: "wpn_servo_claw", name: "Servo-claw", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+2", AP: "-", L: 2, traits: "melee, encombrant" }], cost_credits: 40, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_shock_baton", name: "Shock baton", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "melee, parade, shock (6+)" }], cost_credits: 20, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_arme_hast_shock", name: "Arme d'hast shock", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+1", AP: "-", L: 1, traits: "melee, shock (5+)" }], cost_credits: 25, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_fouet_shock", name: "Fouet shock", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "knockback (6+), melee, shock (6+)" }], cost_credits: 10, cost_tp: 1, is_pious: false, is_fanatic: false },
        { id: "wpn_couteau_stylet", name: "Couteau stylet", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "-", AP: "-", L: 1, traits: "melee, toxine (3+)" }], cost_credits: 25, cost_tp: 2, is_pious: false, is_fanatic: false },
        { id: "wpn_epee_stylet", name: "Epée stylet", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "-", AP: "-1", L: 1, traits: "melee, toxine (3+), parade" }], cost_credits: 45, cost_tp: 2, is_pious: false, is_fanatic: false },

        // ARMES SPÉCIFIQUES CAWDOR ET EXCLUSIVES
        { id: "wpn_exterminator", name: "Exterminator", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 4, AP: "-1", L: 1, traits: "auxilliaire, flammes (5+), tir unique, gabarit" }], cost_credits: 35, cost_tp: 0, is_pious: false, is_fanatic: true },
        { id: "wpn_combi_autogun", name: "Combi autogun", profiles: [
            { name: "Autogun", SR: '8"', LR: '24"', S: 3, AP: "-", L: 1, traits: "combi, tir rapide (1)" },
            { name: "Flamer", SR: "T", LR: "-", S: 4, AP: "-1", L: 1, traits: "munitions (6+), flammes (5+), combi, gabarit" }
        ], cost_credits: 75, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_fire_pike", name: "Fire pike*", profiles: [{ name: "Unique", SR: "T", LR: "-", S: 4, AP: "-2", L: 1, traits: "munitions (6+), flammes (5+), brêche (5+), gabarit" }], cost_credits: 80, cost_tp: 0, is_pious: false, is_fanatic: true },
        { id: "wpn_arbalete_lourde", name: "Arbalète lourde", profiles: [
            { name: "Frag", SR: '15"', LR: '30"', S: 4, AP: "-", L: 1, traits: "munitions (3+), explosion (5\"), lourd, knockback (6+)" },
            { name: "Krak", SR: '15"', LR: '30"', S: 6, AP: "-2", L: 1, traits: "munitions (4+), lourd" }
        ], cost_credits: 110, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_autogun_hast", name: "Autogun d'hast Cawdor*", profiles: [
            { name: "Melee", SR: "E", LR: "-", S: "S+1", AP: "-", L: 2, traits: "lourd, lance, melee, encombrant" },
            { name: "Autogun", SR: '8"', LR: '24"', S: 3, AP: "-", L: 1, traits: "tir rapide (1)" }
        ], cost_credits: 30, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_lance_flamme_hast", name: "Lance flamme d'hast Cawdor*", profiles: [
            { name: "Melee", SR: "E", LR: "-", S: "S+1", AP: "-", L: 2, traits: "lourd, lance, melee, encombrant" },
            { name: "Lance flamme", SR: "T", LR: "-", S: 4, AP: "-1", L: 1, traits: "munitions (6+), flammes (5+), gabarit" }
        ], cost_credits: 85, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_blunderbuss_hast", name: "Blunderbuss d'hast Cawdor*", profiles: [
            { name: "Melee", SR: "E", LR: "-", S: "S+1", AP: "-", L: 2, traits: "lourd, lance, melee, encombrant" },
            { name: "Munitions en grappe", SR: "T", LR: "-", S: 2, AP: "-", L: 1, traits: "tir rapide, gabarit" },
            { name: "Munitions purgation", SR: "T", LR: "-", S: 3, AP: "-", L: 1, traits: "munitions (6+), flammes (5+), gabarit" }
        ], cost_credits: 80, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_glaive_tronconneur", name: "Glaive tronçonneur", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+1", AP: "-1", L: 2, traits: "lourd, melee, parade, déchiqueter (6+), encombrant" }], cost_credits: 50, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_eviscerator", name: "Eviscerator", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+2", AP: "-2", L: 2, traits: "lourd, melee, déchiqueter (5+), encombrant" }], cost_credits: 65, cost_tp: 0, is_pious: false, is_fanatic: true },
        { id: "wpn_lance_frag", name: "Lance frag*", profiles: [
            { name: "Primed", SR: "E", LR: "-", S: 4, AP: "-1", L: 1, traits: "lourd, lance-bombe, knockback (5+), melee" },
            { name: "Spent", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "lourd, lance, melee" }
        ], cost_credits: 35, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_lance_krak", name: "Lance krak*", profiles: [
            { name: "Primed", SR: "E", LR: "-", S: 6, AP: "-2", L: 2, traits: "lourd, lance-bombe, melee" },
            { name: "Spent", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "lourd, lance, melee" }
        ], cost_credits: 50, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_lance_shock", name: "Lance shock*", profiles: [
            { name: "Primed", SR: "E", LR: "-", S: 2, AP: "-1", L: 1, traits: "lourd, lance-bombe, shock (3+), melee" },
            { name: "Spent", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "lourd, lance, melee" }
        ], cost_credits: 30, cost_tp: 0, is_pious: true, is_fanatic: false },
        { id: "wpn_couperet", name: "Couperet", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-1", L: 2, traits: "melee" }], cost_credits: 25, cost_tp: 0, is_pious: true, is_fanatic: false },

        // ARMES DÉDIÉES PROFILS FIXES
        { id: "wpn_beak_talons", name: "Beak & talons", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+1", AP: "-1", L: 2, traits: "melee, déchirant (6+)" }], default_for: "char_shen_bird", specific_to: "char_shen_bird" },
        { id: "wpn_heavy_club", name: "Heavy club", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+2", AP: "-", L: 2, traits: "commotion (5+), lourd, melee, encombrant" }], default_for: "char_stig_shambler", specific_to: "char_stig_shambler" },
        { id: "wpn_heavy_stubber_jumele_stig", name: "Heavy stubber jumelé*", profiles: [{ name: "Unique", SR: '20"', LR: '40"', S: 4, AP: "-1", L: 1, traits: "lourd, tir rapide (2), jumelé" }], cost_credits: 10, is_pious: true, specific_to: "char_stig_shambler" },

        // ARMES MERCENAIRES
        { id: "wpn_armbot_grav", name: "Armbot grav cutter", profiles: [{ name: "Unique", SR: '6"', LR: '12"', S: "-", AP: "-", L: 2, traits: "explosion (3\"), graviton pulse" }], is_merc_weapon: true, cost_credits: 40 },
        { id: "wpn_armbot_melta", name: "Armbot melta cutter", profiles: [{ name: "Unique", SR: '4"', LR: '8"', S: 6, AP: "-2", L: 2, traits: "munitions (6+), dommages (2)" }], is_merc_weapon: true, cost_credits: 70 },
        { id: "wpn_storm_welder", name: "Storm Welder", profiles: [{ name: "Unique", SR: '8"', LR: '16"', S: 5, AP: "-", L: 1, traits: "tir rapide (3), shock (6+), instable" }], is_merc_weapon: true, cost_credits: 70 },
        { id: "wpn_poing_augmetic", name: "Poing augmetic", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "melee, knockback (6+)" }], is_merc_weapon: true, cost_credits: 0 },
        { id: "wpn_morsure", name: "Morsure", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 1, traits: "melee" }], is_merc_weapon: true },
        { id: "wpn_gueule_crocs", name: "Gueule à crocs", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "-", AP: "-", L: 1, traits: "melee, toxine (4+)" }], is_merc_weapon: true },
        { id: "wpn_dents", name: "Dents", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S", AP: "-", L: 2, traits: "melee" }], is_merc_weapon: true },
        { id: "wpn_arc_welder", name: "Arc welder", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S+2", AP: "-3", L: 2, traits: "melee, flammes (5+)" }], is_merc_weapon: true, cost_credits: 70 },
        { id: "wpn_griffes_tunnel", name: "Griffes de tunnel", profiles: [{ name: "Unique", SR: "E", LR: "-", S: "S-1", AP: "-", L: 2, traits: "melee, paire (2)" }], is_merc_weapon: true },
        { id: "wpn_spud_jacker", name: "Spud jacker", profiles: [{ name: "Unique", SR: "E", LR: "+", S: "S+1", AP: "-", L: 1, traits: "melee, knockback (6+), commotion (6+)" }], is_merc_weapon: true, cost_credits: 20 }
    ],

    equipment: [
        // ARMURES
        { id: "eq_armure_cara_leg", name: "Armure carapace légère", type: "Armure", cost_credits: 100, cost_tp: 1, effect: "Améliore la sauvegarde de 1. Réduit l'initiative de 1." },
        { id: "eq_armure_cara_lourde", name: "Armure carapace lourde", type: "Armure", cost_credits: 140, cost_tp: 3, effect: "Améliore la sauvegarde de 2. Réduit l'initiative de 2. Malus aux jets d'agilité de -1." },
        { id: "eq_hazard_suit", name: "Hazard suit", type: "Armure", cost_credits: 10, cost_tp: 0, effect: "Immunisé aux traits flammes (X+) et rad-phage.", is_hive_scum: true },
        { id: "eq_mesh_armour", name: "Mesh Armour", type: "Armure", cost_credits: 40, cost_tp: 0, effect: "Améliore la sauvegarde de 1 au corps à corps.", is_pious: true },
        { id: "eq_reflec_shroud", name: "Reflec shroud", type: "Armure", cost_credits: 25, cost_tp: 1, effect: "L'AP des armes las, plasma et fuseur devient '-' contre le porteur." },
        { id: "eq_refractor_shield", name: "Refractor shield", type: "Armure", cost_credits: 50, cost_tp: 2, effect: "Sauvegarde invulnérable de 5+. Au premier jet de 1, ne fonctionne plus.", is_pious: true },

        // ÉQUIPEMENTS PERSONNELS
        { id: "eq_bio_booster", name: "Bio-booster", type: "Personnel", cost_credits: 25, cost_tp: 0, effect: "1ère fois blessé : réduit léthalité de 1." },
        { id: "eq_drop_rig", name: "Drop rig", type: "Personnel", cost_credits: 10, cost_tp: 0, effect: "Action descendre : 12\" verticalement vers le bas et 3\" horizontalement.", is_pious: true, is_hive_scum: true },
        { id: "eq_grapnel_launcher", name: "Grapnel launcher", type: "Personnel", cost_credits: 25, cost_tp: 0, effect: "Action grappin : déplace de 12\" en ligne droite, doit finir plus haut." },
        { id: "eq_grav_chute", name: "Grav Chute", type: "Personnel", cost_credits: 30, cost_tp: 0, effect: "Chute sans dommage, jamais suppressed." },
        { id: "eq_medicae_kit", name: "Medicae Kit", type: "Personnel", cost_credits: 20, cost_tp: 0, effect: "Jette 2 dés de recovery et garde celui au choix.", is_pious: true },
        { id: "eq_photo_goggles", name: "Photo-goggles", type: "Personnel", cost_credits: 35, cost_tp: 0, effect: "Visibilité +9\", voit dans fumée. Malus -2 init si munition flash.", is_pious: true, is_hive_scum: true },
        { id: "eq_photo_lumens", name: "Photo-Lumens", type: "Personnel", cost_credits: 15, cost_tp: 0, effect: "Visibilité +9\" mais toujours ciblable." },
        { id: "eq_respirator", name: "Respirator", type: "Personnel", cost_credits: 15, cost_tp: 0, effect: "Sauvegarde invulnérable de 5+ contre le gaz.", is_pious: true },
        { id: "eq_servo_harness_partial", name: "Servo-harness partial", type: "Personnel", cost_credits: 100, cost_tp: 2, effect: "+2 Force, +1 Endo. Malus -1 Mvt et Init." },
        { id: "eq_servo_harness_full", name: "Servo-harness full", type: "Personnel", cost_credits: 130, cost_tp: 3, effect: "+2 Force, +1 Endo sans malus." },
        { id: "eq_stimm_slug_stash", name: "Stimm-slug stash", type: "Personnel", cost_credits: 25, cost_tp: 0, effect: "1/bataille : +2 M, S, T. Au round suivant, 1 = prend une blessure." },
        { id: "eq_dirt_bike", name: "Dirt bike", type: "Personnel", cost_credits: 35, cost_tp: 0, effect: "Gagne type monté. M = 8\", Dash = 5\".", is_pious: true },
        { id: "eq_rats_kamikazes", name: "Rats kamikazes", type: "Personnel", cost_credits: 30, cost_tp: 0, effect: "Permet de déployer des rats explosifs guidés ou aléatoires à 6\".", is_pious: true },
        { id: "eq_livre_redemption", name: "Livre de la rédemption", type: "Personnel", cost_credits: 50, cost_tp: 0, effect: "Action Mots de colère : relance charge et un 1 pour toucher pour Fanatics à 6\".", is_fanatic: true },
        { id: "eq_icone_culte", name: "Icone du culte", type: "Personnel", cost_credits: 40, cost_tp: 0, effect: "1 max par gang (Leader/Champion). Relance test Ld activation de groupe.", is_pious: true },
        { id: "eq_manteau_pyromane", name: "Manteau du pyromane", type: "Personnel", cost_credits: 30, cost_tp: 0, effect: "Attaques CàC gagnent flammes (5+) quand actif.", is_fanatic: true },
        { id: "eq_ridge_walker_pious", name: "Ridge walker", type: "Personnel", cost_credits: 40, cost_tp: 0, effect: "Gagne monté et agile, +1 agilité, M = 8\", Dash = 5\".", is_pious: true },
        { id: "eq_ridge_walker_fanatic", name: "Ridge walker", type: "Personnel", cost_credits: 45, cost_tp: 0, effect: "Gagne monté et agile, +1 agilité, M = 8\", Dash = 5\".", is_fanatic: true },

        { id: "eq_medicrane", name: "Medicrane", type: "Personnel", cost_credits: 0, effect: "Figurine à 1\", T3 Sv6+. Soigne en action gratuite.", specific_to: "merc_rogue_doc" },

        // ACCESSOIRES D'ARMES
        { id: "eq_focusing_cristal", name: "Focusing cristal", type: "Accessoire", cost_credits: 25, cost_tp: 1, effect: "AP +1. Arme devient instable." },
        { id: "eq_hotshot_las_pack", name: "Hotshot las pack", type: "Accessoire", cost_credits: 25, cost_tp: 1, effect: "Force +1." },
        { id: "eq_infra_sight", name: "Infra-sight", type: "Accessoire", cost_credits: 10, cost_tp: 0, effect: "Tire à travers la fumée. Visibilité +9\"." },
        { id: "eq_las_projector", name: "Las-projector", type: "Accessoire", cost_credits: 20, cost_tp: 1, effect: "Réduit bonus de couvert de 1 à portée courte." },
        { id: "eq_mono_sight", name: "Mono-sight", type: "Accessoire", cost_credits: 20, cost_tp: 0, effect: "Aimed shot : bonus +2 au lieu de +1.", is_pious: true },
        { id: "eq_suspensors", name: "Suspensors", type: "Accessoire", cost_credits: 40, cost_tp: 0, effect: "Arme avec * compte pour 1 emplacement au lieu de 2." },
        { id: "eq_telescopic_sight", name: "Telescopic sight", type: "Accessoire", cost_credits: 20, cost_tp: 1, effect: "Réduit bonus de couvert de 1 sur portée longue.", is_hive_scum: true }
    ],

    // ===== TRAITS DES ARMES =====
    weapon_traits: [
        { id: "trait_arc", name: "Arc (X)", desc: "Une arme avec ce trait a un champ de tir limité, indiqué par X" },
        { id: "trait_assaut", name: "Assaut", desc: "après que l'utilisateur a fait une action de dash, il peut tirer en action gratuite." },
        { id: "trait_attaques_add", name: "Attaques additionnelles (X)", desc: "l'arme peut faire X attaques supplémentaires en plus des attaques normales. Uniquement pendant l'activation et si l'arme n'est pas choisie comme arme primaire ou secondaire" },
        { id: "trait_attirer", name: "Attirer", desc: "Si une figurine est touchée par une arme ayant ce trait mais pas mise hors de combat, l'attaquant peut essayer de l'attirer. Il lance un D6, et si cela dépasse la force de la cible, elle est attirée de D3\". Si elle rencontre une autre figurine, elle est attirée aussi. Si la cible finit dans les 1\" d'un de ses ennemis, elle est déplacée pour être engagée avec lui." },
        { id: "trait_auxilliaire", name: "Auxilliaire", desc: "Une arme avec ce trait ne peut qu'être attaché à une autre arme et jamais prise seule. Elle n'utilise pas d'emplacement d'arme." },
        { id: "trait_backstab", name: "Backstab", desc: "Cette arme gagne +1 en force si l'adversaire est engagé avec plus d'un ennemI." },
        { id: "trait_belier", name: "Bélier", desc: "une arme avec ce trait ne peut être utilisée que lors d'une charge." },
        { id: "trait_bouclier", name: "Bouclier", desc: "Si la figurine est équipé avec au moins une arme ayant ce trait, elle augmente sa sauvegarde de 1 contre les tirs." },
        { id: "trait_breche", name: "Breche (X+)", desc: "Si le jet de blessure donne X ou +, il ne peut y avoir de jet d'armure." },
        { id: "trait_combi", name: "Combi", desc: "Quand on tire avec cette arme, le personnage peut choisir quel profil il utilise. Il peut aussi tirer avec les deux, mais avec une pénalité de -1 pour toucher." },
        { id: "trait_commotion", name: "Commotion (X+)", desc: "Si l'attaquant blesse son adversaire et que le jet de blessure est de X ou +, l'initiative de la cible baisse de 1 jusqu'à la fin de sa prochaine activation." },
        { id: "trait_dechiqueter", name: "Déchiqueter (X+)", desc: "Lors du jet de blessure avec cette arme, si le résultat est de X ou +, la léthalité de l'arme augmente de 1." },
        { id: "trait_dechirant", name: "Déchirant (X+)", desc: "Si le jet naturel d'une blessure avec cette arme est X ou plus, augmenter l'AP de 1." },
        { id: "trait_dommages", name: "Dommages (X)", desc: "Si un guerrier est blessé par cette arme, il perd X PV au lieu d'un. S'il faut faire un jet de dé de blessure, on ne lance que la léthalité de cette arme, quel que soit le nombre de PV perdu." },
        { id: "trait_encombrant", name: "Encombrant", desc: "Au corps à corps, les attaques avec cette arme se font avec une initiative de 1." },
        { id: "trait_explosion", name: "Explosion (3\"/5\")", desc: "Placer ule gabarit correspondant sur la cible du tir. Si la touche rate, le gabarit se déplace de D6\" dans la direction indiquée par le dé de dispersion. Si le dé de dispersion indique un hit et le dé une valeur de 1, le tir est annulé. Si l'arme a tir rapide, les touches supplémentaires font une dispersion centrée sur le premier gabarit." },
        { id: "trait_fiable", name: "Fiable", desc: "Une arme avec ce trait ignore le premier résultat à court de munitions obtenu à chaque round." },
        { id: "trait_flammes", name: "Flammes (X+)", desc: "Si le jet pour blesser donner X ou plus, on effectue une touche supplémentaire, même s'il n'y a pas de blessure. Faire un nouveau jet de blessure pour cette nouvelle touche, qui n'en génèrera pas de supplémentaire." },
        { id: "trait_flash", name: "Flash", desc: "Si une cible est touchée par une arme avec flash, on ne jette pas de jet de blessure, mais d'initiative. S'il est raté, la figurine subit la condition aveugle, ce qui enlève son token prêt. Si la figurine n'en a pas, elle n'en récupèrera pas de token prêt au prochain round. Si elle doit attaquer au corps à corps, elle ne touchera que sur 6+." },
        { id: "trait_fumee", name: "Fumée", desc: "Cette arme ne cible pas une figurine, mais un point sur le champ de bataille. Une fois la position du gabarit déterminée, une colonne de fumée s'élève à cet endroit, ce qui blocks les lignes de vue. A la phase de renfort, jeter un D6, la fumée reste en place sur un 5+. une cible touchée par le gabarit n'est pas suppressed." },
        { id: "trait_gabarit", name: "Gabarit", desc: "quand un tir est réalisé avec cette arme, placer le gabarit en larme. Toute figurine sous le gabarit est automatiquement touchée. Si cette arme est légère et utilisée au corps à corps, elle touche automatiquement, mais on ne place pas le gabarit. Si l'arme a aussi tir rapide, la cible la plus proche est touchée autant de fois que le dé de tir rapide l'indique, les autres ne sont touchés qu'un seule fois." },
        { id: "trait_gaz", name: "Gaz", desc: "un guerrier ne peut faire de jet d'armure contre les armes ayant ce trait.Les guerriers équipés d'un respirateur ont une sauvegarde invulnérable de 5+ contre ces armes." },
        { id: "trait_graviton_pulse", name: "Graviton pulse", desc: "Au lieu de lancer un jet de blessure, la cible doit faire un test de force. S'il est raté, la figurine subit une blessure sans sauvegarde. Puis on laisse le marqueur d'explosion en place." },
        { id: "trait_independant", name: "Indépendant", desc: "Le porteur de cette arme ne peut pas tirer avec? A la place, elle tire en même temps que son porteur, en pouvant avoir une autre cible. Elle touche toujours sur 4+." },
        { id: "trait_instable", name: "Instable", desc: "Si le jet pour toucher avec cette arme donne 1, ,le guerrier maniant cette arme subit une touche automatique avec le profil de l'arme. Si cette arme ne nécessite pas de jet de touche, un D6 est lancé tout de même." },
        { id: "trait_jumelee", name: "Jumelée", desc: "Lors d'un tir avec cette arme, le dé de tir rapide peut être relancé." },
        { id: "trait_knockback", name: "Knockback (X+)", desc: "si cette arme touche avec un résultat de X ou plus, la cible est repoussée de 1\", ce qui peut la faire tomber. Cela peut aussi sortir de l'engagement la cible. Si l'arme a aussi le trait explosion, jeter un dé pour chaque combattant touché. Sur un X ou +, elles sont repoussées depuis le centre du gabarit." },
        { id: "trait_lance", name: "Lance", desc: "Si le guerrier portant cette arme est monté, il ajoute +1 en force à ses atttaques de charge." },
        { id: "trait_lance_bombe", name: "Lance-bombe", desc: "La première touche de la partie avec cette arme est résolue avec son profil \",primed\" toutes les autres se feront avec son profil \"utilisé\"" },
        { id: "trait_leger", name: "Léger", desc: "Cette arme peut être utilsié en tant qu'arme primaire ou secondaire au corps à corps, mais elle ne pourra toujours faire qu'une seule attaque. Si cette arme a le trait souffle, elle touche automatiquement, mais on ne place pas le gabarit." },
        { id: "trait_limite", name: "Limité", desc: "Si cette arme tombe à court de munitions, elle ne peut plus être utilisée pour cette partie." },
        { id: "trait_lourd", name: "Lourd", desc: "Une arme avec ce trait ne peut tirer qu'en utilisant l'action braced shot. Une arme de corps à corps avec ce trait ne peut pas être utilisée en tant qu'arme secondaire, ou en même temps qu'une arme secondaire." },
        { id: "trait_maudit", name: "Maudit", desc: "un guerrier touché par une arme maudite doit réussir un test de willpower ou subir la condition insanity. Si le jet pour toucher était de 1, c'est l'attaquant qui doit faire ce test." },
        { id: "trait_melee", name: "Melee", desc: "cette arme ne peut être utilisée que quand on est engagé." },
        { id: "trait_munitions", name: "Munitions (X+)", desc: "après le tir avec cette arme, lancer un D6. Si le résultat est X+, rien ne se passe. Sinon, l'arme est à court de munition même sans le trait tir rapide. Si l'arme a aussi tir rapide et a un résultat plus de munitions, l'ame n'est plus utilisable cette partie." },
        { id: "trait_paire", name: "Paire (X)", desc: "Une arme avec ce trait ne peut jamais être utilisée en tant qu'arme secondaire, ou en même temps qu'une arme secondaire. Quand on attaque avec cette arme, on ajoute X attaques." },
        { id: "trait_parade", name: "Parade", desc: "Quand cette arme est utilisée en tant qu'arme primaire ou secondaire au corps à corps, la sauvegarde augmente de 1." },
        { id: "trait_power_pack", name: "Power pack", desc: "Une arme avec ce trait ne compte pas dans le nombre d'armes qu'un guerrier peut porter, mais on ne peut avoir plus de 2 armes avec ce trait." },
        { id: "trait_rad_phage", name: "Rad-phage", desc: "Quand un guerrier subit une blessure non sauvegardée d'une arme avec ce trait, il devient empoisonné aux radiations, ce qui baisse son endurance de 1." },
        { id: "trait_rare", name: "Rare (X+)", desc: "Lors de l'action de recharge de cette arme, il faut lancer un D6. Si le résultat est X ou plus, l'arme est rechargée, sinon elle reste à court de munitions, mais on peut retenter l'action plus tard." },
        { id: "trait_shock", name: "Shock (X+)", desc: "Lors du jet pour toucher avec cette arme, si le résultat est de X ou +, on considère que le jet de blessure donne 6." },
        { id: "trait_temeraire", name: "Téméraire", desc: "une arme avec ce trait peut toucher toute figurine en ligne de vue dans les 6\", même amie, à déterminer aléatoirement. Au corps à corps, il faut aussi déterminer aléatoirement quell guerrier engagé avec le porteur est touché, même un allié." },
        { id: "trait_tir_rapide", name: "Tir rapide (X)", desc: "Quand on tire avec cette arme, on ajoute le dé de tir rapide, qui indiquera le nombre de touches. Cette arme risque de tomber à court de munitions." },
        { id: "trait_tir_unique", name: "Tir unique", desc: "Cette arme ne peut tirer qu'une fois par partie, sans pouvoir être rechargée." },
        { id: "trait_toile", name: "Toile", desc: "On ne jette pas de sauvegarde contre cette arme, sauf invulnérable. Si un guerrier est blessé par cette arme, il ne perd pas de PV mais gagne la condition entoilé.  Il ne peut plus bouger et subit un malus de -1 pour toucher. A la fin de son activation, il peut faire un test de force pour annuler cet état." },
        { id: "trait_toxine", name: "Toxine (X+)", desc: "lors du jet de blessure avec cette arme, on ignore l'endurance de la cible, qui est blessée sur X et + à la place. Pour les véhicules, ils ne seront endommagés que sur des 6+." }
    ],

    // ===== CARTES TACTIQUES (18) =====
    tactics: [
        { id: "tac_point_blank_shot", name: "Point-blank shot", timing: "Quand un guerrier s'active, avant ses actions", effect: "Une des armes du guerrier qui n'a pas les traits explosions ou template gagne le trait léger." },
        { id: "tac_hidden_stash", name: "Hidden stash", timing: "Quand un guerrier s'active, avant ses actions", effect: "Pendant son activation, ce guerrier peut faire gratuitement une action de recharge." },
        { id: "tac_suppressing_fire", name: "Suppressing fire", timing: "Quand un guerrier tire", effect: "La cible est suppressed même si elle n'est pas touchée. Les compétences ne peuvent empêcher le suppressed." },
        { id: "tac_burst_of_courage", name: "Burst of courage", timing: "Avant de faire un bottle check", effect: "Le test est automatiquement réussi." },
        { id: "tac_adrenaline_surge", name: "Adrenaline surge", timing: "Quand un guerrier s'active, avant ses actions", effect: "Le guerrier peut faire une action supplémentaire." },
        { id: "tac_desperate_effort", name: "Desperate effort", timing: "Juste avant de choisir quel guerrier va s'activer", effect: "Activer le guerrier comme s'il avait un marqueur prêt. À la fin de son activation, il est suppressed et subit une blessure qu'on ne peut sauvegarder ou empêcher." },
        { id: "tac_grenade_bouquet", name: "Grenade bouquet", timing: "Quand un guerrier tire avec une grenade ayant le trait explosion", effect: "Le guerrier résout 3 attaques ciblant le même ennemi. Elles dévient toutes et l'arme devient à court de munitions." },
        { id: "tac_quick_finish", name: "Quick finish", timing: "Quand un guerrier s'active, avant ses actions", effect: "Le guerrier peut faire un coup de grâce en action gratuite." },
        { id: "tac_remorseless_killer", name: "Remorseless killer", timing: "Quand un guerrier fait un coup de grâce, avant de jeter les dés", effect: "L'ennemi est directement out of combat sans jet de dé." },
        { id: "tac_last_gap", name: "Last gap", timing: "Quand un guerrier reçoit l'état out of action", effect: "Le guerrier peut immédiatement faire un tir avant d'être retiré du terrain." },
        { id: "tac_thundering_charge", name: "Thundering charge", timing: "Quand un guerrier déclare une charge, avant de jeter le dé de distance", effect: "Lancer 2 dés et choisir lequel garder pour la distance de charge." },
        { id: "tac_chain_attack", name: "Chain attack", timing: "Quand un guerrier a résolu un combat et n'est plus engagé", effect: "Le guerrier peut immédiatement effectuer une charge gratuite même s'il a déjà charged ce tour. La distance de charge sera de D6+2\"." },
        { id: "tac_opening_volley", name: "Opening volley", timing: "Avant le premier round et le jet de priorité", effect: "Un guerrier peut immédiatement effectuer un tir sans perdre son état prêt." },
        { id: "tac_you", name: "You !", timing: "Quand un guerrier s'active, avant ses actions", effect: "Désigner un guerrier ennemi, le guerrier aura +1 pour blesser cet ennemi pour toute la partie. Tant que l'ennemi est sur la table, le guerrier ne peut prendre que lui pour cible de ses actions." },
        { id: "tac_rapid_healing", name: "Rapid healing", timing: "Quand un guerrier s'active, avant ses actions", effect: "Le guerrier récupère immédiatement 1 PV perdu." },
        { id: "tac_reckless_attack", name: "Reckless attack", timing: "Quand un guerrier s'active, avant ses actions", effect: "Pour son activation, le guerrier a +1 à sa WS. Jusqu'à sa prochaine activation, il sera touché sur un 2+ au corps à corps." },
        { id: "tac_rapid_fire", name: "Rapid fire", timing: "Quand un guerrier s'active, avant ses actions", effect: "Durant son activation, ce guerrier peut faire une action de tir gratuitement (pas une en plus)." },
        { id: "tac_crossfire", name: "Crossfire", timing: "Quand un guerrier s'active, avant ses actions", effect: "Si ce guerrier fait une attaque de tir sur un ennemi qui a déjà été pris pour cible par un allié à ce round, le tir touche automatiquement." }
    ],

    // ===== TERRITOIRES (19) =====
    territories: [
        { id: "ter_settlement", name: "Settlement", income: 15, optionType: "discount_ganger", optionText: "Option : Recruter un ganger (-25 cr sur coût)", desc: "Revenu : 15 cr OU recruter un ganger pour 25 cr de moins." },
        { id: "ter_bullet_den", name: "Bullet den", income: 15, optionType: "discount_ammojack", optionText: "Option : Recruter un Ammo-jack (-30 cr sur coût)", desc: "Revenu : 15 cr OU recruter un Ammo-jack pour 30 cr de moins." },
        { id: "ter_rogue_doc_shop", name: "Rogue doc shop", income: 15, optionType: "discount_doc", optionText: "Option : Recruter un Rogue doc (-30 cr sur coût)", desc: "Revenu : 15 cr OU recruter un Rogue doc pour 30 cr de moins." },
        { id: "ter_mess_shack", name: "Mess Shack", income: 15, optionType: "discount_slopper", optionText: "Option : Recruter un Slopper (-30 cr sur coût)", desc: "Revenu : 15 cr OU recruter un Slopper pour 30 cr de moins." },
        { id: "ter_drinking_hole", name: "Drinking hole", income: 15, optionType: "discount_watcher", optionText: "Option : Recruter un Hive watcher (-30 cr sur coût)", desc: "Revenu : 15 cr OU recruter un Hive watcher pour 30 cr de moins." },
        { id: "ter_fence_hangout", name: "Fence hangout", income: 15, optionType: "discount_runner", optionText: "Option : Recruter un Dome runner (-30 cr sur coût)", desc: "Revenu : 15 cr OU recruter un Dome runner pour 30 cr de moins." },
        { id: "ter_bounty_den", name: "Bounty den", income: 25, desc: "Revenu : 25 crédits." },
        { id: "ter_generatorium", name: "Generatorium", income: 15, passive: "+1 Réputation", desc: "Revenu : 15 cr. Passif : +1 Réputation tant que contrôlé." },
        { id: "ter_corpse_farm", name: "Corpse farm", income: 25, desc: "Revenu : 25 crédits." },
        { id: "ter_tunnels", name: "Tunnels", income: 20, desc: "Revenu : 20 crédits." },
        { id: "ter_tech_bazaar", name: "Tech bazaar", income: 15, passive: "+1 TP", desc: "Revenu : 15 cr. Passif : +1 TP au Trading Post." },
        { id: "ter_promethium_cache", name: "Promethium cache", income: 15, optionType: "items_suits", optionText: "Option : 3 Combinaisons de protection gratos", desc: "Revenu : 15 cr OU récupérer gratuitement 3 combinaisons de protection dans le Stash." },
        { id: "ter_collapsed_dome", name: "Collapsed dome", income: 20, desc: "Revenu : 20 crédits." },
        { id: "ter_bone_shrine", name: "Bone shrine", income: 25, desc: "Revenu : 25 crédits." },
        { id: "ter_mine_workings", name: "Mine workings", income: 20, optionType: "items_respirators", optionText: "Option : 2 Respirateurs gratos", desc: "Revenu : 20 cr OU récupérer gratuitement 2 respirateurs dans le Stash." },
        { id: "ter_gambling_den", name: "Gambling den", income: 15, passive: "+1 Réputation", desc: "Revenu : 15 cr. Passif : +1 Réputation tant que contrôlé." },
        { id: "ter_synth_still", name: "Synth still", income: 20, desc: "Revenu : 20 crédits." },
        { id: "ter_old_ruins", name: "Old ruins", income: 20, desc: "Revenu : 20 crédits." },
        { id: "ter_fighting_pit", name: "Fighting pit", income: 25, desc: "Revenu : 25 crédits." }
    ],

    // ===== CONDITIONS =====
    conditions: {
        "Fearsome": "Losqu'il est pris pour cible d'une attaque de corps à corps, l'attaquant fait un jet de Wil. En cas d'échec, sa WS passe à 6+. Les guerriers fearsome ne sont pas affectés, sauf si la cible est terrifying",
        "Frénésie": "Le guerrier doit déclarer une charge s'il commence son activation à son M + 6\" d'un ennemi. Il devrai charger l'ennemi le plus proche. Ils gagnent +1A",
        "Haine": "Quand le guerrier engage, charge ou est la cible des ces actions par une figurine haïe, elle peut relancer les jets pour toucher ratés.",
        "Blessé": "Le guerrier perd toutes ses compétences jusqu'à ce qu'il récupère un point de vie",
        "Intoxiqué": "Le guerrier baisse de 1 ses WS et BS, mais augmente son cool de 1",
        "Terrifying": "A les mêmes avantages qu'un guerrier fearsome. De plus, pour charger ou engager ce guerrier, il faut réussir un test Will. En cas d'échec, l'attaquant reste sur place. Ce guerrier n'est affecté ni par fearsome, ni par terrifying.",
        "Entoilé": "Le guerrier ne peut plus sé déplacer, ni être déplacé et il subit un -1 à tous ses jets pour toucher. A la fon de son activation, il peut faire un test de force qui le libère de la condition s'il est réussi.",
        "Folie": "Quand un guerrier atteint de folie s'active, jeter un dé sur le tableau de folie pour voir comment il va agir. A la fin de son activation, il faut faire un jet de Will sui s'il est réussi, annule la condition folie"
    },

// ===== RÈGLES D'ARMÉE =====
    army_rules: {
        pious: "Articles de Foi (Pieux) : Génère des dés de foi au début de chaque round. Permet de lancer des prières d'actes de foi pour accorder des bonus à toute la bande.",
        fanatic: "Articles de Foi (Fanatique) : Chemin des Damnés. Génère des dés de ferveur lors des charges et des éliminations pour appliquer des effets fanatiques destructeurs."
    }
};

// ==========================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================
let appState = { view: 'menu', mode: null, editTarget: null, isQuickMatch: false };
let savedGangs = JSON.parse(localStorage.getItem('escherGangs')) || {};
let currentGang = null;
let tempFighter = null;

function saveGangs() {
    localStorage.setItem('escherGangs', JSON.stringify(savedGangs));
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function isMercOrBeastProfile(fighter) {
    let types = (fighter.type || []).map(t => t.toLowerCase());
    return types.includes("bête") || types.includes("bette") || types.includes("hanger-on") || (fighter.charId && fighter.charId.startsWith("merc_") && fighter.charId !== "merc_hive_scum");
}

function calculateFighterCost(m) {
    const char = db.characters.find(c => c.id === m.charId);
    if (!char) return 0;
    let total = char.cost;
    
    (m.weapons || []).forEach(w => {
        if (!w) return;
        const isDefault = w.isDefault || (char.default_weapons && (char.default_weapons.includes(w.id) || char.default_weapons.includes(w.name)));
        if (!isDefault) {
            total += (w.cost_credits || w.cost || 0);
        }
        if (w.accessory && typeof w.accessory === 'object' && !w.accessory.isDefault) {
            total += (w.accessory.cost_credits || w.accessory.cost || 0);
        }
    });
    
    (m.equipment || []).forEach(e => {
        if (!e) return;
        const isDefault = e.isDefault || (char.default_equipment && (char.default_equipment.includes(e.id) || char.default_equipment.includes(e.name)));
        if (!isDefault) {
            total += (e.cost_credits || e.cost || 0);
        }
    });
    
    return total;
}

function calculateGangRating(gang) {
    if (!gang || !gang.members) return 0;
    let rating = 0;
    gang.members.forEach(m => {
        m.totalCost = calculateFighterCost(m);
        rating += m.totalCost;
    });
    gang.rating = rating;
    return rating;
}

function updateTopBar() {
    const topBar = document.getElementById('top-bar');
    if (!topBar) return;

    if (typeof currentGang === 'undefined' || !currentGang) {
        topBar.innerHTML = '';
        topBar.style.display = 'none';
        return;
    }

    topBar.style.display = 'block';
    topBar.classList.remove('hidden');

    // 1. Calcul du Gang Rating (somme des combattants + équipements équipés)
    let gangRating = typeof calculateGangRating === 'function' 
        ? calculateGangRating(currentGang) 
        : (currentGang.members || []).reduce((sum, m) => sum + (m.totalCost || m.cost || 0), 0);

    // 2. Valeur des objets dans le Stash
    let stashVal = (currentGang.stash || []).reduce((sum, item) => {
        let itemCost = (typeof item === 'object') ? (item.cost || item.cost_credits || item.price || 0) : 0;
        return sum + itemCost;
    }, 0);

    // 3. Richesse totale = Gang Rating + Stash
    let gangWealth = gangRating + stashVal + (currentGang.credits || 0);

    // 4. Réputation (base + bonus territoires)
    let totalRep = typeof calculateGangReputation === 'function' 
        ? calculateGangReputation(currentGang) 
        : ((currentGang.reputation !== undefined) ? currentGang.reputation : 1);

    // 5. Structure HTML harmonisée
    topBar.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:6px 15px; background:var(--panel-bg, #1e1e1e); border-bottom:1px solid #333; box-sizing:border-box; color:#fff;">
            <div>
                <strong>${currentGang.name || 'Gang'}</strong> | 
                Crédits : <strong style="color:var(--accent-cyan, #00d2d3);">${currentGang.credits || 0} cr</strong> | 
                Gang Rating : <strong style="color:var(--accent-purple, #9b59b6);">${gangRating} cr</strong> | 
                Richesse : <strong style="color:#f39c12;">${gangWealth} cr</strong> | 
                Réputation : <strong style="color:#2ecc71;">${totalRep}</strong>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-cyan" style="padding:3px 10px; font-size:12px; cursor:pointer;" onclick="openStashModal()">📦 Réserve (Stash)</button>
                <button class="btn" style="padding:3px 10px; font-size:12px; cursor:pointer;" onclick="openTerritoriesModal()">🚩 Territoires</button>
                <button class="btn btn-cyan" style="padding:3px 10px; font-size:12px; cursor:pointer;" onclick="openMatchHistoryModal()">📜 Historique</button>
            </div>
        </div>
    `;
}

// ==========================================
// UI ROUTING
// ==========================================
function navigate(view) {
    appState.view = view;
    const container = document.getElementById('main-content');
    updateTopBar();

    switch(view) {
        case 'menu': renderMenu(container); break;
        case 'gang-create': renderGangCreate(container); break;
        case 'gang-select': renderGangSelect(container); break;
        case 'gang-manage': renderGangManage(container); break;
        case 'fighter-edit': renderFighterEdit(container); break;
        case 'game-setup': renderGameSetup(container); break;
    }
}

// ==========================================
// VIEWS RENDERING
// ==========================================
function renderMenu(container) {
    currentGang = null;
    updateTopBar();
    container.innerHTML = `
        <div class="card" style="text-align:center;">
            <h2>Bienvenue dans le Sous-Monde : gang Cawdor</h2>
            <p>Sélectionnez une option :</p><br>
            <button onclick="navigate('gang-create')">Création de Gang</button><br>
            <button onclick="appState.mode='campaign'; navigate('gang-select')">Suivi de Gang (Campagne)</button><br>
            <hr style="border-color:var(--border-color); margin: 20px 0;">
            <button onclick="importGang()">Importer un gang (.json)</button>
        </div>
    `;
}

function renderGangCreate(container) {
    container.innerHTML = `
        <div class="card">
            <h2>Créer un nouveau gang Escher</h2>
            <input type="text" id="new-gang-name" placeholder="Nom du gang">
            <button onclick="createGang()">Créer</button>
            <button class="btn-danger" onclick="navigate('menu')">Annuler</button>
        </div>
    `;
}

function createGang() {
    const name = document.getElementById('new-gang-name').value.trim();
    if(!name) return alert("Nom requis.");
    if(savedGangs[name] && !confirm("Ce nom existe déjà. L'écraser ?")) return;
    
    currentGang = {
        name: name, credits: 1000, rating: 0, reputation: 1, members: [], stash: [], territories: [], tactics: [], isEstablished: false
    };
    savedGangs[name] = currentGang;
    saveGangs();
    appState.mode = 'campaign';
    navigate('gang-manage');
}

function renderGangSelect(container) {
    let html = `<div class="card"><h2>Sélectionner un gang</h2>`;
    if(Object.keys(savedGangs).length === 0) {
        html += `<p>Aucun gang sauvegardé.</p>`;
    } else {
        for(let name in savedGangs) {
            calculateGangRating(savedGangs[name]);
            html += `
                <div class="fighter-item">
                    <span><strong>${name}</strong> (Rating: ${savedGangs[name].rating})</span>
                    <div>
                        <button onclick="loadGang('${name}')">Gérer</button>
                        <button onclick="exportGang('${name}')">Export</button>
                        <button class="btn-danger" onclick="deleteGang('${name}')">X</button>
                    </div>
                </div>
            `;
        }
    }
    html += `<br><button class="btn-danger" onclick="navigate('menu')">Retour</button></div>`;
    container.innerHTML = html;
}

function loadGang(name) {
    currentGang = savedGangs[name];
    if (currentGang.isEstablished === undefined) {
        currentGang.isEstablished = true;
    }
    navigate('gang-manage');
}

// ==========================================
// GESTION ET AFFICHAGE DU GANG
// ==========================================
function renderGangManage(container) {
    if (!container) container = document.getElementById('main-content');
    if (!container) return;

    calculateGangRating(currentGang);
    updateTopBar();
    // ... reste de la fonction inchangé

    const statKeys = ['M', 'WS', 'BS', 'S', 'T', 'W', 'I', 'A', 'Sv', 'Ld', 'Cl', 'Wil', 'Int'];

    let html = `
        <div class="card">
            <h2>Gestion de Gang : ${currentGang.name}</h2>
            <button onclick="openRecruitModal()">+ Recruter un Combattant</button>
            <button onclick="openGangTacticsModal()">🎴 Cartes Tactiques (${(currentGang.tactics || []).length})</button>
            <button onclick="appState.isQuickMatch = false; navigate('game-setup')">⚔️ Partie de campagne</button>
            <button class="btn-cyan" onclick="appState.isQuickMatch = true; navigate('game-setup')">⚡ Partie rapide</button>
            <button onclick="if(typeof renderPostCycleView === 'function') { renderPostCycleView(document.getElementById('main-content')); }">🔄 Lancer un Post-Cycle</button>
            ${!currentGang.isEstablished ? `<button class="btn-cyan" onclick="finishGangCreation()">✅ Valider la création du gang</button>` : ''}
            <button onclick="exportGang('${currentGang.name}')">Export JSON</button>
            <button class="btn-danger" onclick="navigate('menu')">Menu Principal</button>
        </div>
        
        <div class="card">
            <h3>Membres du Gang (${currentGang.members.length})</h3>
    `;

    if (currentGang.members.length === 0) {
        html += `<p style="margin-top:10px;">Aucun membre recruté.</p>`;
    } else {
        currentGang.members.forEach((m, idx) => {
            let st = m.stats || {};
            
            html += `
            <div class="card" style="margin-top:10px; background:#181818; border:1px solid var(--border-color);">
                <div class="fighter-item" style="border:none; padding:0 0 10px 0;">
                    <div>
                        <strong>${m.customName || 'Sans nom'}</strong> (${m.charName})<br>
                        <small>Coût: ${m.totalCost}c | Type: ${(m.type || []).join(', ')}</small>
                    </div>
                    <div>
                        <button onclick="editFighter(${idx})">Équipement & Compétences</button>
                        <button class="btn-danger" onclick="removeFighter(${idx})">Licencier</button>
                    </div>
                </div>

                <div style="overflow-x:auto; background:#111; padding:8px; border-radius:4px; border:1px solid #333;">
                    <div style="display:flex; justify-content:space-between; gap:4px; text-align:center; min-width:600px;">
                        ${statKeys.map(key => `
                            <div style="flex:1; background:#1a1a1a; padding:6px 2px; border-radius:3px; border:1px solid #222;">
                                <small style="color:var(--accent-cyan); font-weight:bold; font-size:11px;">${key}</small>
                                <div style="font-weight:bold; font-size:13px; margin-top:2px; color:#fff;">${st[key] !== undefined ? st[key] : '-'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
        });
    }
    html += `</div>`;
    container.innerHTML = html;
}

function finishGangCreation() {
    if (confirm("Valider la liste initiale et passer en mode Gestion de Gang (Campagne) ?")) {
        currentGang.isEstablished = true;
        saveGangs();
        renderGangManage(document.getElementById('main-content'));
    }
}

// ==========================================
// FIGHTER EDITING & RECRUITMENT
// ==========================================
function openRecruitModal() {
    let html = `<h3>Sélectionner le profil à recruter</h3>`;
    
    const showMercs = currentGang && currentGang.isEstablished;

    // Détection des leaders Cawdor déjà recrutés
    const hasWordKeeper = currentGang.members.some(m => 
        (m.charName || '').toLowerCase().includes('word-keeper') || (m.charId || '').includes('word_keeper')
    );
    const hasRedemptionistPriest = currentGang.members.some(m => 
        (m.charName || '').toLowerCase().includes('redemptionist priest') || (m.charId || '').includes('redemptionist_priest')
    );

    db.characters.forEach(c => {
        const isMerc = c.id.startsWith("merc_");
        if (isMerc && !showMercs) return;

        const cName = (c.name || '').toLowerCase();
        const isWK = cName.includes('word-keeper') || c.id.includes('word_keeper');
        const isRP = cName.includes('redemptionist priest') || c.id.includes('redemptionist_priest');

        // Blocage d'alignement au recrutement
        if (hasWordKeeper && isRP) return;
        if (hasRedemptionistPriest && isWK) return;

        html += `
            <div class="fighter-item">
                <span><strong>${c.name}</strong> (${c.cost}c) ${isMerc ? '<small style="color:var(--accent-purple);">[Mercenaire/Hanger-on]</small>' : ''}</span>
                <button onclick="selectRecruitProfile('${c.id}')">Choisir</button>
            </div>
        `;
    });

    openModal("Recrutement", html);
}

function selectRecruitProfile(charId) {
    closeModal();
    const char = db.characters.find(c => c.id === charId);
    if (!char) return;

  let initSkills = [];
    if (char.starting_skill && char.starting_skill.trim() !== "" && !char.starting_skill.includes("choix") && !char.starting_skill.includes("selon")) {
        const norm = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        let skillNames = char.starting_skill.split(/\s+et\s+|,\s*|\/\s*/i);

        skillNames.forEach(rawName => {
            let cleanRaw = rawName.trim();
            if (!cleanRaw) return;

            let normRaw = norm(cleanRaw);
            let foundSkill = null;

            for (let cat in db.skills) {
                let match = db.skills[cat].find(s => {
                    let normS = norm(s.name);
                    if (normS === normRaw) return true;
                    if (normRaw.startsWith("leash") && normS.startsWith("leash")) return true;
                    return false;
                });
                if (match) {
                    foundSkill = JSON.parse(JSON.stringify(match));
                    if (normRaw.startsWith("leash")) {
                        foundSkill.name = cleanRaw.charAt(0).toUpperCase() + cleanRaw.slice(1);
                    }
                    break;
                }
            }

            if (foundSkill) {
                initSkills.push(foundSkill);
            } else {
                initSkills.push({
                    id: "sk_start_" + generateId(),
                    name: cleanRaw.charAt(0).toUpperCase() + cleanRaw.slice(1),
                    desc: "Compétence de départ"
                });
            }
        });
    }

    let initWeapons = [];
    if (char.default_weapons) {
        char.default_weapons.forEach(wId => {
            let wObj = db.weapons.find(w => w.id === wId || w.name === wId);
            if (wObj) {
                let item = JSON.parse(JSON.stringify(wObj));
                item.isDefault = true;
                initWeapons.push(item);
            }
        });
    }

    let initEquip = [];
    if (char.default_equipment) {
        char.default_equipment.forEach(eId => {
            let eObj = db.equipment.find(e => e.id === eId || e.name === eId);
            if (eObj) {
                let item = JSON.parse(JSON.stringify(eObj));
                item.isDefault = true;
                initEquip.push(item);
            }
        });
    }

    tempFighter = {
        id: generateId(),
        charId: char.id,
        charName: char.name,
        customName: "",
        type: char.type,
        stats: JSON.parse(JSON.stringify(char.stats)),
        weapons: initWeapons,
        equipment: initEquip,
        skills: initSkills,
        totalCost: char.cost
    };
    appState.editTarget = null;
    navigate('fighter-edit');
}

function editFighter(idx) {
    appState.editTarget = idx;
    tempFighter = JSON.parse(JSON.stringify(currentGang.members[idx]));
    navigate('fighter-edit');
}

function renderFighterEdit(container) {
    const m = tempFighter;
    m.totalCost = calculateFighterCost(m);

    let types = (m.type || []).map(t => t.toLowerCase());
    let isBeast = types.includes("bête") || types.includes("bette");
    let isMerc = m.charId && m.charId.startsWith("merc_");
    let isHiveScum = m.charId === "merc_hive_scum";

    let html = `
        <div class="card">
            <h2>${appState.editTarget === null ? 'Recruter' : 'Modifier'} ${m.charName}</h2>
            <label>Nom personnalisable :</label>
            <input type="text" value="${m.customName}" placeholder="Ex: Roxie Speed" oninput="tempFighter.customName = this.value">
            
            <h3>Armes Équipées</h3>
            <div id="weapon-list">
                ${m.weapons.length === 0 ? '<p>Aucune arme.</p>' : m.weapons.map((w, i) => {
                    let prof = (w.profiles && w.profiles[0]) ? w.profiles[0] : null;
                    let statsText = prof ? `Portée: ${prof.SR}/${prof.LR} | F:${prof.S} | AP:${prof.AP} | D:${prof.L}${prof.traits ? ` | ${prof.traits}` : ''}` : '';
                    
                    return `
                    <div style="margin:8px 0; background:#181818; padding:8px; border-radius:4px; display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            • <strong>${w.name}</strong> (${w.cost_credits||0}c)
                            ${statsText ? `<br><small style="color:#aaa; font-size:11px; margin-left:12px;">${statsText}</small>` : ''}
                            ${w.accessory ? `<br><small style="color:var(--accent-cyan); margin-left:12px;">↳ Accessoire : ${w.accessory.name} ${w.accessory.effect ? `— <em>${w.accessory.effect}</em>` : ''} ${w.accessory.fromStash ? '<span style="color:#2ecc71;">(Réserve - 0c)</span>' : `(${w.accessory.cost_credits||0}c)`} ${!isBeast && (!isMerc || isHiveScum) ? `<button class="btn-danger" style="padding:2px 6px; font-size:10px; margin-left:5px;" onclick="removeWeaponAccessory(${i})">Retirer accessoire</button>` : ''}</small>` : (!isBeast && (!isMerc || isHiveScum) ? `<br><button style="padding:2px 6px; font-size:11px; margin-left:12px; margin-top:4px;" onclick="openWeaponAccessoryModal(${i})">+ Ajouter un accessoire</button>` : '')}
                        </div>
                        <button class="btn-danger" style="padding:2px 6px; font-size:11px; flex-shrink:0;" onclick="removeWeapon(${i})">Supprimer</button>
                    </div>
                    `;
                }).join('')}
            </div>
            <button onclick="openWeaponSelectModal()">+ Ajouter / Échanger une Arme</button>

            <h3 style="margin-top:15px;">Armures & Équipements</h3>
            <div id="equip-list">
                ${m.equipment.length === 0 ? '<p>Aucun équipement.</p>' : m.equipment.map((e, i) => `
                    <div style="margin:6px 0; background:#181818; padding:6px 8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            • <strong>${e.name}</strong> ${e.fromStash ? '<span style="color:#2ecc71;">(Réserve)</span>' : `(${e.cost_credits||0}c)`}
                            ${e.effect ? `<br><small style="color:#aaa; font-size:11px; margin-left:12px;">${e.effect}</small>` : ''}
                        </div>
                        <button class="btn-danger" style="padding:2px 6px; font-size:11px;" onclick="removeEquipment(${i})">X</button>
                    </div>
                `).join('')}
            </div>
            <button onclick="openEquipSelectModal()">+ Ajouter Armure / Équipement</button>
    `;

    if (isHiveScum) {
        html += `<p style="color:var(--accent-purple); font-size:12px; margin-top:5px;">💡 Hive Scum : peut sélectionner uniquement le matériel compatible Hive Scum (60 cr max au total).</p>`;
    } else if (isBeast || isMerc) {
        html += `<p style="color:#aaa; font-size:12px; margin-top:5px;">💡 Les options proposées sont strictement filtrées selon les spécificités de ce profil.</p>`;
    }

    html += `
            <h3 style="margin-top:15px;">Compétences</h3>
            <div id="skills-list">
                ${m.skills.length === 0 ? '<p>Aucune compétence sélectionnée.</p>' : m.skills.map((s, i) => `
                    <div style="margin:5px 0;">• ${typeof s === 'string' ? s : s.name} ${!isBeast && !isMerc ? `<button class="btn-danger" onclick="removeSkill(${i})">X</button>` : ''}</div>
                `).join('')}
            </div>
            ${!isBeast && !isMerc ? `<button onclick="openSkillModal()">Gérer les Compétences</button>` : ''}

            <hr style="margin:20px 0; border-color:var(--border-color);">
            <p><strong>Valeur du Combattant (Rating) : ${m.totalCost} crédits</strong></p>
            <button onclick="saveFighter()">Valider et Enregistrer</button>
            <button class="btn-danger" onclick="cancelFighterEdit()">Annuler</button>
        </div>
    `;
    container.innerHTML = html;
}
// ==========================================
// SELECTION ET GESTION DES ARMES
// ==========================================
function openWeaponSelectModal() {
    if (!tempFighter) return;
    const charDef = db.characters.find(c => c.id === tempFighter.charId);
    const isCampaign = currentGang && currentGang.isEstablished;

    let types = (tempFighter.type || []).map(t => t.toLowerCase());
    let isBeast = types.includes("bête") || types.includes("bette");
    let isMerc = tempFighter.charId && tempFighter.charId.startsWith("merc_");
    let isHiveScum = tempFighter.charId === "merc_hive_scum";

    // Détection Pious / Fanatic
    let isPious = types.includes("pious") || types.includes("pieux") || (charDef && charDef.is_pious);
    let isFanatic = types.includes("fanatic") || types.includes("fanatique") || (charDef && charDef.is_fanatic);

    // Calcul des emplacements occupés (max 3)
    let usedSlots = (tempFighter.weapons || []).reduce((sum, w) => {
        return sum + (w.name.includes('*') ? 2 : 1);
    }, 0);

    let html = `<p>Emplacements d'armes utilisés : <strong>${usedSlots} / 3</strong></p><br>`;

    // 1. Réserve du Gang (Stash) en campagne
    if (isCampaign && !isHiveScum && !isBeast && !isMerc) {
        html += `<h4 style="color:var(--accent-cyan);">1. Réserve du Gang (Stash) :</h4>`;
        if (!currentGang.stash) currentGang.stash = [];

        let availableStashWeapons = currentGang.stash.filter(item => {
            let itemType = (typeof item === 'object' && item.type) ? item.type : '';
            if (itemType === 'Arme') return true;
            let itemName = typeof item === 'string' ? item : item.name;
            let foundDb = db.weapons.find(w => w.name === itemName);
            return !!foundDb;
        });

        if (availableStashWeapons.length === 0) {
            html += `<p style="color:#888; font-size:12px; margin-bottom:10px;">Aucune arme disponible dans la réserve.</p>`;
        } else {
            availableStashWeapons.forEach(stItem => {
                let itemName = typeof stItem === 'string' ? stItem : stItem.name;
                let cleanName = itemName.replace(/'/g, "\\'");
                let slotsNeeded = itemName.includes('*') ? 2 : 1;
                let isAvailable = (usedSlots + slotsNeeded <= 3);

                let wDb = db.weapons.find(w => w.name === itemName);
                let prof = (wDb && wDb.profiles && wDb.profiles[0]) ? wDb.profiles[0] : null;
                let statsText = prof ? `Portée: ${prof.SR}/${prof.LR} | F:${prof.S} | AP:${prof.AP} | D:${prof.L}${prof.traits ? ` | ${prof.traits}` : ''}` : '';

                html += `
                    <div class="fighter-item ${!isAvailable ? 'disabled' : ''}">
                        <div>
                            <strong>${itemName}</strong> <small style="color:#2ecc71;">(Réserve - 0 cr)</small> ${slotsNeeded === 2 ? '<em>(2 emplacements)</em>' : ''}
                            ${statsText ? `<br><small style="color:#aaa; font-size:11px;">${statsText}</small>` : ''}
                        </div>
                        ${isAvailable ? `<button class="btn-cyan" onclick="addWeaponFromStash('${cleanName}')">Équiper (Stash)</button>` : '<small>Emplacements insuffisants</small>'}
                    </div>
                `;
            });
        }
        html += `<hr style="margin:15px 0; border-color:#333;"><h4 style="color:var(--accent-purple);">2. Acheter sur la Liste de Clan :</h4>`;
    }

    // 2. Filtrage du catalogue d'armes
    const availableWeapons = db.weapons.filter(w => {
        if (w.requires_equip) {
            let hasReq = tempFighter.equipment.some(e => e.id === w.requires_equip || e.name === w.requires_equip);
            if (!hasReq) return false;
        }

        if (isBeast || (isMerc && !isHiveScum)) return w.specific_to === tempFighter.charId;
        if (isHiveScum) return w.is_hive_scum === true;
        if (w.is_merc_weapon) return false;
        if (w.default_for) return false;
        if (w.specific_to && w.specific_to !== tempFighter.charId) return false;

        // Alignement Pious / Fanatic
        let matchPious = isPious && w.is_pious;
        let matchFanatic = isFanatic && w.is_fanatic;
        let isAllowedExclusive = charDef && charDef.allowed_weapons_exclusive && charDef.allowed_weapons_exclusive.includes(w.id);

        return matchPious || matchFanatic || isAllowedExclusive;
    });

    if (availableWeapons.length === 0) {
        html += `<p style="color:#888; font-size:12px;">Aucune arme disponible pour ce combattant.</p>`;
    } else {
        availableWeapons.forEach(w => {
            let slotsNeeded = w.name.includes('*') ? 2 : 1;
            let isAvailable = (usedSlots + slotsNeeded <= 3);

            let prof = (w.profiles && w.profiles[0]) ? w.profiles[0] : null;
            let statsText = prof ? `Portée: ${prof.SR}/${prof.LR} | F:${prof.S} | AP:${prof.AP} | D:${prof.L}${prof.traits ? ` | ${prof.traits}` : ''}` : '';

            html += `
                <div class="fighter-item ${!isAvailable ? 'disabled' : ''}">
                    <div>
                        <strong>${w.name}</strong> (${w.cost_credits || 0}c) ${slotsNeeded === 2 ? '<em>(2 emplacements)</em>' : ''}
                        ${statsText ? `<br><small style="color:#aaa; font-size:11px;">${statsText}</small>` : ''}
                    </div>
                    ${isAvailable ? `<button onclick="addWeapon('${w.id}')">${isCampaign ? 'Acheter' : 'Ajouter'}</button>` : '<small>Emplacements insuffisants</small>'}
                </div>
            `;
        });
    }

    openModal("Sélection d'Arme / Option", html);
}

 
function swapMercWeapon(newWpnId, replaceWpnId, cost) {
    let repIdx = tempFighter.weapons.findIndex(w => w.id === replaceWpnId || w.name === replaceWpnId);
    if (repIdx >= 0) {
        tempFighter.weapons.splice(repIdx, 1);
    }

    let wObj = db.weapons.find(w => w.id === newWpnId || w.name === newWpnId);
    if (wObj) {
        let item = JSON.parse(JSON.stringify(wObj));
        item.cost_credits = cost;
        item.isDefault = false;
        item.replaces = replaceWpnId;
        tempFighter.weapons.push(item);
    }

    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function addMercWeapon(wId, cost) {
    let wObj = db.weapons.find(w => w.id === wId || w.name === wId);
    if (wObj) {
        let item = JSON.parse(JSON.stringify(wObj));
        item.cost_credits = cost;
        item.isDefault = false;
        tempFighter.weapons.push(item);
    }
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function addWeapon(wId) {
    const w = db.weapons.find(item => item.id === wId);
    let newWeapon = JSON.parse(JSON.stringify(w));
    newWeapon.accessory = null;

    if (w.requires_equip === "eq_escher_cutter") {
        tempFighter.weapons = tempFighter.weapons.filter(existing => existing.requires_equip !== "eq_escher_cutter");
    }

    if (w.upgrades_from) {
        tempFighter.weapons = tempFighter.weapons.filter(existing => {
            let dbWeapon = db.weapons.find(dw => dw.name === existing.name || dw.id === existing.id);
            return !(dbWeapon && (dbWeapon.id === w.upgrades_from || dbWeapon.name === w.upgrades_from));
        });
    }

    tempFighter.weapons.push(newWeapon);
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function addWeaponFromStash(itemName) {
    if (!currentGang || !currentGang.stash) return;

    let sIdx = currentGang.stash.findIndex(item => (typeof item === 'string' ? item : item.name) === itemName);
    if (sIdx >= 0) {
        currentGang.stash.splice(sIdx, 1);
        let foundDbW = db.weapons.find(w => w.name === itemName);
        let newWeapon = foundDbW ? JSON.parse(JSON.stringify(foundDbW)) : { name: itemName, cost_credits: 0 };
        newWeapon.accessory = null;
        newWeapon.fromStash = true;
        tempFighter.weapons.push(newWeapon);
        saveGangs();
    }
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function removeWeapon(idx) {
    let w = tempFighter.weapons[idx];
    const charDef = db.characters.find(c => c.id === tempFighter.charId);
    const isMercOrBeast = isMercOrBeastProfile(tempFighter);
    const isDefault = w.isDefault || (charDef && charDef.default_weapons && (charDef.default_weapons.includes(w.id) || charDef.default_weapons.includes(w.name)));
    const isCutterWpn = w.requires_equip === "eq_escher_cutter";

    if (currentGang && currentGang.isEstablished && !isDefault && !isMercOrBeast && !isCutterWpn) {
        if (!currentGang.stash) currentGang.stash = [];
        if (w.accessory && !w.accessory.isDefault) {
            currentGang.stash.push({ name: w.accessory.name, type: "Accessoire", cost: w.accessory.cost_credits || 0 });
        }
        currentGang.stash.push({ name: w.name, type: "Arme", cost: w.cost_credits || 0 });
        saveGangs();
    }

    if (w.replaces) {
        let repWpn = db.weapons.find(dw => dw.id === w.replaces || dw.name === w.replaces);
        if (repWpn) {
            let restored = JSON.parse(JSON.stringify(repWpn));
            restored.isDefault = true;
            tempFighter.weapons.splice(idx, 1, restored);
        } else {
            tempFighter.weapons.splice(idx, 1);
        }
    } else if (isCutterWpn && w.id !== "wpn_cutter_grenade_launcher" && tempFighter.equipment.some(e => e.id === "eq_escher_cutter" || e.name === "Escher cutter")) {
        let gl = db.weapons.find(dw => dw.id === "wpn_cutter_grenade_launcher");
        if (gl) {
            let restored = JSON.parse(JSON.stringify(gl));
            restored.isDefault = true;
            tempFighter.weapons.splice(idx, 1, restored);
        } else {
            tempFighter.weapons.splice(idx, 1);
        }
    } else {
        tempFighter.weapons.splice(idx, 1);
    }

    renderFighterEdit(document.getElementById('main-content'));
}

function cancelFighterEdit() {
    if (tempFighter && currentGang) {
        let origFighter = (appState.editTarget !== null && currentGang.members[appState.editTarget]) ? currentGang.members[appState.editTarget] : null;
        if (!currentGang.stash) currentGang.stash = [];

        // 1. Remet en réserve les armes prélevées dans le Stash
        (tempFighter.weapons || []).forEach(w => {
            let wasOnOrig = origFighter && (origFighter.weapons || []).some(ow => ow.name === w.name);
            if (w.fromStash && !wasOnOrig) {
                currentGang.stash.push({ name: w.name, type: "Arme", cost: w.cost_credits || w.cost || 0 });
            }
            // Remet en réserve les accessoires d'armes prélevés
            if (w.accessory) {
                let wasAccOnOrig = origFighter && (origFighter.weapons || []).some(ow => ow.accessory && ow.accessory.name === w.accessory.name);
                if (w.accessory.fromStash && !wasAccOnOrig) {
                    currentGang.stash.push({ name: w.accessory.name, type: "Accessoire", cost: w.accessory.cost_credits || w.accessory.cost || 0 });
                }
            }
        });

        // 2. Remet en réserve les armures et équipements prélevés dans le Stash
        (tempFighter.equipment || []).forEach(e => {
            let wasOnOrig = origFighter && (origFighter.equipment || []).some(oe => oe.name === e.name);
            if (e.fromStash && !wasOnOrig) {
                currentGang.stash.push({ name: e.name, type: e.type || "Équipement", cost: e.cost_credits || e.cost || 0 });
            }
        });

        saveGangs();
    }
    navigate('gang-manage');
}

// ==========================================
// GESTION DES ACCESSOIRES D'ARMES
// ==========================================
function openWeaponAccessoryModal(weaponIdx) {
    const weapon = tempFighter.weapons[weaponIdx];
    if (!weapon) return;

    let html = `<p>Arme concernée : <strong>${weapon.name}</strong></p><br>`;
    const isCampaign = currentGang && currentGang.isEstablished;

    let types = (tempFighter.type || []).map(t => t.toLowerCase());
    let charDef = db.characters.find(c => c.id === tempFighter.charId);
    let isBeast = types.includes("bête") || types.includes("bette");
    let isMerc = tempFighter.charId && tempFighter.charId.startsWith("merc_");
    let isHiveScum = tempFighter.charId === "merc_hive_scum";
    let isMercOrBeast = isMercOrBeastProfile(tempFighter);

    // Alignement Pious / Fanatic
    let isPious = types.includes("pious") || types.includes("pieux") || (charDef && charDef.is_pious);
    let isFanatic = types.includes("fanatic") || types.includes("fanatique") || (charDef && charDef.is_fanatic);

    if (!currentGang.stash) currentGang.stash = [];

    // Recherche de tous les accessoires dans le Stash (par type ou BDD)
    let stashAccessories = currentGang.stash.filter(item => {
        let itemName = typeof item === 'string' ? item : item.name;
        let itemType = (typeof item === 'object' && item.type) ? item.type : '';
        let lowerType = itemType.toLowerCase();
        if (lowerType.includes('accessoire')) return true;
        let foundDb = db.equipment.find(e => e.name === itemName);
        return foundDb && foundDb.type && foundDb.type.toLowerCase().includes('accessoire');
    });

    // Affichage de la réserve SI des objets s'y trouvent OU si on est en mode campagne
    if (stashAccessories.length > 0 || isCampaign) {
        html += `<h4 style="color:var(--accent-cyan);">1. Réserve du Gang (Stash / Trading Post) :</h4>`;
        if (stashAccessories.length === 0) {
            html += `<p style="color:#888; font-size:12px; margin-bottom:10px;">Aucun accessoire disponible dans la réserve.</p>`;
        } else {
            stashAccessories.forEach(stItem => {
                let itemName = typeof stItem === 'string' ? stItem : stItem.name;
                let cleanName = itemName.replace(/'/g, "\\'");
                html += `
                    <div class="fighter-item">
                        <span><strong>${itemName}</strong> <small style="color:#2ecc71;">(Réserve - 0 cr)</small></span>
                        <button class="btn-cyan" onclick="addWeaponAccessoryFromStash(${weaponIdx}, '${cleanName}')">Équiper (Gratuit)</button>
                    </div>
                `;
            });
        }
        html += `<hr style="margin:15px 0; border-color:#333;"><h4 style="color:var(--accent-purple);">2. Acheter sur la Liste de Clan :</h4>`;
    }

    let availableAccessories = db.equipment.filter(e => {
        let eType = (e.type || '').toLowerCase();
        if (!eType.includes('accessoire')) return false;
        if (isMercOrBeast) return e.specific_to === tempFighter.charId;
        if (isHiveScum) return e.is_hive_scum === true;
        if (e.specific_to && e.specific_to !== tempFighter.charId) return false;

        let matchPious = isPious && e.is_pious;
        let matchFanatic = isFanatic && e.is_fanatic;
        let isGeneral = !e.is_pious && !e.is_fanatic && !e.specific_to && !e.is_hive_scum;

        return matchPious || matchFanatic || isGeneral || e.is_gang === true;
    });

    if (availableAccessories.length === 0) {
        html += `<p style="color:#888; font-size:12px;">Aucun accessoire de base disponible sur la liste de ce gang.</p>`;
    } else {
        availableAccessories.forEach(acc => {
            let cost = acc.cost_credits || 0;
            let canAfford = !isCampaign || ((currentGang.credits || 0) >= cost);
            html += `
                <div class="fighter-item ${!canAfford ? 'disabled' : ''}">
                    <span><strong>${acc.name}</strong> (${cost}c) - <small style="color:#aaa;">${acc.effect || ''}</small></span>
                    ${canAfford ? 
                        `<button onclick="addWeaponAccessory(${weaponIdx}, '${acc.id}')">${isCampaign ? `Acheter (${cost}c)` : 'Équiper'}</button>` : 
                        `<small style="color:#e74c3c;">Crédits insuffisants</small>`
                    }
                </div>
            `;
        });
    }

    openModal(`Accessoire pour ${weapon.name}`, html);
}
function addWeaponAccessory(weaponIdx, accId) {
    const acc = db.equipment.find(e => e.id === accId || e.name === accId);
    if (!acc || !tempFighter.weapons[weaponIdx]) return;

    let newAcc = JSON.parse(JSON.stringify(acc));
    newAcc.fromStash = false;
    tempFighter.weapons[weaponIdx].accessory = newAcc;
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function addWeaponAccessoryFromStash(weaponIdx, itemName) {
    if (!currentGang || !currentGang.stash || !tempFighter.weapons[weaponIdx]) return;

    let sIdx = currentGang.stash.findIndex(item => (typeof item === 'string' ? item : item.name) === itemName);
    if (sIdx >= 0) {
        currentGang.stash.splice(sIdx, 1);
        let foundAcc = db.equipment.find(e => e.name === itemName);
        let newAcc = foundAcc ? JSON.parse(JSON.stringify(foundAcc)) : { name: itemName, cost_credits: 0, type: "Accessoire" };
        newAcc.fromStash = true;
        tempFighter.weapons[weaponIdx].accessory = newAcc;
        saveGangs();
    }
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function removeWeaponAccessory(weaponIdx) {
    let weapon = tempFighter.weapons[weaponIdx];
    if (!weapon || !weapon.accessory) return;

    let acc = weapon.accessory;
    let origFighter = (appState.editTarget !== null && currentGang.members[appState.editTarget]) ? currentGang.members[appState.editTarget] : null;
    let wasOnOrig = origFighter && (origFighter.weapons || []).some(ow => ow.accessory && ow.accessory.name === acc.name);

    if (acc.fromStash || (currentGang && currentGang.isEstablished && wasOnOrig && !acc.isDefault)) {
        if (!currentGang.stash) currentGang.stash = [];
        currentGang.stash.push({ name: acc.name, type: "Accessoire", cost: acc.cost_credits || acc.cost || 0 });
        saveGangs();
    }

    weapon.accessory = null;
    renderFighterEdit(document.getElementById('main-content'));
}
// ==========================================
// SELECTION ET GESTION DES ARMURES & EQUIPEMENTS
// ==========================================
function openEquipSelectModal() {
    if (!tempFighter) return;
    const charDef = db.characters.find(c => c.id === tempFighter.charId);
    const isCampaign = currentGang && currentGang.isEstablished;

    let types = (tempFighter.type || []).map(t => t.toLowerCase());
    let isBeast = types.includes("bête") || types.includes("bette");
    let isMerc = tempFighter.charId && tempFighter.charId.startsWith("merc_");
    let isHiveScum = tempFighter.charId === "merc_hive_scum";

    // Détection Pious / Fanatic
    let isPious = types.includes("pious") || types.includes("pieux") || (charDef && charDef.is_pious);
    let isFanatic = types.includes("fanatic") || types.includes("fanatique") || (charDef && charDef.is_fanatic);

    let html = ``;

    // 1. Réserve du Gang (Stash) en campagne
    if (isCampaign && !isHiveScum && !isBeast && !isMerc) {
        html += `<h4 style="color:var(--accent-cyan);">1. Réserve du Gang (Stash) :</h4>`;
        if (!currentGang.stash) currentGang.stash = [];

        let availableEquip = currentGang.stash.filter(item => {
            let itemType = (typeof item === 'object' && item.type) ? item.type : '';
            return itemType === 'Armure' || itemType === 'Équipement' || itemType === 'Personnel';
        });

        if (availableEquip.length === 0) {
            html += `<p style="color:#888; font-size:12px; margin-bottom:10px;">Aucun équipement disponible dans la réserve.</p>`;
        } else {
            availableEquip.forEach(stItem => {
                let itemName = typeof stItem === 'string' ? stItem : stItem.name;
                let itemType = (typeof stItem === 'object' && stItem.type) ? stItem.type : 'Matériel';
                let cleanName = itemName.replace(/'/g, "\\'");
                html += `
                    <div class="fighter-item">
                        <span><strong>${itemName}</strong> <small style="color:#aaa;">(${itemType})</small> <small style="color:#2ecc71;">(Réserve - 0 cr)</small></span>
                        <button class="btn-cyan" onclick="addEquipmentFromStash('${cleanName}')">Équiper (Stash)</button>
                    </div>
                `;
            });
        }
        html += `<hr style="margin:15px 0; border-color:#333;"><h4 style="color:var(--accent-purple);">2. Acheter sur la Liste :</h4>`;
    }

    // 2. Filtrage du catalogue d'équipements
    let generalEquipments = db.equipment.filter(e => {
        if (e.type === "Accessoire") return false;

        if (isBeast || (isMerc && !isHiveScum)) {
            return e.specific_to === tempFighter.charId;
        }

        if (isHiveScum) {
            return e.is_hive_scum === true;
        }

        if (e.specific_to && e.specific_to !== tempFighter.charId) return false;

        // Alignement Pious / Fanatic / Commun
        let matchPious = isPious && e.is_pious;
        let matchFanatic = isFanatic && e.is_fanatic;
        let isGeneralGang = e.is_gang === true || (!e.is_pious && !e.is_fanatic && !e.specific_to && !e.is_hive_scum);

        return matchPious || matchFanatic || isGeneralGang;
    });

    if (generalEquipments.length === 0) {
        html += `<p style="color:#888; font-size:12px;">Aucun équipement disponible pour ce combattant.</p>`;
    } else {
        generalEquipments.forEach(e => {
            html += `
                <div class="fighter-item">
                    <div>
                        <strong>${e.name}</strong> (${e.cost_credits || 0}c) - <small style="color:var(--accent-purple);">${e.type}</small>
                        ${e.effect ? `<br><small style="color:#aaa; font-size:11px;">${e.effect}</small>` : ''}
                    </div>
                    <button onclick="addEquipment('${e.id}')">${isCampaign ? 'Acheter' : 'Équiper'}</button>
                </div>
            `;
        });
    }

    openModal("Sélection Armure / Équipement", html);
}

function addEquipment(eId) {
    const e = db.equipment.find(item => item.id === eId);
    tempFighter.equipment.push(JSON.parse(JSON.stringify(e)));

    if (e.id === "eq_escher_cutter") {
        let gl = db.weapons.find(w => w.id === "wpn_cutter_grenade_launcher");
        if (gl && !tempFighter.weapons.some(w => w.requires_equip === "eq_escher_cutter")) {
            let glItem = JSON.parse(JSON.stringify(gl));
            glItem.isDefault = true;
            tempFighter.weapons.push(glItem);
        }
    }

    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function addEquipmentFromStash(itemName) {
    if (!currentGang || !currentGang.stash) return;

    let sIdx = currentGang.stash.findIndex(item => (typeof item === 'string' ? item : item.name) === itemName);
    if (sIdx >= 0) {
        currentGang.stash.splice(sIdx, 1);
        let foundDbE = db.equipment.find(e => e.name === itemName);
        let newE = foundDbE ? JSON.parse(JSON.stringify(foundDbE)) : { name: itemName, cost_credits: 0 };
        newE.fromStash = true;
        tempFighter.equipment.push(newE);

        if (newE.id === "eq_escher_cutter" || newE.name === "Escher cutter") {
            let gl = db.weapons.find(w => w.id === "wpn_cutter_grenade_launcher");
            if (gl && !tempFighter.weapons.some(w => w.requires_equip === "eq_escher_cutter")) {
                let glItem = JSON.parse(JSON.stringify(gl));
                glItem.isDefault = true;
                tempFighter.weapons.push(glItem);
            }
        }

        saveGangs();
    }
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function removeEquipment(idx) {
    let eq = tempFighter.equipment[idx];
    const charDef = db.characters.find(c => c.id === tempFighter.charId);
    const isMercOrBeast = isMercOrBeastProfile(tempFighter);
    const isDefault = eq.isDefault || (charDef && charDef.default_equipment && (charDef.default_equipment.includes(eq.id) || charDef.default_equipment.includes(eq.name)));

    if (currentGang && currentGang.isEstablished && !isDefault && !isMercOrBeast) {
        if (!currentGang.stash) currentGang.stash = [];
        currentGang.stash.push({ name: eq.name, type: eq.type || "Équipement", cost: eq.cost_credits || 0 });
        saveGangs();
    }

    if (eq.id === "eq_escher_cutter" || eq.name === "Escher cutter") {
        tempFighter.weapons = tempFighter.weapons.filter(w => w.requires_equip !== "eq_escher_cutter");
    }

    tempFighter.equipment.splice(idx, 1);
    renderFighterEdit(document.getElementById('main-content'));
}

// ==========================================
// GESTION DES COMPÉTENCES (CRÉATION)
// ==========================================
function openSkillModal() {
    if (!tempFighter) return;
    const char = db.characters.find(c => c.id === tempFighter.charId);
    if (!char) return;

    let types = (char.type || []).map(t => t.toLowerCase());

    let isLeaderOrChampion = types.includes("leader") || types.includes("champion");
    let isProspectOrBeast = types.includes("prospect") || types.includes("bête") || types.includes("bette");
    let isSpecialist = types.includes("spécialiste") || types.includes("specialiste");

    const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    let primaryCats = (char.primary_skills || []).map(s => norm(s));
    let secondaryCats = (char.secondary_skills || []).map(s => norm(s));

    const specialistSkillIds = [
        "sk_biceps_saillants", "sk_tir_hanche", "sk_pistolero", "sk_grimper",
        "sk_tir_precision", "sk_berserker", "sk_soin", "sk_munitions"
    ];

    let html = `<div style="max-height:60vh; overflow-y:auto;">`;

    if (isProspectOrBeast) {
        html += `<p style="color:var(--accent-purple); padding:10px; background:#111; border-radius:5px; border:1px solid #333;">
            ⚠️ Les Prospects et Bêtes n'ont pas accès à la sélection de compétences à la création (uniquement leur compétence de départ).
        </p>`;
    } else if (isSpecialist) {
        html += `<p style="color:var(--accent-cyan); margin-bottom:10px;">
            🎯 <strong>Spécialiste :</strong> Choisissez 1 compétence parmi les 8 spécialités ci-dessous :
        </p>`;

        for (let cat in db.skills) {
            db.skills[cat].forEach(s => {
                if (specialistSkillIds.includes(s.id)) {
                    let isChecked = tempFighter.skills.some(sk => sk.id === s.id);
                    html += `
                        <div class="skill-checkbox-group" style="margin-bottom:8px; padding:6px; background:#181818; border-radius:4px; border:1px solid #333;">
                            <input type="checkbox" id="sk-${s.id}" ${isChecked ? 'checked' : ''} onchange="toggleSpecialistSkill('${s.id}', '${cat}')">
                            <label for="sk-${s.id}"><strong>${s.name}</strong> (${cat.toUpperCase()}) : ${s.desc}</label>
                        </div>
                    `;
                }
            });
        }
    } else {
        for (let cat in db.skills) {
            let catNorm = norm(cat);
            let isPrimary = primaryCats.includes(catNorm);
            let isSecondary = secondaryCats.includes(catNorm);
            
            let isAllowed = true;
            if (isLeaderOrChampion) {
                isAllowed = isPrimary;
            }

            html += `
                <div class="skill-category" style="margin-bottom:12px; ${isAllowed ? '' : 'opacity:0.35; pointer-events:none; filter:grayscale(1);'}">
                    <h4 style="margin-bottom:6px; color:${isPrimary ? 'var(--accent-cyan)' : (isSecondary ? 'var(--accent-purple)' : '#888')};">
                        Catégorie : ${cat.toUpperCase()} ${isPrimary ? '(Primaire)' : (isSecondary ? '(Secondaire)' : (isLeaderOrChampion ? '(Inaccessible)' : ''))}
                    </h4>
            `;

            db.skills[cat].forEach(s => {
                let isChecked = tempFighter.skills.some(sk => sk.id === s.id);
                html += `
                    <div class="skill-checkbox-group" style="margin-bottom:4px;">
                        <input type="checkbox" id="sk-${s.id}" ${isChecked ? 'checked' : ''} ${isAllowed ? '' : 'disabled'} onchange="toggleSkill('${cat}', '${s.id}')">
                        <label for="sk-${s.id}"><strong>${s.name}</strong> : ${s.desc}</label>
                    </div>
                `;
            });

            html += `</div>`;
        }
    }

    html += `</div><br><button class="btn" onclick="closeModal()">Fermer</button>`;
    openModal("Menu des Compétences (Création)", html);
}

function toggleSpecialistSkill(skillId, cat) {
    const skillObj = db.skills[cat].find(s => s.id === skillId);
    if (!skillObj) return;

    const specialistSkillIds = [
        "sk_biceps_saillants", "sk_tir_hanche", "sk_pistolero", "sk_grimper",
        "sk_tir_precision", "sk_berserker", "sk_soin", "sk_munitions"
    ];

    tempFighter.skills = tempFighter.skills.filter(s => !specialistSkillIds.includes(s.id));

    let checkbox = document.getElementById(`sk-${skillId}`);
    if (checkbox && checkbox.checked) {
        tempFighter.skills.push(JSON.parse(JSON.stringify(skillObj)));
    }

    openSkillModal();
}

function toggleSkill(cat, skillId) {
    const skillObj = db.skills[cat].find(s => s.id === skillId);
    const existingIdx = tempFighter.skills.findIndex(s => s.id === skillId);
    
    if (existingIdx >= 0) {
        tempFighter.skills.splice(existingIdx, 1);
    } else {
        tempFighter.skills.push(JSON.parse(JSON.stringify(skillObj)));
    }
}

function removeSkill(idx) {
    tempFighter.skills.splice(idx, 1);
    renderFighterEdit(document.getElementById('main-content'));
}

// ==========================================
// SAUVEGARDE ET RENVOI DU COMBATTANT
// ==========================================
function saveFighter() {
    if (!tempFighter.customName.trim()) return alert("Veuillez saisir un nom pour le combattant.");
    
    if (tempFighter.charId === 'merc_hive_scum') {
        let wCost = (tempFighter.weapons || []).reduce((sum, w) => sum + (w.isDefault ? 0 : (w.cost_credits || 0)), 0);
        let eCost = (tempFighter.equipment || []).reduce((sum, e) => sum + (e.isDefault ? 0 : (e.cost_credits || 0)), 0);
        if (wCost + eCost > 60) {
            return alert(`Dépassement de limite ! Le matériel du Hive Scum ne peut pas dépasser 60 crédits au total (Actuel : ${wCost + eCost} cr).`);
        }
    }

    tempFighter.totalCost = calculateFighterCost(tempFighter);

    if (!currentGang.isEstablished) {
        let oldCost = 0;
        if (appState.editTarget !== null) {
            oldCost = currentGang.members[appState.editTarget].totalCost;
        }
        let diff = tempFighter.totalCost - oldCost;
        if (currentGang.credits - diff < 0) return alert("Crédits insuffisants !");
        currentGang.credits -= diff;
    } else {
        let creditsToPay = 0;

        if (appState.editTarget === null) {
            const charDef = db.characters.find(c => c.id === tempFighter.charId);
            creditsToPay += (charDef ? charDef.cost : 0);

            (tempFighter.weapons || []).forEach(w => {
                if (!w.fromStash && !w.isDefault) creditsToPay += (w.cost_credits || 0);
                if (w.accessory && !w.accessory.fromStash && !w.accessory.isDefault) creditsToPay += (w.accessory.cost_credits || 0);
            });
            (tempFighter.equipment || []).forEach(e => {
                if (!e.fromStash && !e.isDefault) creditsToPay += (e.cost_credits || 0);
            });
        } else {
            let origFighter = currentGang.members[appState.editTarget];
            
            const countNewItems = (tempList, origList, getItemName, getAcc) => {
                let tempCounts = {};
                (tempList || []).forEach(item => {
                    if (getAcc) item = item.accessory;
                    if (!item) return;
                    if (!item.fromStash && !item.isDefault) {
                        let n = getItemName(item);
                        let cost = item.cost_credits || item.cost || 0;
                        if (!tempCounts[n]) tempCounts[n] = { count: 0, cost: cost };
                        tempCounts[n].count++;
                    }
                });

                let origCounts = {};
                (origList || []).forEach(item => {
                    if (getAcc) item = item.accessory;
                    if (!item) return;
                    if (!item.fromStash && !item.isDefault) {
                        let n = getItemName(item);
                        if (!origCounts[n]) origCounts[n] = 0;
                        origCounts[n]++;
                    }
                });

                let totalNewCost = 0;
                for (let n in tempCounts) {
                    let diff = tempCounts[n].count - (origCounts[n] || 0);
                    if (diff > 0) {
                        totalNewCost += diff * tempCounts[n].cost;
                    }
                }
                return totalNewCost;
            };

            creditsToPay += countNewItems(tempFighter.weapons, origFighter.weapons, w => w.name, false);
            creditsToPay += countNewItems(tempFighter.weapons, origFighter.weapons, acc => acc.name, true);
            creditsToPay += countNewItems(tempFighter.equipment, origFighter.equipment, e => e.name, false);
        }

        if (creditsToPay > 0) {
            if (currentGang.credits < creditsToPay) {
                return alert(`Crédits insuffisants ! Requis : ${creditsToPay} cr | Disponibles : ${currentGang.credits} cr.`);
            }
            currentGang.credits -= creditsToPay;
        }
    }
    
    if (appState.editTarget === null) {
        currentGang.members.push(tempFighter);
    } else {
        currentGang.members[appState.editTarget] = tempFighter;
    }
    
    calculateGangRating(currentGang);
    saveGangs();
    navigate('gang-manage');
}
function removeFighter(idx) {
    if (!confirm("Voulez-vous vraiment licencier ce combattant ?")) return;
    const m = currentGang.members[idx];
    const charDef = db.characters.find(c => c.id === m.charId);
    const isMercOrBeast = isMercOrBeastProfile(m);

    if (currentGang.isEstablished) {
        if (!currentGang.stash) currentGang.stash = [];
        let addedToStash = false;

        (m.weapons || []).forEach(w => {
            const isDefault = w.isDefault || (charDef && charDef.default_weapons && (charDef.default_weapons.includes(w.id) || charDef.default_weapons.includes(w.name)));
            const isCutterWpn = w.requires_equip === "eq_escher_cutter";
            if (!isDefault && !isMercOrBeast && !isCutterWpn) {
                if (w.accessory && !w.accessory.isDefault) {
                    currentGang.stash.push({ name: w.accessory.name, type: "Accessoire", cost: w.accessory.cost_credits || 0 });
                }
                currentGang.stash.push({ name: w.name, type: "Arme", cost: w.cost_credits || 0 });
                addedToStash = true;
            }
        });

        (m.equipment || []).forEach(e => {
            const isDefault = e.isDefault || (charDef && charDef.default_equipment && (charDef.default_equipment.includes(e.id) || charDef.default_equipment.includes(e.name)));
            if (!isDefault && !isMercOrBeast) {
                currentGang.stash.push({ name: e.name, type: e.type || "Équipement", cost: e.cost_credits || 0 });
                addedToStash = true;
            }
        });

        if (addedToStash) {
            alert(`Les équipements supplémentaires de ${m.customName} ont été remis dans la réserve de gang.`);
        }
    } else {
        currentGang.credits += m.totalCost;
    }

    currentGang.members.splice(idx, 1);
    calculateGangRating(currentGang);
    saveGangs();
    renderGangManage(document.getElementById('main-content'));
}

// ==========================================
// MODALE & UTILS EXPORT
// ==========================================
function openModal(title, content) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    if (appState.view === 'fighter-edit') {
        renderFighterEdit(document.getElementById('main-content'));
    }
}

function exportGang(name) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedGangs[name], null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Gang_${name.replace(/\s+/g, '_')}.json`);
    dlAnchorElem.click();
}

function importGang() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const gang = JSON.parse(event.target.result);
                savedGangs[gang.name] = gang;
                saveGangs();
                alert("Gang importé avec succès !");
                navigate('gang-select');
            } catch(err) { alert("Fichier JSON invalide."); }
        };
        reader.readAsText(file);
    };
    input.click();
}

function deleteGang(name) {
    if(confirm(`Êtes-vous sûr de vouloir supprimer définitivement le gang ${name} ?`)) {
        delete savedGangs[name];
        saveGangs();
        renderGangSelect(document.getElementById('main-content'));
    }
}

// ==========================================
// GESTION DES CARTES TACTIQUES (BUILDER)
// ==========================================
function openGangTacticsModal() {
    if (!currentGang) return;
    if (!currentGang.tactics) currentGang.tactics = [];

    let html = `<div style="max-height:60vh; overflow-y:auto;">
        <p><small>Sélectionnez les cartes attribuées au gang pour vos affrontements.</small></p>
        <hr style="margin:10px 0; border-color:#333;">
    `;

    (db.tactics || []).forEach(t => {
        let isSelected = currentGang.tactics.some(gt => (typeof gt === 'string' ? gt === t.id : gt.id === t.id));
        html += `
            <div style="border:1px solid #444; padding:10px; margin-bottom:8px; border-radius:6px; background:#111; display:flex; justify-content:space-between; align-items:center;">
                <div style="flex:1; padding-right:10px;">
                    <strong style="color:var(--accent-cyan); font-size:15px;">${t.name}</strong><br>
                    <small style="color:var(--accent-purple);"><strong>Timing :</strong> ${t.timing}</small><br>
                    <small style="color:#ccc;"><strong>Effet :</strong> ${t.effect}</small>
                </div>
                <button class="${isSelected ? 'btn-danger' : 'btn-cyan'}" style="padding:4px 10px; font-size:12px;" onclick="toggleGangTactic('${t.id}')">
                    ${isSelected ? 'Retirer' : 'Ajouter'}
                </button>
            </div>
        `;
    });

    html += `</div><br><button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer</button>`;
    openModal("🎴 Sélection des Cartes Tactiques", html);
}

function toggleGangTactic(tacticId) {
    if (!currentGang) return;
    if (!currentGang.tactics) currentGang.tactics = [];

    let tacObj = db.tactics.find(t => t.id === tacticId);
    if (!tacObj) return;

    let existingIdx = currentGang.tactics.findIndex(gt => (typeof gt === 'string' ? gt === tacticId : gt.id === tacticId));

    if (existingIdx >= 0) {
        currentGang.tactics.splice(existingIdx, 1);
    } else {
        currentGang.tactics.push(JSON.parse(JSON.stringify(tacObj)));
    }

    saveGangs();
    renderGangManage(document.getElementById('main-content'));
    openGangTacticsModal();
}

navigate('menu');