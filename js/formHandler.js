document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('petForm');
    const hasPetsSelect = document.getElementById('hasPets');
    const petCountGroup = document.getElementById('petCountGroup');
    const resultsDiv = document.getElementById('results');
    const otherResultsDiv = document.getElementById('otherResults');
    const showMoreResultsBtn = document.getElementById('showMoreResults');

    // Lógica para o formulário
    if (hasPetsSelect) {
        hasPetsSelect.addEventListener('change', function() {
            petCountGroup.style.display = this.value === 'sim' ? 'block' : 'none';
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                this.submit();
            }
        });
    }

    // Lógica para a página de resultados
    if (resultsDiv) {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const age = urlParams.get('age');
        const hasPets = urlParams.get('hasPets');
        const petCount = urlParams.get('petCount');

        displayUserResults(email, age, hasPets, petCount);

        const simulatedData = generateSimulatedData();
        const allData = [...simulatedData, {age: parseInt(age), hasPets: hasPets, petCount: parseInt(petCount) || 0}];
        
        updateCharts(allData);
        displayOtherResults(simulatedData.slice(0, 3));

        if (showMoreResultsBtn) {
            showMoreResultsBtn.addEventListener('click', function() {
                displayOtherResults(simulatedData.slice(3));
                this.style.display = 'none';
            });
        }
    }
});

function validateForm() {
    let isValid = true;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const hasPets = document.getElementById('hasPets').value;
    const petCount = document.getElementById('petCount').value;

    if (!email || !isValidEmail(email)) {
        alert('Por favor, insira um email válido.');
        isValid = false;
    }

    if (!age || age < 1 || age > 120) {
        alert('Por favor, insira uma idade válida entre 1 e 120 anos.');
        isValid = false;
    }

    if (hasPets === '') {
        alert('Por favor, selecione se possui animais de estimação.');
        isValid = false;
    }

    if (hasPets === 'sim' && (!petCount || petCount < 1)) {
        alert('Por favor, insira um número válido de animais de estimação.');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function displayUserResults(email, age, hasPets, petCount) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Seus Dados:</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Idade:</strong> ${age}</p>
        <p><strong>Possui animais de estimação:</strong> ${hasPets}</p>
        ${hasPets === 'sim' ? `<p><strong>Quantidade de animais:</strong> ${petCount}</p>` : ''}
    `;
}

function generateSimulatedData() {
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            age: Math.floor(Math.random() * 60) + 20,
            hasPets: Math.random() > 0.5 ? 'sim' : 'não',
            petCount: Math.floor(Math.random() * 5)
        });
    }
    return data;
}

function displayOtherResults(data) {
    const otherResultsDiv = document.getElementById('otherResults');
    data.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <p><strong>Idade:</strong> ${user.age}</p>
            <p><strong>Possui animais de estimação:</strong> ${user.hasPets}</p>
            ${user.hasPets === 'sim' ? `<p><strong>Quantidade de animais:</strong> ${user.petCount}</p>` : ''}
            <hr>
        `;
        otherResultsDiv.appendChild(userDiv);
    });
}

function updateCharts(data) {
    const ages = data.map(user => user.age);
    const petOwners = data.filter(user => user.hasPets === 'sim').length;
    const nonPetOwners = data.length - petOwners;

    createAgeChart(ages);
    createPetOwnershipChart(petOwners, nonPetOwners);
}

function createAgeChart(ages) {
    const options = {
        chart: {
            type: 'bar',
            height: 350
        },
        series: [{
            name: 'Idade',
            data: ages
        }],
        xaxis: {
            categories: ages.map((_, index) => `Usuário ${index + 1}`)
        },
        title: {
            text: 'Idade dos Participantes'
        }
    };

    const chart = new ApexCharts(document.querySelector("#ageChart"), options);
    chart.render();
}

function createPetOwnershipChart(petOwners, nonPetOwners) {
    const options = {
        chart: {
            type: 'pie',
            height: 350
        },
        series: [petOwners, nonPetOwners],
        labels: ['Possui Pets', 'Não Possui Pets'],
        title: {
            text: 'Posse de Animais de Estimação'
        }
    };

    const chart = new ApexCharts(document.querySelector("#petOwnershipChart"), options);
    chart.render();
}