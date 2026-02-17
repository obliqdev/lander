(function () {
  const button = document.createElement('button');
  button.className = 'chat-fab';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.textContent = window.innerWidth <= 560 ? 'Chat' : 'Live Chat';

  const panel = document.createElement('aside');
  panel.className = 'chat-panel';
  panel.setAttribute('aria-label', 'Live chat');
  panel.innerHTML = `
    <h4>Live Chat</h4>
    <p>Chat placeholder for studio support. Connect your preferred chat provider or route to support.</p>
    <div class="chat-actions">
      <a class="btn" href="#support">Go to Support</a>
      <button class="btn" type="button" id="chatCloseBtn">Close</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  const closeBtn = panel.querySelector('#chatCloseBtn');

  function openPanel() {
    panel.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    panel.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', () => {
    if (panel.classList.contains('open')) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePanel();
  });

  document.addEventListener('click', (event) => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(event.target) || button.contains(event.target)) return;
    closePanel();
  });

  window.addEventListener('resize', () => {
    button.textContent = window.innerWidth <= 560 ? 'Chat' : 'Live Chat';
  });
})();
