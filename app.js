// Mock Database
const phoneDirectory = [
    {
        number: "+8801700000000",
        name: "রাকিব হাসান",
        carrier: "Grameenphone",
        location: "ঢাকা, বাংলাদেশ",
        type: "নিরাপদ কলার",
        risk: "safe",
        reports: 0,
        verified: true
    },
    {
        number: "+8801800999999",
        name: "লটারি বিজয় স্ক্যাম",
        carrier: "Robi",
        location: "চট্টগ্রাম, বাংলাদেশ",
        type: "হাই রিস্ক স্প্যাম",
        risk: "high",
        reports: 142,
        verified: false
    },
    {
        number: "+8801900111222",
        name: "ব্যাংক আপডেট ওটিপি",
        carrier: "Banglalink",
        location: "সিলেট, বাংলাদেশ",
        type: "সন্দেহজনক স্প্যাম",
        risk: "medium",
        reports: 28,
        verified: false
    }
];

// Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultContainer = document.getElementById('resultContainer');
const historyContent = document.getElementById('historyContent');
const spamContent = document.getElementById('spamContent');
const tabHistory = document.getElementById('tabHistory');
const tabSpam = document.getElementById('tabSpam');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderSpamList();
    loadSearchHistory();
});

// Tab Switching
tabHistory.addEventListener('click', () => {
    tabHistory.classList.add('text-blue-400', 'border-b-2', 'border-blue-500');
    tabHistory.classList.remove('text-slate-400');
    tabSpam.classList.remove('text-blue-400', 'border-b-2', 'border-blue-500');
    tabSpam.classList.add('text-slate-400');
    
    historyContent.classList.remove('hidden');
    spamContent.classList.add('hidden');
});

tabSpam.addEventListener('click', () => {
    tabSpam.classList.add('text-blue-400', 'border-b-2', 'border-blue-500');
    tabSpam.classList.remove('text-slate-400');
    tabHistory.classList.remove('text-blue-400', 'border-b-2', 'border-blue-500');
    tabHistory.classList.add('text-slate-400');
    
    spamContent.classList.remove('hidden');
    historyContent.classList.add('hidden');
});

// Search Submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if(!query) return;

    const result = phoneDirectory.find(item => item.number.includes(query) || item.name.includes(query));
    
    if(result) {
        displayResult(result);
        saveHistory(result);
    } else {
        displayNotFound(query);
    }
});

function displayResult(data) {
    let riskBadge = '';
    if(data.risk === 'safe') {
        riskBadge = `<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">নিরাপদ কলার</span>`;
    } else if(data.risk === 'high') {
        riskBadge = `<span class="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-medium"><i class="fas fa-exclamation-triangle mr-1"></i>স্প্যাম (${data.reports} রিপোর্ট)</span>`;
    } else {
        riskBadge = `<span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-medium">সন্দেহজনক কলার</span>`;
    }

    resultContainer.innerHTML = `
        <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div class="flex items-center space-x-4">
                    <div class="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                        ${data.name.charAt(0)}
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h3 class="text-lg font-bold text-white">${data.name}</h3>
                            ${data.verified ? '<i class="fas fa-check-circle text-blue-400" title="Verified"></i>' : ''}
                        </div>
                        <p class="text-sm text-slate-400">${data.number}</p>
                        <p class="text-xs text-slate-500 mt-0.5">${data.carrier} • ${data.location}</p>
                    </div>
                </div>
                <div>
                    ${riskBadge}
                </div>
            </div>
        </div>
    `;
    resultContainer.classList.remove('hidden');
}

function displayNotFound(query) {
    resultContainer.innerHTML = `
        <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
            <p class="text-slate-400 text-sm">"${query}" এর জন্য কোনো কলার ডাটা পাওয়া যায়নি।</p>
        </div>
    `;
    resultContainer.classList.remove('hidden');
}

function renderSpamList() {
    const spams = phoneDirectory.filter(i => i.risk !== 'safe');
    spamContent.innerHTML = spams.map(item => `
        <div class="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <div>
                <p class="text-sm font-semibold text-rose-300">${item.name}</p>
                <p class="text-xs text-slate-400">${item.number}</p>
            </div>
            <span class="text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">${item.reports} টি রিপোর্ট</span>
        </div>
    `).join('');
}

function saveHistory(item) {
    let history = JSON.parse(localStorage.getItem('truecaller_history') || '[]');
    history = [item, ...history.filter(h => h.number !== item.number)].slice(0, 5);
    localStorage.setItem('truecaller_history', JSON.stringify(history));
    loadSearchHistory();
}

function loadSearchHistory() {
    let history = JSON.parse(localStorage.getItem('truecaller_history') || '[]');
    if(history.length === 0) {
        historyContent.innerHTML = `<p class="text-xs text-slate-500 text-center py-2">কোনো সাম্প্রতিক সার্চ ইতিহাস নেই</p>`;
        return;
    }
    historyContent.innerHTML = history.map(item => `
        <div class="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
            <div>
                <p class="text-sm font-medium text-slate-200">${item.name}</p>
                <p class="text-xs text-slate-400">${item.number}</p>
            </div>
            <span class="text-xs text-slate-400">${item.carrier}</span>
        </div>
    `).join('');
}
