// Configuración de tu entorno de Jira (Reemplaza con tus datos reales)
const JIRA_DOMAIN = "tu-dominio.atlassian.net"; 
const EMAIL = "tu_correo@correounivalle.edu.co";
const API_TOKEN = "TU_JIRA_API_TOKEN"; // Se genera en tu cuenta de Atlassian (Security -> API Tokens)

// Función para consultar un ticket de Jira de forma dinámica
async function consultarTicketJira(issueKey) {
    const chatBox = document.getElementById('chat-box');
    
    // Crear el encabezado de autenticación (Basic Auth)
    const auth = btoa(`${EMAIL}:${API_TOKEN}`);
    
    // Al usarlo localmente, la API de Jira suele requerir un proxy por temas de CORS
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
        
        // Extraer datos dinámicos de Jira
        const summary = data.fields.summary;
        const status = data.fields.status.name;

        // Renderizar en el chat de la página
        chatBox.innerHTML += `<p class="jira-ticket"><strong>Jira Bot [${issueKey}]:</strong> ${summary} | <strong>Estado:</strong> ${status}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        chatBox.innerHTML += `<p style="color: red;"><strong>Error:</strong> No se pudo conectar con Jira (${error.message})</p>`;
    }
}

// Escuchar el envío del formulario
document.getElementById('message-form').addEventListener('submit', function() {
    const input = document.getElementById('user-message');
    const msg = input.value.trim();
    const chatBox = document.getElementById('chat-box');

    if (msg !== '') {
        // Mostrar mensaje del usuario
        chatBox.innerHTML += `<p style="float: right; background: #0052cc; color: white;"><strong>Tú:</strong> ${msg}</p><div style="clear:both;"></div>`;
        
        // Si el usuario escribe una clave de Jira (Ej: "MDS-1"), se dispara la consulta dinámica
        if (msg.toUpperCase().startsWith("MDS-")) {
            chatBox.innerHTML += `<p><em>Consultando estado en Jira...</em></p>`;
            consultarTicketJira(msg.toUpperCase());
        }

        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});