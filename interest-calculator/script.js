let interestType = 'simple';
let timeUnit = 'years';

function setTimeUnit(unit) {
  timeUnit = unit;
  if (unit === 'months') {
      document.getElementById('selectMonths').classList.add('active');
      document.getElementById('selectYears').classList.remove('active');
  } else if (unit === 'years') {
      document.getElementById('selectMonths').classList.remove('active');
      document.getElementById('selectYears').classList.add('active');
  }
}

function setInterestType(type) {
  if (type === 'simple' || type === 'compound') {
    interestType = type;
    document.getElementById('simpleInterest').classList.remove('active');
    document.getElementById('compoundInterest').classList.remove('active');

    if (type === 'simple') {
      document.getElementById('simpleInterest').classList.add('active');
    } else {
      document.getElementById('compoundInterest').classList.add('active');
    }
  }
}

function calculateInterest() {
  const principal = parseFloat(document.getElementById('principal').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const years = parseFloat(document.getElementById('years').value);

  let time = years;
  if (timeUnit === 'months') {
    time /= 12;
  }

  if (isNaN(principal) || isNaN(rate) || isNaN(years)) {
    alert('원금, 이자율, 기간을 올바르게 입력해주세요.');
    return;
  }

  let interest;
  if (interestType === 'simple') {
    interest = principal * (1 + (rate / 100) * years);
  } else if (interestType === 'compound') {
    interest = principal * Math.pow(1 + (rate / 100), time);
  }

  document.getElementById('result').innerHTML = `미래 가치: ${interest.toFixed(2)} 원`;
}

setInterestType('simple');
