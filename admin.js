let osCount = {};
let browserCount = {};
let locationCount = 0;

// Função para abrir abas
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    
    // Atualizar estatísticas específicas da aba
    if (tabName === 'devicesTab') {
        updateDeviceStats();
    }
}

// Função para detectar sistema operacional a partir do user agent
function detectOS(userAgent) {
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (userAgent.indexOf("Android") !== -1) return "Android";
    if (userAgent.indexOf("like Mac") !== -1) return "iOS";
    return "Outro";
}

// Função para detectar navegador a partir do user agent
function detectBrowser(userAgent) {
    if (userAgent.indexOf("Firefox") !== -1) return "Firefox";
    if (userAgent.indexOf("SamsungBrowser") !== -1) return "Samsung Browser";
    if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1) return "Opera";
    if (userAgent.indexOf("Edg") !== -1) return "Edge";
    if (userAgent.indexOf("Chrome") !== -1) return "Chrome";
    if (userAgent.indexOf("Safari") !== -1) return "Safari";
    return "Outro";
}

// Função para detectar dispositivo a partir do user agent
function detectDevice(userAgent) {
    if (userAgent.indexOf("Mobile") !== -1) {
        if (userAgent.indexOf("iPhone") !== -1) return "iPhone";
        if (userAgent.indexOf("iPad") !== -1) return "iPad";
        if (userAgent.indexOf("Android") !== -1) {
            // Tenta pegar modelo Android
            const match = userAgent.match(/Android [0-9.]+; ([^;)]+)/);
            if (match) return `Android (${match[1]})`;
            return "Android";
        }
        return "Dispositivo Móvel";
    }
    return "Desktop/Notebook";
}

// Função para carregar os dados
function loadData() {
    // const allData = JSON.parse(localStorage.getItem('securityDemoData') || '[]');
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    fetch('https://api.com/dados') // substitua pela rota correta
    .then(response => response.json())
    .then(allData => {
        console.log('Dados recebidos:', allData);
        allData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const os = detectOS(item.userAgent);
        const browser = detectBrowser(item.userAgent);
        const device = detectDevice(item.userAgent);
        
        // Contagem para estatísticas
        osCount[os] = (osCount[os] || 0) + 1;
        browserCount[browser] = (browserCount[browser] || 0) + 1;
        if (item.location_lat && typeof item.location_lng === 'string') {
            locationCount++;
        }
        
        const timestamp = new Date(item.timestamp).toLocaleString();
        
        row.innerHTML = `
            <td>${timestamp}</td>
            <td>${device}</td>
            <td>${os}</td>
            <td>${browser}</td>
            <td>${item.ipInfo || 'N/A'}</td>
            <td>${item.batteryLevel || 'N/A'}</td>
            <td><button class="btn" onclick="showDetails(${index})">Detalhes</button></td>
        `;
        
        tableBody.appendChild(row);
        
        
        
        // Atualizar estatísticas
        document.getElementById('totalAccesses').textContent = allData.length;
        document.getElementById('totalOS').textContent = Object.keys(osCount).length;
        document.getElementById('totalBrowsers').textContent = Object.keys(browserCount).length;
        document.getElementById('totalWithLocation').textContent = locationCount;
        
        // Atualizar estatísticas de dispositivos se a aba estiver aberta
        if (document.getElementById('devicesTab').style.display === 'block') {
            updateDeviceStats();
        }

    });
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
    
    
}

// Função para atualizar estatísticas de dispositivos
function updateDeviceStats() {
    //const allData = JSON.parse(localStorage.getItem('securityDemoData') || '[]');

    fetch('https://api.com/dados') // substitua pela rota correta
    .then(response => response.json())
    .then(allData => {
        console.log('Dados recebidos para atualizar:', allData);

        let osCount = {};
        let browserCount = {};
        
        
        allData.forEach(item => {
            const os = detectOS(item.userAgent);
            const browser = detectBrowser(item.userAgent);
            
            osCount[os] = (osCount[os] || 0) + 1;
            browserCount[browser] = (browserCount[browser] || 0) + 1;
        });
        
        // Mostrar estatísticas de sistemas operacionais
        const osStatsContent = document.getElementById('osStatsContent');
        osStatsContent.innerHTML = '';
        
        if (Object.keys(osCount).length > 0) {
            const osTable = document.createElement('table');
            osTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Sistema Operacional</th>
                        <th>Contagem</th>
                        <th>Porcentagem</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            for (const os in osCount) {
                const percent = ((osCount[os] / allData.length) * 100).toFixed(1);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${os}</td>
                    <td>${osCount[os]}</td>
                    <td>${percent}%</td>
                `;
                osTable.querySelector('tbody').appendChild(row);
            }
            
            osStatsContent.appendChild(osTable);
        } else {
            osStatsContent.innerHTML = '<p>Nenhum dado disponível</p>';
        }
        
        // Mostrar estatísticas de navegadores
        const browserStatsContent = document.getElementById('browserStatsContent');
        browserStatsContent.innerHTML = '';
        
        if (Object.keys(browserCount).length > 0) {
            const browserTable = document.createElement('table');
            browserTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Navegador</th>
                        <th>Contagem</th>
                        <th>Porcentagem</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            for (const browser in browserCount) {
                const percent = ((browserCount[browser] / allData.length) * 100).toFixed(1);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${browser}</td>
                    <td>${browserCount[browser]}</td>
                    <td>${percent}%</td>
                `;
                browserTable.querySelector('tbody').appendChild(row);
            }
            
            browserStatsContent.appendChild(browserTable);
        } else {
            browserStatsContent.innerHTML = '<p>Nenhum dado disponível</p>';
        }
        
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
    
    
}

// Função para mostrar detalhes
function showDetails(index) {    

    fetch('https://api.com/dados') // substitua pela rota correta
    .then(response => response.json())
    .then(allData => {
        const item = allData[index];
        console.log('Dados recebidos em detalhes:', allData);
        // Exibir no HTML
        const detailView = document.getElementById('detailView');
        detailView.style.display = 'block';
        
        const detailContent = document.getElementById('detailContent');
        
        let locationText = 'Não disponível';
        if (item.location_lat && typeof item.location_lat !== 'string') {
            locationText = `Latitude: ${item.location_lat}, Longitude: ${item.location_lng}`;
        } else if (typeof item.location_lat === 'string') {
            locationText = "Lat:"+item.location_lat+ " | Lng:"+item.location_lng;
        }
        
        detailContent.innerHTML = `
            <h3>Dados Coletados da Sessão #${index + 1}</h3>
            <div class="detail-row">
                <div class="detail-label">Data/Hora:</div>
                <div class="detail-value">${new Date(item.timestamp).toLocaleString()}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Sessão ID:</div>
                <div class="detail-value">${item.sessionId}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">User Agent:</div>
                <div class="detail-value">${item.userAgent}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Idioma:</div>
                <div class="detail-value">${item.language}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Plataforma:</div>
                <div class="detail-value">${item.platform}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Resolução:</div>
                <div class="detail-value">${item.screenSize}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Endereço IP:</div>
                <div class="detail-value">${item.ipInfo || 'Não disponível'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Bateria:</div>
                <div class="detail-value">${item.batteryLevel || 'Não disponível'} ${item.batteryCharging ? '(Carregando)' : ''}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Referenciador:</div>
                <div class="detail-value">${item.referrer}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Localização:</div>
                <div class="detail-value">${locationText}</div>
            </div>
            <div class="detail-row">
                <iframe class="map-teste" src="https://maps.google.com.br/maps?q=@${item.location_lat},${item.location_lng}&output=embed&dg=oo" frameborder="0"></iframe>
            </div>
        `;
        
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
    
    
}

// Função para exportar dados
function exportData() {
    fetch('https://api.com/dados') // substitua pela rota correta
    .then(response => response.json())
    .then(allData => {
        console.log('Dados exportados:', allData);

        if (allData.length === 0) {
        alert('Não há dados para exportar');
        return;
    }
    
    // Converter para CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Cabeçalhos
    const headers = ["Data/Hora", "Dispositivo", "Sistema", "Navegador", "IP", "Bateria", "Idioma", "Localização"];
    csvContent += headers.join(",") + "\n";
    
    // Linhas de dados
    allData.forEach(item => {
        const os = detectOS(item.userAgent);
        const browser = detectBrowser(item.userAgent);
        const device = detectDevice(item.userAgent);
        
        let locationText = "Não disponível";
        if (item.location_lat && typeof item.location !== 'string') {
            locationText = `${item.location_lat},${item.location_lng}`;
        }
        
        const row = [
            new Date(item.timestamp).toLocaleString(),
            device,
            os,
            browser,
            item.ipInfo || 'N/A',
            item.batteryLevel || 'N/A',
            item.language,
            locationText
        ];
        
        // Escapar valores com vírgulas
        const escapedRow = row.map(value => {
            // Se contém vírgula, aspas ou quebra de linha, colocar entre aspas
            if (/[",\n\r]/.test(value)) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        
        csvContent += escapedRow.join(",") + "\n";
    });
    
    // Criar link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dados_demonstracao_seguranca.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
        
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
    
    
}

// Adicionar listeners de eventos
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('refreshBtn').addEventListener('click', loadData);
    
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    document.getElementById('clearBtn').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('securityDemoData');
            loadData();
            document.getElementById('detailView').style.display = 'none';
        }
    });
    
    // Carregar dados ao iniciar
    loadData();
});

// Expor função para chamadas externas
window.showDetails = showDetails;
window.openTab = openTab;