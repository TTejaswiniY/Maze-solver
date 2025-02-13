/* script.js */
let mazeLayout = [];
let timerInterval;
let timeElapsed = 0;

function loadMazeFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('mazeInput').value = e.target.result;
            generateMazeFromInput();
        };
        reader.readAsText(file);
    } else {
        alert("Please select a file.");
    }
}

function generateMazeFromInput() {
    const input = document.getElementById('mazeInput').value;
    mazeLayout = input.trim().split('\n').map(row => row.split(',').map(Number));
    createMaze();
}

const maze = document.getElementById('maze');
const start = [0, 0];
const end = [9, 9];

function createMaze() {
    maze.innerHTML = '';
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (mazeLayout[row][col] === 1) cell.classList.add('wall');
            if (row === start[0] && col === start[1]) cell.classList.add('start');
            if (row === end[0] && col === end[1]) cell.classList.add('end');
            cell.id = `cell-${row}-${col}`;
            maze.appendChild(cell);
        }
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeElapsed = 0;
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

function solveMaze() {
    const visited = Array.from({ length: mazeLayout.length }, () => Array(mazeLayout[0].length).fill(false));
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    function dfs(row, col) {
        if (row === end[0] && col === end[1]) {
            clearInterval(timerInterval);
            return true;
        }
        for (let [dx, dy] of directions) {
            const newRow = row + dx, newCol = col + dy;
            if (
                newRow >= 0 && newRow < mazeLayout.length &&
                newCol >= 0 && newCol < mazeLayout[0].length &&
                !visited[newRow][newCol] &&
                mazeLayout[newRow][newCol] === 0
            ) {
                visited[newRow][newCol] = true;
                document.getElementById(`cell-${newRow}-${newCol}`).classList.add('path');
                if (dfs(newRow, newCol)) return true;
                document.getElementById(`cell-${newRow}-${newCol}`).classList.remove('path');
            }
        }
        return false;
    }

    visited[start[0]][start[1]] = true;
    dfs(start[0], start[1]);
}

