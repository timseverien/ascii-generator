export default class AsciiFactory {
    static getAscii(characterLightnessSet, imageLightnessData) {
        let ascii = '',
            find = function(lightness) {
                let match;

                characterLightnessSet.forEach(function(character) {
                    if (
                        match &&
                        Math.abs(lightness - character.lightness) >=
                        Math.abs(lightness - match.lightness)
                    ) return;

                    match = character;
                });

                return match.character;
            };

        imageLightnessData.data.forEach(function(lightness, i) {
            if (i > 0 && i % imageLightnessData.width === 0) {
                ascii += '\r\n';
            }

            ascii += find(lightness);
        });

        return ascii;
    }
}
