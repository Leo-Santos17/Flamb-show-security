📌 Descrição do Projeto
Este repositório contém um sistema de IP Logger desenvolvido para fins educacionais, demonstrando como certas informações podem ser coletadas quando um usuário acessa um link. O projeto consiste em:

Uma página inicial que simula um material de apoio sobre segurança digital

Um painel administrativo que exibe os dados coletados

Um redirecionamento para um PDF após a coleta de dados

🌟 Funcionalidades Principais
Coleta de dados:

Endereço IP público

User Agent (navegador, sistema operacional, dispositivo)

Idioma preferido

Resolução de tela

Nível de bateria (quando disponível)

Geolocalização (se permitida pelo usuário)

Referenciador (de onde o usuário veio)

Painel administrativo:

Visualização tabular dos acessos

Estatísticas de dispositivos e navegadores

Detalhes completos de cada acesso

Exportação de dados para CSV

🛠️ Tecnologias Utilizadas
HTML5, CSS3 e JavaScript para o frontend

API pública para obtenção do IP (api.ipify.org)

Render para hospedagem da API de coleta de dados

📸 Screenshots
Página Inicial
{Imagem}Página inicial simulando material de segurança digital

Painel Administrativo
{Imagem}Painel administrativo mostrando dados coletados

Detalhes do Acesso
{Imagem}Tela de detalhes mostrando informações específicas

⚠️ Considerações Éticas e Legais
Este projeto foi desenvolvido apenas para fins educacionais e demonstração de conceitos de segurança digital. A coleta não autorizada de dados pessoais pode violar leis de privacidade em muitas jurisdições.

Recomendações para uso ético:

Sempre obtenha consentimento explícito dos usuários

Use os dados apenas para os fins declarados

Não armazene informações sensíveis sem necessidade

🚀 Como Implementar
Clone este repositório

Hospede os arquivos HTML em um servidor web

Configure o endpoint da API em index.html (linha ~180) e admin.js para receber os dados

Acesse o painel administrativo em admin.html

📝 Licença
Este projeto é disponibilizado apenas para fins educacionais. Consulte as leis locais sobre privacidade de dados antes de implementar qualquer sistema de coleta de informações.
