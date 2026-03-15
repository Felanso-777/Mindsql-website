/**
 * MINDSQL — script.js
 * Terminal: boot sequence, command history, tab completion, glitch, commands
 */

const terminalInput  = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody   = document.getElementById('terminal-body');

let commandHistory = [];
let historyIndex   = -1;

terminalBody.addEventListener('click', () => terminalInput.focus());

/* ─── Output helpers ─────────────────────────────────── */

function appendOutput(html, isCommand = false) {
    const p = document.createElement('p');
    p.className = 'fade-in';
    p.innerHTML = isCommand
        ? `<span class="prompt">root@mindsql:~$</span> <span style="color:#fff">${html}</span>`
        : html;
    terminalOutput.appendChild(p);
    scrollBottom();
}

function scrollBottom() {
    setTimeout(() => { terminalBody.scrollTop = terminalBody.scrollHeight; }, 12);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

/* ─── Boot sequence ─────────────────────────────────── */

async function bootSequence() {
    terminalInput.disabled = true;

    const lines = [
        { t: '[  0.000000] MINDSQL kernel v1.0.0 loading…', cls: 'boot-line', d: 120 },
        { t: '[  0.008823] Initializing AI inference engine…', cls: 'boot-line', d: 260 },
        { t: '[  0.021547] Loading SQL parser modules… <span style="color:var(--green)">[OK]</span>', cls: 'boot-line', d: 220 },
        { t: '[  0.038902] Mounting database drivers… <span style="color:var(--green)">[OK]</span>', cls: 'boot-line', d: 280 },
        { t: '[  0.052310] <span style="color:var(--yellow)">[WARN]</span> API key not configured — run <span class="accent">setup</span> to configure.', cls: 'boot-line warn', d: 200 },
        { t: '[  0.071884] NLP transformer model loaded… <span style="color:var(--green)">[OK]</span>', cls: 'boot-line', d: 320 },
        { t: '[  0.089001] PostgreSQL / MySQL / SQLite adapters ready.', cls: 'boot-line', d: 220 },
        { t: '[  0.097432] Terminal ready. <span style="color:var(--green)">[OK]</span>', cls: 'boot-line', d: 180 },
    ];

    for (const line of lines) {
        await delay(line.d);
        const p = document.createElement('p');
        p.className = `fade-in ${line.cls || ''}`;
        p.innerHTML = line.t;
        terminalOutput.appendChild(p);
        scrollBottom();
    }

    await delay(500);
    terminalOutput.innerHTML = '';

    appendOutput(`Welcome to <span class="accent">MINDSQL</span> v1.0.0 — Type <span class="accent">help</span> for available commands.`);

    terminalInput.disabled = false;
    terminalInput.focus();

    // Start periodic glitch on ASCII art
    const ascii = document.querySelector('.ascii-art');
    if (ascii) {
        setTimeout(() => triggerGlitch(ascii), 600);

        setInterval(() => {
            if (Math.random() > 0.55) triggerGlitch(ascii);
        }, 6000);
    }
}

function triggerGlitch(el) {
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 360);
}

/* ─── OS logos (ASCII) ───────────────────────────────── */

const osLogos = {
    windows: `<pre style="color:#00a4ef;margin:8px 0">  _      ___         __             
 | | /| / (_)___  __/ /___ _      __
 | |/ |/ / / __ \\/ __  / __ \\ | /| / /
 |__/ |__/_/_/ /_/\\__,_/\\____/|__/|__/</pre>`,
    ubuntu: `<pre style="color:#E95420;margin:8px 0">   __  ____                 __       
  / / / / /_  __  ______  / /___  __
 / / / / __ \\/ / / / __ \\/ __/ / / /
\\____/_.___/\\__,_/_/ /_/\\__/\\__,_/</pre>`,
    macos: `<pre style="color:#aaa;margin:8px 0">    ___                __   
   /   |  ____  ____  / /__ 
  / /| | / __ \\/ __ \\/ / _ \\
 / ___ |/ /_/ / /_/ / /  __/
/_/  |_/ .___/ .___/_/\\___/ 
      /_/   /_/</pre>`,
    apple: null,
    mac: null,
    linux: null,
};
osLogos.apple = osLogos.macos;
osLogos.mac   = osLogos.macos;
osLogos.linux = osLogos.ubuntu;

/* ─── Built-in commands ─────────────────────────────── */

const COMMANDS = {

    help() {
        return `<div style="color:var(--text-muted);margin-bottom:0.5rem">Available commands:</div>
<div style="display:grid;grid-template-columns:auto 1fr;gap:0.15rem 1.5rem">
  <span style="color:var(--accent-color)">help</span><span style="color:var(--text-muted)">Show this help</span>
  <span style="color:var(--accent-color)">about</span><span style="color:var(--text-muted)">About MindSQL</span>
  <span style="color:var(--accent-color)">version</span><span style="color:var(--text-muted)">Version information</span>
  <span style="color:var(--accent-color)">team</span><span style="color:var(--text-muted)">Meet the core team</span>
  <span style="color:var(--accent-color)">features</span><span style="color:var(--text-muted)">Core feature list</span>
  <span style="color:var(--accent-color)">whoami</span><span style="color:var(--text-muted)">Who are you?</span>
  <span style="color:var(--accent-color)">github</span><span style="color:var(--text-muted)">Open GitHub repo</span>
  <span style="color:var(--accent-color)">status</span><span style="color:var(--text-muted)">System status check</span>
  <span style="color:var(--accent-color)">[os], sql --install</span><span style="color:var(--text-muted)">Install (windows / ubuntu / macos)</span>
  <span style="color:var(--accent-color)">clear</span><span style="color:var(--text-muted)">Clear terminal</span>
</div>`;
    },

    about() {
        return `<span style="color:var(--accent-light)">MindSQL</span> bridges the gap between human language and database queries.<br>
A terminal-based AI tool that translates plain English into SQL — fast, local, and offline-capable.<br>
<span style="color:var(--text-muted)">Built by the <span style="color:var(--accent-color)">small2big</span> team · Kerala, India · 2026</span>`;
    },

    version() {
        return `<span class="accent">MINDSQL</span> v1.0.0 <span style="color:var(--text-muted)">stable</span><br>
<span style="color:var(--text-muted)">Build:  2026.03.15</span><br>
<span style="color:var(--text-muted)">NLP:    GPT-4o (local inference)</span><br>
<span style="color:var(--text-muted)">DBs:    PostgreSQL · MySQL · SQLite</span><br>
<span style="color:var(--text-muted)">License: MIT</span>`;
    },

    team() {
        return `<span style="color:var(--accent-color)">Core Team — small2big</span><br>
<span style="color:var(--text-muted)">  ▸</span> Adam Felanso Sijo     <span style="color:var(--text-muted)">— Lead Developer</span><br>
<span style="color:var(--text-muted)">  ▸</span> Akhildev C Vasudevan  <span style="color:var(--text-muted)">— AI Engineer</span><br>
<span style="color:var(--text-muted)">  ▸</span> Alex Chittilappilly   <span style="color:var(--text-muted)">— Backend Developer</span><br>
<span style="color:var(--text-muted)">  ▸</span> Alvin N.S             <span style="color:var(--text-muted)">— Systems Architect</span>`;
    },

    features() {
        return `<span style="color:var(--accent-color)">⚡ Terminal Native</span>   — Optimized for CLI workflows<br>
<span style="color:var(--accent-color)">🧠 AI-Powered</span>        — Natural language → SQL translation<br>
<span style="color:var(--accent-color)">🗄  Multi-Database</span>   — PostgreSQL, MySQL, SQLite<br>
<span style="color:var(--accent-color)">🔒 Local Inference</span>   — Your data never leaves your machine<br>
<span style="color:var(--accent-color)">🚀 Cross-Platform</span>    — Windows, macOS, Linux`;
    },

    whoami() {
        const msgs = [
            'You are a developer. You understand the power of SQL. That makes you dangerous. Welcome.',
            'Someone curious enough to type whoami into a fake terminal. We respect that.',
            'A future MindSQL power user. The query whisperer.',
            'root. Always root.',
        ];
        return `<span style="color:var(--text-muted);font-style:italic">${msgs[Math.floor(Math.random() * msgs.length)]}</span>`;
    },

    github() {
        setTimeout(() => window.open('https://github.com', '_blank'), 200);
        return `<span style="color:var(--green)">Opening GitHub…</span>`;
    },

    async status() {
        // Simulate a status check
        appendOutput('<span style="color:var(--text-muted)">Running diagnostics…</span>');
        await delay(400);
        appendOutput(`<span style="color:var(--green)">✓</span> AI Engine      <span style="color:var(--green)">ONLINE</span>`);
        await delay(220);
        appendOutput(`<span style="color:var(--green)">✓</span> SQL Parser     <span style="color:var(--green)">READY</span>`);
        await delay(180);
        appendOutput(`<span style="color:var(--yellow)">⚠</span> API Key        <span style="color:var(--yellow)">NOT SET</span>`);
        await delay(200);
        appendOutput(`<span style="color:var(--green)">✓</span> DB Adapters    <span style="color:var(--green)">3 LOADED</span>`);
        return null; // already output above
    },
};

/* ─── Download helper ───────────────────────────────── */

function downloadInstaller(os, content) {
    const clean = content.replace(/<[^>]*>/gm, '');
    const blob  = new Blob([clean], { type: 'text/plain' });
    const url   = URL.createObjectURL(blob);
    const a     = Object.assign(document.createElement('a'), { href: url, download: `mindsql-${os}-installer.txt`, style: 'display:none' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ─── Command processor ─────────────────────────────── */

async function processCommand(cmd) {
    const command = cmd.toLowerCase().trim();
    appendOutput(cmd, true);
    terminalInput.value = '';

    if (!command) return;

    // History
    if (commandHistory[0] !== cmd) commandHistory.unshift(cmd);
    if (commandHistory.length > 60) commandHistory.pop();
    historyIndex = -1;

    if (command === 'clear') { terminalOutput.innerHTML = ''; return; }

    if (COMMANDS[command]) {
        const result = await COMMANDS[command]();
        if (result !== null && result !== undefined) appendOutput(result);
        return;
    }

    // [os], sql --install
    const match = command.match(/^([a-z0-9]+)\s*,\s*sql\s+--install$/);
    if (match) {
        const os = match[1];
        terminalInput.disabled = true;

        const steps = [
            { t: '<span class="boot-line">Verifying OS compatibility…</span>', d: 380 },
            { t: '<span class="boot-line">Allocating memory buffers…</span>', d: 440 },
            { t: '<span class="boot-line">Fetching MINDSQL from repository…</span>', d: 680 },
            { t: '<span class="boot-line">Decompressing package…</span>', d: 500 },
            { t: '<span class="boot-line">Installing dependencies…</span>', d: 560 },
            { t: '<span class="boot-line">Finalizing…</span>', d: 300 },
        ];

        for (const s of steps) { await delay(s.d); appendOutput(s.t); }

        await delay(350);

        const logo = osLogos[os];
        appendOutput(logo || `<span style="color:#ccc">[ OS: ${os.toUpperCase()} Recognized ]</span>`);
        downloadInstaller(os, logo || os);

        await delay(250);
        appendOutput(`<span class="success">✓ SUCCESS</span>  MINDSQL installed for ${os.toUpperCase()}.`);

        if (window.showToast) showToast(`✓ MINDSQL installed for ${os.toUpperCase()}`, 'success');

        terminalInput.disabled = false;
        terminalInput.focus();
        return;
    }

    appendOutput(`<span style="color:#ff5f56">Command not recognized:</span> ${command}`);
    appendOutput(`Type <span class="accent">help</span> for available commands.`);
}

/* ─── Key bindings ──────────────────────────────────── */

terminalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        processCommand(terminalInput.value);
        return;
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        }
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;
            terminalInput.value = '';
        }
        return;
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        const input = terminalInput.value.toLowerCase().trim();
        if (!input) return;
        const allCmds = [...Object.keys(COMMANDS), 'clear', 'windows, sql --install', 'ubuntu, sql --install', 'macos, sql --install'];
        const found = allCmds.find(c => c.startsWith(input) && c !== input);
        if (found) terminalInput.value = found;
    }
});

/* ─── Start ─────────────────────────────────────────── */

bootSequence();
