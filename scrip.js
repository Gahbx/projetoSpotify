const clientId = "09e9693e6bad4bdea9015fac7288e88e"; 
const clientSecret = "87c569ef37ba45c7a8cf216b50dc9275"; 
let ACCESS_TOKEN = ''; 

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('result');
const category = document.getElementById('category');
const nameCategory = document.createElement('h1');
const query = '';

const popup = document.getElementById('popup');
const artistaImagem = document.getElementById('artista');
const artistaNome = document.getElementById('artist-name');
const albumElements = [document.getElementById('msc1'), document.getElementById('msc2'), document.getElementById('msc3'), document.getElementById('msc4')];



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

async function getTopAlbums(artistId) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=4`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    });
    const data = await response.json();
    displayAlbums(data.items);
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




function displayAlbums(albums) {
    albumElements.forEach((albumElement, index) => {
        if (albums[index]) {
            const album = document.createElement('img');
            const albumname = document.createElement('h3');
            
            // Ajusta as propriedades do álbum e insere no elemento do álbum
            albumname.textContent = albums[index].name;
            album.src = albums[index].images[0]?.url || '';  // Verifica se a imagem existe
            album.alt = albums[index].name;
            
            // Limpa o conteúdo anterior e adiciona os elementos criados
            albumElement.innerHTML = ''; 
            albumElement.appendChild(album);
            albumElement.appendChild(albumname);
        } else {
            albumElement.innerHTML = '';  // Limpa se não houver álbum suficiente
        }
    });
    
    popup.style.display = 'flex';
}


function displayResults(artists) {
    resultsDiv.innerHTML = '';
    nameCategory.textContent = 'Artistas';
    category.appendChild(nameCategory);
  
    artists.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.classList.add('artist');

        const artistName = document.createElement('h2');
        artistName.textContent = artist.name;

        const artistImg = document.createElement('img');
        artistImg.classList.add('artistImg');
        artistImg.src = artist.images[0]?.url || '';

        artistDiv.appendChild(artistImg);
        artistDiv.appendChild(artistName);
        
        // Adiciona o evento de clique para buscar os álbuns do artista
        artistDiv.addEventListener('click', () => {
            artistaNome.textContent = artist.name;
            artistaImagem.src = artist.images[0]?.url || '';
            getTopAlbums(artist.id);
        });

        resultsDiv.appendChild(artistDiv);
    });
}


window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

// Obtém o token de acesso ao carregar a página
getAccessToken();
