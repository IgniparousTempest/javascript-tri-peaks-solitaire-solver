const assert = require('assert');
const solver = require('./solver');

const solvable_games = [
    "8S TS 4D 7S 5D 7C 2D JH AC 3S 2H 3H 9H KC QC TD 8D 9C 7H 9D JS QS 4H 5C 5S 4C 2C QD 8C KD 3D KS JD 2S 7D KH AH 5H 9S 4S QH 6S 6D 3C JC TC 8H 6C TH AS AD 6H",
    "5D 9C 5S QS 8S 9D AS 5C 2S QD KC 9H 4H QC 2H 8D 4C 4D JC TS 6D 7H QH 3S 5H JH 6H 2D AC 7S 7C 3D KD 9S 3C TH 6C AH 8H TC 4S 8C AD 3H KS 6S JS 7D JD TD 2C KH"
];

it('should solve known games', () => {
  assert.equal(true, true);
    solvable_games.forEach(function (i) {
        const array = i.split(' ');
        const result = solver.solve(array.slice(0, 28), array.slice(28, 52), 0, []);
        assert.equal(result[0], true);
    });
});
