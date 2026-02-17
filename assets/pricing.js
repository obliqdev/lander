(function () {
  const totalEl = document.getElementById('pricingTotal');
  const addOnInputs = Array.from(document.querySelectorAll('input[data-addon-price]'));

  if (!totalEl || !addOnInputs.length) {
    return;
  }

  const BASE_PRICE = 100;

  const asPrice = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const renderTotal = () => {
    const addOnTotal = addOnInputs.reduce((sum, input) => {
      if (!input.checked) return sum;
      return sum + asPrice(input.getAttribute('data-addon-price'));
    }, 0);

    const total = BASE_PRICE + addOnTotal;
    totalEl.textContent = `$${total}`;
  };

  addOnInputs.forEach((input) => {
    input.addEventListener('change', renderTotal);
  });

  renderTotal();
})();
