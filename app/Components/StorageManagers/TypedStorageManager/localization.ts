export const dictionary = {
    getFilesUploadedText(count: number) {
        return `${count} ${count === 1 ? "Datei hochgeladen" : "Dateien hochgeladen"}`;
    },
    getFileSizeErrorText(sizeText: string) {
        return `Die Dateigröße muss kleiner als ${sizeText} sein`;
    },
    getRemainingFilesText(count: number) {
        return `${count} ${count === 1 ? "Datei" : "Dateien"} werden hochgeladen`;
    },
    getUploadingText(percentage: number) {
        return `Hochladen${percentage > 0 ? `: ${percentage}%` : ""}`;
    },
    getUploadButtonText(count: number) {
        return `${count} ${count === 1 ? "Datei" : "Dateien"} hochladen`;
    },
    getMaxFilesErrorText(count: number) {
        return `Es können nicht mehr als ${count} ${
            count === 1 ? "Datei" : "Dateien"
        } ausgewählt werden. Löschen Sie Dateien, bevor Sie aktualisieren.`;
    },
    getErrorText(message: string) {
        return message;
    },
    doneButtonText: "Fertig",
    clearAllButtonText: "Alles löschen",
    extensionNotAllowedText: "Dateierweiterung nicht erlaubt",
    browseFilesText: "Dateien durchsuchen",
    dropFilesText: "Dateien hier ablegen oder",
    pauseButtonText: "Pause",
    resumeButtonText: "Fortsetzen",
    uploadSuccessfulText: "Upload erfolgreich",
    getPausedText(percentage: number) {
        return `Pausiert: ${percentage}%`;
    },
};
