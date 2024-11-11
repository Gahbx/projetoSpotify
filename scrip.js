console.log('olá, mundo!');


const clientId = "09e9693e6bad4bdea9015fac7288e88e"; 
const clientSecret = "87c569ef37ba45c7a8cf216b50dc9275"; 
let ACCESS_TOKEN = ''; 

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('result');
const category = document.getElementById('category');
const nameCategory = document.createElement('h1');
const query = 'opaepae';

nameCategory.id = "nameCategory";

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    ACCESS_TOKEN = data.access_token;
}

// Função para pesquisar artistas
async function searchArtists(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
        }
    });

    const data = await response.json();
    displayResults(data.artists.items);
}



// Adiciona evento de clique ao botão de pesquisa


searchInput.addEventListener('keydown', function(event) {

    const query = searchInput.value.trim();
    
    
    if (query) {
        searchArtists(query);
        console.log(query);
    }
    else{
        resultsDiv.innerHTML = '';
    }
    if(event.key === 'Enter'){
        event.preventDefault();
    }


});


// Função para exibir resultados
function displayResults(artists) {

    resultsDiv.innerHTML = '';
    nameCategory.textContent = 'Artistas';
    category.appendChild(nameCategory);

    if (artists.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum artista encontrado.</p>';
        return;
    }
  
    artists.forEach(artist => {
        const artistDiv = document.createElement('div');
        const artistName = document.createElement('h2');
        const artistImg = document.createElement('img');

        artistDiv.classList.add('artist');
        artistImg.classList.add('artistImg');
        
        artistName.textContent = artist.name;
        console.log(artistName);

        artistImg.src = artist.images[0]?.url;
     

        artistDiv.appendChild(artistImg);
        artistDiv.appendChild(artistName);
        resultsDiv.appendChild(artistDiv);
    });
}

// Obtém o token de acesso ao carregar a página
getAccessToken();