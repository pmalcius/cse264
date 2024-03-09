document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const size = 4; // Size of row and cols
  const emptyCell = 16; // empty cell starting position

  // Initial state of the puzzle
  let puzzleState = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => row * size + col + 1));

  // Shuffle the puzzle pieces 5000 times. It is possible since this moves the blocks around the blank cell just as the player would but 5000 randomly.
  function shuffle() {
    for (let move = 0; move < 5000; move++) {
      const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
      ];

      // Get the row and column values of the empty cell
      const emptyRow = findEmptyCell().row;
      const emptyCol = findEmptyCell().col;

      // Randomly select a direction from the array of possible directions
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      // Calculate the new position after the move
      const newRow = emptyRow + randomDirection.row;
      const newCol = emptyCol + randomDirection.col;

      // Check if the new position is within the bounds of the puzzle grid
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        // Swap the values of the empty cell and the adjacent cell
        [puzzleState[emptyRow][emptyCol], puzzleState[newRow][newCol]] = [
          puzzleState[newRow][newCol],
          puzzleState[emptyRow][emptyCol],
        ];
      }
    }

    // Update the table after shuffling
    updateTable();
  }

  // Find the coordinates of the empty cell
  function findEmptyCell() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (puzzleState[row][col] === emptyCell) {
          return { row, col };
        }
      }
    }
  }

  // Update the HTML table with the current puzzle state
  function updateTable(checkSolved = false) {
    // Get the table element with the ID of gameTable
    const tableElement = document.getElementById("gameTable");

    // Loop through each row and column in the puzzleState
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Calculate the unique cell ID based on the row and column
        const cellId = row * size + col + 1;

        // Get the element corresponding to the current cell ID
        const cellElement = document.getElementById(cellId.toString());

        // Check if the cell contains the empty cell value
        if (puzzleState[row][col] === emptyCell) {
          // Set the CSS class and clear the content for the empty cell
          cellElement.className = "blank";
          cellElement.textContent = "";
        } else {
          // Reset CSS class, set the cell content, and add a click event listener
          cellElement.className = "";
          cellElement.textContent = puzzleState[row][col];
          cellElement.addEventListener("click", function () {
            moveCell(row, col);
          });
        }
      }
    }

    // Check if the puzzle is solved and update table cell styling
    if (checkSolved) {
      checkIfSolved();
    }
  }

  // Move the clicked cell only if it's adjacent to the empty cell
  function moveCell(row, col) {
    // Define possible directions for movement
    const directions = [
      { row: -1, col: 0 }, // Up
      { row: 1, col: 0 },  // Down
      { row: 0, col: -1 }, // Left
      { row: 0, col: 1 },  // Right
    ];

    // Iterate over each possible direction for movement
    for (const direction of directions) {
      // Calculate the new row and column based on the selected direction
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      // Check if the new position is within the puzzle boundaries
      if (
        newRow >= 0 && newRow < size && // Check if the new row is within the puzzle grid
        newCol >= 0 && newCol < size     // Check if the new column is within the puzzle grid
      ) {
        // Check if the new position is the empty cell
        if (puzzleState[newRow][newCol] === emptyCell) {
          // Swap the clicked cell with the empty cell since it is a valid move
          [puzzleState[row][col], puzzleState[newRow][newCol]] = [
            puzzleState[newRow][newCol],
            puzzleState[row][col],
          ];

          // Update the table to reflect the new puzzle state
          updateTable(true); // Pass true to check for solved state after a move

          // Exit the function after a successful move
          return;
        }
      }
    }
  }

  // Reset the puzzle to its initial state
  function reset() {
    puzzleState = Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => row * size + col + 1)
    );

    // Update the table after resetting
    updateTable();
  }

  // Check if the puzzle is in its solved state and update table cell styling
  function checkIfSolved() {
    // Flatten the 2D puzzle array to a 1D array without the empty cell
    // Got this from https://www.geeksforgeeks.org/how-to-convert-two-dimensional-array-into-an-object-in-javascript/
    const flatPuzzle = puzzleState.flat();
    
    // Create an array representing the solved state
    const solvedState = Array.from({ length: size * size }, (_, i) => i + 1);

    // Checking the Arrays
    console.log("Flattened Puzzle Array:", flatPuzzle);
    console.log("solvedState Puzzle Array:", solvedState);

    // Check if the puzzle is in the solved state by comparing each element
    const isSolved = flatPuzzle.every((value, index) => value === solvedState[index]);
    // Checking bool value if the flatPuzzle array is the same as the solvedState array
    console.log("Puzzle isSolved:", isSolved);

    // Go through each cell in the table to update styling
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Calculate the unique cell ID based on the row and column
        const cellId = row * size + col + 1;

        // Get the element corresponding to the current cell ID
        const cellElement = document.getElementById(cellId.toString());

        // Check if the puzzle is solved
        if (isSolved) {
          // Puzzle is solved, change the cell background color to lightish green
          cellElement.style.backgroundColor = "#A1FABE";
        } else {
          // Puzzle is not solved, reset the cell background color
          cellElement.style.backgroundColor = "";
        }
      }
    }
  }

  // Handle button clicks
  document.querySelector(".reset").addEventListener("click", reset);
  document.querySelector(".scramble").addEventListener("click", shuffle);

  // Initialize the puzzle - to start the puzzle you need to press shuffle!!!!
  reset();
});