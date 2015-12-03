export default class ImageFactory {
    static getImageFromFile(file) {
        var reader = new FileReader,
            image = new Image;

        return new Promise(function(resolve, reject) {
            reader.addEventListener('load', function() {
                image.src = reader.result;
            });

            image.addEventListener('load', function() {
                resolve(image);
            });

            reader.addEventListener('error', reject);
            image.addEventListener('error', reject);
            reader.readAsDataURL(file);
        });
    }
}
