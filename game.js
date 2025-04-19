// 游戏状态
const gameState = {
    board: [],
    playerPos: {x:1, y:1},
    levels: [
        [
            '##########',
            '#       @#',
            '#   $    #',
            '#   .    #',
            '##########'
        ]
    ]
};

// 初始化游戏
function initGame() {
    loadLevel(0);
    renderBoard();
    document.addEventListener('keydown', handleKeyDown);
    document.getElementById('reset').addEventListener('click', resetGame);
}

// 加载关卡
function loadLevel(level) {
    gameState.board = [];
    const map = gameState.levels[level];
    
    for(let y=0; y<map.length; y++) {
        gameState.board[y] = [];
        for(let x=0; x<map[y].length; x++) {
            if(map[y][x] === '@') {
                gameState.playerPos = {x, y};
                gameState.board[y][x] = ' ';
            } else {
                gameState.board[y][x] = map[y][x];
            }
        }
    }
}

// 渲染游戏板
function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    for(let y=0; y<gameState.board.length; y++) {
        for(let x=0; x<gameState.board[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const char = gameState.board[y][x];
            if(char === '#') cell.classList.add('wall');
            else if(char === '$') cell.classList.add('box');
            else if(char === '.') cell.classList.add('goal');
            
            if(x === gameState.playerPos.x && y === gameState.playerPos.y) {
                cell.classList.add('player');
            }
            
            board.appendChild(cell);
        }
    }
}

// 键盘控制
function handleKeyDown(e) {
    const keyMap = {
        'ArrowUp': {dx:0, dy:-1},
        'ArrowDown': {dx:0, dy:1},
        'ArrowLeft': {dx:-1, dy:0},
        'ArrowRight': {dx:1, dy:0}
    };
    
    const dir = keyMap[e.key];
    if(dir) movePlayer(dir.dx, dir.dy);
}

// 移动玩家
function movePlayer(dx, dy) {
    const newX = gameState.playerPos.x + dx;
    const newY = gameState.playerPos.y + dy;
    
    // 边界检查
    if(newY < 0 || newY >= gameState.board.length || 
       newX < 0 || newX >= gameState.board[newY].length) {
        return;
    }
    
    const targetCell = gameState.board[newY][newX];
    
    // 空地或目标点
    if(targetCell === ' ' || targetCell === '.') {
        gameState.playerPos = {x: newX, y: newY};
    } 
    // 箱子
    else if(targetCell === '$') {
        const boxX = newX + dx;
        const boxY = newY + dy;
        
        // 箱子前面是空地或目标点
        if(gameState.board[boxY][boxX] === ' ' || gameState.board[boxY][boxX] === '.') {
            gameState.board[newY][newX] = ' ';
            gameState.board[boxY][boxX] = '$';
            gameState.playerPos = {x: newX, y: newY};
        }
    }
    
    renderBoard();
}

// 重置游戏
function resetGame() {
    loadLevel(0);
    renderBoard();
}

// 启动游戏
window.onload = initGame;