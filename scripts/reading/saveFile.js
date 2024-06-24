//Remove characters that are invalid in filesystem naming conventions
function removeInvalidCharacters(unmodifiedTitle) {
    if (unmodifiedTitle === null || unmodifiedTitle === undefined) return "";
    let invalidCharactersToRemove = /[<>:"\/\\|?*\x00-\x1F]|amp;/g;
    return unmodifiedTitle.toString().replace(invalidCharactersToRemove, '');
}

//Creates a string that will be used as the default filename when saving an image
function createFileNameForImage(imageExtension, currentIndex) {
    let seriesTitleInnerHTML = document.getElementsByClassName("bar-title-a")[0].innerHTML;
    let documentTitle = document.title;
    let seriesTitle = seriesTitleInnerHTML ? removeInvalidCharacters(seriesTitleInnerHTML) : "";
    let issueTitle = documentTitle ? removeInvalidCharacters(documentTitle) : "";
    let pageNumber = currentIndex ? "Page" + currentIndex : "";
    return seriesTitle + "_" + issueTitle + "_" + pageNumber + "." + imageExtension;
}

//Saves current page to filesystem
function saveImage(imageToSave, currentIndex) {
    let imageExtension = imageToSave.split('.').pop();
    if (imageToSave && imageExtension) {
        fetch(imageToSave)
            .then(response => response.blob())
            .then(blob => {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = createFileNameForImage(imageExtension, currentIndex);
                link.click();
            })
            .catch(error => console.error('Error saving image to local fileystem:', error));
    } else {
        console.error("Could not retrieve the current image");
    }
}

module.exports = {
    removeInvalidCharacters: removeInvalidCharacters,
    saveImage: saveImage,
    createFileNameForImage: createFileNameForImage
};