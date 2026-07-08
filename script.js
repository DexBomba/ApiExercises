const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=';

const input = document.getElementById('playerInput');
const button = document.getElementById('searchBtn');
const app = document.getElementById('app');

function displayPlayer(player) {
    app.innerHTML = `
        <div>
            <img 
                src="${player.strThumb || ''}" 
                alt="${player.strPlayer}" 
                width="150" 
                height="150"
                onerror="this.onerror=null; this.src=''; this.alt='No image';"
            >
            <h1>${player.strPlayer}</h1>
            <p><strong>Nationality:</strong> ${player.strNationality || 'N/A'}</p>
            <p><strong>Position:</strong> ${player.strPosition || 'N/A'}</p>
            <p><strong>Team:</strong> ${player.strTeam || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> ${player.dateBorn || 'N/A'}</p>
            <p><strong>Height:</strong> ${player.strHeight || 'N/A'}</p>
            <p><strong>Weight:</strong> ${player.strWeight || 'N/A'}</p>
            <hr>
            <p>${player.strDescriptionEN ? player.strDescriptionEN.substring(0, 400) + '…' : 'No description.'}</p>
        </div>
    `;
}

function displayMultiple(players) {
    let html = `<p><strong>${players.length} player(s) found:</strong></p><ul>`;
    players.forEach(p => {
        html += `<li>${p.strPlayer} – ${p.strTeam || 'N/A'} (${p.strPosition || 'N/A'})</li>`;
    });
    html += '</ul><hr><p><em>Showing details of the first player:</em></p>';
    app.innerHTML = html;
    displayPlayer(players[0]);
}

async function searchPlayer(name) {
    app.innerHTML = '<p>Loading…</p>';
    try {
        const url = API_BASE + encodeURIComponent(name);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const text = await response.text();
        if (!text) throw new Error('Empty response from server. Try again.');

        const data = JSON.parse(text);
        if (!data.player || data.player.length === 0) {
            throw new Error('No player found with that name.');
        }

        const players = data.player;
        if (players.length === 1) {
            displayPlayer(players[0]);
        } else {
            displayMultiple(players);
        }
    } catch (error) {
        app.innerHTML = `<p style="color: red;">⚠️ ${error.message}</p>`;
    }
}

button.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) searchPlayer(name);
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const name = input.value.trim();
        if (name) searchPlayer(name);
    }
});