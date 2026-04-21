const fs = require('fs');
const files = ['index.html', 'about.html', 'cases.html', 'hongkong.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Protect strings that already have the full name
    content = content.replace(/启航新未来/g, '@@TEMP_NAME@@');
    
    // Replace all standalone instances of "启航"
    content = content.replace(/启航/g, '启航新未来');
    
    // Restore the full name
    content = content.replace(/@@TEMP_NAME@@/g, '启航新未来');

    // Additional specific fixes for the English "QIHANG" text where appropriate
    content = content.replace(/QIHANG 启航新未来/g, '启航新未来');
    content = content.replace(/创立了 QIHANG/g, '创立了启航新未来');
    
    // Replace nav logo text QIHANG
    content = content.replace(/QIHANG\s*<\/a>/g, '启航新未来\n        </a>');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Company name updated in all files.');