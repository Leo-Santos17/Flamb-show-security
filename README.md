# 🕵️‍♂️ IP Logger Educacional

## 📌 Descrição do Projeto

Este repositório apresenta um sistema de **IP Logger** desenvolvido **exclusivamente para fins educacionais**, com o objetivo de demonstrar como certas informações podem ser coletadas quando um usuário acessa um link. O sistema inclui:

- Uma **página inicial** que simula um material de apoio sobre segurança digital.
    
- Um **painel administrativo** que exibe os dados coletados.
    
- Um **redirecionamento automático** para um arquivo PDF após a coleta dos dados.
    

---

## 🌟 Funcionalidades Principais

### 🔍 Coleta de Dados

- Endereço IP público
    
- User Agent (navegador, sistema operacional, tipo de dispositivo)
    
- Idioma preferido
    
- Resolução de tela
    
- Nível de bateria (quando disponível)
    
- Geolocalização (com permissão do usuário)
    
- Referenciador (origem do acesso)
    

### 📊 Painel Administrativo

- Visualização tabular dos acessos
    
- Estatísticas por dispositivo e navegador
    
- Detalhamento completo de cada acesso
    
- Exportação de dados para CSV
    

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript
    
- **Coleta de IP:** API pública [ipify.org](https://api.ipify.org/)
    
- **Backend/API:** Hospedado na plataforma [Render](https://render.com/)
    

---

## 📸 Screenshots

### Página Inicial

_Simula material de conscientização em segurança digital_  
![index](https://github.com/user-attachments/assets/c9cb3d5c-ac7c-4569-b4cf-5925b3ccc99d)

### Painel Administrativo

_Visualização dos dados coletados_  
![admin](https://github.com/user-attachments/assets/6cc4bbef-c09a-4bca-8cb3-7c26745a1e2e)

### Detalhes do Acesso

_Informações específicas por visitante_  
![detalhes](https://github.com/user-attachments/assets/fc27c537-ba58-4ffc-9c6a-0539e9326e7f)

---

## ⚠️ Considerações Éticas e Legais

Este projeto tem como **único propósito a educação** e a demonstração de conceitos relacionados à **segurança digital**. A coleta de dados sem o devido consentimento pode violar legislações de privacidade, como a **LGPD** ou o **GDPR**.

**Recomendações para uso ético:**

- Obtenha **consentimento explícito** dos usuários
    
- Utilize os dados apenas para os fins declarados
    
- Evite armazenar **informações sensíveis** sem necessidade
    

---

## 🚀 Como Implementar

1. Clone este repositório:
    
    ```bash
    git clone https://github.com/Leo-Santos17/Flamb-show-security.git
    ```
    
2. Hospede os arquivos HTML em um servidor web (pode ser local ou online)
    
3. Configure os endpoints da API:
    
    - No arquivo `index.html` (linha ~180)
        
    - No arquivo `admin.js`
        
4. Acesse o painel administrativo via `admin.html` para visualizar os acessos
    

---

## 📝 Licença

Este projeto é fornecido **apenas para fins educacionais**. Verifique e siga as leis de privacidade de dados aplicáveis em sua localidade antes de qualquer implementação prática.

---
