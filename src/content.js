function getPackageName() {
  const match = window.location.pathname.match(/^\/project\/([^/]+)\//);
  return match ? match[1] : null;
}

function getPreferredTool() {
  return localStorage.getItem("preferred-python-installer") || "uv";
}

function setPreferredTool(tool) {
  localStorage.setItem("preferred-python-installer", tool);
}

function insertUvAddBlock(packageName) {
  if (!packageName) return;

  const pipBlock = document.querySelector('[data-controller="clipboard"]');
  if (!pipBlock || document.getElementById("uv-add-block")) return;

  const preferredTool = getPreferredTool();
  const initialText = `${preferredTool} add ${packageName}`;

  const newBlock = document.createElement("div");
  newBlock.dataset.controller = "clipboard";
  newBlock.id = "uv-add-block";

  newBlock.innerHTML = `
    <p class="package-header__pip-instructions">
      <span id="main-install-text" data-clipboard-target="source">${initialText}</span>
      <button type="button"
              class="copy-tooltip copy-tooltip-s"
              id="main-copy-btn"
              data-action="clipboard#copy"
              data-clipboard-target="tooltip"
              data-clipboard-tooltip-value="Copy to clipboard">
        <i class="fa fa-copy" aria-hidden="true"></i>
        <span class="sr-only">Copy command</span>
      </button>
      <button type="button"
              class="copy-tooltip copy-tooltip-s dropdown-toggle"
              data-clipboard-tooltip-value="Show more install options"
              aria-label="Show more install options">
        <i class="fa fa-ellipsis-vertical" aria-hidden="true"></i>
        <span class="sr-only">Show more options</span>
      </button>
      <span class="alt-buttons">
        <button type="button"
                class="copy-tooltip copy-tooltip-s alt-btn"
                data-tool="uv"
                data-value="uv add ${packageName}">
          uv
        </button>
        <button type="button"
                class="copy-tooltip copy-tooltip-s alt-btn"
                data-tool="poetry"
                data-value="poetry add ${packageName}">
          poetry
        </button>
        <button type="button"
                class="copy-tooltip copy-tooltip-s alt-btn"
                data-tool="pdm"
                data-value="pdm add ${packageName}">
          pdm
        </button>
      </span>
    </p>
  `;

  pipBlock.parentNode.insertBefore(newBlock, pipBlock.nextSibling);

  const caretBtn = newBlock.querySelector('.dropdown-toggle');
  const altBtnGroup = newBlock.querySelector('.alt-buttons');
  const mainText = newBlock.querySelector('#main-install-text');

  caretBtn.addEventListener('click', () => {
    altBtnGroup.classList.toggle('show');
  });

  altBtnGroup.querySelectorAll('.alt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newText = btn.getAttribute('data-value');
      const tool = btn.getAttribute('data-tool');
      mainText.textContent = newText;
      setPreferredTool(tool);
      altBtnGroup.classList.remove('show');
    });
  });

  document.addEventListener('click', (e) => {
    if (!newBlock.contains(e.target)) {
      altBtnGroup.classList.remove('show');
    }
  });
}

insertUvAddBlock(getPackageName());
