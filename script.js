// Catálogo de Pacotes separado por categoria
const catalog = {
    diamantes: [
        { id: 'd1', name: '100 Diamantes', bonusText: '+10 Bônus', price: 4.50, popular: false, icon: 'gem' },
        { id: 'd2', name: '310 Diamantes', bonusText: '+31 Bônus', price: 13.00, popular: false, icon: 'gem' },
        { id: 'd3', name: '520 Diamantes', bonusText: '+52 Bônus', price: 20.90, popular: true, icon: 'gem' },
        { id: 'd4', name: '1060 Diamantes', bonusText: '+106 Bônus', price: 41.50, popular: false, icon: 'gem' },
        { id: 'd5', name: '2180 Diamantes', bonusText: '+218 Bônus', price: 87.00, popular: false, icon: 'gem' }
    ],
    passes: [
        { id: 'p1', name: 'Assinatura Semanal', bonusText: '450 Diamantes no total', price: 8.90, popular: false, icon: 'calendar' },
        { id: 'p2', name: 'Passe Booyah Premium', bonusText: 'Recompensas exclusivas', price: 14.90, popular: true, icon: 'crown' },
        { id: 'p3', name: 'Assinatura Mensal', bonusText: '2.600 Diamantes no total', price: 39.90, popular: false, icon: 'award' },
        { id: 'p4', name: 'Trilha Evolução (7 dias)', bonusText: 'Tokens + Diamantes', price: 6.50, popular: false, icon: 'zap' }
    ]
};

let currentCategory = null;
let selectedPackage = null;
let isIdValid = false;

// Abre a lista de pacotes da categoria clicada
function openCategory(category) {
    currentCategory = category;
    document.getElementById('category-selector').classList.add('hidden');
    document.getElementById('packages-container').classList.remove('hidden');
    document.getElementById('back-category-btn').classList.remove('hidden');

    const title = document.getElementById('section-title');
    if (category === 'diamantes') {
        title.innerHTML = `<i data-lucide="gem" class="text-red-500 w-5 h-5"></i> 1. Escolha o Pacote de Diamantes`;
    } else {
        title.innerHTML = `<i data-lucide="crown" class="text-yellow-500 w-5 h-5"></i> 1. Escolha o Passe`;
    }

    renderPackages();
}

// Volta para as 2 opções principais (Diamantes e Passes)
function showCategories() {
    currentCategory = null;
    document.getElementById('category-selector').classList.remove('hidden');
    document.getElementById('packages-container').classList.add('hidden');
    document.getElementById('back-category-btn').classList.add('hidden');

    const title = document.getElementById('section-title');
    title.innerHTML = `<i data-lucide="layers" class="text-red-500 w-5 h-5"></i> 1. Escolha a Categoria`;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Renderiza os itens da categoria selecionada
function renderPackages() {
    if (!currentCategory) return;

    const container = document.getElementById('packages-container');
    container.innerHTML = '';

    catalog[currentCategory].forEach(pkg => {
        const isSelected = selectedPackage && selectedPackage.id === pkg.id;
        const isPass = currentCategory === 'passes';
        
        const card = document.createElement('div');
        card.className = `card-package cursor-pointer bg-slate-900 border rounded-xl p-4 flex justify-between items-center relative ${
            isSelected ? 'card-selected' : 'border-slate-800 hover:border-slate-700'
        }`;
        card.onclick = () => selectPackage(pkg);

        card.innerHTML = `
            ${pkg.popular ? `
                <span class="absolute -top-2.5 left-4 bg-yellow-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Mais Popular
                </span>
            ` : ''}
            <div class="flex items-center space-x-3">
                <div class="${isPass ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-red-500/10 border-red-500/20 text-red-500'} p-2.5 rounded-lg border">
                    <i data-lucide="${pkg.icon}" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-xl font-bold font-gaming text-white tracking-wide">${pkg.name}</span>
                    </div>
                    <span class="text-xs text-yellow-400 font-semibold">${pkg.bonusText}</span>
                </div>
            </div>
            <div class="text-right">
                <span class="text-lg font-bold text-emerald-400 font-gaming">R$ ${pkg.price.toFixed(2).replace('.', ',')}</span>
            </div>
        `;

        container.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Seleciona um pacote ou passe
function selectPackage(pkg) {
    selectedPackage = pkg;
    renderPackages();
    updateSummary();
}

// Validação simples do ID do jogador
function validateId() {
    const input = document.getElementById('player-id');
    const feedback = document.getElementById('id-feedback');
    const idValue = input.value.trim();

    const isValid = /^\d{8,12}$/.test(idValue);

    feedback.classList.remove('hidden', 'text-emerald-400', 'text-red-400');

    if (isValid) {
        feedback.textContent = '✓ ID validado com sucesso!';
        feedback.classList.add('text-emerald-400');
        isIdValid = true;
    } else {
        feedback.textContent = '✕ Digite um ID válido (8 a 12 números).';
        feedback.classList.add('text-red-400');
        isIdValid = false;
    }

    updateSummary();
}

// Atualiza o painel de resumo e habilita/desabilita o botão
function updateSummary() {
    const summaryPkg = document.getElementById('summary-package');
    const summaryBonus = document.getElementById('summary-bonus');
    const summaryId = document.getElementById('summary-id');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const idInput = document.getElementById('player-id').value.trim();

    if (selectedPackage) {
        summaryPkg.textContent = selectedPackage.name;
        summaryBonus.textContent = selectedPackage.bonusText;
        summaryTotal.textContent = `R$ ${selectedPackage.price.toFixed(2).replace('.', ',')}`;
    } else {
        summaryPkg.textContent = 'Nenhum';
        summaryBonus.textContent = '-';
        summaryTotal.textContent = 'R$ 0,00';
    }

    summaryId.textContent = isIdValid ? idInput : (idInput ? 'Pendente de validação' : 'Não informado');

    if (selectedPackage && isIdValid) {
        checkoutBtn.disabled = false;
        checkoutBtn.className = "w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg text-sm tracking-wider uppercase shadow-lg shadow-red-600/30 transition-all duration-200 cursor-pointer";
    } else {
        checkoutBtn.disabled = true;
        checkoutBtn.className = "w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-lg text-sm tracking-wider uppercase cursor-not-allowed transition-all duration-200";
    }
}

// Processa o Modal de Confirmação
function processCheckout() {
    if (!selectedPackage || !isIdValid) return;

    const idInput = document.getElementById('player-id').value.trim();
    document.getElementById('modal-id').textContent = idInput;
    document.getElementById('modal-amount').textContent = `${selectedPackage.name} (${selectedPackage.bonusText})`;
    document.getElementById('modal-total').textContent = `R$ ${selectedPackage.price.toFixed(2).replace('.', ',')}`;

    document.getElementById('checkout-modal').classList.remove('hidden');
}

// Fecha o Modal e reseta a seleção
function closeModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
    selectedPackage = null;
    isIdValid = false;
    document.getElementById('player-id').value = '';
    document.getElementById('id-feedback').classList.add('hidden');
    showCategories();
    updateSummary();
}

// Event listener para validação em tempo real ao digitar
document.getElementById('player-id').addEventListener('input', () => {
    isIdValid = false;
    document.getElementById('id-feedback').classList.add('hidden');
    updateSummary();
});

// Inicialização dos ícones na tela inicial
window.onload = function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};