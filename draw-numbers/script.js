function generateColors() {
  const colors = [
    '#1F618D',
    '#7D6608',
    '#A93226',
    '#4A235A',
    '#0E6655',
    '#7E5109',
    '#1B2631',
    '#633974',
    '#283747',
    '#515A5A',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateNumbers() {
  const range = parseInt(document.getElementById('range').value);
  const count = parseInt(document.getElementById('count').value);

  if (count > range) {
    alert('Number count cannot be greater than the number range.');
    return;
  }

  const result = document.getElementById('result');
  result.innerHTML = '';

  const numbers = [];
  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * range) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
      const numberDiv = document.createElement('div');
      numberDiv.className = 'number';
      numberDiv.textContent = randomNumber;
      numberDiv.style.backgroundColor = generateColors();
      result.appendChild(numberDiv);
    }
  }
}
