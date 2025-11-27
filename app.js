// WebSocket connection
let ws = null;
let currentMessageDiv = null;

// WebSocket URL (hardcoded)
const WEBSOCKET_URL = 'wss://x1au0p5av1.execute-api.ap-south-1.amazonaws.com/prod/';

// DOM elements
const messagesContainer = document.getElementById('messages');
const queryInput = document.getElementById('query-input');
const sendBtn = document.getElementById('send-btn');

// Connect to WebSocket
function connect() {
    // Close existing connection
    if (ws) {
        ws.close();
    }

    console.log('Connecting to WebSocket...');

    try {
        ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            queryInput.disabled = false;
            sendBtn.disabled = false;
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            handleMessage(JSON.parse(event.data));
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            queryInput.disabled = true;
            sendBtn.disabled = true;
            addErrorMessage('WebSocket connection error');
        };

        ws.onclose = () => {
            queryInput.disabled = true;
            sendBtn.disabled = true;
            console.log('WebSocket connection closed');
        };

    } catch (error) {
        console.error('Connection error:', error);
        queryInput.disabled = true;
        sendBtn.disabled = true;
        addErrorMessage('Failed to connect: ' + error.message);
    }
}

// Send query
function sendQuery() {
    const query = queryInput.value.trim();

    if (!query) return;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        addErrorMessage('Not connected to WebSocket. Please refresh the page.');
        return;
    }

    // Add user message
    addUserMessage(query);

    // Clear input
    queryInput.value = '';

    // Send to WebSocket
    const message = {
        action: 'message',
        message: query
    };

    ws.send(JSON.stringify(message));

    // Prepare for assistant response
    currentMessageDiv = createAssistantMessage();
}

// Handle incoming WebSocket messages
function handleMessage(data) {
    const type = data.type;

    if (type === 'status') {
        // Show status message
        addStatusMessage(data.message);

    } else if (type === 'chunk') {
        // Append chunk to current message
        if (currentMessageDiv) {
            const contentDiv = currentMessageDiv.querySelector('.message-content');
            contentDiv.textContent += data.content;

            // Auto-scroll
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

    } else if (type === 'complete') {
        // Add sources if available
        if (data.sources && data.sources.length > 0) {
            addSources(data.sources);
        }
        currentMessageDiv = null;

    } else if (type === 'error') {
        addErrorMessage(data.message);
        currentMessageDiv = null;
    }
}

// Add user message
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';

    messageDiv.innerHTML = `
        <div class="message-label">You</div>
        <div class="message-content">${escapeHtml(text)}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Create assistant message container
function createAssistantMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    messageDiv.innerHTML = `
        <div class="message-label">Lenny</div>
        <div class="message-content"></div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageDiv;
}

// Add status message
function addStatusMessage(text) {
    if (currentMessageDiv) {
        let statusDiv = currentMessageDiv.querySelector('.status-message');

        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'status-message';
            currentMessageDiv.appendChild(statusDiv);
        }

        statusDiv.textContent = text;
    }
}

// Add sources/citations
function addSources(sources) {
    if (!currentMessageDiv) return;

    const sourcesDiv = document.createElement('div');
    sourcesDiv.className = 'sources';

    let sourcesHtml = '<div class="sources-title">Sources:</div>';

    sources.forEach((source, index) => {
        sourcesHtml += `
            <div class="source-item">
                <div class="source-title">${index + 1}. ${escapeHtml(source.title)}</div>
                ${source.url ? `<a href="${escapeHtml(source.url)}" target="_blank" class="source-url">${escapeHtml(source.url)}</a>` : ''}
                <div class="source-score">Relevance: ${(source.score || 0).toFixed(2)}</div>
            </div>
        `;
    });

    sourcesDiv.innerHTML = sourcesHtml;
    currentMessageDiv.appendChild(sourcesDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add error message
function addErrorMessage(text) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'Error: ' + text;

    messagesContainer.appendChild(errorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
sendBtn.addEventListener('click', sendQuery);

queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendQuery();
    }
});

// Auto-connect on page load
queryInput.disabled = true;
sendBtn.disabled = true;
connect();
