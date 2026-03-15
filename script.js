const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

// LINK GITHUB RELEASES HERE.
// const githubReleases = "https://github.com/mindsql/releases";

terminalBody.addEventListener('click', () => {
    terminalInput.focus();
});

function appendOutput(html, isCommand = false) {
    const p = document.createElement('p');
    p.className = 'fade-in';

    if (isCommand) {
        p.innerHTML = `<span class="prompt">root@mindsql:~$</span> <span style="color: #fff">${html}</span>`;
    } else {
        p.innerHTML = html;
    }

    terminalOutput.appendChild(p);
    scrollToBottom();
}

function scrollToBottom() {
    // Small delay to let DOM paint
    setTimeout(() => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }, 10);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const osLogos = {
    windows: `
<pre style="color: #00a4ef; margin: 10px 0;">
  _      ___         __             
 | | /| / (_)___  __/ /___ _      __
 | |/ |/ / / __ \\/ __  / __ \\ | /| / /
 |  /|  / / / / / /_/ / /_/ / |/ |/ / 
 |__/ |__/_/_/ /_/\\__,_/\\____/|__/|__/  
</pre>`,
    ubuntu: `
<pre style="color: #E95420; margin: 10px 0;">
   __  ____                 __       
  / / / / /_  __  ______  / /___  __
 / / / / __ \\/ / / / __ \\/ __/ / / /
/ /_/ / /_/ / /_/ / / / / /_/ /_/ / 
\\____/_.___/\\__,_/_/ /_/\\__/\\__,_/  
</pre>`,
    apple: `
<pre style="color: #ffffff; margin: 10px 0;">
    ___                __   
   /   |  ____  ____  / /__ 
  / /| | / __ \\/ __ \\/ / _ \\
 / ___ |/ /_/ / /_/ / /  __/
/_/  |_/ .___/ .___/_/\\___/ 
      /_/   /_/             
</pre>`,
    mac: `
<pre style="color: #ffffff; margin: 10px 0;">
    ___                __   
   /   |  ____  ____  / /__ 
  / /| | / __ \\/ __ \\/ / _ \\
 / ___ |/ /_/ / /_/ / /  __/
/_/  |_/ .___/ .___/_/\\___/ 
      /_/   /_/             
</pre>`,
    macos: `
<pre style="color: #ffffff; margin: 10px 0;">
    ___                __   
   /   |  ____  ____  / /__ 
  / /| | / __ \\/ __ \\/ / _ \\
 / ___ |/ /_/ / /_/ / /  __/
/_/  |_/ .___/ .___/_/\\___/ 
      /_/   /_/             
</pre>`
};

function downloadInstaller(os, content) {
    // Strip HTML tags to make it a clean text file
    let cleanContent = content.replace(/<[^>]*>?/gm, '');

    // Create a Blob containing the text
    const blob = new Blob([cleanContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `mindsql-${os}-installer.txt`;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function processCommand(cmd) {
    // Handle inputs lowercase internally to prevent Caps Lock errors
    const command = cmd.toLowerCase().trim();

    // Display original raw input in the terminal as command
    appendOutput(cmd, true);
    terminalInput.value = '';

    if (!command) return;

    if (command === 'clear') {
        terminalOutput.innerHTML = '';
        return;
    }

    // Match pattern: "[os], sql --install"
    const match = command.match(/^([a-z0-9]+)\s*,\s*sql\s+--install$/);

    if (match) {
        const os = match[1];

        terminalInput.disabled = true;

        await delay(500);
        appendOutput('<span class="system">Verifying OS...</span>');

        await delay(800);
        appendOutput('<span class="system">Allocating Memory...</span>');

        await delay(800);
        appendOutput('<span class="system">Fetching MINDSQL from Git...</span>');

        await delay(1000);

        if (osLogos[os]) {
            appendOutput(osLogos[os]);
            downloadInstaller(os, osLogos[os]);
        } else {
            appendOutput(`<span style="color: #ccc;">[ OS: ${os.toUpperCase()} Recognized ]</span>`);
            downloadInstaller(os, `[ OS: ${os.toUpperCase()} Installer Data ]`);
        }

        await delay(500);
        appendOutput('<span class="success">SUCCESS</span>  MINDSQL installed successfully.');

        terminalInput.disabled = false;
        terminalInput.focus();
    } else {
        appendOutput(`<span style="color: #ff5f56;">Command not recognized: ${command}</span>`);
        appendOutput(`Try: 'windows, sql --install' or 'ubuntu, sql --install'`);
    }
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        processCommand(terminalInput.value);
    }
});
