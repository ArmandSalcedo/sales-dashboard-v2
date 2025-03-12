let agentsData = [];
let currentTimeRange = 'weekly';

// Function to fetch data from our Node.js API endpoint
async function fetchAgentData(timeRange = 'weekly', startDate, endDate) {
    try {
        let url = `/api/agents?timeRange=${timeRange}`;
        
        if (timeRange === 'custom' && startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching agent data:', error);
        return [];
    }
}

function renderSummaryCards(agents) {
    const summaryCardsContainer = document.getElementById('summary-cards');
    
    const totalSales = agents.reduce((sum, agent) => sum + agent.sales, 0);
    const totalExpenses = agents.reduce((sum, agent) => sum + agent.expenses, 0);
    const overallRatio = totalSales / totalExpenses;
    const overallPerformancePercentage = (overallRatio / 30) * 100;

    summaryCardsContainer.innerHTML = `
        <div class="summary-card">
            <h3>${currentTimeRange.charAt(0).toUpperCase() + currentTimeRange.slice(1)} Sales</h3>
            <div class="value" style="color: var(--accent-blue)">₱${totalSales.toLocaleString()}</div>
        </div>
        <div class="summary-card">
            <h3>${currentTimeRange.charAt(0).toUpperCase() + currentTimeRange.slice(1)} Expenses</h3>
            <div class="value" style="color: var(--accent-green)">₱${totalExpenses.toLocaleString()}</div>
        </div>
        <div class="summary-card">
            <h3>Overall Performance</h3>
            <div class="value" style="color: var(--accent-purple)">${overallRatio.toFixed(1)}:1</div>
            <div class="performance-indicator ${
                overallPerformancePercentage > 100 ? 'positive' : 'negative'
            }">
                ${overallPerformancePercentage.toFixed(1)}%
            </div>
        </div>
    `;
}

function renderAgentCards(agents) {
    agentsData = [...agents];
    const sortedAgents = [...agents].sort((a, b) => b.actualRatio - a.actualRatio);
    
    const agentCardsContainer = document.getElementById('agent-cards');
    agentCardsContainer.innerHTML = '';

    sortedAgents.forEach((agent, index) => {
        const agentCard = document.createElement('div');
        agentCard.className = `agent-card ${
            agent.actualRatio > 30 ? 'high-performer' : 'low-performer'
        }`;
        
        agentCard.innerHTML = `
            <div class="ranking-badge rank-${index + 1}">${index + 1}</div>
            <img src="${agent.avatar}" alt="${agent.name}" class="agent-avatar">
            <h3>${agent.name}</h3>
            <div class="performance-indicator ${
                agent.performancePercentage > 100 ? 'positive' : 'negative'
            }">
                Performance: ${agent.performancePercentage.toFixed(1)}%
            </div>
        `;
        
        // Add click event to show card screen
        agentCard.addEventListener('click', () => showCardScreen(agent, index + 1));
        
        agentCardsContainer.appendChild(agentCard);
    });
}

async function initializeDashboard(timeRange = 'weekly', startDate, endDate) {
    currentTimeRange = timeRange;
    
    // Show loading state
    document.getElementById('summary-cards').innerHTML = '<div class="summary-card">Loading...</div>';
    document.getElementById('agent-cards').innerHTML = '<div class="agent-card">Loading...</div>';
    
    // Fetch data from API
    const agents = await fetchAgentData(timeRange, startDate, endDate);
    
    if (agents.length > 0) {
        renderSummaryCards(agents);
        renderAgentCards(agents);
    } else {
        document.getElementById('summary-cards').innerHTML = '<div class="summary-card">Empty data</div>';
        document.getElementById('agent-cards').innerHTML = '<div class="agent-card">Empty data</div>';
    }
}

// Time Range Selection Logic
function setupTimeRangeSelection() {
    const timeRangeButtons = document.querySelectorAll('.time-range-btn[data-range]');
    const customDateContainer = document.getElementById('custom-date-container');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const applyCustomDateButton = document.getElementById('apply-custom-date');

    timeRangeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeRangeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const range = this.dataset.range;
            
            // Toggle custom date container visibility
            if (range === 'custom') {
                customDateContainer.classList.add('visible');
            } else {
                customDateContainer.classList.remove('visible');
                initializeDashboard(range);
            }
        });
    });

    // Custom Date Range Application
    applyCustomDateButton.addEventListener('click', function() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            
            // Update time range label
            currentTimeRange = `Custom (${daysDifference} days)`;
            
            // Fetch and render data
            initializeDashboard('custom', startDate, endDate);
        } else {
            alert('Please select a valid date range.');
        }
    });
}

function showCardScreen(agent, rank) {
    const cardScreen = document.getElementById('card-screen');
    const cardScreenDetails = document.getElementById('card-screen-details');

    cardScreenDetails.innerHTML = `
        <div class="ranking-badge rank-${rank}" style="position: relative; margin: 0 auto 1rem; width: 60px; height: 60px; font-size: 1.5rem;">${rank}</div>
        <img src="${agent.avatar}" alt="${agent.name}" style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 1rem; border: 3px solid var(--border-color);">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">${agent.name}</h2>
        <div class="stat">
            <span>Sales</span>
            <span class="stat-value" style="color: var(--accent-blue)">₱${agent.sales.toLocaleString()}</span>
        </div>
        <div class="stat">
            <span>Expenses</span>
            <span class="stat-value" style="color: var(--accent-green)">₱${agent.expenses.toLocaleString()}</span>
        </div>
        <div class="stat">
            <span>Target Ratio</span>
            <span class="stat-value">${agent.targetRatio}:1</span>
        </div>
        <div class="stat">
            <span>Actual Ratio</span>
            <span class="stat-value ${
                agent.actualRatio > 30 ? 'text-green-600' : 'text-red-600'
            }">
                ${agent.actualRatio.toFixed(1)}:1
            </span>
        </div>
        <div class="performance-indicator ${
            agent.performancePercentage > 100 ? 'positive' : 'negative'
        }" style="margin-top: 1rem;">
            Performance: ${agent.performancePercentage.toFixed(1)}%
        </div>
    `;

    cardScreen.style.display = 'flex';
}

function hideCardScreen() {
    const cardScreen = document.getElementById('card-screen');
    cardScreen.style.display = 'none';
}

// Initialize dashboard and setup time range selection on window load
window.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupTimeRangeSelection();
    
    // Add refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh';
    refreshButton.className = 'refresh-btn';
    refreshButton.onclick = () => {
		var applyBtn = document.getElementById('apply-custom-date')
		applyBtn.click();
        // if (currentTimeRange.startsWith('Custom')) {
            // const startDate = document.getElementById('start-date').value;
            // const endDate = document.getElementById('end-date').value;
            // initializeDashboard('custom', startDate, endDate);
        // } else {
            // initializeDashboard(currentTimeRange);
        // }
		
		
    };
    document.body.appendChild(refreshButton);
	
	// const encoder = document.createElement('button');
    // encoder.textContent = 'Encoder';
    // encoder.className = 'encode-btn';
	// refreshButton.onclick = () => {
		// window.location.href = document.URL + '/encoder'
	// }
	// document.body.appendChild(encoder);
});