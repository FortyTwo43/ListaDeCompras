export const KaomojisVacio = [
  "(,,>﹏<,,)",
  "(╥﹏╥)",
  "( º _ º)",
  "(｡•́︿•̀｡)",
  "(・_・;)",
  "¯\\_(ツ)_/¯",
  "(*_*)",
  "(´･_･`)",
  "(︶︹︺)",
  "(-_-;)"
];

export const getRandomKaomoji = () => {
  const indiceAleatorio = Math.floor(Math.random() * KaomojisVacio.length);
  return KaomojisVacio[indiceAleatorio];
};
