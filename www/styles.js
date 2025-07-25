import '@material/web/all.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

document.addEventListener('DOMContentLoaded', () => {
  const wave = document.getElementById('wave');

  if (wave) {
    wave.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(20deg)' },
        { transform: 'rotate(-15deg)' },
        { transform: 'rotate(10deg)' },
        { transform: 'rotate(-5deg)' },
        { transform: 'rotate(0deg)' },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        iterations: 1,
        delay: 300
      }
    );
  } else {
    console.warn('Wave element not found!');
  }
});