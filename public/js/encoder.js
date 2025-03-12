var _metricId = 0;
var _leaderId = 0;
var _leaderName = '';

async function FetchTargetRatioData() {
    try {
        let url = `/api/encoder`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function UpdateTargetRatio(targetRatio) {
    try {
        let url = `/api/update_target_ratio?targetRatio=${targetRatio}`;
        
        const response = await fetch(url);
        
		// var targetRatio = document.getElementById('global-target-ratio');
		// targetRatio.value = targetRatio;
		showSuccessModal('Success','Target global ratio successfully updated!')
        
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function GetLeaders() {
    try {
        let url = `/api/get_leaders`;
        
        const response = await fetch(url);
        
		// var targetRatio = document.getElementById('global-target-ratio');
		// targetRatio.value = targetRatio;
		// showSuccessModal('Success','Target global ratio successfully updated!')
        
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function GetAllMetrics() {
    try {
        let url = `/api/get_all_metrics`;
        
        const response = await fetch(url);
        
		// var targetRatio = document.getElementById('global-target-ratio');
		// targetRatio.value = targetRatio;
		// showSuccessModal('Success','Target global ratio successfully updated!')
        
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function GetMetrics(metricId) {
	const modal = document.getElementById("myModal");
	modal.style.display = "flex";
	var sales = document.getElementById('sales');
	var expense = document.getElementById('expenses');
	var salesDate = document.getElementById('sales-date');
	var expenseDate = document.getElementById('expenses-date');
	var availableAgents = document.getElementById("available-agents");
    try {
        let url = `/api/get_metrics?metricId=${metricId}`;
        
        const response = await fetch(url);
        const metricsDetails = await response.json();
		
		let i = 0;
		
		while (i < metricsDetails.length) {
			sales.value = metricsDetails[i].sales;
			expense.value = metricsDetails[i].expense;
			document.getElementById("sales-date").value = metricsDetails[i].sales_date.split('T')[0];
			document.getElementById("expenses-date").value = metricsDetails[i].expense_date.split('T')[0];
			availableAgents.options[availableAgents.selectedIndex].text = metricsDetails[i].leader_name;
			i++;
		}
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
			modal.style.display = "none";
		}, 2000); // Simulate a 2-second delay
	});
}

async function AddAgent(leaderId, sales, salesDate, expense, expenseDate) {
    try {
        let url = `/api/add_agent?leaderId=${leaderId}&sales=${sales}&salesDate=${salesDate}&expense=${expense}&expenseDate=${expenseDate}`;
        
        const response = await fetch(url);
        
		// var targetRatio = document.getElementById('global-target-ratio');
		// targetRatio.value = targetRatio;
		showSuccessModal('Success','Agent added successfully!')
        
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function UpdateTargetMetrics(metricsId, leaderId, sales, salesDate, expense, expenseDate) {
    try {
        let url = `/api/update_metrics?metricsId=${metricsId}&leaderId=${leaderId}&sales=${sales}&salesDate=${salesDate}&expense=${expense}&expenseDate=${expenseDate}`;
        
        const response = await fetch(url);
		
		// alert(JSON.stringify(response));
		
        // const table = new DataTable('#example');
		// table.row
        // .add(JSON.stringify(response))
        // .draw(false);
		
		// var targetRatio = document.getElementById('global-target-ratio');
		// targetRatio.value = targetRatio;
		
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function UpdateLeader(id, name, avatar) {
    try {
        let url = `/api/update_leader?id=${id}&name=${name}&avatar=${avatar}`;
        
        const response = await fetch(url);
        
		showSuccessModal('Success','Agent details successfully updated!')
        
        return await response.json();
    } catch (error) {
        showErrorModal('Error fetching agent data', error);
        return [];
    }
	
	return new Promise(resolve => {
                setTimeout(() => {
			resolve(); // Resolve the promise after 2 seconds
		}, 2000); // Simulate a 2-second delay
	});
}

async function initializeEncoder() {    
	const modal = document.getElementById("myModal");
    // Fetch data from API
	modal.style.display = "flex";
    const target = await FetchTargetRatioData();
	const leaders = await GetLeaders();
	const metrics = await GetAllMetrics();
	modal.style.display = "none";
	const updateRatio = document.getElementById('update-ratio');
	const updateMetrics = document.getElementById('update-agent');
	const addAgent = document.getElementById('add-agent');
	const leaderList = document.getElementById('agent-name');
	const sales = document.getElementById('sales');
	const salesDate = document.getElementById("sales-date");
	const expense = document.getElementById('expenses');
	const expenseDate = document.getElementById('expenses-date');
	var availableAgents = document.getElementById("available-agents");
	var updateLeader = document.getElementById('update-leader');
	var leader = document.getElementById('agent-name');
	var avatar = document.getElementById('agent-avatar');
	var leaderName = '';	 
	var targetRatio = document.getElementById('global-target-ratio');
	targetRatio.value = target[0].target_ratio;
	
	updateLeader.addEventListener('click', function() {
		if (leader.value == '') {
			showErrorModal('Please select an agent');
		} else {
			modal.style.display = "flex";
			leaderName = leader.options[leader.selectedIndex].text;
			UpdateLeader(leader.value, leaderName, avatar.value);
			setTimeout(() => {
				modal.style.display = "none";
				showSuccessModal('Success','Agent metrics successfully updated!')
			}, 2000); // Simulate a 2-second delay
		}		
    });
	
	addAgent.addEventListener('click', function() {
		if (availableAgents.options[availableAgents.selectedIndex].text == '') {
			showErrorModal('Please select leader below');
		}
		else if (sales.value == '' || salesDate.value == '' || expense.value == '' || expenseDate.value == '') {
			showErrorModal('Please fill in all fields');
		} else {
			AddAgent(_leaderId, sales.value, salesDate.value, expense.value, expenseDate.value);
			window.location.href = document.URL;	
		}
    });
	
	updateMetrics.addEventListener('click', function() {
		modal.style.display = "flex";
		UpdateTargetMetrics(_metricId, _leaderId, sales.value, salesDate.value, expense.value, expenseDate.value);
		setTimeout(() => {
			modal.style.display = "none";
			showSuccessModal('Success','Agent metrics successfully updated!')
		}, 2000); // Simulate a 2-second delay
		const table = new DataTable('#example');
		table
		.rows( function ( idx, data, node ) {
			return data[0] === _metricId;
		} )
		.remove()
		.draw();
		
		table.row
        .add([
            _metricId,
            _leaderId,
			_leaderName,
            sales.value,
            salesDate.value,
            expense.value,
			expenseDate.value
        ])
        .draw(false);
    });
	
	updateRatio.addEventListener('click', function() {
		UpdateTargetRatio(targetRatio.value);
    });
	
	const columns = [
		{ 
			data: 'metrics_id'
		},
		{ 
			data: 'leader_id'
		},
		{ data: 'leader_name' },
		{ data: 'sales' },
		{ 
			data: (item) => {
				return item.sales_date.split('T')[0]; // Extract date part
			}, 
		},
		{ data: 'expense' },
		{ 
			data: (item) => {
				return item.expense_date.split('T')[0]; // Extract date part
			}, 
		},
	];

	populateDataTable(metrics, 'example', columns, {
	  paging: false,
	  ordering: false,
	  info: false
	});
	
	for(var y = 0; y <= leaders.length; y++) {
		leaderList.add(new Option(leaders[y].leader_name, leaders[y].leader_id));
	}
}

window.addEventListener('DOMContentLoaded', () => {
    initializeEncoder();
	 
	document.querySelector('#button').addEventListener('click', function () {
		table.row('.selected').remove().draw(false);
	});
});

function populateDataTable(apiResponse, tableId, columns, options = {}) {
	const table = document.getElementById(tableId);
	const tbody = table.querySelector('tbody');

	// Clear existing table rows
	tbody.innerHTML = '';

	if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
	// Handle empty or invalid response
	tbody.innerHTML = '<tr><td colspan="' + columns.length + '">No data available.</td></tr>';
	return;
	}

	apiResponse.forEach(item => {
	const row = document.createElement('tr');
	columns.forEach(column => {
	  const cell = document.createElement('td');
	  if (typeof column.data === 'function') {
		cell.textContent = column.data(item);
	  } else {
		cell.textContent = item[column.data];
	  }
	  row.appendChild(cell);
	});
	tbody.appendChild(row);
	});

	// Initialize DataTables
	$(table).DataTable(options); //Pass the options object directly to datatables.

	const tblEncoded = new DataTable('#example');

	tblEncoded.on('click', 'tbody tr', (e) => {
		let classList = e.currentTarget.classList;

		if (classList.contains('selected')) {
			classList.remove('selected');
		} else {
			tblEncoded.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
			classList.add('selected');

			// Get the row index
			const row = tblEncoded.row(e.currentTarget);
			const rowIndex = row.index();

			// Get the data of the first cell (first index)
			const firstCellData = row.data()[0]; // Assuming the first cell is at index 0
			const secondCellData = row.data()[1];
			const thirdCellData = row.data()[2]

			// Alert the row index and first cell data
			// alert(firstCellData);
			
			_metricId = firstCellData;
			_leaderId = secondCellData;
			_leaderName =  thirdCellData;
				
			GetMetrics(_metricId);
		}
	});
}

function showSuccessModal(title, message) {
  const modal = document.getElementById("successModal");
  const modalTitle = document.getElementById("successTitle");
  const modalMessage = document.getElementById("successMessage");
  const closeBtn = document.getElementById("closeSuccess");

  modalTitle.textContent = title || "Success!"; // Use provided title or default
  modalMessage.textContent = message || "Your operation was successful."; // Use provided message or default
  modal.style.display = "block";

  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function showErrorModal(title, message) {
  const modal = document.getElementById("errorModal");
  const modalTitle = document.getElementById("errorTitle");
  const modalMessage = document.getElementById("errorMessage");
  const closeBtn = document.getElementById("closeError");

  modalTitle.textContent = title || "Error!"; // Use provided title or default
  modalMessage.textContent = message || "Your operation was not successful."; // Use provided message or default
  modal.style.display = "block";

  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}