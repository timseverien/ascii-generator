export default class CharacterSetFactory {
    static getCharacterSet(start, end) {
        var characterSet = [];

        for(var i = start; i <= end; i++) {
            characterSet.push(String.fromCodePoint(i));
        }

        return characterSet;
    }
}
