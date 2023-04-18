const canvas = document.getElementById('ladderCanvas');
const ctx = canvas.getContext('2d');
const ladderHeight = 10;
const ladderSpacing = 40;
const ladderSpacingY = 30;

let participants = 8;
let ladderMatrix = [];
let ladderWidth = Math.floor(canvas.width / (participants + 1));
let currentStartPos = 0;

function applyParticipants() {
  const numParticipantsInput = document.getElementById('numParticipants');
  const numParticipants = parseInt(numParticipantsInput.value, 10);

  if (isNaN(numParticipants) || numParticipants < 2 || numParticipants > 20) {
    alert('참가자 수는 2에서 20 사이의 숫자여야 합니다.');
    return;
  }

  participants = numParticipants;
  ladderWidth = Math.floor(canvas.width / (participants + 1));
  createInputFields();
  drawLadder();
}

function createInputFields() {
  const inputTableDiv = document.getElementById('inputTable');

  while (inputTableDiv.firstChild) {
    inputTableDiv.removeChild(inputTableDiv.firstChild);
  }

  const inputTable = document.createElement('table');
  const inputTableHead = document.createElement('thead');
  const inputTableHeadRow = document.createElement('tr');
  const numberHead = document.createElement('th');
  const participantHead = document.createElement('th');
  const resultHead = document.createElement('th');

  numberHead.textContent = '번호';
  participantHead.textContent = '참가자';
  resultHead.textContent = '결과';

  inputTableHeadRow.appendChild(numberHead);
  inputTableHeadRow.appendChild(participantHead);
  inputTableHeadRow.appendChild(resultHead);
  inputTableHead.appendChild(inputTableHeadRow);
  inputTable.appendChild(inputTableHead);

  const inputTableBody = document.createElement('tbody');
  inputTable.appendChild(inputTableBody);
  inputTableDiv.appendChild(inputTable);

  for (let i = 0; i < participants; i++) {
    const tableRow = document.createElement('tr');

    const numberTd = document.createElement('td');
    numberTd.textContent = i + 1;
    tableRow.appendChild(numberTd);

    const participantTd = document.createElement('td');
    const participantInput = document.createElement('input');
    participantInput.type = 'text';
    participantInput.id = 'participant' + (i + 1);
    participantTd.appendChild(participantInput);
    tableRow.appendChild(participantTd);

    const resultTd = document.createElement('td');
    const resultInput = document.createElement('input');
    resultInput.type = 'text';
    resultInput.id = 'result' + (i + 1);
    resultTd.appendChild(resultInput);
    tableRow.appendChild(resultTd);

    inputTableBody.appendChild(tableRow);
  }
}

function drawLadder() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ladderMatrix = [];
  for (let i = 0; i < participants - 1; i++) {
    let row = [];
    for (let j = 0; j < ladderHeight; j++) {
      row.push(Math.random() > 0.5);
    }
    ladderMatrix.push(row);
  }

  // 각 세로선 사이에 적어도 하나의 가로선이 있는지 확인하고 필요한 경우 가로선을 추가합니다.
  for (let i = 0; i < participants - 1; i++) {
    let hasHorizontalLine = false;
    for (let j = 0; j < ladderHeight; j++) {
      if (ladderMatrix[i][j]) {
        hasHorizontalLine = true;
        break;
      }
    }
    if (!hasHorizontalLine) {
      ladderMatrix[i][Math.floor(Math.random() * ladderHeight)] = true;
    }
  }

  // 가로줄이 겹치지 않도록 검사하고 수정합니다.
  for (let i = 0; i < participants - 1; i++) {
    for (let j = 0; j < ladderHeight; j++) {
      if (i > 0 && ladderMatrix[i][j] && ladderMatrix[i - 1][j]) {
        ladderMatrix[i][j] = false;
      }
    }
  }

  // 가로줄을 그립니다.
  for (let j1 = 0; j1 < participants; j1++) {
    let x = (j1 + 1) * ladderWidth;
    let y = (j1 * (canvas.height - ladderSpacingY * 2)) / ladderHeight + ladderSpacingY;
    ctx.beginPath();
    ctx.moveTo(x, ladderSpacingY);
    ctx.lineTo(x, canvas.height - ladderSpacingY);
    ctx.stroke();
  }

  // 세로줄을 그립니다.
  for (let i = 0; i < participants; i++) {
    for (let j = 0; j < ladderHeight; j++) {
      let x = (i + 1) * ladderWidth;
      let y = (j * (canvas.height - ladderSpacingY * 2)) / ladderHeight + ladderSpacingY;
      if (ladderMatrix[i][j] && i < participants - 1) {
        ctx.beginPath();
        ctx.moveTo(x, y + (canvas.height - ladderSpacingY * 2) / ladderHeight / 2);
        ctx.lineTo(x + ladderWidth, y + (canvas.height - ladderSpacingY * 2) / ladderHeight / 2);
        ctx.stroke();
      }
    }
  }
}

function areParticipantInputsFilled() {
  for (let i = 0; i < participants; i++) {
    const participantInput = document.getElementById('participant' + (i + 1));
    if (!participantInput.value) {
      return false;
    }
  }
  return true;
}

function hasAtLeastOneResultInputFilled() {
  for (let i = 0; i < participants; i++) {
    const resultInput = document.getElementById('result' + (i + 1));
    if (resultInput.value) {
      return true;
    }
  }
  return false;
}

function findEmptyParticipantInput() {
  for (let i = 0; i < participants; i++) {
    const participantInput = document.getElementById('participant' + (i + 1));
    if (!participantInput.value) {
      return i + 1;
    }
  }
  return -1;
}

function startGame() {
  if (animationProgress < animationPath.length - 1) {
    return;
  }

  if (!areParticipantInputsFilled()) {
    const emptyInputIndex = findEmptyParticipantInput();
    alert('참가자 ' + emptyInputIndex + '의 이름이 비어있습니다.');
    return;
  }

  if (!hasAtLeastOneResultInputFilled()) {
    alert('하나 이상의 결과 입력란에 값을 입력해야 합니다.');
    return;
  }

  const startPos = currentStartPos;
  currentStartPos = (currentStartPos + 1) % participants;
  let currentPos = startPos;
  animationProgress = 0;
  animationPath = [];

  for (let j = 0; j < ladderHeight; j++) {
    animationPath.push([currentPos, j]);
    if (currentPos > 0 && ladderMatrix[currentPos - 1][j]) {
      currentPos--;
    } else if (currentPos < participants - 1 && ladderMatrix[currentPos][j]) {
      currentPos++;
    }
  }

  animationPath.push([currentPos, ladderHeight]);
  moveRedRect();

  const participantInput = document.getElementById('participant' + (startPos + 1));
  const resultInput = document.getElementById('result' + (currentPos + 1));
  setTimeout(() => {
    alert('시작 위치: ' + participantInput.value + ', 결과 위치: ' + resultInput.value);
  }, frameDelay * animationPath.length);
}

currentStartPos = 0;
let animationProgress = 0;
let animationPath = [];
const frameDelay = 150;

function moveRedRect() {
  if (animationProgress < animationPath.length - 1) {
    const from = animationPath[animationProgress];
    const to = animationPath[animationProgress + 1];
    const x1 = from[0] * ladderWidth + ladderWidth - 10;
    const y1 = (from[1] * (canvas.height - ladderSpacingY * 2)) / ladderHeight + ladderSpacingY + 10;
    const x2 = to[0] * ladderWidth + ladderWidth - 10;
    const y2 = (to[1] * (canvas.height - ladderSpacingY * 2)) / ladderHeight + ladderSpacingY + 10;

    ctx.fillStyle = 'red';
    ctx.clearRect(x1, y1 - 20, 20, 20);
    ctx.fillRect(x2, y2 - 20, 20, 20);

    animationProgress++;
    setTimeout(moveRedRect, frameDelay);
  }
}

applyParticipants();
drawLadder();
