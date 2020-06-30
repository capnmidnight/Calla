export const userNumber = document.location.hash.length > 0
    ? parseFloat(document.location.hash.substring(1))
    : 1;