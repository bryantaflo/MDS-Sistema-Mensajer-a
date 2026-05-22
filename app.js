
const JIRA_DOMAIN = "tu-dominio.atlassian.net"; 
const EMAIL = "tu_correo@correounivalle.edu.co";
const API_TOKEN = "TU_JIRA_API_TOKEN"; 

async function consultarTicketJira(issueKey) {
    const chatBox = document.getElementById('chat-box');
    
    const auth = btoa(`${EMAIL}:${API_TOKEN}`);
    
    const url = `https://cors-anywhere.herokuapp.com/https://${JIRA_DOMAIN}/rest/api/3/issue/${issueKey}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('No se encontró el ticket');

        const data = await response.json();
        
        const summary = data.fields.summary;
        const status = data.fields.status.name;

        chatBox.innerHTML += `<p class="jira-ticket"><strong>Jira Bot [${issueKey}]:</strong> ${summary} | <strong>Estado:</strong> ${status}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        chatBox.innerHTML += `<p style="color: red;"><strong>Error:</strong> No se pudo conectar con Jira (${error.message})</p>`;
    }
}

document.getElementById('message-form').addEventListener('submit', function() {
    const input = document.getElementById('user-message');
    const msg = input.value.trim();
    const chatBox = document.getElementById('chat-box');

    if (msg !== '') {
        chatBox.innerHTML += `<p style="float: right; background: #0052cc; color: white;"><strong>Tú:</strong> ${msg}</p><div style="clear:both;"></div>`;
        
        if (msg.toUpperCase().startsWith("MDS-")) {
            chatBox.innerHTML += `<p><em>Consultando estado en Jira...</em></p>`;
            consultarTicketJira(msg.toUpperCase());
        }

        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});