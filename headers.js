const tabId = parseInt(window.location.search.substring(1));

window.addEventListener('load', function () {
    chrome.debugger.sendCommand({ tabId: tabId }, 'Network.enable');
    chrome.debugger.onEvent.addListener(onEvent);

    chrome.tabs.get(tabId, function (tab) {
        document.getElementById('title').textContent = tab.title;
    });

    document.getElementById('zeroup').addEventListener('click', function () {
        toggleZeroVotes('up');
    });
    document.getElementById('zerodown').addEventListener('click', function () {
        toggleZeroVotes('down');
    });
});

window.addEventListener('unload', function () {
    chrome.debugger.detach({ tabId: tabId });
});

function onEvent(debuggeeId, message, params) {
    if (tabId != debuggeeId.tabId) return;

    // based on: https://stackoverflow.com/a/31223354
    if (message === 'Network.webSocketFrameReceived') {
        //const pre = document.createElement('pre');
        //pre.textContent = JSON.stringify(JSON.parse(params.response.payloadData), null, 2);
        //document.getElementById('container').appendChild(pre);

        try {
            const data = JSON.parse(params.response.payloadData);
            if (data.message_body.voter && data.message_body.vote) {
                addVote(data.message_body.voter, data.message_body.vote);
            }
        } catch (error) { }
    }
}

function addVote(voter, vote) {
    const userBox = document.getElementById(voter.username);

    if (userBox) {
        if (vote.vote === 1) {
            userBox.dataset.upvotes = Number(userBox.dataset.upvotes) + 1;
            userBox.querySelector('.upvotes').textContent = String(userBox.dataset.upvotes);
        } else {
            userBox.dataset.downvotes = Number(userBox.dataset.downvotes) + 1;
            userBox.querySelector('.downvotes').textContent = String(userBox.dataset.downvotes);
        }
    } else {
        const user = document.createElement('div');
        user.id = voter.username;
        user.className = 'user';

        user.dataset.upvotes = vote.vote === 1 ? 1 : 0;
        user.dataset.downvotes = vote.vote === -1 ? 1 : 0;

        const avatar = document.createElement('img');
        avatar.src = voter.avatar.cache.indexOf('//') === 0 ? voter.avatar.permalink : voter.avatar.cache;

        const name = document.createElement('a');
        name.textContent = voter.name;
        name.href = voter.profileUrl;
        if (voter.about) {
            name.title = voter.about;
        }

        const reg = document.createElement('sup');
        reg.textContent = voter.joinedAt.replace('T', ' ');

        const upvotes = document.createElement('span');
        upvotes.className = 'upvotes';
        upvotes.textContent = String(user.dataset.upvotes);

        const downvotes = document.createElement('span');
        downvotes.className = 'downvotes';
        downvotes.textContent = String(user.dataset.downvotes);

        user.appendChild(avatar);
        user.appendChild(name);
        user.appendChild(reg);
        user.appendChild(document.createElement('br'));
        user.appendChild(upvotes);
        user.appendChild(downvotes);
        user.appendChild(document.createElement('br'));

        document.getElementById('container').appendChild(user);
    }
}

function toggleZeroVotes(v) {
    document.getElementById('container').classList.toggle('hidezero' + v + 'votes');
    document.getElementById('zero' + v).classList.toggle('active');
}