const updateWinStatus = async(id, currentPage) => {
    const updateStatusField = document.querySelector(`#updateStatusField${id}`).value;
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bets/updatestatus/${updateStatusField}`,
            data: {
                status: 'win',
            },
        });
        if (res.data.status === 'success') {
            location.assign(`/geez/admin/payedBets/?page=${currentPage}`);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
    }
}
const updateLoseStatus = async(id, currentPage) => {
    const updateStatusField = document.querySelector(`#updateStatusField${id}`).value;
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bets/updatestatus/${updateStatusField}`,
            data: {
                status: 'loose',
            },
        });
        if (res.data.status === 'success') {
            location.assign(`/geez/admin/payedBets/?page=${currentPage}`);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
    }
}
const updatePay = async(id, currentPage) => {
    const payField = document.querySelector(`#payField${id}`).value;
    console.log('payField');
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bets/${payField}`,
            data: {
                payed: true,
            },
        });
        if (res.data.status === 'success') {
            location.assign(`/geez/admin/allBets/?page=${currentPage}`);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
        location.reload();
    }
}
const deleteUnpayed = async(id) => {
    const payField = document.querySelector(`#payField${id}`).value;
    try {
        const res = await axios({
            method: 'Delete',
            url: `/geez/api/v1/bets/${payField}`,
        });
    } catch (err) {
        showAlert('danger', err.response.data.message);
    }
}
const updateConditional = async(isPayed) => {
    const payField = document.querySelector(`#conditionalField`).value;
    if (isPayed) {
        try {
            const res = await axios({
                method: 'Patch',
                url: `/geez/api/v1/bets/updatestatus/${payField}`,
                data: {
                    status: 'win',
                },
            });
            if (res.data.status === 'success') {
                location.assign('/geez/admin/payedBets/');
            }
        } catch (err) {
            showAlert('danger', err.response.data.message);
        }
    } else {
        try {
            const res = await axios({
                method: 'Patch',
                url: `/geez/api/v1/bets/${payField}`,
                data: {
                    payed: true,
                },
            });
            if (res.data.status === 'success') {
                location.assign('/geez/admin/allBets/');
            }
        } catch (err) {
            showAlert('danger', err.response.data.message);
        }
    }
}
const matchNumber = async() => {
    const miValue = document.querySelector('#matchNumber').value;
    const tableBody = document.querySelector('#tableBody');
    tableBody.innerHTML = '';
    for (i = 0; i < miValue; i++) {
        const newRow = tableBody.insertRow(-1);
        const newCell = newRow.insertCell(0);
        const firstChild = document.createElement('p');
        firstChild.appendChild(document.createTextNode('ሽም'));
        firstChild.className = "text-light";
        newCell.appendChild(firstChild);
        const secCell = newRow.insertCell(1);
        const secChild = document.createElement("input");
        secChild.className = 'bg-dark form-control';
        secChild.name = 'match';
        secChild.id = `match${i}`;
        secChild.style.color = 'rgb(255,255,255)';
        secChild.style.borderColor = 'rgb(41,41,41)';
        secChild.style.width = '200px';
        secCell.appendChild(secChild);
        const thirdCell = newRow.insertCell(2);
        const thirdChild = document.createElement("input");
        thirdChild.className = 'bg-dark form-control';
        thirdChild.name = 'date';
        thirdChild.date = `date${i}`;
        thirdChild.style.color = 'rgb(255,255,255)';
        thirdChild.style.borderColor = 'rgb(41,41,41)';
        thirdChild.style.width = '200px';
        thirdCell.appendChild(thirdChild);
    }


    // const matchNumber = document.querySelector('#matchNumber').value;


}

const updateBonusPay = async(id, currentPage) => {
    const payField = document.querySelector(`#bonusPayField${id}`).value;
    console.log(payField);

    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bonusBets/${payField}`,
            data: {
                payed: true,
            },
        });
        if (res.data.status === 'success') {
            location.assign(`/geez/admin/bonusBets/?page=${currentPage}`);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
        location.reload();
    }
}

const updateBonusWinStatus = async(id, currentPage) => {
    const updateStatusField = document.querySelector(`#bonusPayField${id}`).value;
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bonusBets/updatestatus/${updateStatusField}`,
            data: {
                status: 'win',
            },
        });
        if (res.data.status === 'success') {
            location.assign(`/geez/admin/bonusBets/?page=${currentPage}`);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
    }
}
const updateBonusLoseStatus = async(id, currentPage) => {
    const updateStatusField = document.querySelector(`#bonusPayField${id}`).value;
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bonusBets/updatestatus/${updateStatusField}`,
            data: {
                status: 'loose',
            },
        });
        if (res.data.status === 'success') {
            location.assign(`/geez/admin/bonusBets/?page=${currentPage}`);
        }
    } catch (err) {
        showAlert('danger', err.response.data.message);
    }
}