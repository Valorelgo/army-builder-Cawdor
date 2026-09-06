// ==========================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================
let appState = { view: 'menu', mode: null, editTarget: null };
let savedGangs = JSON.parse(localStorage.getItem('escherGangs')) || {};
let currentGang = null;
let tempFighter = null;

function saveGangs() {
    localStorage.setItem('escherGangs', JSON.stringify(savedGangs));
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Calcul du coût d'un guerrier unique (incluant les accessoires d'armes)
function calculateFighterCost(m) {
    const char = db.characters.find(c => c.id === m.charId);
    if (!char) return 0;
    let total = char.cost;
    
    // Coût des armes et de leurs accessoires rattachés
    m.weapons.forEach(w => {
        total += (w.cost_credits || 0);
        if (w.accessory) {
            total += (w.accessory.cost_credits || 0);
        }
    });
    
    // Coût des équipements / armures (hors accessoires d'armes)
    m.equipment.forEach(e => {
        total += (e.cost_credits || 0);
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
    if (currentGang) {
        document.getElementById('header-gang-name').innerText = currentGang.name;
        document.getElementById('ui-credits').innerText = currentGang.credits;
        document.getElementById('ui-rating').innerText = calculateGangRating(currentGang);
        document.getElementById('header-credits-rating').classList.remove('hidden');
    } else {
        document.getElementById('header-gang-name').innerText = "Escher Builder";
        document.getElementById('header-credits-rating').classList.add('hidden');
    }
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
            <h2>Bienvenue dans le Sous-Monde</h2>
            <p>Sélectionnez une option :</p><br>
            <button onclick="navigate('gang-create')">Création de Gang</button><br>
            <button onclick="appState.mode='campaign'; navigate('gang-select')">Suivi de Gang (Campagne)</button><br>
            <button onclick="appState.mode='quick'; navigate('gang-select')">Partie Rapide</button><br>
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
        name: name, credits: 1000, rating: 0, reputation: 1, members: [], stash: [], territories: [], tactics: []
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
    navigate('gang-manage');
}

function renderGangManage(container) {
    calculateGangRating(currentGang);
    updateTopBar();
    let html = `
        <div class="card">
            <h2>Gestion de Gang : ${currentGang.name}</h2>
            <button onclick="openRecruitModal()">+ Recruter un Combattant</button>
            <button onclick="navigate('game-setup')">⚔️ Lancer une partie</button>
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
            html += `
            <div class="fighter-item">
                <div>
                    <strong>${m.customName}</strong> (${m.charName})<br>
                    <small>Coût: ${m.totalCost}c | Type: ${m.type.join(', ')}</small>
                </div>
                <div>
                    <button onclick="editFighter(${idx})">Modifier</button>
                    <button class="btn-danger" onclick="removeFighter(${idx})">Licencier</button>
                </div>
            </div>`;
        });
    }
    html += `</div>`;
    container.innerHTML = html;
}

// ==========================================
// FIGHTER EDITING & RECRUITMENT
// ==========================================
function openRecruitModal() {
    let html = `<h3>Sélectionner le profil à recruter</h3>`;
    db.characters.forEach(c => {
        html += `
            <div class="fighter-item">
                <span><strong>${c.name}</strong> (${c.cost}c)</span>
                <button onclick="selectRecruitProfile('${c.id}')">Choisir</button>
            </div>
        `;
    });
    openModal("Recrutement", html);
}

function selectRecruitProfile(charId) {
    closeModal();
    const char = db.characters.find(c => c.id === charId);
    tempFighter = {
        id: generateId(),
        charId: char.id,
        charName: char.name,
        customName: "",
        type: char.type,
        stats: JSON.parse(JSON.stringify(char.stats)),
        weapons: [],
        equipment: [],
        skills: [],
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

    let html = `
        <div class="card">
            <h2>${appState.editTarget === null ? 'Recruter' : 'Modifier'} ${m.charName}</h2>
            <label>Nom personnalisable :</label>
            <input type="text" value="${m.customName}" placeholder="Ex: Roxie Speed" oninput="tempFighter.customName = this.value">
            
            <h3>Armes Équipées (Max 3 emplacements)</h3>
            <div id="weapon-list">
                ${m.weapons.length === 0 ? '<p>Aucune arme.</p>' : m.weapons.map((w, i) => `
                    <div style="margin:8px 0; background:#181818; padding:8px; border-radius:4px;">
                        • <strong>${w.name}</strong> (${w.cost_credits||0}c)
                        ${w.accessory ? `<br><small style="color:var(--accent-cyan); margin-left:15px;">↳ Accessoire : ${w.accessory.name} (${w.accessory.cost_credits}c) <button class="btn-danger" style="padding:2px 6px; font-size:10px;" onclick="removeWeaponAccessory(${i})">Retirer accessoire</button></small>` : `<br><button style="padding:2px 6px; font-size:11px; margin-left:15px;" onclick="openWeaponAccessoryModal(${i})">+ Ajouter un accessoire</button>`}
                        <button class="btn-danger" style="float:right; padding:2px 6px; font-size:11px;" onclick="removeWeapon(${i})">Supprimer l'arme</button>
                        <div style="clear:both;"></div>
                    </div>
                `).join('')}
            </div>
            <button onclick="openWeaponSelectModal()">+ Ajouter une Arme</button>

            <h3 style="margin-top:15px;">Armures & Équipements (Hors accessoires d'armes)</h3>
            <div id="equip-list">
                ${m.equipment.length === 0 ? '<p>Aucun équipement.</p>' : m.equipment.map((e, i) => `
                    <div style="margin:5px 0;">• ${e.name} (${e.cost_credits||0}c) <button class="btn-danger" onclick="removeEquipment(${i})">X</button></div>
                `).join('')}
            </div>
            <button onclick="openEquipSelectModal()">+ Ajouter Armure / Équipement</button>

            <h3 style="margin-top:15px;">Compétences</h3>
            <div id="skills-list">
                ${m.skills.length === 0 ? '<p>Aucune compétence sélectionnée.</p>' : m.skills.map((s, i) => `
                    <div style="margin:5px 0;">• ${s.name} <button class="btn-danger" onclick="removeSkill(${i})">X</button></div>
                `).join('')}
            </div>
            <button onclick="openSkillModal()">Gérer les Compétences</button>

            <hr style="margin:20px 0; border-color:var(--border-color);">
            <p><strong>Coût Total du Combattant : ${m.totalCost} crédits</strong></p>
            <button onclick="saveFighter()">Valider et Enregistrer</button>
            <button class="btn-danger" onclick="navigate('gang-manage')">Annuler</button>
        </div>
    `;
    container.innerHTML = html;
}

// Ajout / Retrait Armes
function openWeaponSelectModal() {
    let usedSlots = tempFighter.weapons.reduce((sum, w) => sum + (w.name.includes('*') ? 2 : 1), 0);
    let html = `<p>Emplacements utilisés : ${usedSlots} / 3</p><br>`;
    
    db.weapons.forEach(w => {
        let slotsNeeded = w.name.includes('*') ? 2 : 1;
        let isAvailable = (usedSlots + slotsNeeded <= 3);
        
        html += `
            <div class="fighter-item ${!isAvailable ? 'disabled' : ''}">
                <span>${w.name} (${w.cost_credits||0}c) ${slotsNeeded === 2 ? '<em>(2 emplacements)</em>' : ''}</span>
                ${isAvailable ? `<button onclick="addWeapon('${w.id}')">Ajouter</button>` : '<small>Emplacements insuffisants</small>'}
            </div>
        `;
    });
    openModal("Sélection d'Arme", html);
}

function addWeapon(wId) {
    const w = db.weapons.find(item => item.id === wId);
    let newWeapon = JSON.parse(JSON.stringify(w));
    newWeapon.accessory = null; // Initialisé sans accessoire
    tempFighter.weapons.push(newWeapon);
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function removeWeapon(idx) {
    tempFighter.weapons.splice(idx, 1);
    renderFighterEdit(document.getElementById('main-content'));
}

// Gestion des Accessoires d'armes (filtrés par type "Accessoire" dans db.equipment)
let currentWeaponIndexForAccessory = null;
function openWeaponAccessoryModal(wIdx) {
    currentWeaponIndexForAccessory = wIdx;
    let accessories = db.equipment.filter(e => e.type === "Accessoire");
    
    let html = `<h3>Sélectionner un accessoire pour l'arme</h3><br>`;
    if (accessories.length === 0) {
        html += `<p>Aucun accessoire disponible.</p>`;
    } else {
        accessories.forEach(acc => {
            html += `
                <div class="fighter-item">
                    <span><strong>${acc.name}</strong> (${acc.cost_credits}c) <br><small>${acc.effect || ''}</small></span>
                    <button onclick="attachAccessoryToWeapon('${acc.id}')">Équiper</button>
                </div>
            `;
        });
    }
    openModal("Accessoire d'arme", html);
}

function attachAccessoryToWeapon(accId) {
    const acc = db.equipment.find(item => item.id === accId);
    if (currentWeaponIndexForAccessory !== null) {
        tempFighter.weapons[currentWeaponIndexForAccessory].accessory = JSON.parse(JSON.stringify(acc));
    }
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function removeWeaponAccessory(wIdx) {
    tempFighter.weapons[wIdx].accessory = null;
    renderFighterEdit(document.getElementById('main-content'));
}

// Ajout / Retrait Armures & Équipements (Exclut les accessoires d'armes)
function openEquipSelectModal() {
    let generalEquipments = db.equipment.filter(e => e.type !== "Accessoire");
    let html = ``;
    generalEquipments.forEach(e => {
        html += `
            <div class="fighter-item">
                <span>${e.name} (${e.cost_credits||0}c) - <small>${e.type}</small></span>
                <button onclick="addEquipment('${e.id}')">Équiper</button>
            </div>
        `;
    });
    openModal("Sélection Armure / Équipement", html);
}

function addEquipment(eId) {
    const e = db.equipment.find(item => item.id === eId);
    tempFighter.equipment.push(JSON.parse(JSON.stringify(e)));
    closeModal();
    renderFighterEdit(document.getElementById('main-content'));
}

function removeEquipment(idx) {
    tempFighter.equipment.splice(idx, 1);
    renderFighterEdit(document.getElementById('main-content'));
}

// Gestion des Compétences
function openSkillModal() {
    let html = `<br>`;
    for (let cat in db.skills) {
        html += `<div class="skill-category"><h4>Catégorie : ${cat.toUpperCase()}</h4>`;
        db.skills[cat].forEach(s => {
            let isChecked = tempFighter.skills.some(sk => sk.id === s.id);
            html += `
                <div class="skill-checkbox-group">
                    <input type="checkbox" id="sk-${s.id}" ${isChecked ? 'checked' : ''} onchange="toggleSkill('${cat}', '${s.id}')">
                    <label for="sk-${s.id}"><strong>${s.name}</strong> : ${s.desc}</label>
                </div>
            `;
        });
        html += `</div>`;
    }
    openModal("Menu des Compétences", html);
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

function saveFighter() {
    if (!tempFighter.customName.trim()) return alert("Veuillez saisir un nom pour le combattant.");
    
    tempFighter.totalCost = calculateFighterCost(tempFighter);
    
    let oldCost = 0;
    if (appState.editTarget !== null) {
        oldCost = currentGang.members[appState.editTarget].totalCost;
    }
    
    let diff = tempFighter.totalCost - oldCost;
    if (currentGang.credits - diff < 0) return alert("Crédits insuffisants !");
    
    currentGang.credits -= diff;
    
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
    currentGang.credits += m.totalCost;
    currentGang.members.splice(idx, 1);
    calculateGangRating(currentGang);
    saveGangs();
    navigate('gang-manage');
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

navigate('menu');