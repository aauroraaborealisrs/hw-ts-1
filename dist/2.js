"use strict";
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
delay(500).then(() => console.log("Готово через 500мс"));
