/* COLORS */
const $dmg = "#b04337";
const $hpr = "#34eb7a";
const $itm = "#d9ab38";

/* RANDOM FUNCTIONS */

function removeAllFromArray(array, type, value) {
  let i = 0;
  while (i < array.length) {
    if (array[i]?.[type] === value) {
      array.splice(i, 1);
    } else {
      i++;
    }
  }
}