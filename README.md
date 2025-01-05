# Flappy Bird

[**Watch on YouTube**](https://youtu.be/jj5ADM2uywg)

## Overview
I built this **Flappy Bird** game by following the linked tutorial and then improved it to work smoothly on both desktop and mobile devices. It also has **custom sound effects** and **optimized performance**.

## Key Improvements
- **Mobile Support**:  
  - Switched from separate `click` and `touchstart` events to a single `pointerdown` listener.  
  - Moved event listeners from the `document` to the canvas (`board`) for better responsiveness.  

- **Performance Tweaks**:  
  - Preloaded images to reduce stutter.  
  - Combined event listeners, preventing conflicts or delays in iOS Safari.  

- **Audio Integration**:  
  - Added background music (BGM) that starts playing after the first user interaction.  
  - Added wing, hit, point, and fall sounds to enhance the gameplay experience.

## Lessons Learned
- **Event Handling** can be smoother when using **pointer events** (like `pointerdown`) instead of separate `click` or `touchstart`.  
- **Preloading Assets** (images and audio) prevents hiccups on mobile devices.  
- **Optimizing Canvas** interactions and limiting events to a single element helps avoid double-tap zoom or scrolling issues.

## How to Play
1. Open the webpage on your **desktop** or **mobile** device.  
2. **Tap** (or **click**) anywhere on the game board to make the bird jump.  
3. Avoid the pipes to keep playing and rack up a high score!