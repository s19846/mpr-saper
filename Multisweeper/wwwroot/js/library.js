class Library {
    /**
     * @returns {Minefield}
     */
    initGamefield() {
        let gamefield = new Minefield();
        let minefieldObj = this.generateMines();
        let board = this.generateBoard(minefieldObj.minefield);
        gamefield.setBoard(board);
        gamefield.setMines(minefieldObj.mines);
        return gamefield;
    }

    /**
     * @param minefield
     * @return {[][]}
     */
    generateBoard(minefield) {
        let board = [];
        for (let i=0;i<30;i++) {
            let row = [];
            for (let j=0;j<30;j++) {
                row[j] = this.fieldObject(j, i, minefield[j][i], this.countLocalMines(minefield, j, i));
            }
            board[i] = row;
        }
        return board;
    }

    /**
     * @returns {{mines: number, minefield: [][]}}
     */
    generateMines() {
        let minefield = [];
        let mines = 0;
        for (let i = 0; i < 30; i++) {
            let row = [];
            for (let j = 0; j < 30; j++) {
                row[j] = this.generateMine();
                if (row[j]) {
                    mines++;
                }
            }
            minefield[i] = row;
        }
        return {
            minefield: minefield,
            mines: mines
        };
    }

    /**
     * @returns {boolean}
     */
    generateMine() {
        // From 1 to 100
        let randNum = Math.floor(Math.random() * 100) + 1;
        // % chance for a mine
        return randNum <= 12;
    }

    /**
     * @param x
     * @param y
     * @param mine
     * @param surroundingMines
     * @returns {{mine: boolean, surroundingMines: number, x: number, y: number}}
     */
    fieldObject(x, y, mine, surroundingMines) {
        return {
            x: x,
            y: y,
            mine: mine,
            surroundingMines: surroundingMines
        }
    }

    /**
     * @param minefield
     * @param x
     * @param y
     * @returns {number}
     */
    countLocalMines(minefield, x, y) {
        let count = 0;
        if (x > 0) {
            if (minefield[x-1][y]) {
                count++;
            }
            if (y < 29) {
                if (minefield[x - 1][y + 1]) {
                    count++;
                }
            }
            if (y > 0) {
                if (minefield[x-1][y-1]) {
                    count++;
                }
            }
        }
        if (y < 29) {
            if (minefield[x][y + 1]) {
                count++;
            }
        }
        if (y > 0) {
            if (minefield[x][y - 1]) {
                count++;
            }
        }
        if (x < 29) {
            if (minefield[x+1][y]) {
                count++;
            }
            if (y < 29) {
                if (minefield[x+1][y+1]) {
                    count++;
                }
            }
            if (y > 0) {
                if (minefield[x+1][y - 1]) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * @param x
     * @param y
     * @returns {string}
     */
    convertLocationToId(x, y) {
        return "x-" + x + ";y-" + y;
    }

    /**
     * @param id
     * @returns {{x: number, y: number}}
     */
    convertIdToLocation(id) {
        let numbers = id.match(/\d+/g).map(Number);
        return {
            x: numbers[0],
            y: numbers[1]
        }
    }
}

class Minefield {
    board;
    allMines;
    leftMines;
    leftEmptyFields;

    /**
     *
     * @param mines
     * @returns {number}
     */
    setMines(mines) {
        this.allMines = mines;
        this.leftMines = mines;
        this.leftEmptyFields = (30 * 30) - this.allMines;
        return this.allMines;
    }

    /**
     * @returns {number}
     */
    removeFromLeftMines() {
        this.leftMines -= 1;
        return this.leftMines;
    }

    /**
     *
     * @returns {number}
     */
    removeFromLeftEmptyFields() {
        this.leftEmptyFields -= 1;
        return this.leftEmptyFields
    }

    /**
     * @param board
     * @returns {[][]}
     */
    setBoard(board) {
        this.board = board;
        return this.board
    }

    /**
     * @returns {[][]}
     */
    getBoard() {
        return this.board;
    }
}