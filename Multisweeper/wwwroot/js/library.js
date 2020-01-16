class Library {
    /**
     * @returns {Minefield}
     */
    initGamefield(board) {
        let gamefield = new Minefield();
        let data = this.convertBoard(board);
        gamefield.setBoard(data.convertedBoard);
        gamefield.setMines(data.mines);
        return gamefield;
    }

    convertBoard(serverBoard) {
        let mineCount = 0;
        let board = [];
        let rowList = serverBoard.RowList;
        for (let i = 0; i < 30; i++) {
            let row = [];
            let boxList = rowList[i].BoxList;
            for (let j = 0; j < 30; j++) {
                let box = boxList[j];
                row[j] = this.fieldObject(box.X, box.Y, box.Mine, box.SurroundingMines);
                if (box.Mine === true) {
                    mineCount++;
                }
            }
            board[i] = row;
        }
        return {
            convertedBoard: board,
            mines: mineCount
        };
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