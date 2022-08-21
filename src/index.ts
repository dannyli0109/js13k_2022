import { Program } from "./Program";


// const ready = (callback: any) => {
//     // in case the document is already rendered
//     if (document.readyState!='loading') callback();
//     // modern browsers
//     else if (document.addEventListener) window.addEventListener('load', callback);
// }

// ready(() => {
//     console.log(document.readyState);
//     const program = new Program();
//     program.init();
//     program.update();
// })

const program = new Program();
program.init();
program.update();