const updateMatch = async(id, leagueName, add) => {
    const percent = document.querySelector(`#percentage${id}`).value;
    try {
        console.log('in update math');
        const res = await axios({
            method: 'Put',
            url: `/geez/admin/view_matches/${leagueName}?matchIndex=${id}&add=${add}&percent=${percent}`,
        });
        if (res.data.status === 'Success') {
            showAlert('success', 'Updated successfuly');
        }
    } catch (err) {
        console.log('some err');
        showAlert('danger', err);
    }
}
const updateMatchStatus = async(id, leagueName) => {
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/matches/${id}`,
            data: {
                "status": "finished"
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Updated successfuly');
            location.assign(`/geez/admin/view_matches/${leagueName}`);
        }
    } catch (err) {
        console.log('some err');
        showAlert('danger', err);
    }
}
const createMatchResult = async(index, matchId) => {
        const firstHome = document.querySelector(`#firstHome${index}`).value;
        const firstAway = document.querySelector(`#firstAway${index}`).value;
        const secondHome = document.querySelector(`#secondHome${index}`).value;
        const secondAway = document.querySelector(`#secondAway${index}`).value;
        try {
            const res = await axios({
                method: 'Post',
                url: `/geez/api/v1/matchResult/`,
                data: {
                    "matchId": matchId,
                    "team1": {
                        "firstHalf": Math.abs(firstHome),
                        "secondHalf": Math.abs(secondHome),
                    },
                    "team2": {
                        "firstHalf": Math.abs(firstAway),
                        "secondHalf": Math.abs(secondAway),
                    }
                }
            });
            if (res.data.status === 'success') {
                showAlert('success', 'Updated Successfully');
            }
            location.reload();
        } catch (err) {
            showAlert('danger', err);
            location.reload();
        }
    }
    // const updateMatchResult = async(index, matchId) => {
    //     const firstHome = document.querySelector(`#firstHome${index}`).value;
    //     const firstAway = document.querySelector(`#firstAway${index}`).value;
    //     const secondHome = document.querySelector(`#secondHome${index}`).value;
    //     const secondAway = document.querySelector(`#secondAway${index}`).value;
    //     try {
    //         const res = await axios({
    //             method: 'Patch',
    //             url: `/geez/api/v1/matchResult/${matchId}`,
    //             data: {
    //                 "matchId": matchId,
    //                 "team1": {
    //                     "firstHalf": Math.abs(firstHome),
    //                     "secondHalf": Math.abs(secondHome),
    //                 },
    //                 "team2": {
    //                     "firstHalf": Math.abs(firstAway),
    //                     "secondHalf": Math.abs(secondAway),
    //                 }
    //             }
    //         });
    //         if (res.data.status === 'success') {
    //             showAlert('success', 'Updated Successfully');
    //         }
    //         location.reload();
    //     } catch (err) {
    //         showAlert('danger', err);
    //         location.reload();
    //     }
    // }

const createBonus = async(index, matchId) => {
    const tableBody = document.querySelector('#tableBody');
    const matchDetail = [];
    for (i = 0; i < tableBody.rows.length; i++) {
        matchDetail.push({
            "title": tableBody.rows[i].children[1].firstChild.value,
            "date": tableBody.rows[i].children[2].firstChild.value
        });
    }


    const placedMoney = document.querySelector('#placedMoney').value;
    const winMoney = document.querySelector('#winMoney').value;

    try {
        const res = await axios({
            method: 'Post',
            url: `/geez/api/v1/bonus/`,
            data: {
                "placedMoney": placedMoney,
                "winMoney": winMoney,
                "matchDetail": matchDetail,

            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Updated Successfully');
        }
        location.reload();
    } catch (err) {
        showAlert('danger', err);
        location.reload();
    }
}

const updateBonusStatus = async(bonusId) => {
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/bonus/${bonusId}`
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Updated successfuly');
            location.assign(`/geez/admin/bonus/`);
        }
    } catch (err) {
        console.log('some err');
        showAlert('danger', err);
    }
}
const updateMatchResult = async(index, matchId) => {
    const firstHome = document.querySelector(`#firstHome${index}`).value;
    const firstAway = document.querySelector(`#firstAway${index}`).value;
    const secondHome = document.querySelector(`#secondHome${index}`).value;
    const secondAway = document.querySelector(`#secondAway${index}`).value;
    try {
        const res = await axios({
            method: 'Patch',
            url: `/geez/api/v1/matchResult/${matchId}`,
            data: {
                "matchId": matchId,
                "team1": {
                    "firstHalf": Math.abs(firstHome),
                    "secondHalf": Math.abs(secondHome),
                },
                "team2": {
                    "firstHalf": Math.abs(firstAway),
                    "secondHalf": Math.abs(secondAway),
                }
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Updated Successfully');
        }
        location.reload();
    } catch (err) {
        showAlert('danger', err);
        location.reload();
    }
}