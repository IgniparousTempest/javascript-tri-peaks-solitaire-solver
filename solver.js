class Card {
    constructor(cardString) {
        this.rank = cardString[0];
        this.suit = cardString[1];
    }

    /**
     * Gets the face value of the card, from [0 .. 12].
     * @returns {number} The value.
     */
    get integerValue() {
        return "A23456789TJQK".indexOf(this.rank);
    }

    /**
     * Returns true if the other card has a face value one above or below this card.
     * @param card Another card.
     * @returns {boolean} True if sequential, false otherwise.
     */
    isSequential(card) {
        return (this.integerValue + 1) % 13 === card.integerValue || (this.integerValue - 1) % 13 === card.integerValue;
    }

    get toString() {
        return this.rank + this.suit;
    }
}

class Pyramid {
    constructor(pyramidArray) {
        this.array = pyramidArray;
    }

    get isCleared() {
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i] !== 0)
                return false;
        }
        return true;
    }

    get freeCardIndices() {
        let freeIndices = [];
        for (let i = this.array.length - 1; i >= 0; i--) {
            if (this.array[i] === 0)
                continue;
            const secondOffset = Math.floor((i - 3) / 2);
            // This is the last row
            if (i >= 18)
                freeIndices.push(i);
            // Third row
            else if (i <= 17 && i >= 9 && this.array[i + 9] === 0 && this.array[i + 10] === 0)
                freeIndices.push(i);
            // Second row
            else if (i <= 8 && i >= 3 && this.array[i + 6 + secondOffset] === 0 && this.array[i + 7 + secondOffset] === 0)
                freeIndices.push(i);
            // First row
            else if (i <= 2 && i >= 0 && this.array[i + 3 + i] === 0 && this.array[i + 4 + i] === 0)
                freeIndices.push(i);
        }
        return freeIndices;
    }

    static triangularNumber(n) {
        return (n * (n + 1)) / 2;
    }
}

class MoveString {
    static gameWon() {return "You have won.";}
    static gameLost() {return "There are no more valid moves.";}
    static match(cardA, cardB) {return "Move " + cardA + " onto the stock.";}
    static flipStock() {return "Draw a new stock card.";}
}

const GameStates = Object.freeze({"won": true, "lost": false});

/**
 * Solves a Tri Peaks solitaire game.
 * @param pyramidArray The cards in the pyramids, starting in the top-left peak. The cards are in left-to-right, then top-to-bottom order.
 * @param stockArray The cards in the stock.
 * @param stockIndex The index of the top stock card.
 * @param moveArray The list of moves that have been made to get a deck in this configuration.
 * @returns {*[]|([*, *]|[*, *]|[*, *])}
 */
function solve(pyramidArray, stockArray, stockIndex = 0, moveArray = []) {
    let newMoveArray = JSON.parse(JSON.stringify(moveArray));
    let pyramid = new Pyramid(pyramidArray);

    // We cleared the pyramid
    if (pyramid.isCleared) {
        newMoveArray.push(MoveString.gameWon());
        return [GameStates.won, newMoveArray];
    }

    // We have run out of stock cards
    if (stockIndex >= stockArray.length) {
        newMoveArray.push(MoveString.gameLost());
        return [GameStates.lost, newMoveArray];
    }

    const topStock = new Card(stockArray[stockIndex]);

    let freeCardsIndices = pyramid.freeCardIndices;
    // match free cards with stock
    for (let i = 0; i < freeCardsIndices.length; i++) {
        let cardA = new Card(pyramidArray[freeCardsIndices[i]]);
        if (!cardA.isSequential(topStock))
            continue;
        let newStock = JSON.parse(JSON.stringify(stockArray));
        newStock.splice(stockIndex + 1, 0, cardA.toString);
        stockIndex++;

        newMoveArray = JSON.parse(JSON.stringify(moveArray));
        newMoveArray.push(MoveString.match(cardA.toString, topStock.toString));

        let newPyramidArray = JSON.parse(JSON.stringify(pyramidArray));
        newPyramidArray[freeCardsIndices[i]] = 0;

        let result = solve(newPyramidArray, newStock, stockIndex, newMoveArray);
        if (result[0] === GameStates.won)
            return result;
    }

    // Flip over a new card
    newMoveArray = JSON.parse(JSON.stringify(moveArray));
    newMoveArray.push(MoveString.flipStock());
    let result = solve(pyramidArray, stockArray, stockIndex + 1, newMoveArray);
    if (result[0] === GameStates.won)
        return result;

    // This node was useless
    return [GameStates.lost, moveArray];
}

exports.solve = solve;
