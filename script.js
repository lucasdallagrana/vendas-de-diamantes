// Dados dos Pacotes de Diamantes
const packages = [
    { id: 1, amount: 100, bonus: 10, price: 4.50, popular: false },
    { id: 2, amount: 310, bonus: 31, price: 13.00, popular: false },
    { id: 3, amount: 520, bonus: 52, price: 20.90, popular: true },
    { id: 4, amount: 1060, bonus: 106, price: 41.50, popular: false },
    { id: 5, amount: 2180, bonus: 218, price: 87.00, popular: false }
];

let selectedPackage = null;
let isIdValid = false;

// Renderiza os pacotes dinamicamente no HTML
function renderPackages() {
    const container = document.getElementById('packages-container');
    container.innerHTML = '';

    packages.forEach(pkg => {
        const isSelected = selectedPackage && selectedPackage.id === pkg.id;
        
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
                <div class="bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 text-red-500">
                    <i data-lucide="gem" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-xl font-bold font-gaming text-white tracking-wide">${pkg.amount} Diamantes</span>
                    </div>
                    <span class="text-xs text-yellow-400 font-semibold">+${pkg.bonus} Bônus</span>
                </div>
            </div>
            <div class="text-right">
                <span class="text-lg font-bold text-emerald-400 font-gaming">R$ ${pkg.price.toFixed(2).replace('.', ',')}</span>
            </div>
        `;

        container.appendChild(card);
    });

    // Reinicializar ícones do Lucide após alterar o DOM
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Seleciona um pacote
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

    // Validação simples: apenas números e comprimento de 8 a 12 dígitos
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
        summaryPkg.textContent = `${selectedPackage.amount} Diamantes`;
        summaryBonus.textContent = `+${selectedPackage.bonus} Dima`;
        summaryTotal.textContent = `R$ ${selectedPackage.price.toFixed(2).replace('.', ',')}`;
    } else {
        summaryPkg.textContent = 'Nenhum';
        summaryBonus.textContent = '+0 Dima';
        summaryTotal.textContent = 'R$ 0,00';
    }

    summaryId.textContent = isIdValid ? idInput : (idInput ? 'Pendente de validação' : 'Não informado');

    // Habilitar botão apenas se pacote estiver selecionado e ID for válido
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
    document.getElementById('modal-amount').textContent = `${selectedPackage.amount} + ${selectedPackage.bonus} (Bônus) Diamantes`;
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
    renderPackages();
    updateSummary();
}

// Event listener para validação em tempo real ao digitar
document.getElementById('player-id').addEventListener('input', () => {
    isIdValid = false;
    document.getElementById('id-feedback').classList.add('hidden');
    updateSummary();
});

// Inicialização
window.onload = function() {
    renderPackages();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};