var inpSubNode = document.getElementById('inpSub');
var inpQueNode = document.getElementById('inpQue');
var submitBtnNode = document.getElementById('submitBtn');
var displayLeftQueNode = document.getElementById('displayLeftQue');
var rightTemplateNode = document.getElementById('rightTemplate');
var rightQueHeadingNode = document.getElementById('rightQueHeading');
var rightQueNode = document.getElementById('rightQue');
var responseNode = document.getElementById('response');
var inpResNameNode = document.getElementById('inpResName');
var inpResAnsNode = document.getElementById('inpResAns');
var submitResponseBtn = document.getElementById('submitResponseBtn');
var searchQueNode = document.getElementById('searchQue');
var upNode = document.getElementById('up');
var downNode = document.getElementById('down');
var resolveBtnNode = document.getElementById('resolveBtn');
var newQueTempNode = document.getElementById('newQueTemp');


var Questions = [];

onload();

function onload() {
    var allQue = getQue();

    Questions = allQue.sort(function (a, b) {
        if (a.upvote > b.upvote)
            return -1

        return 1;
    })

    if (Questions.length) {
        Questions.forEach(function (data) {
            {
                showLeft(data);
            }

        })
    }


}

submitBtnNode.addEventListener('click', newQue);

function newQue() {
    console.log(inpSubNode.value);
    console.log(inpQueNode.value);
    if (inpSubNode.value == "" || inpQueNode.value == "") {
        alert('Please enter Subject and Question');
    } else {



        var que = {
            sub: inpSubNode.value,
            que: inpQueNode.value,
            answeredBy: [],
            isResolved: false,
            upvote: 0,
            downvote: 0,
            createdAt: Date.now(),
        }

        saveQue(que);
        showLeft(que);
        clearInput();
    }

}

function saveQue(que) {
    getQue();
    Questions.push(que);
    localStorage.setItem("questions", JSON.stringify(Questions));
}

function updateQue(que) {

    localStorage.setItem("questions", JSON.stringify(Questions));
}

function getQue() {
    var question = localStorage.getItem("questions");
    question = JSON.parse(question);
    if (question)
        Questions = question;
    else
        Questions = [];

    return Questions;
}

function showLeft(que) {
    var divNode = document.createElement('div');
    var subNode = document.createElement('h3');
    var queNode = document.createElement('h6');
    var hrNode = document.createElement('hr');
    var upBtnNode = document.createElement('h5');

    subNode.innerHTML = que.sub;
    queNode.innerHTML = que.que;
    upBtnNode.innerHTML = 'vote: ' + `${que.upvote}`;

    divNode.setAttribute("class", "queDiv");
    divNode.setAttribute("id", que.createdAt);
    upBtnNode.setAttribute("class", "btn btn-success");

    divNode.appendChild(subNode);
    divNode.appendChild(queNode);
    divNode.appendChild(upBtnNode);


    displayLeftQueNode.append(divNode);
    displayLeftQueNode.appendChild(hrNode);


    divNode.addEventListener('click', onQueClick(que));



}

function clearInput() {
    inpSubNode.value = "";
    inpQueNode.value = "";
}


function onQueClick(que) {
    // clear right side

    return function () {
        rightTemplateNode.style.display = 'none';
        rightQueHeadingNode.style.display = 'inline';
        rightQueNode.innerHTML = "";
        responseNode.innerHTML = "";
        showQueRight(que);
        submitResponseBtn.onclick = response(que);

        // sorting response before showing them
        var allRes = que.answeredBy
        responses = allRes.sort(function (a, b) {
            if (a.upvote > b.upvote)
                return -1

            return 1;
        })

        // for adding previous saved responses
        responses.forEach(function (data) {
            addResponse(data);
        });
        upNode.onclick = upvote(que);
        downNode.onclick = downvote(que);
        resolveBtnNode.onclick = deleteQue(que);

    }



}

function showQueRight(que) {
    var divNode = document.createElement('div');
    var subNode = document.createElement('h3');
    var queNode = document.createElement('h6');


    subNode.innerHTML = que.sub;
    queNode.innerHTML = que.que;

    divNode.setAttribute("class", "queDiv");


    divNode.appendChild(subNode);
    divNode.appendChild(queNode);
    rightQueNode.append(divNode);


}



function response(que) {

    return function () {
        if (inpResNameNode.value == "" || inpResAnsNode.value == "") {
            alert('Please enter Your Name and Answer!');
        } else {

            var res = {
                name: inpResNameNode.value,
                ans: inpResAnsNode.value,
                upvote: 0,
                downvote: 0,
                createdAt: Date.now()
            }
            que.answeredBy.push(res);
            // adding response in local storage
            updateQue(que);
            addResponse(res)
            console.log(que);
            clearRes();
        }
    }
}

function addResponse(res) {
    var divNode = document.createElement('div');
    var subNode = document.createElement('h5');
    var queNode = document.createElement('h7');
    var upBtnNode = document.createElement('h5');
    var brNode = document.createElement('br');
    var resUpVote = document.createElement('button');
    var resDownVote = document.createElement('button');
    var hrNode = document.createElement('hr');



    subNode.innerHTML = res.name;
    queNode.innerHTML = res.ans;
    resUpVote.innerHTML = "Upvote";
    resDownVote.innerHTML = "Downvote";
    upBtnNode.innerHTML = 'vote: ' + `${res.upvote}`;;


    divNode.setAttribute("class", "resDiv");
    upBtnNode.setAttribute("class", 'resVote');
    resUpVote.setAttribute("class", 'btn btn-success');
    resDownVote.setAttribute("class", 'btn btn-danger');
    divNode.setAttribute("id", res.createdAt);



    divNode.appendChild(subNode);
    divNode.appendChild(queNode);
    divNode.appendChild(upBtnNode);
    divNode.appendChild(brNode);
    divNode.appendChild(resUpVote);
    divNode.appendChild(resDownVote);
    divNode.appendChild(hrNode);
    responseNode.appendChild(divNode);

    resUpVote.onclick = upvote(res);
    resDownVote.onclick = downvote(res);



}

function clearRes() {
    inpResNameNode.value = "";
    inpResAnsNode.value = "";

}


// for search que

searchQueNode.addEventListener('keyup', function () {
    displayLeftQueNode.innerHTML = "";
    findQue(event.target.value);
    // console.log(event.target.value);
});

function findQue(search) {
    var allQue = getQue();
    if (search) {
        var thatQue = allQue.filter(function (que) {
            if (que.sub.includes(search))
                return true;
        });

        // console.log(thatQue);

        if (thatQue.length > 0) {
            allQue.forEach(function (que) {
                if (que.sub.includes(search))
                    showLeft(que);
            })
        } else {
            notfound();
        }



    } else {
        allQue.forEach(function (que) {
            showLeft(que);
        })
    }
}

function notfound() {
    var msgNode = document.createElement('h4');
    msgNode.innerHTML = 'NO QUESTION FOUND!';

    displayLeftQueNode.appendChild(msgNode);
}

function upvote(que) {

    return function () {
        console.log("up");
        que.upvote++;
        console.log(que.createdAt);
        updateQue(que);
        updateUI(que);
    }

}

function downvote(que) {

    return function () {
        console.log("down");
        que.upvote--;
        updateUI(que);
        updateQue(que);
    }

}

function updateUI(que) {
    var node = document.getElementById(que.createdAt);
    console.log(node);
    node.childNodes[2].innerHTML = 'vote: ' + `${que.upvote}`;
}

function deleteQue(que) {
    return function () {

        var allQues = getQue();

        var num = 0;
        allQues.forEach(function (data) {
            console.log(num);
            num++;

            if (data.createdAt === que.createdAt) {
                if(num===1)
                allQues.splice(num-1, num);
                allQues.splice(num-1, num-1);
            }

        })

        updateQue(allQues);
        updateLeftQue();
    }
}

function updateLeftQue() {
    displayLeftQueNode.innerHTML="";
    console.log("hi");
    onload();
}

 newQueTempNode.onclick = newQueBtn;

function newQueBtn(){
    console.log("clicked");
    rightTemplateNode.style.display = 'inline';
    rightQueHeadingNode.style.display='none';
}