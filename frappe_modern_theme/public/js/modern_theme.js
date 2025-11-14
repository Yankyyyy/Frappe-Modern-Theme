// modern_theme.js
// - Adds parallax on scroll
// - Watches for theme changes (data-theme on body) and toggles CSS variables


(function(){
// parallax multiplier for the ::before background layer
const FAR_MULT = 0.25; // subtle
const MID_MULT = 0.5;


function onScroll(){
const y = window.scrollY || window.pageYOffset;
// move the ::before layer slightly
document.body.style.setProperty('--parallax-far', `${y * FAR_MULT}px`);
// We'll push transforms onto the pseudo-element using translateY via style on body
document.body.style.transform = `translateY(0)`; // noop, kept for safety
// update CSS custom property to be used by CSS (if desired)
document.body.style.setProperty('--parallax-offset', `${Math.round(y * FAR_MULT)}px`);


// use direct style on the pseudo via CSS variable applied in stylesheet if needed
}


// Simple MutationObserver to watch for data-theme changes
const observer = new MutationObserver(function(mutations){
// modern_theme.js
for(const m of mutations){
if(m.type === 'attributes' && m.attributeName === 'data-theme'){
const theme = document.body.getAttribute('data-theme') || 'light';
applyThemeVars(theme);
}
}
});


function applyThemeVars(theme){
if(theme === 'dark'){
document.body.style.setProperty('--bg-current', "var(--bg-dark)");
// Example: reduce blur on dark for readability
document.documentElement.style.setProperty('--panel-blur', '6px');
} else {
document.body.style.setProperty('--bg-current', "var(--bg-light)");
document.documentElement.style.setProperty('--panel-blur', '8px');
}
}


// Initialize
function init(){
// set initial theme vars
const theme = document.body.getAttribute('data-theme') || 'light';
applyThemeVars(theme);


// wire up observer
observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });


// scroll listener (throttle)
let ticking = false;
window.addEventListener('scroll', function(){
if(!ticking){
window.requestAnimationFrame(function(){
onScroll();
ticking = false;
});
}
ticking = true;
}, { passive: true });


// small: expose toggle function if needed
window.frappe_modern_theme = {
applyThemeVars
};
}


if(document.readyState === 'loading'){
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();