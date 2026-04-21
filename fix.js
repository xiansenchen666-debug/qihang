const fs = require('fs');
const files = ['index.html', 'about.html', 'cases.html', 'hongkong.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Fix btn-gold css
    content = content.replace(
        /\.btn-gold\s*\{\s*transition:\s*all\s*0\.3s\s*ease;\s*border:\s*1px\s*solid\s*#C5A059;\s*color:\s*#C5A059;\s*background:\s*linear-gradient\(to right,\s*transparent\s*50%,\s*#C5A059\s*50%\);\s*background-size:\s*200%\s*100%;\s*background-position:\s*(right|left)\s*bottom;\s*\}\s*\.btn-gold:hover\s*\{\s*background-position:\s*(left|right)\s*bottom;\s*color:\s*#FDFBF7;\s*\}/g,
        `.btn-gold {
            transition: all 0.3s ease;
            border: 1px solid #C5A059;
            color: #FDFBF7;
            background: linear-gradient(to right, transparent 50%, #C5A059 50%);
            background-size: 200% 100%;
            background-position: $1 bottom;
        }
        .btn-gold:hover {
            background-position: $2 bottom;
            color: #C5A059;
        }`
    );

    fs.writeFileSync(file, content, 'utf8');
});

// Fix icon in hongkong.html
let hk = fs.readFileSync('hongkong.html', 'utf8');
hk = hk.replace(/<i data-lucide="passport" class="w-6 h-6"><\/i>/g, '<i data-lucide="id-card" class="w-6 h-6"></i>');
fs.writeFileSync('hongkong.html', hk, 'utf8');

console.log('Fixed button text color and icon');