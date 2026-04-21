const fs = require('fs');

const files = ['index.html', 'about.html', 'cases.html', 'hongkong.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');

    // 1. Update Tailwind config
    content = content.replace(
        /colors:\s*\{[\s\S]*?offwhite:\s*'#F3F4F6'\n\s*\}/,
        `colors: {
                        obsidian: '#FDFBF7',
                        surface: '#FFFFFF',
                        gold: '#C5A059',
                        goldlight: '#E6D5B8',
                        offwhite: '#2C241B',
                        gray: {
                            300: '#A39C93',
                            400: '#8A8275',
                            500: '#5C5448',
                            600: '#453E34',
                        }
                    }`
    );

    // 2. Update Body CSS
    content = content.replace(
        /body\s*\{\s*background-color:\s*#0A0A0A;\s*color:\s*#E5E7EB;/,
        `body {\n            background-color: #FDFBF7;\n            color: #5C5448;`
    );

    // 3. Update Ambient Globs
    content = content.replace(
        /background:\s*radial-gradient\(circle,\s*rgba\(212,175,55,0\.06\)\s*0%,\s*rgba\(10,10,10,0\)\s*60%\);/g,
        `background: radial-gradient(circle, rgba(197,160,89,0.15) 0%, rgba(253,251,247,0) 60%);`
    );
    content = content.replace(
        /background:\s*radial-gradient\(circle,\s*rgba\(30,58,138,0\.1\)\s*0%,\s*rgba\(10,10,10,0\)\s*60%\);/g,
        `background: radial-gradient(circle, rgba(200,205,210,0.4) 0%, rgba(253,251,247,0) 60%);`
    );

    // 4. Update Glassmorphism
    content = content.replace(
        /\.glass\s*\{\s*background:\s*rgba\(255, 255, 255, 0\.03\);\s*backdrop-filter:\s*blur\(16px\);\s*-webkit-backdrop-filter:\s*blur\(16px\);\s*border:\s*1px\s*solid\s*rgba\(255, 255, 255, 0\.05\);\s*box-shadow:\s*0\s*8px\s*32px\s*0\s*rgba\(0,\s*0,\s*0,\s*0\.3\);\s*\}/g,
        `.glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(197, 160, 89, 0.2);
            box-shadow: 0 8px 32px 0 rgba(44, 36, 27, 0.05);
        }`
    );

    // 5. Update Glass Nav
    content = content.replace(
        /\.glass-nav\s*\{\s*background:\s*rgba\(10,\s*10,\s*10,\s*0\.7\);\s*backdrop-filter:\s*blur\(16px\);\s*-webkit-backdrop-filter:\s*blur\(16px\);\s*border-bottom:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.05\);\s*\}/g,
        `.glass-nav {
            background: rgba(253, 251, 247, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(197, 160, 89, 0.15);
        }`
    );

    // 6. Update btn-gold hover (both left and right bottom variants)
    content = content.replace(
        /\.btn-gold\s*\{\s*transition:\s*all\s*0\.3s\s*ease;\s*border:\s*1px\s*solid\s*#D4AF37;\s*color:\s*#0A0A0A;\s*background:\s*linear-gradient\(to right,\s*transparent\s*50%,\s*#D4AF37\s*50%\);\s*background-size:\s*200%\s*100%;\s*background-position:\s*(right|left)\s*bottom;\s*\}\s*\.btn-gold:hover\s*\{\s*background-position:\s*(left|right)\s*bottom;\s*color:\s*#D4AF37;\s*\}/g,
        `.btn-gold {
            transition: all 0.3s ease;
            border: 1px solid #C5A059;
            color: #C5A059;
            background: linear-gradient(to right, transparent 50%, #C5A059 50%);
            background-size: 200% 100%;
            background-position: $1 bottom;
        }
        .btn-gold:hover {
            background-position: $2 bottom;
            color: #FDFBF7;
        }`
    );

    // 7. Update hero-bg to have a lighter overlay
    content = content.replace(
        /linear-gradient\(rgba\(10, 10, 10, 0\.85\), rgba\(10, 10, 10, 0\.95\)\)/g,
        `linear-gradient(rgba(253, 251, 247, 0.85), rgba(253, 251, 247, 0.95))`
    );
    content = content.replace(
        /linear-gradient\(rgba\(10, 10, 10, 0\.9\), rgba\(10, 10, 10, 0\.95\)\)/g,
        `linear-gradient(rgba(253, 251, 247, 0.9), rgba(253, 251, 247, 0.95))`
    );
    content = content.replace(
        /linear-gradient\(rgba\(10, 10, 10, 0\.8\), rgba\(10, 10, 10, 0\.9\)\)/g,
        `linear-gradient(rgba(253, 251, 247, 0.8), rgba(253, 251, 247, 0.9))`
    );
    content = content.replace(
        /linear-gradient\(rgba\(10, 10, 10, 0\.7\), rgba\(10, 10, 10, 0\.9\)\)/g,
        `linear-gradient(rgba(253, 251, 247, 0.7), rgba(253, 251, 247, 0.9))`
    );

    // 8. Replace hardcoded dark mode utility classes in HTML
    content = content.replace(/text-gray-400/g, 'text-gray-500'); 
    content = content.replace(/text-gray-300/g, 'text-gray-500');
    content = content.replace(/bg-black\/50/g, 'bg-surface/80');
    content = content.replace(/bg-black\/40/g, 'bg-surface/60');
    content = content.replace(/bg-surface\/30/g, 'bg-surface/50');
    content = content.replace(/border-white\/5/g, 'border-gold/10');
    content = content.replace(/border-white\/10/g, 'border-gold/20');
    content = content.replace(/hover:bg-white\/5/g, 'hover:bg-gold/5');
    content = content.replace(/bg-white\/5/g, 'bg-gold/5');
    content = content.replace(/from-black/g, 'from-obsidian');
    content = content.replace(/to-black/g, 'to-obsidian');
    content = content.replace(/bg-black/g, 'bg-obsidian');
    
    // Update some generic white text that doesn't use the 'offwhite' alias
    content = content.replace(/text-white/g, 'text-offwhite'); 

    // Specific fix for "text-gray-500" if it was already there?
    // The previous text-gray-500 was used rarely, our new one maps to taupe.

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Theme updated successfully.');
