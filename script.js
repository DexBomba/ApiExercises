const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=';

const input = document.getElementById('playerInput');
const button = document.getElementById('searchBtn');
const app = document.getElementById('app');

// Loops through all players returned by the API and displays them on the page.
function displayPlayers(players) {
    // Start the HTML with the total number of players found
    let html = `<p><strong>${players.length} player(s) found:</strong></p>`;

    // Loop through every player from the API
    players.forEach(player => {
        // Add one player's information to the html variable
        html += `
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
            <hr>
        `;
    });

    if (players.length === 1) {
        html += `<p style="color: #555; font-style: italic;">
            ⚠️ The free API key shows only one result. Upgrade for full search.
        </p>`;
    }

    // Display all players on the page
    app.innerHTML = html;
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

        console.log('Full API response:', data);
        console.log('Players from API:', data.player);
        console.log('Number of players:', data.player ? data.player.length : 0);

        if (!data.player || data.player.length === 0) {
            throw new Error('No player found with that name.');
        }

        const players = data.player;

        // Display all players returned by the API. If only one appears, the API only returned one
        displayPlayers(players);

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
})

/*
Summary:
The display logic now shows all players returned by the API.
For searches like "Manny", TheSportsDB API currently returns only one result,
so only one player is displayed.
*/