// Configurações da API
const API_URL = 'http://seu-servidor/api'; // Substitua pelo URL real do seu servidor

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

// Função para carregar os dados da API
async function loadData() {
    try {
        // Exibir indicador de carregamento (opcional)
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="7">Carregando dados...</td></tr>';
        
        // Buscar dados da API
        const response = await fetch(`${API_URL}/get_data.php`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const allData = await response.json();
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        
        let osCount = {};
        let browserCount = {};
        let locationCount = 0;
        
        allData.forEach((item, index) => {
            const row = document.createElement('tr');
            
            const os = detectOS(item.userAgent);
            const browser = detectBrowser(item.userAgent);
            const device = detectDevice(item.userAgent);
            
            // Contagem para estatísticas
            osCount[os] = (osCount[os] || 0) + 1;
            browserCount[browser] = (browserCount[browser] || 0) + 1;
            if (item.location) {
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
        });
        
        // Armazenar dados temporariamente para acesso rápido
        window.securityDemoData = allData;
        
        // Atualizar estatísticas
        document.getElementById('totalAccesses').textContent = allData.length;
        document.getElementById('totalOS').textContent = Object.keys(osCount).length;
        document.getElementById('totalBrowsers').textContent = Object.keys(browserCount).length;
        document.getElementById('totalWithLocation').textContent = locationCount;
        
        // Atualizar estatísticas de dispositivos se a aba estiver aberta
        if (document.getElementById('devicesTab').style.display === 'block') {
            updateDeviceStats();
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.getElementById('tableBody').innerHTML = `<tr><td colspan="7">Erro ao carregar dados: ${error.message}</td></tr>`;
    }
}

// Função para atualizar estatísticas de dispositivos
function updateDeviceStats() {
    if (!window.securityDemoData) {
        return;
    }
    
    const allData = window.securityDemoData;
    
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
}

// Função para mostrar detalhes
function showDetails(index) {
    if (!window.securityDemoData) {
        return;
    }
    
    const item = window.securityDemoData[index];
    
    const detailView = document.getElementById('detailView');
    detailView.style.display = 'block';
    
    const detailContent = document.getElementById('detailContent');
    
    let locationText = 'Não disponível';
    if (item.location) {
        locationText = `Latitude: ${item.location.latitude}, Longitude: ${item.location.longitude}`;
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
        
        <!-- Se houver localização, mostrar mapa -->
        ${item.location ? `
        <div class="detail-row">
            <div class="detail-label">Mapa:</div>
            <div class="detail-value">
                <div class="map-container">
                    <img src="/api/placeholder/600/300" alt="Mapa de localização">
                    <p style="text-align: center;">Simulação de mapa - Em um ambiente real, aqui seria exibido um mapa com a localização exata</p>
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

// Função para exportar dados
function exportData() {
    // Redirecionar para o endpoint de exportação
    window.location.href = `${API_URL}/export_data.php`;
}

// Função para limpar todos os dados
async function clearData() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        try {
            const response = await fetch(`${API_URL}/delete_data.php`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            // Limpar dados armazenados localmente
            window.securityDemoData = null;
            
            // Recarregar dados
            loadData();
            
            // Fechar a janela de detalhes se estiver aberta
            document.getElementById('detailView').style.display = 'none';
            
            alert('Dados removidos com sucesso!');
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            alert(`Erro ao limpar dados: ${error.message}`);
        }
    }
}

// Função para fechar detalhes
function closeDetails() {
    document.getElementById('detailView').style.display = 'none';
}

// Adicionar listeners de eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar listener para o botão de atualizar
    document.getElementById('refreshBtn').addEventListener('click', loadData);
    
    // Adicionar listener para o botão de exportar
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Adicionar listener para o botão de limpar
    document.getElementById('clearBtn').addEventListener('click', clearData);
    
    // Adicionar listener para o botão de fechar detalhes
    document.getElementById('closeDetailBtn').addEventListener('click', closeDetails);
    
    // Carregar dados ao iniciar
    loadData();
});

// Expor funções para chamadas externas
window.showDetails = showDetails;
window.openTab = openTab;
window.closeDetails = closeDetails;
window.clearData = clearData;
window.exportData = exportData;