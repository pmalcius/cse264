document.addEventListener('DOMContentLoaded', function() {
    const socket = io('http://xena.cse.lehigh.edu:3000'); // Adjust URL as needed
    const canvas = document.getElementById('fruitCanvas');
    const ctx = canvas.getContext('2d');
    const fruitImages = {};
    let grid = []; // This needs to be updated with actual grid data from the server
    let loggedIn = 0;
    let username = "";
    let usernameId = "";

    // Image preloading
    const imagePaths = {
        1: '../images/appleGreen.png',
        2: '../images/appleRed.png',
        3: '../images/cherry.png',
        4: '../images/grape.png',
        5: '../images/orange.png',
        6: '../images/strawberry.png',
        7: '../images/watermelon.png'
    };

    Promise.all(Object.keys(imagePaths).map(key => 
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                fruitImages[key] = img;
                resolve();
            };
            img.src = imagePaths[key];
            img.onerror = reject;
        })
    )).then(() => {
        console.log("Images loaded successfully");
        drawGrid(); // You should trigger this properly based on game state updates from the server
    }).catch(error => {
        console.error("Error loading images:", error);
    });

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < 8; row++) { 
            if (!grid[row]) continue; // Skip if the row isn't defined
            for (let col = 0; col < 10; col++) { 
                const tileIndex = grid[row][col];
                if (fruitImages[tileIndex]) { // Check if the image is loaded
                    ctx.drawImage(fruitImages[tileIndex], col * 50, row * 50, 50, 50);
                } else {
                    console.error('Image for tile index', tileIndex, 'not loaded or not found');
                }
            }
        }
    }

    // I need to add if there is no username it doesnt swap
    function swapTiles(tile1, tile2) {
        // Swap the tile indices in the grid array
        const temp = grid[tile1.row][tile1.col];
        grid[tile1.row][tile1.col] = grid[tile2.row][tile2.col];
        grid[tile2.row][tile2.col] = temp;
        
        console.log("ID: " + usernameId + ", 1row: " + tile1.row + ", 1col: " + tile1.col + ", 2row: " + tile2.row + ", 2col: " + tile2.col);

        // Emit the event to update the grid on the server
        socket.emit('imageswap', { id: usernameId, image1Col: tile1.col, image1Row: tile1.row, image2Col: tile2.col, image2Row: tile2.row });

        updateGrid(grid);
    }

    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        selectedTile = { col: Math.floor(x / 50), row: Math.floor(y / 50), x: x, y: y };
        console.log("selected Tile: " + JSON.stringify(selectedTile));
    });
    
    canvas.addEventListener('mouseup', function(e) {
        if (!selectedTile) return;
    
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const releasedTile = { col: Math.floor(x / 50), row: Math.floor(y / 50), x: x, y: y };
        console.log("release Tile: " + JSON.stringify(releasedTile));
    
        if ((Math.abs(selectedTile.col - releasedTile.col) === 1 && selectedTile.row === releasedTile.row) ||
            (Math.abs(selectedTile.row - releasedTile.row) === 1 && selectedTile.col === releasedTile.col)) {
            swapTiles(selectedTile, releasedTile);
        }
    
        selectedTile = null;
    });

    canvas.addEventListener('mouseleave', function(e) {
        selectedTile = null;
    });

    function updateGrid(newGrid) {
        grid = newGrid;
        drawGrid();
    }

    socket.on('gridupdate', updateGrid);

    socket.on('playerslistupdate', function(players) {
        const leaderboardData = document.getElementById('leaderboardData');
        leaderboardData.innerHTML = '';
        players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${player.name}</td><td>${player.score}</td>`;
            leaderboardData.appendChild(row);
        });
    });

    socket.on('chatbroadcast', function(message) {
        var newItem = $(`<li>${message}</li>`);
        $("#chatMessages").append(newItem);
        var myList = $("#chatMessages");
        myList.scrollTop(myList.prop("scrollHeight"));
    });

    $('#login-button').on("click", () => {
        username = $('#username').val();
        $('#username').val("");
        console.log(username);
        if(username !== "" && loggedIn === 0){
            loggedIn = 1;
            socket.emit("login", username);
            socket.on('loginresponse', (datavalue) => {
                console.log("successful login: ", datavalue.id);
                usernameId = datavalue.id;
            });
        }
    });

    $('#chat-button').on("click", () => {
        const message = $('#chatMessage').val();
        $('#chatMessage').val("");
        console.log(message);
        console.log(usernameId);
        if(usernameId !== "" && message !== ""){
            socket.emit("chatsend", {id : usernameId, message : message});
        }
    });
});
