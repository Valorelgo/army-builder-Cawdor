// ==========================================
// GAME STATE MANAGEMENT
// ==========================================
let currentGameRoster = [];
let gameTactics = [];

const CUMULATIVE_CONDITIONS = [
    "Blessé", "Folie", "Entoilé", "Fearsome", "Frénésie", "Haine", "Intoxiqué", "Terrifying"
];

const PERMANENT_INJURIES = [
    "+1 XP",
    "+2 XP",
    "+3 XP",
    "Gagne Haine",
    "Condition fearsome",
    "+1 Ld",
    "Aucune conséquence",
    "Recovery (Absente prochaine partie)",
    "Recovery & -1 BS",
    "Recovery & -1 WS",
    "Recovery & -1 M",
    "Recovery & -1 S",
    "Recovery & -1 T",
    "Recovery & -1 Ld",
    "Capturé",
    "Blessure critique",
    "Mort"
];

// Fonction utilitaire de recherche de territoire (compatibilité ID / Nom)
function getTerritoryDef(terId) {
    if (typeof db === 'undefined' || !db.territories) return null;
    return db.territories.find(t => t.id === terId || t.name === terId);
}

// Détermination de la règle d'armée Cawdor selon le Leader présent
function getCawdorArmyRule() {
    if (!currentGang || !currentGang.members) return null;

    const hasWordKeeper = currentGang.members.some(m => 
        (m.charName || '').toLowerCase().includes('word-keeper') || 
        (m.charId || '').includes('word_keeper')
    );
    const hasRedemptionistPriest = currentGang.members.some(m => 
        (m.charName || '').toLowerCase().includes('redemptionist priest') || 
        (m.charId || '').includes('redemptionist_priest')
    );

    if (hasWordKeeper) {
        return {
            name: "Pious",
            desc: "without number : au moment de choisir les guerriers pour une bataille, le gang peut inclure un prospect additionnel dans leur équipe de départ."
        };
    }
    if (hasRedemptionistPriest) {
        return {
            name: "Fanatic",
            desc: "fanatical : le gang peut relancer les tests de bottle-checks dont le résultat est 11 ou 12."
        };
    }
    return null;
}

// ==========================================
// PALIERS D'EXPÉRIENCE & RANGS
// ==========================================
function getFighterRank(xp) {
    if (xp < 1) return 0;
    if (xp <= 3) return 1;
    if (xp <= 6) return 2;
    if (xp <= 9) return 3;
    if (xp <= 12) return 4;
    if (xp <= 18) return 5;
    if (xp <= 24) return 6;
    if (xp <= 30) return 7;
    if (xp <= 36) return 8;
    if (xp <= 48) return 9;
    if (xp <= 60) return 10;
    if (xp <= 72) return 11;
    if (xp <= 84) return 12;
    if (xp <= 96) return 13;
    if (xp <= 108) return 14;
    if (xp <= 120) return 15;
    if (xp <= 132) return 16;
    if (xp <= 156) return 17;
    if (xp <= 180) return 18;
    if (xp <= 204) return 19;
    if (xp <= 228) return 20;
    return 21;
}

function getPendingAdvances(m) {
    let currentXP = getFighterXP(m);
    let currentRank = getFighterRank(currentXP);
    if (m.startingRank === undefined) {
        m.startingRank = currentRank;
    }
    let taken = m.advancesCount || 0;
    let pending = currentRank - m.startingRank - taken;
    return Math.max(0, pending);
}

function applyStatUpgrade(m, statKey) {
    if (!m.stats) m.stats = {};
    let cur = m.stats[statKey];

    if (cur === undefined || cur === null || cur === '-' || cur === '') {
        if (['WS', 'BS', 'I', 'Sv', 'Ld', 'Cl', 'Wil', 'Int'].includes(statKey)) {
            m.stats[statKey] = '6+';
        } else if (statKey === 'M') {
            m.stats[statKey] = '5"';
        } else {
            m.stats[statKey] = 1;
        }
        return;
    }

    let str = cur.toString().trim();
    let hasQuote = str.endsWith('"');
    let hasPlus = str.endsWith('+');
    let num = parseInt(str);

    if (isNaN(num)) {
        m.stats[statKey] = str + ' (+1)';
        return;
    }

    if (hasPlus) {
        let newNum = Math.max(1, num - 1);
        m.stats[statKey] = newNum + '+';
    } else if (hasQuote) {
        let newNum = num + 1;
        m.stats[statKey] = newNum + '"';
    } else {
        m.stats[statKey] = num + 1;
    }
}

// ==========================================
// BANDEAU SUPÉRIEUR
// ==========================================
function calculateGangReputation(gang) {
    if (!gang) return 1;
    let baseRep = (gang.reputation !== undefined) ? gang.reputation : 1;
    let territoryBonus = 0;

    if (gang.territories && Array.isArray(gang.territories)) {
        gang.territories.forEach(terId => {
            let tDef = getTerritoryDef(terId);
            if (tDef) {
                if (tDef.reputationBonus) {
                    territoryBonus += tDef.reputationBonus;
                } else if (tDef.desc) {
                    let match = tDef.desc.match(/\+(\d+)\s*(?:points?\s*de\s*)?réputation/i);
                    if (match) territoryBonus += parseInt(match[1]);
                }
            }
        });
    }
    return Math.max(1, baseRep + territoryBonus);
}

function updateGameTopBar() {
    const topBar = document.getElementById('top-bar');
    if (!topBar) return;

    if (typeof currentGang === 'undefined' || !currentGang) {
        topBar.innerHTML = '';
        topBar.style.display = 'none';
        return;
    }

    topBar.style.display = 'block';
    topBar.classList.remove('hidden');

    // 1. Gang Rating = Somme des guerriers + leurs équipements
    let gangRating = (currentGang.members || []).reduce((sum, m) => sum + (m.totalCost || m.cost || 0), 0);

    // 2. Valeur de la Réserve (Stash)
    let stashVal = (currentGang.stash || []).reduce((sum, item) => {
        let itemCost = (typeof item === 'object') ? (item.cost || item.cost_credits || item.price || 0) : 0;
        return sum + itemCost;
    }, 0);

    // 3. Richesse = Gang Rating + Valeur du Stash
    let gangWealth = gangRating + stashVal + (currentGang.credits || 0);

    // 4. Réputation totale
    let totalRep = calculateGangReputation(currentGang);

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

function setGameHeaderVisibility(inGame) {
    const topBar = document.getElementById('top-bar');
    if (topBar) {
        if (inGame) {
            topBar.classList.add('hidden');
            topBar.style.display = 'none';
        } else {
            topBar.classList.remove('hidden');
            topBar.style.display = 'block';
            updateGameTopBar();
        }
    }
}

function safeSave() {
    if (typeof appState !== 'undefined' && appState.isQuickMatch) return;
    if (typeof saveGangs === 'function') saveGangs();
    updateGameTopBar();
}

function safeNavigate(target) {
    // 1. Fermer toute modale ouverte
    if (typeof closeModal === 'function') {
        closeModal();
    }

    // 2. Masquer et réinitialiser le bandeau de jeu
    const topBar = document.getElementById('top-bar');
    if (topBar) {
        topBar.innerHTML = '';
        topBar.classList.add('hidden');
        topBar.style.display = 'none';
    }

    // 3. Mettre à jour la vue globale
    if (typeof appState !== 'undefined') {
        appState.view = target;
    }

    // 4. Rediriger vers la page de destination
    if (typeof navigate === 'function') {
        navigate(target);
    } else if (typeof navigateTo === 'function') {
        navigateTo(target);
    }
}
function getFighterXP(m) {
    if (m.xp !== undefined && m.xp !== null) return m.xp;
    if (typeof db !== 'undefined' && db.characters) {
        let charDef = db.characters.find(c => c.name === m.charName || (m.type && c.name === m.type[0]));
        if (charDef) {
            let startXp = charDef.starting_xp !== undefined ? charDef.starting_xp : (charDef.xp !== undefined ? charDef.xp : 0);
            m.xp = startXp;
            return startXp;
        }
    }
    m.xp = 0;
    return 0;
}

// ==========================================
// MENU & MODALE DE LA RÉSERVE (STASH X/Y)
// ==========================================
function openStashModal() {
    if (!currentGang) return;
    if (!currentGang.stash) currentGang.stash = [];

    let inventoryMap = {};

    (currentGang.members || []).forEach(m => {
        (m.weapons || []).forEach(w => {
            let wName = w.name;
            if (!inventoryMap[wName]) inventoryMap[wName] = { type: 'Arme', equipped: 0, stash: 0 };
            inventoryMap[wName].equipped++;

            if (w.accessory && w.accessory.name) {
                let accName = w.accessory.name;
                if (!inventoryMap[accName]) inventoryMap[accName] = { type: 'Accessoire', equipped: 0, stash: 0 };
                inventoryMap[accName].equipped++;
            }
        });

        if (m.armor && m.armor.name) {
            let aName = m.armor.name;
            if (!inventoryMap[aName]) inventoryMap[aName] = { type: 'Armure', equipped: 0, stash: 0 };
            inventoryMap[aName].equipped++;
        }

        (m.equipment || []).forEach(e => {
            let eName = e.name;
            if (!inventoryMap[eName]) inventoryMap[eName] = { type: 'Équipement', equipped: 0, stash: 0 };
            inventoryMap[eName].equipped++;
        });
    });

    (currentGang.stash || []).forEach(item => {
        let name = typeof item === 'string' ? item : item.name;
        let type = (typeof item === 'object' && item.type) ? item.type : 'Matériel';
        if (!inventoryMap[name]) inventoryMap[name] = { type: type, equipped: 0, stash: 0 };
        inventoryMap[name].stash++;
    });

    let html = `
        <div style="max-height:60vh; overflow-y:auto;">
            <p><small>Format <strong>X/Y</strong> : <strong>X</strong> = Équipés sur guerriers / <strong>Y</strong> = Total possédés par le gang.</small></p>
            <hr style="margin:10px 0; border-color:#333;">
            <table style="width:100%; border-collapse:collapse; text-align:left;">
                <thead>
                    <tr style="border-bottom:2px solid var(--accent-purple, #9b59b6);">
                        <th style="padding:6px;">Objet / Équipement</th>
                        <th style="padding:6px;">Type</th>
                        <th style="padding:6px; text-align:center;">Équipés / Total (X/Y)</th>
                        <th style="padding:6px; text-align:center;">En Stock</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let itemKeys = Object.keys(inventoryMap).sort();
    if (itemKeys.length === 0) {
        html += `<tr><td colspan="4" style="padding:15px; text-align:center; color:#888;">Le gang ne possède aucun matériel.</td></tr>`;
    } else {
        itemKeys.forEach(itemName => {
            let data = inventoryMap[itemName];
            let X = data.equipped;
            let stashCount = data.stash;
            let Y = X + stashCount;

            html += `
                <tr style="border-bottom:1px solid #222;">
                    <td style="padding:6px;"><strong>${itemName}</strong></td>
                    <td style="padding:6px;"><small style="color:#aaa;">${data.type}</small></td>
                    <td style="padding:6px; text-align:center;"><strong style="color:var(--accent-cyan, #00d2d3);">${X}/${Y}</strong></td>
                    <td style="padding:6px; text-align:center;">
                        ${stashCount > 0 ? `<span style="color:#2ecc71;">${stashCount} dispo</span>` : `<span style="color:#888;">0 dispo</span>`}
                    </td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
        <br>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer</button>
    `;

    if (typeof openModal === 'function') openModal("📦 Réserve du Gang (Stash)", html);
}

// ==========================================
// MENU DE GESTION DES TERRITOIRES
// ==========================================
function openTerritoriesModal() {
    if (!currentGang) return;
    if (!currentGang.territories) currentGang.territories = [];

    let dbTerritories = (typeof db !== 'undefined' && db.territories) ? db.territories : [];

    let html = `
        <div style="max-height:60vh; overflow-y:auto;">
            <h4>Territoires Contrôlés (${currentGang.territories.length})</h4>
            <hr style="margin:8px 0; border-color:#333;">
    `;

    if (currentGang.territories.length === 0) {
        html += `<p style="color:#888;">Aucun territoire contrôlé.</p>`;
    } else {
        html += `<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">`;
        currentGang.territories.forEach((tName, idx) => {
            let tData = getTerritoryDef(tName);
            let descText = tData ? tData.desc : 'Revenu : +15 cr';
            html += `
                <div style="background:#111; border:1px solid var(--accent-purple); padding:8px; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:var(--accent-cyan);">${tName}</strong><br>
                        <small style="color:#bbb;">${descText}</small>
                    </div>
                    <button class="btn btn-danger" style="padding:2px 8px; font-size:11px;" onclick="removeGangTerritoryFromModal(${idx})">Perdre</button>
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `
            <h4>Acquérir un nouveau Territoire</h4>
            <hr style="margin:8px 0; border-color:#333;">
            <div style="display:grid; grid-template-columns:1fr; gap:8px; margin-bottom:12px;">
    `;

    dbTerritories.forEach(t => {
        let count = currentGang.territories.filter(x => x === t.name || x === t.id).length;
        let cleanName = t.name.replace(/'/g, "\\'");
        html += `
            <div style="border:1px solid #444; padding:8px; border-radius:5px; background:#1a1a1a;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:#fff;">${t.name}</strong>
                        ${count > 0 ? `<span style="color:#2ecc71; font-size:11px; margin-left:8px;">(Possédé x${count})</span>` : ''}
                    </div>
                    <button class="btn btn-cyan" style="padding:2px 8px; font-size:11px;" onclick="addTerritoryToGang('${cleanName}')">+ Prendre</button>
                </div>
                <small style="color:#aaa;">${t.desc}</small>
            </div>
        `;
    });

    html += `
            </div>
            <button class="btn" onclick="openAddCustomTerritoryPrompt()">+ Territoire Personnalisé</button>
        </div>
        <br>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer</button>
    `;

    if (typeof openModal === 'function') openModal("🚩 Gestion des Territoires", html);
}

function addTerritoryToGang(name) {
    if (!currentGang) return;
    if (!currentGang.territories) currentGang.territories = [];
    currentGang.territories.push(name);
    safeSave();
    openTerritoriesModal();
}

function removeGangTerritoryFromModal(index) {
    if (!currentGang || !currentGang.territories) return;
    currentGang.territories.splice(index, 1);
    safeSave();
    openTerritoriesModal();
}

function openAddCustomTerritoryPrompt() {
    let name = prompt("Nom du territoire personnalisé :");
    if (name) {
        addTerritoryToGang(name);
    }
}

// ==========================================
// GAME SETUP (Sélection des participants)
// ==========================================
function renderGameSetup(container) {
    setGameHeaderVisibility(false);
    
    if (!currentGang) {
        container.innerHTML = `<div class="card"><p>Aucun gang sélectionné.</p><button onclick="safeNavigate('gang-manage')">Retour</button></div>`;
        return;
    }

    let isQuick = typeof appState !== 'undefined' && appState.isQuickMatch;

    let html = `
        <div class="card">
            <h2>Préparation de la Partie ${isQuick ? '(⚡ Partie Rapide)' : '(⚔️ Partie de Campagne)'}</h2>
            <p>Sélectionnez les combattants qui participent à l'affrontement :</p>
            ${isQuick ? '<p style="color:var(--accent-purple); font-size:12px; margin-top:4px;">💡 Mode Partie Rapide : aucune modification ne sera enregistrée sur le gang à la fin de l\'affrontement.</p>' : ''}<br>
    `;

    if (!currentGang.members || currentGang.members.length === 0) {
        html += `<p>Aucun membre dans le gang.</p>`;
    } else {
        currentGang.members.forEach((m, idx) => {
            if (!m.recovery) {
                html += `
                    <div class="fighter-item">
                        <div>
                            <strong>${m.customName}</strong> (${m.charName})<br>
                            <small>${(m.type || []).join(', ')} - Coût : ${m.totalCost || 0}c | XP : ${getFighterXP(m)}</small>
                        </div>
                        <div>
                            <button onclick="inspectFighter(${idx})">👁️ Voir</button>
                            <label style="margin-left:10px;">
                                <input type="checkbox" class="roster-select" value="${idx}" checked> Participe
                            </label>
                        </div>
                    </div>
                `;
            }
        });
    }

    html += `
        <br>
        <button onclick="startGame()">⚔️ Lancer la Partie</button>
        <button class="btn-danger" onclick="safeNavigate('gang-manage')">Annuler</button>
    </div>`;

    container.innerHTML = html;
}

function inspectFighter(idx) {
    if (!currentGang || !currentGang.members[idx]) return;
    const m = currentGang.members[idx];
    let html = `
        <p><strong>Type :</strong> ${(m.type || []).join(', ')}</p>
        <p><strong>XP :</strong> ${getFighterXP(m)}</p>
        <hr style="margin:10px 0; border-color:var(--border-color);">
        <h4>Armes :</h4>
        <ul>${(m.weapons || []).map(w => `<li>${w.name} ${w.accessory ? '('+w.accessory.name+')' : ''}</li>`).join('')}</ul>
        <h4 style="margin-top:5px;">Équipements & Armures :</h4>
        <ul>${(m.equipment || []).map(e => `<li>${e.name}</li>`).join('')}</ul>
        <h4 style="margin-top:5px;">Compétences :</h4>
        <ul>${(m.skills || []).map(s => `<li>${typeof s === 'string' ? s : (s.name || s)}</li>`).join('')}</ul>
    `;
    if (typeof openModal === 'function') openModal(m.customName, html);
}

function startGame() {
    const selectedIndexes = document.querySelectorAll('.roster-select:checked');
    if (selectedIndexes.length === 0) return alert("Sélectionnez au moins un combattant.");

    if (!confirm("Confirmer le lancement de la partie avec ces combattants ?")) return;

    currentGameRoster = [];
    selectedIndexes.forEach(chk => {
        let m = JSON.parse(JSON.stringify(currentGang.members[chk.value]));
        m.currentHP = parseInt(m.stats ? m.stats.W : 1) || 1;
        m.status = 'Prêt';
        m.activated = false;
        m.suppressed = false;
        m.conditions = {};

        // --- AUTOMATISATION DES CONDITIONS PERMANENTES ---
        // 1. Vérification de la compétence Fearsome / Redoutable
        const hasFearsomeSkill = (m.skills || []).some(s => {
            let sName = (typeof s === 'string' ? s : (s.name || '')).toLowerCase();
            let sId = (typeof s === 'object' && s.id) ? s.id : '';
            return sId === 'sk_redoutable' || sName.includes('fearsome') || sName.includes('redoutable');
        });

        // 2. Vérification d'une blessure permanente Fearsome / Redoutable
        const hasFearsomeInjury = (m.injuries || []).some(inj => {
            let injStr = (typeof inj === 'string' ? inj : '').toLowerCase();
            return injStr.includes('fearsome') || injStr.includes('redoutable');
        });

        // Si le combattant a la compétence ou la blessure, on coche la condition automatiquement
        if (hasFearsomeSkill || hasFearsomeInjury) {
            m.conditions['Fearsome'] = true; // Remplace 'Fearsome' par 'Redoutable' si c'est le nom exact dans CUMULATIVE_CONDITIONS
        }

        // 3. Vérification de la compétence Berserker (Condition Frénésie)
        const hasBerserkerSkill = (m.skills || []).some(s => {
            let sName = (typeof s === 'string' ? s : (s.name || '')).toLowerCase();
            let sId = (typeof s === 'object' && s.id) ? s.id : '';
            return sId === 'sk_berserker' || sName.includes('berserker');
        });

        if (hasBerserkerSkill) {
            m.conditions['Frénésie'] = true;
        }
        
        if (m.weapons) {
            m.weapons.forEach(w => {
                w.outOfAmmo = false;
                w.jammed = false;
            });
        }
        
        currentGameRoster.push(m);
    });

    gameTactics = JSON.parse(JSON.stringify(currentGang.tactics || []));
    
    if (typeof appState !== 'undefined') appState.view = 'game-view';
    renderGameView(document.getElementById('main-content'));
}

// ==========================================
// GAME VIEW (Page Résumé & Actions)
// ==========================================
function renderGameView(container) {
    setGameHeaderVisibility(true);

    let isQuick = typeof appState !== 'undefined' && appState.isQuickMatch;

    let html = `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>Partie en cours — ${currentGang ? currentGang.name : ''} ${isQuick ? '(⚡ Partie Rapide)' : ''}</h2>
                <button onclick="openTacticsModal()">🎴 Cartes Tactiques</button>
            </div>
        </div>

        <h3>Résumé de la Bande</h3>
        <!-- DEBUT DU CONTENEUR SUR 2 COLONNES -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 10px; align-items: start;">
    `;

    currentGameRoster.forEach((m, idx) => {
        let activeConds = Object.keys(m.conditions || {}).filter(c => m.conditions[c]);
        let isOOA = (m.status === 'Out of action');

        // Couleurs du nom : Grisé (OOA) > Rouge (Sérieusement blessé) > Jaune (Pilonné) > Orange (Blessé)
        let nameColor = '#ffffff';
        if (isOOA) {
            nameColor = '#777777';
        } else if (m.status === 'Sérieusement blessé') {
            nameColor = '#e74c3c';
        } else if (m.status === 'Pilonné' || m.suppressed) {
            nameColor = '#f1c40f';
        } else if (m.conditions && m.conditions['Blessé']) {
            nameColor = '#e67e22';
        }

        let ooaCardStyle = isOOA ? 'background: #141414; opacity: 0.45; filter: grayscale(1); border: 1px solid #333;' : '';

        html += `
            <div class="card" style="margin-bottom:0; ${ooaCardStyle}">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div>
                        <strong style="font-size:16px; cursor:pointer; text-decoration:${isOOA ? 'line-through' : 'underline'}; color:${nameColor};" onclick="openFighterDetailModal(${idx})">
                            ${m.customName}
                        </strong> 
                        <small style="color:${isOOA ? '#666' : 'inherit'};"> — <strong>${m.charName || ''}</strong> (${(m.type || []).join(', ')})</small><br>
                        <small style="color:${isOOA ? '#666' : 'inherit'};">Armes : ${(m.weapons || []).map(w => w.name + (w.accessory ? ' ['+w.accessory.name+']' : '')).join(', ') || 'Aucune'}</small>
                        ${activeConds.length > 0 ? `<br><small style="color:${isOOA ? '#666' : '#e67e22'};"><strong>Conditions :</strong> ${activeConds.map(c => `<span style="cursor:pointer; text-decoration:underline;" onclick="showConditionDetails('${c.replace(/'/g, "\\'")}')">${c}</span>`).join(', ')}</small>` : ''}
                    </div>

                    <div style="display:flex; align-items:center; gap:10px; margin-top:5px; flex-wrap:wrap;">
                        <!-- POINTS DE VIE MODIFIABLES DIRECTEMENT -->
                        <div style="display:flex; align-items:center; gap:3px;">
                            <span>PV :</span>
                            <button class="btn" style="padding:1px 5px; font-weight:bold;" onclick="adjHP(${idx}, -1)">-</button>
                            <strong style="font-size:15px; min-width:16px; text-align:center;">${m.currentHP}</strong> / ${m.stats ? m.stats.W : 1}
                            <button class="btn" style="padding:1px 5px; font-weight:bold;" onclick="adjHP(${idx}, 1)">+</button>
                        </div>

                        <!-- MENU DÉROULANT DES ÉTATS -->
                        <div>
                            <select style="background:#222; color:#fff; border:1px solid #444; padding:3px 5px; border-radius:4px; font-size:12px;" onchange="updateFighterStatus(${idx}, this.value)">
                                <option value="Prêt" ${m.status === 'Prêt' ? 'selected' : ''}>Prêt</option>
                                <option value="Engagé" ${m.status === 'Engagé' ? 'selected' : ''}>Engagé</option>
                                <option value="Pilonné" ${m.status === 'Pilonné' ? 'selected' : ''}>Pilonné</option>
                                <option value="Sérieusement blessé" ${m.status === 'Sérieusement blessé' ? 'selected' : ''}>Sérieusement blessé</option>
                                <option value="Out of action" ${m.status === 'Out of action' ? 'selected' : ''}>Out of action</option>
                            </select>
                        </div>

                        <div>
                            <label style="cursor:pointer; font-size:12px;">
                                <input type="checkbox" ${m.activated ? 'checked' : ''} onchange="toggleActivation(${idx})"> Activé
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        </div> <!-- FIN DU CONTENEUR SUR 2 COLONNES -->

        <div style="position:fixed; bottom:0; left:0; width:100%; background:var(--panel-bg); padding:10px; display:flex; justify-content:center; gap:10px; border-top:2px solid var(--accent-purple); z-index:1000; flex-wrap:wrap;">
            <button class="btn btn-cyan" onclick="openPdfModal('📖 Règles', 'Recapitulatif de regles.pdf')">📖 Règles</button>
            <button class="btn btn-cyan" onclick="openPdfModal('📊 Tableaux', 'Tableaux.pdf')">📊 Tableaux</button>
            <button onclick="endRound()">🔄 Fin de Round</button>
            <button class="btn-danger" onclick="endGame()">🏁 Terminer la Partie</button>
        </div>
        <div style="height:60px;"></div>
    `;

    container.innerHTML = html;
}

function toggleActivation(idx) {
    if (currentGameRoster[idx]) {
        currentGameRoster[idx].activated = !currentGameRoster[idx].activated;
        renderGameView(document.getElementById('main-content'));
    }
}

function toggleSuppressed(idx) {
    if (currentGameRoster[idx]) {
        currentGameRoster[idx].suppressed = !currentGameRoster[idx].suppressed;
        renderGameView(document.getElementById('main-content'));
    }
}

function endRound() {
    if (!confirm("Réinitialiser l'état 'Activé' de tous les guerriers pour le nouveau round ?")) return;
    currentGameRoster.forEach(m => m.activated = false);
    renderGameView(document.getElementById('main-content'));
}

function endGame() {
    if (!confirm("Voulez-vous vraiment terminer la partie ?")) return;
    setGameHeaderVisibility(false);

    if (typeof appState !== 'undefined' && appState.isQuickMatch) {
        appState.isQuickMatch = false;
        alert("Partie rapide terminée. Aucune donnée n'a été modifiée.");
        safeNavigate('menu');
        return;
    }

    if (currentGang && currentGang.members) {
        currentGameRoster.forEach(battleFighter => {
            let gangFighter = currentGang.members.find(m => m.id === battleFighter.id || m.customName === battleFighter.customName);
            if (gangFighter) {
                if (battleFighter.status === 'Out of action' || battleFighter.currentHP <= 0) {
                    gangFighter.ooa = true;
                }
            }
        });
        safeSave();
    }

    renderPostBattleView(document.getElementById('main-content'));
}

// ==========================================
// FICHE DÉTAILLÉE DU COMBATTANT
// ==========================================
// ==========================================
// FICHE DÉTAILLÉE DU COMBATTANT (AVEC RÈGLE D'ARMÉE CAWDOR)
// ==========================================
function openFighterDetailModal(idx) {
    const m = currentGameRoster[idx];
    if (!m) return;

    let skillsDetailsHTML = '';
    if (m.skills && m.skills.length > 0) {
        skillsDetailsHTML = m.skills.map(s => {
            let name = typeof s === 'string' ? s : (s.name || s);
            let desc = typeof s === 'object' && s.desc ? s.desc : 'Pas de description.';
            return `<div class="description-block"><strong>Compétence — ${name} :</strong> ${desc}</div>`;
        }).join('');
    }

    let traitDescriptionsHTML = '';
    let processedTraits = new Set();
    
    if (m.weapons) {
        m.weapons.forEach(w => {
            if (w.accessory && w.accessory.effect) {
                traitDescriptionsHTML += `<div class="description-block"><strong>Accessoire d'arme — ${w.accessory.name} (${w.name}) :</strong> ${w.accessory.effect}</div>`;
            }
            
            if (w.profiles && w.profiles[0] && w.profiles[0].traits) {
                let traitsList = w.profiles[0].traits.split(',');
                
                traitsList.forEach(t => {
                    let rawTrait = t.trim();
                    if (!rawTrait) return;
                    
                    let baseKey = rawTrait.toLowerCase().replace(/\s*\(.*?\)/g, '').trim();
                    
                    if (!processedTraits.has(baseKey)) {
                        processedTraits.add(baseKey);
                        
                        let foundTrait = null;
                        if (typeof db !== 'undefined' && db.weapon_traits) {
                            foundTrait = db.weapon_traits.find(dt => 
                                dt.name.toLowerCase().replace(/\s*\(.*?\)/g, '').trim() === baseKey
                            );
                        }

                        if (foundTrait) {
                            traitDescriptionsHTML += `<div class="description-block"><strong>Trait d'arme — ${foundTrait.name} :</strong> ${foundTrait.desc}</div>`;
                        } else {
                            traitDescriptionsHTML += `<div class="description-block"><strong>Trait d'arme — ${rawTrait} :</strong> Description non répertoriée dans le registre.</div>`;
                        }
                    }
                });
            }
        });
    }

    let equipmentDetailsHTML = '';
    if (m.equipment && m.equipment.length > 0) {
        equipmentDetailsHTML = m.equipment.map(e => {
            return `<div class="description-block"><strong>Équipement / Armure — ${e.name} :</strong> ${e.effect || e.type || 'Équipement standard.'}</div>`;
        }).join('');
    }

    // --- B1 : DÉTECTION ET DÉFINITION DE LA RÈGLE D'ARMÉE CAWDOR ---
    let armyRuleHTML = '';
    const activeRule = typeof getCawdorArmyRule === 'function' ? getCawdorArmyRule() : null;
    if (activeRule) {
        armyRuleHTML = `<div class="description-block" style="border-left: 3px solid var(--accent-cyan);"><strong>Règle d'armée — ${activeRule.name} :</strong> ${activeRule.desc}</div>`;
    }

    let st = m.stats || {};
    let html = `
        <div class="landscape-card">
            <div class="card-section-top">
                <div>
                    <h3>${m.customName}</h3>
                    <small>${m.charName} — ${(m.type || []).join(', ')}</small>
                </div>
                <div>
                    <span>PV : </span>
                    <button onclick="adjHP(${idx}, -1)">-</button>
                    <strong style="font-size:16px; margin:0 5px;">${m.currentHP}</strong>
                    <button onclick="adjHP(${idx}, 1)">+</button>
                </div>
                <div>
                    <label>Statut :</label>
                    <select onchange="updateFighterStatus(${idx}, this.value)">
                        <option value="Prêt" ${m.status === 'Prêt' ? 'selected' : ''}>Prêt</option>
                        <option value="Engagé" ${m.status === 'Engagé' ? 'selected' : ''}>Engagé</option>
                        <option value="Pilonné" ${m.status === 'Pilonné' ? 'selected' : ''}>Pilonné</option>
                        <option value="Sérieusement blessé" ${m.status === 'Sérieusement blessé' ? 'selected' : ''}>Sérieusement blessé</option>
                        <option value="Out of action" ${m.status === 'Out of action' ? 'selected' : ''}>Out of action</option>
                    </select>
                </div>
            </div>

            <div class="card-section-center">
                <table>
                    <thead>
                        <tr>
                            <th>M</th><th>WS</th><th>BS</th><th>S</th><th>T</th>
                            <th>W</th><th>I</th><th>A</th><th>Sv</th><th>Ld</th>
                            <th>Cl</th><th>Wil</th><th>Int</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${st.M||'-'}</td><td>${st.WS||'-'}</td><td>${st.BS||'-'}</td>
                            <td>${st.S||'-'}</td><td>${st.T||'-'}</td><td>${st.W||'-'}</td>
                            <td>${st.I||'-'}</td><td>${st.A||'-'}</td><td>${st.Sv||'-'}</td>
                            <td>${st.Ld||'-'}</td><td>${st.Cl||'-'}</td><td>${st.Wil||'-'}</td>
                            <td>${st.Int||'-'}</td>
                        </tr>
                    </tbody>
                </table>

                <h4 style="margin-top:5px;">Armes Équipées</h4>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Nom</th>
                            <th style="width: 8%;">SR</th>
                            <th style="width: 8%;">LR</th>
                            <th style="width: 8%;">S</th>
                            <th style="width: 8%;">AP</th>
                            <th style="width: 8%;">L</th>
                            <th style="width: 20%;">Traits</th>
                            <th style="width: 15%;">Munitions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(m.weapons || []).map((w, wIdx) => {
                            const prof = (w.profiles && w.profiles[0]) ? w.profiles[0] : { SR:'-', LR:'-', S:'-', AP:'-', L:'-', traits:'' };
                            const isMelee = (prof.traits || '').toLowerCase().includes('melee');
                            const accText = w.accessory ? ` <br><small style="color:var(--accent-cyan)">[${w.accessory.name}]</small>` : '';
                            return `
                                <tr>
                                    <td><strong>${w.name}</strong>${accText}</td>
                                    <td>${prof.SR}</td>
                                    <td>${prof.LR}</td>
                                    <td>${prof.S}</td>
                                    <td>${prof.AP}</td>
                                    <td>${prof.L}</td>
                                    <td><small>${prof.traits}</small></td>
                                    <td>
                                        ${isMelee ? '-' : `
                                            <button class="btn-ammo ${w.outOfAmmo ? 'out' : ''}" onclick="toggleWeaponAmmo(${idx}, ${wIdx})">
                                                ${w.outOfAmmo ? 'À COURT' : 'OK'}
                                            </button>
                                            <button class="btn-jam ${w.jammed ? 'jammed' : ''}" onclick="toggleWeaponJam(${idx}, ${wIdx})">
                                                ${w.jammed ? 'ENRAYÉ' : 'Jam'}
                                            </button>
                                        `}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card-section-bottom">
                <h4>Descriptions Détaillées</h4>
                <!-- B2 : INJECTION DE LA RÈGLE D'ARMÉE CAWDOR -->
                ${armyRuleHTML}
                ${skillsDetailsHTML}
                ${equipmentDetailsHTML}
                ${traitDescriptionsHTML}
                ${(!armyRuleHTML && !skillsDetailsHTML && !equipmentDetailsHTML && !traitDescriptionsHTML) ? '<p style="font-size:12px; color:#888;">Aucun effet ou compétence particulier.</p>' : ''}

                <h4 style="margin-top:10px;">Conditions Cumulables</h4>
                <div class="conditions-grid">
                    ${CUMULATIVE_CONDITIONS.map(cond => `
                        <div class="condition-item">
                            <input type="checkbox" id="cond-${cond}" ${m.conditions && m.conditions[cond] ? 'checked' : ''} onchange="toggleCondition(${idx}, '${cond}')">
                            <label for="cond-${cond}">${cond}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    if (typeof openModal === 'function') openModal(`Fiche : ${m.customName}`, html);
}

function adjHP(idx, amount) {
    let m = currentGameRoster[idx];
    if (m) {
        m.currentHP = Math.max(0, m.currentHP + amount);
        let modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay && !modalOverlay.classList.contains('hidden')) {
            openFighterDetailModal(idx);
        }
        renderGameView(document.getElementById('main-content'));
    }
}

function updateFighterStatus(idx, val) {
    if (currentGameRoster[idx]) {
        currentGameRoster[idx].status = val;
        currentGameRoster[idx].suppressed = (val === 'Pilonné');
        let modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay && !modalOverlay.classList.contains('hidden')) {
            openFighterDetailModal(idx);
        }
        renderGameView(document.getElementById('main-content'));
    }
}

function toggleWeaponAmmo(fIdx, wIdx) {
    if (currentGameRoster[fIdx] && currentGameRoster[fIdx].weapons[wIdx]) {
        let w = currentGameRoster[fIdx].weapons[wIdx];
        w.outOfAmmo = !w.outOfAmmo;
        openFighterDetailModal(fIdx);
    }
}

function toggleWeaponJam(fIdx, wIdx) {
    if (currentGameRoster[fIdx] && currentGameRoster[fIdx].weapons[wIdx]) {
        let w = currentGameRoster[fIdx].weapons[wIdx];
        w.jammed = !w.jammed;
        openFighterDetailModal(fIdx);
    }
}

function toggleCondition(fIdx, cond) {
    if (currentGameRoster[fIdx]) {
        let m = currentGameRoster[fIdx];
        if (!m.conditions) m.conditions = {};
        m.conditions[cond] = !m.conditions[cond];
        renderGameView(document.getElementById('main-content'));
    }
}

function openTacticsModal() {
    let html = `<div style="max-height:60vh; overflow-y:auto;">`;

    if (!gameTactics || gameTactics.length === 0) {
        html += `<p style="color:#888;">Aucune carte tactique attribuée à ce gang.</p>`;
    } else {
        gameTactics.forEach((t, i) => {
            let isUsed = t.used;
            let timing = t.timing || '';
            let effect = t.effect || t.desc || t.effet || '';

            html += `
                <div style="border:1px solid ${isUsed ? '#333' : 'var(--accent-cyan)'}; padding:10px; margin-bottom:10px; border-radius:6px; background:${isUsed ? '#141414' : '#1e1e1e'}; opacity:${isUsed ? 0.45 : 1};">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <strong style="color:${isUsed ? '#777' : 'var(--accent-cyan)'}; font-size:15px; ${isUsed ? 'text-decoration:line-through;' : ''}">${t.name}</strong>
                        <span style="font-size:10px; padding:2px 6px; border-radius:3px; background:${isUsed ? '#333' : 'var(--accent-purple)'}; color:#fff; font-weight:bold;">
                            ${isUsed ? 'UTILISÉE' : 'DISPONIBLE'}
                        </span>
                    </div>
                    ${timing ? `<p style="font-size:12px; color:${isUsed ? '#666' : 'var(--accent-purple)'}; margin-bottom:4px;"><strong>Timing :</strong> ${timing}</p>` : ''}
                    <p style="font-size:12px; color:${isUsed ? '#666' : '#ddd'}; margin-bottom:10px;"><strong>Effet :</strong> ${effect}</p>
                    <button class="${isUsed ? '' : 'btn-danger'}" style="padding:4px 10px; font-size:11px;" onclick="toggleTacticUsed(${i})">
                        ${isUsed ? '🔄 Réactiver' : '✖️ Marquer comme Utilisée'}
                    </button>
                </div>
            `;
        });
    }

    html += `</div><br><button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer</button>`;
    if (typeof openModal === 'function') openModal("🎴 Cartes Tactiques du Gang", html);
}

function toggleTacticUsed(idx) {
    if (gameTactics[idx]) {
        gameTactics[idx].used = !gameTactics[idx].used;
        openTacticsModal();
    }
}

// ==========================================
// 1. SÉQUENCE POST-BATAILLE
// ==========================================
function renderPostBattleView(container) {
    if (typeof appState !== 'undefined') appState.view = 'post-battle';
    if (!container) container = document.getElementById('main-content');
    if (!container) return;

    if (!currentGang) {
        container.innerHTML = `<div class="card"><p>Aucun gang chargé.</p><button onclick="safeNavigate('gang-manage')">Retour</button></div>`;
        return;
    }

    updateGameTopBar();

    let ooaFighters = (currentGang.members || []).filter(m => m.ooa === true);

    // Préparation des listes déroulantes pour les territoires
    let dbTerritories = (typeof db !== 'undefined' && db.territories) ? db.territories : [];
    let gangTerritories = currentGang.territories || [];

    let optGained = `<option value="">-- Aucun --</option>` + dbTerritories.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
    let optLost = `<option value="">-- Aucun --</option>` + gangTerritories.map((tName, idx) => `<option value="${idx}">${tName}</option>`).join('');

    let html = `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                <h2>Séquence Post-Bataille — ${currentGang.name}</h2>
                <button class="btn btn-cyan" onclick="openStashModal()">📦 Réserve du Gang (Stash)</button>
            </div>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <button class="btn" onclick="safeNavigate('gang-manage')">← Retour Gestion du Gang</button>
                <button class="btn btn-cyan" onclick="startPostCycleView(document.getElementById('main-content'))">Passer au Post-Cycle →</button>
            </div>
            <hr style="margin: 15px 0; border-color: #333;">

            <h3>1. Résolution des Blessures Permanentes (Out of Action)</h3>
    `;

    if (ooaFighters.length === 0) {
        html += `<p style="color:var(--state-ready, #2ecc71);">Aucun guerrier n'a fini Out of Action !</p>`;
    } else {
        ooaFighters.forEach(m => {
            html += `
                <div style="border: 1px solid #e74c3c; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #1a0a0f;">
                    <strong style="color: #e74c3c;">${m.customName}</strong> (${m.charName})<br>
                    <label>Attribuer une blessure : </label>
                    <select id="inj-select-${m.id}">
                        ${PERMANENT_INJURIES.map(inj => `<option value="${inj}">${inj}</option>`).join('')}
                    </select>
                    <button class="btn btn-danger" onclick="applyInjury('${m.id}')">Valider Blessure</button>
                </div>
            `;
        });
    }

    html += `
            <hr style="margin: 15px 0; border-color: #333;">
            <h3>2. Attribution de l'Expérience (XP)</h3>
            <div class="roster-list">
    `;

    (currentGang.members || []).forEach(m => {
        let pendingAdvances = getPendingAdvances(m);
        let btnLevelUp = pendingAdvances > 0 
            ? `<button class="btn btn-cyan" onclick="openLevelUpModal('${m.id}')">⭐ Montée de Niveau (${pendingAdvances})</button>`
            : `<button class="btn" disabled style="opacity:0.4; cursor:not-allowed;">⭐ Montée de Niveau (0)</button>`;

        html += `
            <div class="fighter-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                <div>
                    <strong>${m.customName}</strong> | XP : <strong>${getFighterXP(m)}</strong> (Rang ${getFighterRank(getFighterXP(m))})
                </div>
                <div style="display:flex; gap:4px; flex-wrap:wrap; align-items:center;">
                    <button class="btn" onclick="addFighterXP('${m.id}', 1)">+1 XP (Partic.)</button>
                    <button class="btn" onclick="addFighterXP('${m.id}', 1)">+1 XP (Assistance)</button>
                    <button class="btn" onclick="addFighterXP('${m.id}', 1)">+1 XP (Scénario)</button>
                    <button class="btn" onclick="addFighterXP('${m.id}', 1)">+1 XP (Injure)</button>
                    <button class="btn" onclick="addFighterXP('${m.id}', 2)">+2 XP (OOA)</button>
                    <button class="btn" onclick="addFighterXP('${m.id}', 1)">+1 XP (Obj.)</button>
                    ${btnLevelUp}
                </div>
            </div>
        `;
    });

    let baseRep = (currentGang.reputation !== undefined) ? currentGang.reputation : 1;
    let totalRep = calculateGangReputation(currentGang);
    let territoryBonus = totalRep - baseRep;

    html += `
            </div>
            <hr style="margin: 15px 0; border-color: #333;">

            <h3>3. Rapport & Enregistrement de la Bataille</h3>
            <div style="background:#111; border:1px solid var(--accent-purple, #9b59b6); padding:12px; border-radius:6px; margin-bottom:15px;">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:10px;">
                    <div>
                        <label style="font-size:12px;">Joueur Adversaire :</label>
                        <input type="text" id="hist-opponent-name" placeholder="Ex : Marc" style="width:100%; padding:4px;">
                    </div>
                    <div>
                        <label style="font-size:12px;">Gang Adversaire :</label>
                        <input type="text" id="hist-opponent-gang" placeholder="Ex : Escher" style="width:100%; padding:4px;">
                    </div>
                    <div>
                        <label style="font-size:12px;">Résultat :</label>
                        <select id="hist-result" style="width:100%; padding:4px; background:#222; color:#fff; border:1px solid #444;">
                            <option value="Victoire">Victoire</option>
                            <option value="Défaite">Défaite</option>
                            <option value="Égalité">Égalité</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px;">Gain Cr. Mission Principale :</label>
                        <input type="number" id="hist-cred-primary" value="0" min="0" style="width:100%; padding:4px;">
                    </div>
                    <div>
                        <label style="font-size:12px;">Gain Cr. Mission Sec. :</label>
                        <input type="number" id="hist-cred-secondary" value="0" min="0" style="width:100%; padding:4px;">
                    </div>
                    <div>
                        <label style="font-size:12px;">Variation Réputation (+/-) :</label>
                        <input type="number" id="hist-rep" value="0" style="width:100%; padding:4px;" placeholder="+1, -1...">
                    </div>
                    <div>
                        <label style="font-size:12px;">Territoire Gagné :</label>
                        <select id="hist-ter-gained" style="width:100%; padding:4px; background:#222; color:#fff; border:1px solid #444;">
                            ${optGained}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px;">Territoire Perdu :</label>
                        <select id="hist-ter-lost" style="width:100%; padding:4px; background:#222; color:#fff; border:1px solid #444;">
                            ${optLost}
                        </select>
                    </div>
                </div>

                <button class="btn btn-cyan" style="width:100%; margin-top:5px;" onclick="saveMatchToHistory()">
                    💾 Valider & Enregistrer la Partie
                </button>
            </div>

            <hr style="margin: 15px 0; border-color: #333;">
            <h3>4. Territoires & Réputation Actuels</h3>
            <p>
                Réputation Totale : <strong style="color:#2ecc71; font-size:16px;">${totalRep}</strong> 
                <small style="color:#aaa;">(Base : ${baseRep}${territoryBonus > 0 ? ` | Bonus Territoires : +${territoryBonus}` : ''})</small>
            </p>
            <div style="display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap;">
                <button class="btn btn-cyan" onclick="adjustReputation(1)">+1 Réputation</button>
                <button class="btn btn-cyan" onclick="adjustReputation(2)">+2 Réputation</button>
                <button class="btn" onclick="adjustReputation(-1)">-1 Réputation</button>
            </div>
            <button class="btn btn-cyan" onclick="openTerritoriesModal()">🚩 Gérer les Territoires (${(currentGang.territories || []).length})</button>
        </div>
    `;

    container.innerHTML = html;
}
function applyInjury(fighterId) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;

    let selectElem = document.getElementById(`inj-select-${fighterId}`);
    let selectedInj = selectElem ? selectElem.value : "Aucune conséquence";
    m.ooa = false;

    if (!m.injuries) m.injuries = [];
    if (!currentGang.stash) currentGang.stash = [];

    if (selectedInj === "+1 XP") {
        m.xp = getFighterXP(m) + 1;
        alert(`${m.customName} gagne +1 XP !`);
    } else if (selectedInj === "+2 XP") {
        m.xp = getFighterXP(m) + 2;
        alert(`${m.customName} gagne +2 XP !`);
    } else if (selectedInj === "+3 XP") {
        m.xp = getFighterXP(m) + 3;
        alert(`${m.customName} gagne +3 XP !`);
    } else if (selectedInj === "Mort") {
        let isMercenary = (m.charId && m.charId.startsWith('merc_')) || 
                          (m.type || []).some(t => {
                              let lower = t.toLowerCase();
                              return lower.includes('merc') || lower.includes('hired') || lower.includes('bounty');
                          });

        if (isMercenary) {
            if (confirm(`${m.customName} (Mercenaire) est mort(e) ! Son équipement disparaît avec lui/elle.`)) {
                currentGang.members = currentGang.members.filter(x => x.id !== fighterId);
            }
        } else {
            if (confirm(`${m.customName} est mort(e) ! Son équipement va être transféré dans la réserve du gang.`)) {
                if (m.weapons) {
    m.weapons.forEach(w => {
        let wCost = w.cost_credits || w.cost || 0;
        currentGang.stash.push({ name: w.name, type: "Arme", cost: wCost });
        
        // Restitution de l'accessoire s'il y en a un
        if (w.accessory) {
            let accCost = w.accessory.cost_credits || w.accessory.cost || 0;
            currentGang.stash.push({ name: w.accessory.name, type: "Accessoire", cost: accCost });
        }
    });
}
                if (m.armor) currentGang.stash.push({ name: m.armor.name, type: "Armure", cost: m.armor.cost || 0 });
                if (m.equipment) {
                    m.equipment.forEach(e => {
                        currentGang.stash.push({ name: e.name, type: "Équipement", cost: e.cost || 0 });
                    });
                }
                currentGang.members = currentGang.members.filter(x => x.id !== fighterId);
            }
        }
    } else if (selectedInj.includes("Recovery")) {
        m.recovery = true;
        m.injuries.push(selectedInj);
    } else if (selectedInj === "Blessure critique") {
        m.critInj = true;
        m.injuries.push(selectedInj);
    } else {
        m.injuries.push(selectedInj);
    }

    safeSave();
    renderPostBattleView(document.getElementById('main-content'));
}

function addFighterXP(fighterId, amount) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (m) {
        m.xp = getFighterXP(m) + amount;
        safeSave();
        renderPostBattleView(document.getElementById('main-content'));
    }
}

function adjustReputation(delta) {
    if (!currentGang) return;
    if (currentGang.reputation === undefined) currentGang.reputation = 1;

    // Empêche la réputation de base de descendre en dessous de 1
    currentGang.reputation = Math.max(1, currentGang.reputation + delta);

    safeSave(); // Sauvegarde et met à jour le bandeau supérieur automatiquement
    renderPostBattleView(document.getElementById('main-content'));
}

// ==========================================
// REGISTRE CENTRAL & SESSION POST-CYCLE
// ==========================================
let postCycleSession = {
    assignments: {},
    territoryUsed: {}
};

function resetPostCycleSession() {
    postCycleSession = {
        assignments: {},
        territoryUsed: {}
    };
}

function startPostCycleView(container) {
    resetPostCycleSession();
    renderPostCycleView(container);
}

// ==========================================
// 2. SÉQUENCE POST-CYCLE
// ==========================================
function renderPostCycleView(container) {
    if (typeof appState !== 'undefined') appState.view = 'post-cycle';
    if (!container) container = document.getElementById('main-content');
    if (!container) return;

    if (!currentGang) {
        container.innerHTML = `<div class="card"><p>Aucun gang chargé.</p><button onclick="safeNavigate('gang-manage')">Retour</button></div>`;
        return;
    }

    updateGameTopBar();
    if (!currentGang.territories) currentGang.territories = [];
    if (!postCycleSession.territoryUsed) postCycleSession.territoryUsed = {};

    let html = `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                <h2>Séquence Post-Cycle — ${currentGang.name}</h2>
                <button class="btn btn-cyan" onclick="openStashModal()">📦 Réserve du Gang (Stash)</button>
            </div>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <button class="btn" onclick="safeNavigate('gang-manage')">← Retour Gestion du Gang</button>
                <button class="btn btn-cyan" onclick="if(confirm('Réinitialiser toutes les actions et territoires pour un nouveau cycle ?')) { resetPostCycleSession(); renderPostCycleView(); }">🔄 Nouveau Cycle / Réinitialiser</button>
            </div>
            <hr style="margin: 15px 0; border-color: #333;">

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background:var(--bg-dark, #111); padding:12px; border-radius:6px;">
                    <h3>Actions Spéciales</h3>
                    <button class="btn" style="width:100%; text-align:left; margin-bottom:8px;" onclick="actionMedicalEscort()">
                        🏥 <strong>Escorte Médicale</strong> (30 cr)<br>
                        <small>Un Leader/Champion accompagne un blessé critique</small>
                    </button>
                    <button class="btn" style="width:100%; text-align:left; margin-bottom:8px;" onclick="actionBionics()">
                        🦾 <strong>Pose de Bioniques</strong> (50 cr)<br>
                        <small>Soigner une blessure spécifique sur un guerrier</small>
                    </button>
                    <button class="btn" style="width:100%; text-align:left; margin-bottom:8px;" onclick="actionTerritoryWork()">
                        ⛏️ <strong>Travail sur les Territoires</strong> (+5 cr / guerrier)<br>
                        <small>Leader, Champion, Ganger ou Prospect (Max 5)</small>
                    </button>
                    <button class="btn" style="width:100%; text-align:left; margin-bottom:8px;" onclick="actionTraining()">
                        🏋️ <strong>Entraînement</strong> (+2 XP / guerrier)<br>
                        <small>Tous les guerriers disponibles</small>
                    </button>
                    <button class="btn btn-cyan" style="width:100%; text-align:left;" onclick="collectAllTerritoryIncome()">
                        💰 <strong>Collecte des Territoires non exploités</strong><br>
                        <small>Récolter les crédits automatiques des territoires disponibles</small>
                    </button>
                </div>

                <div style="background:var(--bg-dark, #111); padding:12px; border-radius:6px;">
                    <h3>Trading Post</h3>
                    <p>Sélectionnez vos envoyés pour générer vos TP et accéder au marché.</p>
                    <p>Crédits du gang : <strong style="color:var(--accent-cyan, #00d2d3);">${currentGang.credits || 0} cr</strong></p>
                    <button class="btn btn-cyan" style="width:100%;" onclick="openTradingPostSetupModal()">Visiter le Trading Post</button>
                </div>
            </div>

            <hr style="margin: 15px 0; border-color: #333;">
            
            <h3>🗺️ Territoires Possédés & Options</h3>
            <div style="background:var(--bg-dark, #111); padding:12px; border-radius:6px; margin-bottom:15px;">
    `;

    if (currentGang.territories.length === 0) {
        html += `<p style="color:#888;">Aucun territoire contrôlé pour le moment.</p>`;
    } else {
        currentGang.territories.forEach((terId, idx) => {
            let tDef = getTerritoryDef(terId) || { name: terId, desc: "Territoire inconnu" };
            let usage = postCycleSession.territoryUsed[idx];

            let statusMarkup = '';
            if (usage === 'credits') {
                statusMarkup = `<span style="color:#2ecc71; font-size:12px; font-weight:bold;">✅ Crédits récoltés</span>`;
            } else if (usage === 'option') {
                statusMarkup = `<span style="color:var(--accent-cyan); font-size:12px; font-weight:bold;">🎁 Option utilisée</span>`;
            } else if (tDef.optionType) {
                statusMarkup = `
                    <button class="btn btn-cyan" style="padding:4px 10px; font-size:12px;" onclick="claimTerritoryOption('${tDef.id || terId}', ${idx})">
                        🎁 ${tDef.optionText || "Utiliser l'option"}
                    </button>
                `;
            }

            html += `
                <div style="border:1px solid #333; padding:8px; margin-bottom:8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <div>
                        <strong>${tDef.name}</strong> — <small style="color:#ccc;">${tDef.desc || ''}</small>
                    </div>
                    <div>
                        ${statusMarkup}
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>

            <hr style="margin: 15px 0; border-color: #333;">
            <h3>Dépense d'XP & Avancées des Guerriers</h3>
            <div class="roster-list">
    `;

    (currentGang.members || []).forEach(m => {
        let pendingAdvances = getPendingAdvances(m);
        let btnLevelUp = pendingAdvances > 0 
            ? `<button class="btn btn-cyan" onclick="openLevelUpModal('${m.id}')">⭐ Montée de Niveau (${pendingAdvances})</button>`
            : `<button class="btn" disabled style="opacity:0.4; cursor:not-allowed;">⭐ Montée de Niveau (0)</button>`;

        html += `
            <div class="fighter-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                    <strong>${m.customName}</strong> (${m.charName})<br>
                    <small>XP : <strong>${getFighterXP(m)}</strong> | Rang : ${getFighterRank(getFighterXP(m))} | Coût : ${m.totalCost || m.cost || 0} cr</small>
                </div>
                <div style="display:flex; gap:6px;">
                    ${btnLevelUp}
                    <button class="btn btn-cyan" onclick="openSkillSelectModal('${m.id}')">Compétences</button>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ==========================================
// REGISTRE CENTRAL DES ACTIONS POST-CYCLE (1 ACTION / GUERRIER)
// ==========================================
function isFighterBusy(fId) {
    return postCycleSession.assignments[fId] || null;
}

// 1. ESCORTE MÉDICALE
function actionMedicalEscort() {
    if (!currentGang) return;
    let crits = (currentGang.members || []).filter(m => m.critInj && !m.recovery);
    if (crits.length === 0) return alert("Aucun guerrier n'a de blessure critique à soigner.");
    if ((currentGang.credits || 0) < 30) return alert("Crédits insuffisants (30 cr requis).");

    let target = crits.find(m => !isFighterBusy(m.id));
    if (!target) return alert("Tous les guerriers en blessure critique ont déjà effectué une action ce cycle.");

    let escort = currentGang.members.find(m => {
        if (m.id === target.id || m.recovery || isFighterBusy(m.id)) return false;
        let types = (m.type || []).map(t => t.toLowerCase());
        return types.includes("leader") || types.includes("champion");
    });

    if (!escort) return alert("Aucun Leader ou Champion disponible (non occupé) pour accompagner le blessé.");

    let choice = prompt(`Escorte médicale pour ${target.customName} par ${escort.customName} (Coût : 30 cr) :\n1 = Mort\n2 = Stabilisée (garder séquelle)\n3 = Guérie (part en Recovery)`);
    
    if (choice === '1') {
        currentGang.members = currentGang.members.filter(x => x.id !== target.id);
        delete postCycleSession.assignments[target.id];
        alert(`${target.customName} est décédée.`);
    } else if (choice === '2') {
        target.critInj = false;
        if (!target.injuries) target.injuries = [];
        target.injuries.push("Séquelle stabilisée");
        postCycleSession.assignments[target.id] = 'Escorte Médicale';
        postCycleSession.assignments[escort.id] = 'Escorte Médicale';
    } else if (choice === '3') {
        target.critInj = false;
        target.recovery = true;
        postCycleSession.assignments[target.id] = 'Escorte Médicale';
        postCycleSession.assignments[escort.id] = 'Escorte Médicale';
    } else {
        return;
    }

    currentGang.credits -= 30;
    safeSave();
    renderPostCycleView(document.getElementById('main-content'));
}

// 2. POSE DE BIONIQUES
function actionBionics() {
    if (!currentGang) return;
    let injuredMembers = (currentGang.members || []).filter(m => (m.injuries && m.injuries.length > 0) || m.critInj || m.recovery);

    if (injuredMembers.length === 0) return alert("Aucun combattant n'a de blessure permanente ou séquelle à soigner.");

    let html = `
        <p>Crédits du gang : <strong style="color:var(--accent-cyan, #00d2d3);">${currentGang.credits || 0} cr</strong> | Coût par pose : <strong>50 cr</strong></p>
        <p><small style="color:#e74c3c;">⚠️ Règle : 1 seule action post-cycle par guerrier.</small></p>
        <hr style="margin:10px 0; border-color:#333;">
        <div style="max-height:50vh; overflow-y:auto;">
    `;

    injuredMembers.forEach(m => {
        let busyReason = isFighterBusy(m.id);
        let isBusyOther = busyReason && busyReason !== 'Pose Bionique';

        html += `
            <div style="border:1px solid #444; padding:8px; margin-bottom:8px; border-radius:4px; background:#111; ${isBusyOther ? 'opacity:0.4;' : ''}">
                <strong>${m.customName}</strong> (${m.charName})
                ${isBusyOther ? `<small style="color:#e74c3c; margin-left:10px;">Occupé : ${busyReason}</small>` : ''}
                <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
        `;

        if (m.critInj) {
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#2a0808; padding:4px; border-radius:3px;">
                    <small style="color:#e74c3c;">Blessure Critique</small>
                    <button class="btn btn-cyan" ${isBusyOther ? 'disabled' : ''} style="padding:2px 6px; font-size:11px;" onclick="healSpecificInjury('${m.id}', 'critInj')">Soigner (-50 cr)</button>
                </div>
            `;
        }

        if (m.recovery) {
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#2a2008; padding:4px; border-radius:3px;">
                    <small style="color:#f39c12;">En Convalescence (Recovery)</small>
                    <button class="btn btn-cyan" ${isBusyOther ? 'disabled' : ''} style="padding:2px 6px; font-size:11px;" onclick="healSpecificInjury('${m.id}', 'recovery')">Soigner (-50 cr)</button>
                </div>
            `;
        }

        (m.injuries || []).forEach((injName, idx) => {
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#222; padding:4px; border-radius:3px;">
                    <small style="color:#aaa;">${injName}</small>
                    <button class="btn btn-cyan" ${isBusyOther ? 'disabled' : ''} style="padding:2px 6px; font-size:11px;" onclick="healSpecificInjury('${m.id}', ${idx})">Soigner (-50 cr)</button>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    html += `</div><br><button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Annuler</button>`;
    if (typeof openModal === 'function') openModal("🦾 Pose de Bioniques", html);
}

function healSpecificInjury(fighterId, targetType) {
    if (!currentGang) return;
    if ((currentGang.credits || 0) < 50) return alert("Crédits insuffisants (50 cr requis).");

    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;

    currentGang.credits -= 50;
    postCycleSession.assignments[m.id] = 'Pose Bionique';

    if (targetType === 'critInj') m.critInj = false;
    else if (targetType === 'recovery') m.recovery = false;
    else if (typeof targetType === 'number' && m.injuries) m.injuries.splice(targetType, 1);

    safeSave();
    alert(`Traitement bionique appliqué avec succès sur ${m.customName} !`);
    if (typeof closeModal === 'function') closeModal();
    renderPostCycleView(document.getElementById('main-content'));
}

// 3. TRAVAIL SUR LES TERRITOIRES
function actionTerritoryWork() {
    if (!currentGang || !currentGang.members) return;

    let eligible = currentGang.members.filter(m => {
        if (m.recovery) return false;
        let types = (m.type || []).map(t => t.toLowerCase());
        return types.some(t => t.includes("leader") || t.includes("champion") || t.includes("ganger") || t.includes("prospect") || t.includes("juve"));
    });

    let html = `
        <p><small>Sélectionnez jusqu'à <strong>5 combattants</strong> (+5 cr par guerrier).</small></p>
        <p><small style="color:#e74c3c;">⚠️ Règle : 1 seule action post-cycle par guerrier.</small></p>
        <hr style="margin:10px 0; border-color:#333;">
        <div style="max-height:50vh; overflow-y:auto;">
    `;

    eligible.forEach(m => {
        let busyReason = isFighterBusy(m.id);
        let isWorking = busyReason === 'Travail Territoires';
        let isBusyOther = busyReason && busyReason !== 'Travail Territoires';

        html += `
            <div style="background:#111; border:1px solid #333; padding:8px; border-radius:5px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; ${isBusyOther ? 'opacity:0.4;' : ''}">
                <div>
                    <strong style="color:var(--accent-cyan);">${m.customName || m.charName}</strong> 
                    <small style="color:#aaa;">(${(m.type || []).join(', ')})</small>
                    ${isBusyOther ? `<br><small style="color:#e74c3c;">Occupé : ${busyReason}</small>` : ''}
                </div>
                <input type="checkbox" class="work-fighter-cb" value="${m.id}" ${isWorking ? 'checked' : ''} ${isBusyOther ? 'disabled' : ''} onchange="limitTerritoryWorkCB(this)" style="transform:scale(1.2); cursor:pointer;">
            </div>
        `;
    });

    html += `
        </div><br>
        <button class="btn btn-cyan" onclick="confirmTerritoryWork()">Valider le travail</button>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Annuler</button>
    `;

    if (typeof openModal === 'function') openModal("⛏️ Travail sur les Territoires", html);
}

function limitTerritoryWorkCB(changedCb) {
    if (document.querySelectorAll('.work-fighter-cb:checked').length > 5) {
        changedCb.checked = false;
        alert("Maximum 5 guerriers peuvent travailler.");
    }
}

function confirmTerritoryWork() {
    let selectedIds = Array.from(document.querySelectorAll('.work-fighter-cb:checked')).map(cb => cb.value);
    let newlyAssigned = 0, unassigned = 0;

    (currentGang.members || []).forEach(m => {
        let wasWorking = postCycleSession.assignments[m.id] === 'Travail Territoires';
        let isSelected = selectedIds.includes(m.id);

        if (isSelected && !wasWorking) {
            postCycleSession.assignments[m.id] = 'Travail Territoires';
            newlyAssigned++;
        } else if (!isSelected && wasWorking) {
            delete postCycleSession.assignments[m.id];
            unassigned++;
        }
    });

    let creditDiff = (newlyAssigned * 5) - (unassigned * 5);
    currentGang.credits = Math.max(0, (currentGang.credits || 0) + creditDiff);

    safeSave();
    if (typeof closeModal === 'function') closeModal();
    renderPostCycleView(document.getElementById('main-content'));
}

// 4. ENTRAÎNEMENT
function actionTraining() {
    if (!currentGang || !currentGang.members) return;

    let eligible = currentGang.members.filter(m => !m.recovery);

    let html = `
        <p><small>Chaque combattant sélectionné gagne <strong>+2 XP</strong>.</small></p>
        <p><small style="color:#e74c3c;">⚠️ Règle : 1 seule action post-cycle par guerrier.</small></p>
        <hr style="margin:10px 0; border-color:#333;">
        <div style="max-height:50vh; overflow-y:auto;">
    `;

    eligible.forEach(m => {
        let busyReason = isFighterBusy(m.id);
        let isTraining = busyReason === 'Entraînement';
        let isBusyOther = busyReason && busyReason !== 'Entraînement';

        html += `
            <div style="background:#111; border:1px solid #333; padding:8px; border-radius:5px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; ${isBusyOther ? 'opacity:0.4;' : ''}">
                <div>
                    <strong style="color:var(--accent-cyan);">${m.customName || m.charName}</strong> 
                    <small style="color:#aaa;">(XP actuelle : ${getFighterXP(m)})</small>
                    ${isBusyOther ? `<br><small style="color:#e74c3c;">Occupé : ${busyReason}</small>` : ''}
                </div>
                <input type="checkbox" class="training-fighter-cb" value="${m.id}" ${isTraining ? 'checked' : ''} ${isBusyOther ? 'disabled' : ''} style="transform:scale(1.2); cursor:pointer;">
            </div>
        `;
    });

    html += `
        </div><br>
        <button class="btn btn-cyan" onclick="confirmTraining()">Valider l'entraînement</button>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Annuler</button>
    `;

    if (typeof openModal === 'function') openModal("🏋️ Entraînement des Guerriers", html);
}

function confirmTraining() {
    let selectedIds = Array.from(document.querySelectorAll('.training-fighter-cb:checked')).map(cb => cb.value);

    (currentGang.members || []).forEach(m => {
        let wasTraining = postCycleSession.assignments[m.id] === 'Entraînement';
        let isSelected = selectedIds.includes(m.id);

        if (isSelected && !wasTraining) {
            postCycleSession.assignments[m.id] = 'Entraînement';
            m.xp = getFighterXP(m) + 2;
        } else if (!isSelected && wasTraining) {
            delete postCycleSession.assignments[m.id];
            m.xp = Math.max(0, getFighterXP(m) - 2);
        }
    });

    safeSave();
    if (typeof closeModal === 'function') closeModal();
    renderPostCycleView(document.getElementById('main-content'));
}

// 5. TRADING POST
let tradingPostSession = {
    selectedFighterIds: [],
    availableTP: 0,
    tpLog: []
};

function openTradingPostSetupModal() {
    if (!currentGang) return;
    tradingPostSession.selectedFighterIds = [];
    tradingPostSession.availableTP = 0;
    tradingPostSession.tpLog = [];

    let eligibleFighters = (currentGang.members || []).filter(m => {
        let types = (m.type || []).map(t => t.toLowerCase());
        let isLeaderOrChamp = types.includes("leader") || types.includes("champion");
        let hasConnected = (m.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === "connected");
        return isLeaderOrChamp || hasConnected;
    });

    let html = `
        <div style="max-height:60vh; overflow-y:auto;">
            <p><small>Sélectionnez les combattants qui se rendent au Trading Post :</small></p>
            <p><small style="color:#e74c3c;">⚠️ Règle : 1 seule action post-cycle par guerrier.</small></p>
            <hr style="margin:10px 0; border-color:#333;">
    `;

    if (eligibleFighters.length === 0) {
        html += `<p style="color:#888;">Aucun Leader, Champion ou membre avec la compétence "Connected" disponible.</p>`;
    } else {
        eligibleFighters.forEach(m => {
            let types = (m.type || []).map(t => t.toLowerCase());
            let isLeader = types.includes("leader");
            let isChampion = types.includes("champion");
            let hasConnected = (m.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === "connected");

            let busyReason = isFighterBusy(m.id);
            let isBusyOther = busyReason && busyReason !== 'Trading Post';
            let isSelected = busyReason === 'Trading Post';

            let infoParts = [];
            if (isLeader) infoParts.push("Leader: 2 TP");
            else if (isChampion) infoParts.push("Champion: 1 TP");
            if (hasConnected) infoParts.push("Connected: +1 TP");

            html += `
                <div style="background:#111; border:1px solid #333; padding:8px; border-radius:5px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; ${isBusyOther ? 'opacity:0.4;' : ''}">
                    <div>
                        <strong style="color:var(--accent-cyan);">${m.customName || m.charName}</strong> 
                        <small style="color:#aaa;">(${infoParts.join(' | ')})</small>
                        ${isBusyOther ? `<br><small style="color:#e74c3c;">Occupé : ${busyReason}</small>` : ''}
                    </div>
                    <input type="checkbox" id="tp-fighter-${m.id}" ${isSelected ? 'checked' : ''} ${isBusyOther ? 'disabled' : ''} onchange="toggleTradingPostFighter('${m.id}')" style="transform:scale(1.2); cursor:pointer;">
                </div>
            `;
        });
    }

    let techBazaarCount = (currentGang.territories || []).filter(t => t.toLowerCase() === "tech bazaar" || t.toLowerCase() === "ter_tech_bazaar").length;
    if (techBazaarCount > 0) {
        html += `<p style="color:var(--accent-purple); font-size:12px; margin-top:10px;">🚩 Territoires Tech Bazaar (${techBazaarCount}) : +${techBazaarCount} TP automatique(s).</p>`;
    }

    html += `
        </div><br>
        <button class="btn btn-cyan" onclick="confirmTradingPostFixedTP()">Calculer les TP et ouvrir le marché</button>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Annuler</button>
    `;

    if (typeof openModal === 'function') openModal("🏬 Visite au Trading Post", html);
}

function toggleTradingPostFighter(fId) {
    let idx = tradingPostSession.selectedFighterIds.indexOf(fId);
    if (idx >= 0) {
        tradingPostSession.selectedFighterIds.splice(idx, 1);
    } else {
        tradingPostSession.selectedFighterIds.push(fId);
    }
}

function confirmTradingPostFixedTP() {
    let totalTP = 0;
    let log = [];

    Object.keys(postCycleSession.assignments).forEach(fId => {
        if (postCycleSession.assignments[fId] === 'Trading Post') {
            delete postCycleSession.assignments[fId];
        }
    });

    tradingPostSession.selectedFighterIds.forEach(fId => {
        let m = currentGang.members.find(x => x.id === fId);
        if (!m) return;

        postCycleSession.assignments[m.id] = 'Trading Post';

        let types = (m.type || []).map(t => t.toLowerCase());
        let isLeader = types.includes("leader");
        let isChampion = types.includes("champion");
        let hasConnected = (m.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === "connected");

        let fighterTP = 0;
        let details = [];

        if (isLeader) { fighterTP += 2; details.push("+2 TP Leader"); }
        else if (isChampion) { fighterTP += 1; details.push("+1 TP Champion"); }

        if (hasConnected) { fighterTP += 1; details.push("+1 TP Connected"); }

        totalTP += fighterTP;
        log.push(`${m.customName || m.charName} : ${fighterTP} TP (${details.join(', ')})`);
    });

    let techBazaarCount = (currentGang.territories || []).filter(t => t.toLowerCase() === "tech bazaar" || t.toLowerCase() === "ter_tech_bazaar").length;
    if (techBazaarCount > 0) {
        totalTP += techBazaarCount;
        log.push(`Territoire(s) Tech Bazaar : +${techBazaarCount} TP`);
    }

    tradingPostSession.availableTP = totalTP;
    tradingPostSession.tpLog = log;

    if (typeof closeModal === 'function') closeModal();
    renderTradingPostView();
}

function renderTradingPostView() {
    let dbWeapons = (typeof db !== 'undefined' && db.weapons) ? db.weapons.filter(w => 
        !w.is_merc_weapon && 
        !w.default_for && 
        !w.specific_to && 
        !w.requires_equip
    ) : [];
    
    let dbEquip = (typeof db !== 'undefined' && db.equipment) ? db.equipment.filter(e => 
        !e.specific_to
    ) : [];

    let html = `
        <div style="background:#111; padding:10px; border-radius:5px; border:1px solid var(--accent-purple); margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>Crédits :</strong> <span style="color:#2ecc71; font-size:16px;">${currentGang.credits || 0} cr</span> | 
                <strong>TP disponibles :</strong> <span style="color:var(--accent-cyan); font-size:16px;">${tradingPostSession.availableTP} TP</span>
            </div>
            <button class="btn btn-cyan" onclick="openTradingPostSetupModal()">🔄 Modifier les envoyés</button>
        </div>
    `;

    if (tradingPostSession.tpLog.length > 0) {
        html += `
            <details style="margin-bottom:15px; background:#181818; padding:8px; border-radius:4px; font-size:12px;">
                <summary style="cursor:pointer; color:#aaa;">Détails des TP générés</summary>
                <ul style="margin-top:5px; padding-left:15px; color:#bbb;">
                    ${tradingPostSession.tpLog.map(l => `<li>${l}</li>`).join('')}
                </ul>
            </details>
        `;
    }

    html += `
        <div style="max-height:50vh; overflow-y:auto; padding-right:5px;">
            <h4>Armes du Marché</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:8px; margin-bottom:20px;">
    `;

    dbWeapons.forEach(w => {
        let tpCost = w.cost_tp !== undefined ? w.cost_tp : (w.rarity || 0);
        let credCost = w.cost_credits || w.cost || w.price || 0;
        let canAfford = (currentGang.credits || 0) >= credCost && tradingPostSession.availableTP >= tpCost;
        let cleanName = w.name.replace(/'/g, "\\'");
        
        let prof = (w.profiles && w.profiles[0]) ? w.profiles[0] : null;
        let statsText = prof ? `Portée: ${prof.SR}/${prof.LR} | F:${prof.S} | AP:${prof.AP} | D:${prof.L}${prof.traits ? ` | ${prof.traits}` : ''}` : '';

        html += `
            <div style="background:#1a1a1a; border:1px solid #333; padding:8px; border-radius:5px; display:flex; justify-content:space-between; align-items:center; ${!canAfford ? 'opacity:0.5;' : ''}">
                <div>
                    <strong style="color:#fff;">${w.name}</strong><br>
                    <small style="color:#aaa;">Coût : ${credCost} cr | Rareté : <span style="color:var(--accent-cyan); font-weight:bold;">${tpCost} TP</span></small>
                    ${statsText ? `<br><small style="color:#888; font-size:11px;">${statsText}</small>` : ''}
                </div>
                <button class="${canAfford ? 'btn btn-cyan' : 'btn'}" ${!canAfford ? 'disabled' : ''} style="padding:4px 10px; font-size:12px;" onclick="buyTradingPostItem('Arme', '${cleanName}', ${credCost}, ${tpCost})">Acheter</button>
            </div>
        `;
    });

    html += `
            </div>
            <h4>Équipements & Accessoires</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:8px; margin-bottom:15px;">
    `;

    dbEquip.forEach(e => {
        let tpCost = e.cost_tp !== undefined ? e.cost_tp : (e.rarity || 0);
        let credCost = e.cost_credits || e.cost || e.price || 0;
        let canAfford = (currentGang.credits || 0) >= credCost && tradingPostSession.availableTP >= tpCost;
        let cleanName = e.name.replace(/'/g, "\\'");
        let rawType = e.type || 'Équipement';
        let cleanType = rawType.replace(/'/g, "\\'");

        html += `
            <div style="background:#1a1a1a; border:1px solid #333; padding:8px; border-radius:5px; display:flex; justify-content:space-between; align-items:center; ${!canAfford ? 'opacity:0.5;' : ''}">
                <div>
                    <strong style="color:#fff;">${e.name}</strong> <small style="color:#888;">(${rawType})</small><br>
                    <small style="color:#aaa;">Coût : ${credCost} cr | Rareté : <span style="color:var(--accent-cyan); font-weight:bold;">${tpCost} TP</span></small>
                    ${e.effect ? `<br><small style="color:#888; font-size:11px;">${e.effect}</small>` : ''}
                </div>
                <button class="${canAfford ? 'btn btn-cyan' : 'btn'}" ${!canAfford ? 'disabled' : ''} style="padding:4px 10px; font-size:12px;" onclick="buyTradingPostItem('${cleanType}', '${cleanName}', ${credCost}, ${tpCost})">Acheter</button>
            </div>
        `;
    });

    html += `
            </div>
        </div>
        <br>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer le Trading Post</button>
    `;

    if (typeof openModal === 'function') openModal("🏬 Trading Post du Sous-Monde", html);
}

function buyTradingPostItem(category, itemName, credCost, tpCost) {
    if (!currentGang) return;
    if (!currentGang.stash) currentGang.stash = [];

    if ((currentGang.credits || 0) < credCost) return alert("Crédits insuffisants !");
    if (tradingPostSession.availableTP < tpCost) return alert("Points de TP insuffisants !");

    currentGang.credits -= credCost;
    tradingPostSession.availableTP -= tpCost;

    // Récupération de la définition complète en BDD
    let itemDef = null;
    if (typeof db !== 'undefined') {
        if (category === 'Arme' && db.weapons) {
            itemDef = db.weapons.find(w => w.name === itemName);
        } else if (db.equipment) {
            itemDef = db.equipment.find(e => e.name === itemName);
        }
    }

    let stashItem = itemDef ? JSON.parse(JSON.stringify(itemDef)) : { name: itemName, cost: credCost };
    stashItem.cost = credCost;

    // Normalisation du type pour la compatibilité avec app.js
    let lowerCat = (category || '').toLowerCase();
    let lowerName = (itemName || '').toLowerCase();

    if (lowerCat.includes('accessoire') || lowerName.includes('lunette') || lowerName.includes('viseur') || lowerName.includes('silencieux')) {
        stashItem.type = "Accessoire d'arme";
    } else if (lowerCat.includes('armure')) {
        stashItem.type = "Armure";
    } else if (category === 'Arme') {
        stashItem.type = "Arme";
    } else {
        stashItem.type = stashItem.type || category || "Équipement";
    }

    currentGang.stash.push(stashItem);

    safeSave();
    renderTradingPostView();
}

// ==========================================
// MONTÉE DE NIVEAU & AVANCÉES
// ==========================================
function openLevelUpModal(fighterId) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;

    let xp = getFighterXP(m);
    let rank = getFighterRank(xp);
    let pending = getPendingAdvances(m);

    if (pending <= 0) return alert("Aucune montée de niveau disponible pour ce guerrier.");

    let statBonuses = [
        { label: "+1 Ld", stat: "Ld", cost: 5 },
        { label: "+1 Int", stat: "Int", cost: 5 },
        { label: "+1 Cl", stat: "Cl", cost: 5 },
        { label: "+1 Wil", stat: "Wil", cost: 5 },
        { label: "+1 I", stat: "I", cost: 10 },
        { label: "+1 M", stat: "M", cost: 10 },
        { label: "+1 WS", stat: "WS", cost: 15 },
        { label: "+1 BS", stat: "BS", cost: 15 },
        { label: "+1 S", stat: "S", cost: 20 },
        { label: "+1 T", stat: "T", cost: 20 },
        { label: "+1 W", stat: "W", cost: 20 },
        { label: "+1 A", stat: "A", cost: 20 },
        { label: "+1 Sv", stat: "Sv", cost: 20 }
    ];

    let skillsDB = (typeof db !== 'undefined' && db.skills) ? db.skills : {};
    let skillOptionsHTML = '';
    Object.keys(skillsDB).forEach(cat => {
        skillOptionsHTML += `<optgroup label="${cat.toUpperCase()}">`;
        skillsDB[cat].forEach(sk => {
            let skName = typeof sk === 'string' ? sk : sk.name;
            skillOptionsHTML += `<option value="${skName}">${skName}</option>`;
        });
        skillOptionsHTML += `</optgroup>`;
    });

    let html = `
        <div style="max-height:65vh; overflow-y:auto; padding-right:5px;">
            <p>Combattant : <strong style="color:var(--accent-cyan);">${m.customName}</strong> (${m.charName})</p>
            <p>XP : <strong>${xp}</strong> | Rang : <strong>${rank}</strong> | Avancées à choisir : <strong style="color:var(--accent-purple); font-size:16px;">${pending}</strong></p>
            <hr style="margin:10px 0; border-color:#333;">

            <h4>Option A : Augmentation de Caractéristique</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:15px;">
                ${statBonuses.map(b => `
                    <button class="btn" style="padding:6px; font-size:12px; text-align:left;" onclick="confirmStatLevelUp('${m.id}', '${b.stat}', ${b.cost})">
                        <strong>${b.label}</strong> <span style="color:#2ecc71;">(+${b.cost} cr)</span>
                    </button>
                `).join('')}
            </div>

            <hr style="margin:10px 0; border-color:#333;">

            <h4>Option B : Choisir une Compétence</h4>
            <div style="background:#111; padding:10px; border-radius:5px; border:1px solid #333;">
                <label style="display:block; margin-bottom:4px; font-size:12px;">Compétence :</label>
                <select id="levelup-skill-select" style="width:100%; padding:6px; margin-bottom:8px; font-size:12px;">
                    ${skillOptionsHTML}
                </select>

                <label style="display:block; margin-bottom:4px; font-size:12px;">Valeur ajoutée au guerrier :</label>
                <select id="levelup-skill-cost" style="width:100%; padding:6px; margin-bottom:10px; font-size:12px;">
                    <option value="5">+5 crédits</option>
                    <option value="10" selected>+10 crédits</option>
                    <option value="15">+15 crédits</option>
                    <option value="30">+30 crédits</option>
                </select>

                <button class="btn btn-cyan" style="width:100%;" onclick="confirmSkillLevelUp('${m.id}')">Valider la Compétence</button>
            </div>
        </div>
        <br>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer</button>
    `;

    if (typeof openModal === 'function') openModal("⭐ Montée de Niveau", html);
}

function confirmStatLevelUp(fighterId, statKey, cost) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;

    applyStatUpgrade(m, statKey);
    m.totalCost = (m.totalCost || m.cost || 0) + cost;
    m.cost = (m.cost || 0) + cost;
    m.advancesCount = (m.advancesCount || 0) + 1;

    safeSave();
    alert(`Statistique ${statKey} augmentée (+${cost} cr au guerrier) !`);

    if (getPendingAdvances(m) > 0) {
        openLevelUpModal(fighterId);
    } else {
        if (typeof closeModal === 'function') closeModal();
        refreshCurrentView();
    }
}

function confirmSkillLevelUp(fighterId) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;

    let skillSelect = document.getElementById('levelup-skill-select');
    let costSelect = document.getElementById('levelup-skill-cost');

    if (!skillSelect || !costSelect) return;

    let skillName = skillSelect.value;
    let cost = parseInt(costSelect.value) || 0;

    if (!m.skills) m.skills = [];

    let foundObj = null;
    if (typeof db !== 'undefined' && db.skills) {
        for (let cat in db.skills) {
            let match = db.skills[cat].find(sk => (typeof sk === 'string' ? sk : sk.name) === skillName);
            if (match) { foundObj = match; break; }
        }
    }

    m.skills.push(foundObj ? JSON.parse(JSON.stringify(foundObj)) : skillName);
    m.totalCost = (m.totalCost || m.cost || 0) + cost;
    m.cost = (m.cost || 0) + cost;
    m.advancesCount = (m.advancesCount || 0) + 1;

    safeSave();
    alert(`Compétence ${skillName} ajoutée (+${cost} cr au guerrier) !`);

    if (getPendingAdvances(m) > 0) {
        openLevelUpModal(fighterId);
    } else {
        if (typeof closeModal === 'function') closeModal();
        refreshCurrentView();
    }
}

function refreshCurrentView() {
    let container = document.getElementById('main-content');
    if (typeof appState !== 'undefined' && appState.view === 'post-battle') {
        renderPostBattleView(container);
    } else {
        renderPostCycleView(container);
    }
}

function openStatUpgradeModal(fighterId) {
    openLevelUpModal(fighterId);
}

function openSkillSelectModal(fighterId) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;

    let charDef = (typeof db !== 'undefined' && db.characters) ? db.characters.find(c => c.name === m.charName || c.id === m.charId) : null;
    let primaries = charDef ? (charDef.primary_skills || []) : [];
    let secondaries = charDef ? (charDef.secondary_skills || []) : [];

    const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    let primaryNorms = primaries.map(s => norm(s));
    let secondaryNorms = secondaries.map(s => norm(s));

    let html = `<h3>Compétences pour ${m.customName}</h3><div style="max-height:60vh; overflow-y:auto; padding-right:5px;">`;

    let skillsDB = (typeof db !== 'undefined' && db.skills) ? db.skills : {};
    Object.keys(skillsDB).forEach(cat => {
        let catNorm = norm(cat);
        let isPrimary = primaryNorms.includes(catNorm);
        let isSecondary = secondaryNorms.includes(catNorm);

        html += `
            <div style="border:1px solid #333; padding:10px; margin-bottom:10px; border-radius:4px; background:#111;">
                <strong style="text-transform:uppercase; color:${isPrimary ? 'var(--accent-cyan)' : (isSecondary ? 'var(--accent-purple)' : '#aaa')}; display:block; margin-bottom:8px;">
                    ${cat} ${isPrimary ? '(Primaire)' : (isSecondary ? '(Secondaire)' : '(Autre)')}
                </strong>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 12px;">
                    ${skillsDB[cat].map(sk => {
                        let skName = typeof sk === 'string' ? sk : sk.name;
                        let checked = (m.skills || []).some(s => (typeof s === 'string' ? s : s.name) === skName) ? 'checked' : '';
                        return `
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:13px; color:#ddd;">
                                <input type="checkbox" ${checked} onchange="toggleFighterSkill('${m.id}', '${skName}', this.checked)" style="margin:0; width:16px; height:16px; flex-shrink:0; cursor:pointer;">
                                <span>${skName}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });

    html += `</div><br><button class="btn btn-cyan" onclick="if (typeof closeModal==='function') closeModal()">Valider & Fermer</button>`;
    if (typeof openModal === 'function') openModal("Menu des Compétences", html);
}

function toggleFighterSkill(fighterId, skillName, add) {
    if (!currentGang) return;
    let m = currentGang.members.find(x => x.id === fighterId);
    if (!m) return;
    if (!m.skills) m.skills = [];

    if (add) {
        if (!m.skills.some(s => (typeof s === 'string' ? s : s.name) === skillName)) {
            let foundObj = null;
            if (typeof db !== 'undefined' && db.skills) {
                for (let cat in db.skills) {
                    let match = db.skills[cat].find(sk => (typeof sk === 'string' ? sk : sk.name) === skillName);
                    if (match) { foundObj = match; break; }
                }
            }
            m.skills.push(foundObj ? JSON.parse(JSON.stringify(foundObj)) : skillName);
        }
    } else {
        m.skills = m.skills.filter(s => (typeof s === 'string' ? s : s.name) !== skillName);
    }
    safeSave();
}

// ==========================================
// ACTIONS ET RÉCOLTE DE TERRITOIRES
// ==========================================

// 1. Récolte automatique des revenus (exclut les territoires déjà exploités)
function collectAllTerritoryIncome() {
    if (!currentGang || !currentGang.territories) return;
    if (!postCycleSession.territoryUsed) postCycleSession.territoryUsed = {};

    let totalIncome = 0;
    let collectedCount = 0;

    currentGang.territories.forEach((terId, idx) => {
        if (postCycleSession.territoryUsed[idx]) return;

        let tDef = getTerritoryDef(terId);
        if (tDef && tDef.income) {
            totalIncome += tDef.income;
            postCycleSession.territoryUsed[idx] = 'credits';
            collectedCount++;
        }
    });

    if (collectedCount > 0) {
        currentGang.credits += totalIncome;
        alert(`Récolte effectuée (${collectedCount} territoire(s)) : +${totalIncome} crédits ajoutés aux caisses du gang !`);
        safeSave();
        renderPostCycleView(document.getElementById('main-content'));
    } else {
        alert("Aucun territoire disponible pour la récolte (tous déjà exploités ce cycle).");
    }
}

// 2. Traitement des options de territoires (Recrutement à prix réduit)
// Fonction utilitaire pour ajouter un équipement directement au Stash
// Fonction utilitaire pour ajouter un ou plusieurs équipements au Stash
function addEquipmentToStash(itemName, defaultCost = 15, count = 1) {
    if (!currentGang) return;
    if (!currentGang.stash) currentGang.stash = [];

    let equipDef = (typeof db !== 'undefined' && db.equipment) 
        ? db.equipment.find(e => e.name.toLowerCase().includes(itemName.toLowerCase()) || itemName.toLowerCase().includes(e.name.toLowerCase())) 
        : null;

    let finalName = equipDef ? equipDef.name : itemName;
    let finalCost = equipDef ? (equipDef.cost_credits || equipDef.cost || equipDef.price || defaultCost) : defaultCost;

    for (let i = 0; i < count; i++) {
        currentGang.stash.push({
            name: finalName,
            type: "Équipement",
            cost: finalCost
        });
    }
}

// Traitement des options de territoires (Recrutement & Matériel gratuit)
function claimTerritoryOption(terId, idx) {
    if (!currentGang) return;
    if (!postCycleSession.territoryUsed) postCycleSession.territoryUsed = {};

    if (postCycleSession.territoryUsed[idx]) {
        return alert("Ce territoire a déjà été exploité pendant ce cycle.");
    }

    let tDef = getTerritoryDef(terId);
    let terKey = (tDef ? (tDef.id || tDef.name) : terId).toLowerCase();
    let optType = (tDef && tDef.optionType) ? tDef.optionType.toLowerCase() : '';

    // A. Mine Working / Shaft -> 2 Respirateurs gratuits
    if (optType === 'free_respirator' || optType === 'add_respirator' || terKey.includes('mine') || terKey.includes('respirat')) {
        addEquipmentToStash('Respirateur', 15, 2);
        postCycleSession.territoryUsed[idx] = 'option';
        safeSave();
        alert("2 Respirateurs ont été ajoutés à la réserve du gang !");
        renderPostCycleView(document.getElementById('main-content'));
        return;
    }

    // B. Promethium Cache -> 3 Combinaisons de protection gratuites
    if (optType === 'free_hazmat' || optType === 'add_hazmat' || optType === 'free_promethium' || terKey.includes('promethium') || terKey.includes('hazmat')) {
        addEquipmentToStash('Combinaison de protection', 15, 3);
        postCycleSession.territoryUsed[idx] = 'option';
        safeSave();
        alert("3 Combinaisons de protection ont été ajoutées à la réserve du gang !");
        renderPostCycleView(document.getElementById('main-content'));
        return;
    }

    // C. Réductions Mercenaires & Recrutement
    const mercDiscountMap = {
        'discount_doc': { charId: 'merc_rogue_doc', discount: 30 },
        'discount_ammojack': { charId: 'merc_ammo_jack', discount: 30 },
        'discount_slopper': { charId: 'merc_slopper', discount: 30 },
        'discount_watcher': { charId: 'merc_hive_watcher', discount: 30 },
        'discount_runner': { charId: 'merc_dome_runner', discount: 30 }
    };

    if (optType === 'discount_ganger') {
        let gangGangers = (typeof db !== 'undefined' && db.characters) ? db.characters.filter(c => 
            !c.id.startsWith('merc_') && 
            (c.type || []).some(t => t.toLowerCase() === 'ganger')
        ) : [];

        if (gangGangers.length === 0) {
            return alert("Aucun profil de Ganger trouvé dans ce gang.");
        }

        if (gangGangers.length === 1) {
            executeDiscountRecruitment(gangGangers[0], 25, idx);
        } else {
            let html = `<h3>Recruter un Ganger (Ristourne Settlement -25c)</h3><br>`;
            gangGangers.forEach(g => {
                let finalCost = Math.max(0, g.cost - 25);
                html += `
                    <div class="fighter-item">
                        <span><strong>${g.name}</strong> — Coût réduit : ${finalCost}c <small style="text-decoration:line-through; color:#888;">(${g.cost}c)</small></span>
                        <button class="btn btn-cyan" onclick="executeDiscountRecruitmentById('${g.id}', 25, ${idx})">Recruter</button>
                    </div>
                `;
            });
            openModal("Choix du Ganger à recruter", html);
        }
    } 
    else if (mercDiscountMap[optType]) {
        let targetInfo = mercDiscountMap[optType];
        let charDef = (typeof db !== 'undefined' && db.characters) ? db.characters.find(c => c.id === targetInfo.charId) : null;
        if (!charDef) return alert("Profil introuvable.");

        executeDiscountRecruitment(charDef, targetInfo.discount, idx);
    } else {
        alert("Aucune option particulière configurée pour ce territoire.");
    }
}
function executeDiscountRecruitmentById(charId, discount, territoryIdx) {
    if (typeof closeModal === 'function') closeModal();
    let charDef = db.characters.find(c => c.id === charId);
    if (charDef) executeDiscountRecruitment(charDef, discount, territoryIdx);
}

function executeDiscountRecruitment(charDef, discount, territoryIdx) {
    let finalCost = Math.max(0, charDef.cost - discount);

    if (currentGang.credits < finalCost) {
        return alert(`Crédits insuffisants. Requis : ${finalCost}c | Disponible : ${currentGang.credits}c`);
    }

    let defaultWeapons = [];
    if (charDef.default_weapons) {
        charDef.default_weapons.forEach(wId => {
            let wObj = db.weapons.find(w => w.id === wId);
            if (wObj) defaultWeapons.push(JSON.parse(JSON.stringify(wObj)));
        });
    }

    let defaultEquip = [];
    if (charDef.default_equipment) {
        charDef.default_equipment.forEach(eId => {
            let eObj = db.equipment.find(e => e.id === eId);
            if (eObj) defaultEquip.push(JSON.parse(JSON.stringify(eObj)));
        });
    }

  let defaultSkills = [];
    if (charDef.starting_skill && charDef.starting_skill.trim() !== "" && !charDef.starting_skill.includes("choix") && !charDef.starting_skill.includes("selon")) {
        const norm = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        let skillNames = charDef.starting_skill.split(/\s+et\s+|,\s*|\/\s*/i);

        skillNames.forEach(rawName => {
            let cleanRaw = rawName.trim();
            if (!cleanRaw) return;

            let normRaw = norm(cleanRaw);
            let foundSkill = null;

            if (typeof db !== 'undefined' && db.skills) {
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
            }

            if (foundSkill) {
                defaultSkills.push(foundSkill);
            } else {
                defaultSkills.push({
                    id: "sk_start_" + (typeof generateId === 'function' ? generateId() : Math.random().toString(36).substr(2, 9)),
                    name: cleanRaw.charAt(0).toUpperCase() + cleanRaw.slice(1),
                    desc: "Compétence de départ"
                });
            }
        });
    }

    let newFighter = {
        id: generateId(),
        charId: charDef.id,
        charName: charDef.name,
        customName: charDef.name,
        type: charDef.type,
        stats: JSON.parse(JSON.stringify(charDef.stats)),
        weapons: defaultWeapons,
        equipment: defaultEquip,
        skills: defaultSkills,
        totalCost: charDef.cost
    };

    currentGang.credits -= finalCost;
    currentGang.members.push(newFighter);

    if (!postCycleSession.territoryUsed) postCycleSession.territoryUsed = {};
    if (territoryIdx !== undefined && territoryIdx !== null) {
        postCycleSession.territoryUsed[territoryIdx] = 'option';
    }

    safeSave();

    alert(`${charDef.name} a été recruté pour ${finalCost}c (réduction de ${discount}c appliquée) !`);
    renderPostCycleView(document.getElementById('main-content'));
}

function showConditionDetails(condName) {
    let desc = "Description non renseignée.";
    if (typeof db !== 'undefined' && db.conditions) {
        let key = Object.keys(db.conditions).find(k => k.toLowerCase() === condName.toLowerCase() || condName.toLowerCase().startsWith(k.toLowerCase()));
        if (key) desc = db.conditions[key];
    }
    openModal(`Condition : ${condName}`, `<p style="padding:10px; font-size:14px; line-height:1.5;">${desc}</p>`);
}

function openPdfModal(title, url) {
    // #navpanes=0 masque le volet de gauche, view=FitH ajuste sur la largeur
    let pdfUrl = `${url}#navpanes=0&toolbar=0&view=FitH`;

    let html = `
        <div style="height:85vh; width:100%;">
            <iframe src="${pdfUrl}" style="width:100%; height:100%; border:none;"></iframe>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <button class="btn btn-cyan" onclick="window.open('${url}', '_blank')">↗️ Ouvrir en grand (Onglet)</button>
            <button class="btn" onclick="closeModal()">Fermer</button>
        </div>
    `;
    openModal(title, html);
}

function saveMatchToHistory() {
    if (!currentGang) return;

    // 1. Saisie des variables
    let opponentName = document.getElementById('hist-opponent-name')?.value.trim() || 'Inconnu';
    let opponentGang = document.getElementById('hist-opponent-gang')?.value.trim() || 'Inconnu';
    let result = document.getElementById('hist-result')?.value || 'Égalité';

    let credPrimary = parseInt(document.getElementById('hist-cred-primary')?.value) || 0;
    let credSecondary = parseInt(document.getElementById('hist-cred-secondary')?.value) || 0;
    let totalCredits = credPrimary + credSecondary;

    let repChange = parseInt(document.getElementById('hist-rep')?.value) || 0;

    let gainedTer = document.getElementById('hist-ter-gained')?.value || '';
    let lostTerIdx = document.getElementById('hist-ter-lost')?.value;

    // 2. Gestion sécurisée des territoires
    let territorySummary = 'Aucun';
    if (!currentGang.territories) currentGang.territories = [];

    if (gainedTer !== '') {
        currentGang.territories.push(gainedTer);
        territorySummary = `+ ${gainedTer}`;
    } else if (lostTerIdx !== undefined && lostTerIdx !== '') {
        let idx = parseInt(lostTerIdx);
        if (!isNaN(idx) && idx >= 0 && idx < currentGang.territories.length) {
            let removed = currentGang.territories.splice(idx, 1)[0];
            territorySummary = `- ${removed}`;
        }
    }

    // 3. Application des crédits et de la réputation au gang
    currentGang.credits = (currentGang.credits || 0) + totalCredits;
    if (repChange !== 0) {
        currentGang.reputation = Math.max(1, (currentGang.reputation || 1) + repChange);
    }

    // 4. Archivage dans l'historique
    if (!currentGang.history) currentGang.history = [];
    currentGang.history.push({
        id: (typeof generateId === 'function') ? generateId() : Date.now().toString(),
        date: new Date().toLocaleDateString('fr-FR'),
        opponentName: opponentName,
        opponentGang: opponentGang,
        result: result,
        primaryCredits: credPrimary,
        secondaryCredits: credSecondary,
        totalCredits: totalCredits,
        repChange: repChange,
        territory: territorySummary
    });

    // 5. Sauvegarde & rechargement de la vue
    safeSave();
    updateGameTopBar();

    alert(`Partie enregistrée ! (${result} contre ${opponentName})`);
    renderPostBattleView(document.getElementById('main-content'));
}

function openMatchHistoryModal() {
    if (!currentGang) return;
    let history = currentGang.history || [];

    if (history.length === 0) {
        return openModal("📜 Historique des Parties", "<p style='color:#888;'>Aucune partie enregistrée pour ce gang.</p>");
    }

    let html = `
        <div style="max-height:60vh; overflow-y:auto; padding-right:5px;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:12px;">
                <thead>
                    <tr style="border-bottom:2px solid var(--accent-purple, #9b59b6); background:#111;">
                        <th style="padding:6px;">Date</th>
                        <th style="padding:6px;">Adversaire</th>
                        <th style="padding:6px; text-align:center;">Résultat</th>
                        <th style="padding:6px; text-align:center;">Crédits</th>
                        <th style="padding:6px; text-align:center;">Rép.</th>
                        <th style="padding:6px;">Territoire</th>
                    </tr>
                </thead>
                <tbody>
    `;

    history.slice().reverse().forEach(item => {
        let resColor = item.result === 'Victoire' ? '#2ecc71' : (item.result === 'Défaite' ? '#e74c3c' : '#f1c40f');
        let repText = (item.repChange > 0) ? `+${item.repChange}` : `${item.repChange || 0}`;

        html += `
            <tr style="border-bottom:1px solid #222;">
                <td style="padding:6px;">${item.date}</td>
                <td style="padding:6px;"><strong>${item.opponentName || 'Inconnu'}</strong><br><small style="color:#aaa;">${item.opponentGang || '-'}</small></td>
                <td style="padding:6px; text-align:center; color:${resColor}; font-weight:bold;">${item.result || 'Égalité'}</td>
                <td style="padding:6px; text-align:center; color:var(--accent-cyan, #00d2d3);">+${item.totalCredits || 0} cr</td>
                <td style="padding:6px; text-align:center;">${repText}</td>
                <td style="padding:6px;"><small style="color:#ddd;">${item.territory || 'Aucun'}</small></td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <br>
        <button class="btn" onclick="if (typeof closeModal==='function') closeModal()">Fermer</button>
    `;

    if (typeof openModal === 'function') openModal("📜 Historique des Parties", html);
}