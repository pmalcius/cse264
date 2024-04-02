let currentPage = 1;
let totalSongs = 0;

document.addEventListener('DOMContentLoaded', function() {
  const artistDropdown = document.getElementById('artistDropdown');
  const searchButton = document.getElementById('searchButton');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const keywordTextbox = document.getElementById('keywordTextbox');
  const resultsPerPage = document.getElementById('resultsPerPage');
  const songsTable = document.getElementById('songsTable').getElementsByTagName('tbody')[0];
  const paginationInfo = document.getElementById('paginationInfo');

  function fetchAndUpdateSongs() {
    const artist = artistDropdown.value;
    const keyword = keywordTextbox.value.trim();
    const limit = parseInt(resultsPerPage.value);
    const offset = (currentPage - 1) * limit;

    fetch(`/songs?artist=${encodeURIComponent(artist)}&keyword=${encodeURIComponent(keyword)}&limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        totalSongs = data.total;
        updateSongsTable(data.songs, totalSongs);
        updatePaginationInfo();
      });
  }

  function updateSongsTable(songs) {
    songsTable.innerHTML = ''; // Clear current table rows
    songs.forEach((song, index) => {
      const row = songsTable.insertRow();
      if (song.numone === 1) {
        row.classList.add('highlight');
      }
      row.insertCell(0).innerText = index + 1 + (currentPage - 1) * parseInt(resultsPerPage.value);
      row.insertCell(1).innerText = song.title;
      row.insertCell(2).innerText = song.artist;
    });
  }

  function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * parseInt(resultsPerPage.value) + 1;
    let endIndex = startIndex + parseInt(resultsPerPage.value) - 1;
    endIndex = endIndex > totalSongs ? totalSongs : endIndex;
    paginationInfo.innerText = `Songs ${startIndex} to ${endIndex} out of ${totalSongs}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = endIndex >= totalSongs;
  }

  // Populate artists dropdown on load
  fetch('/artists')
    .then(response => response.json())
    .then(artists => {
      artists.forEach(artist => {
        const option = new Option(artist.artist, artist.artist);
        artistDropdown.add(option);
      });
    });

  searchButton.addEventListener('click', () => {
    currentPage = 1; // Reset to first page for new search
    fetchAndUpdateSongs();
  });

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndUpdateSongs();
    }
  });

  nextButton.addEventListener('click', () => {
    currentPage++;
    fetchAndUpdateSongs();
  });

  // Initial fetch
  fetchAndUpdateSongs();
});
