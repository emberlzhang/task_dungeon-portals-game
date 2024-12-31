import { homePosition } from "./mapConstants.js";

export const playerAttributes = {
  position: {
    x: homePosition.x,
    y: homePosition.y,
  },
  imageSrc: imageUrls.idleRight,
  scale: 1.25,
  frameRate: 11,
  frameBuffer: 2,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      imageSrc: imageUrls.idleRight,
      loop: true,
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      imageSrc: imageUrls.idleLeft,
      loop: true,
    },
    runRight: {
      frameRate: 12,
      frameBuffer: 2,
      imageSrc: imageUrls.runRight,
      loop: true,
    },
    runLeft: {
      frameRate: 12,
      frameBuffer: 2,
      imageSrc: imageUrls.runLeft,
      loop: true,
    },
    emergeFromPortal: {
      frameRate: 5,
      frameBuffer: 10,
      loop: false,
      imageSrc: imageUrls.emergeFromPortal,
    },
    // enterDoor: {
    // frameRate: ,
    // frameBuffer: ,
    // loop: false,
    // imageSrc: ,
    // },
  },
};
