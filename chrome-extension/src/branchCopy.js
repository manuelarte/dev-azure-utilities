const maxTitleLength = 60;

const sprintTableBody = document.querySelector('tbody');

// `document.querySelector` may return null if the selector doesn't match anything.
if (sprintTableBody) {
  const observer = new MutationObserver(mutationList =>
    mutationList.filter(m => m.type === 'childList').forEach(m => {
      m.addedNodes.forEach(x => {
        if (x.nodeName === 'TR') {
          addDoubleClickListenerToTasks(x);
        }

      });
    }));
  observer.observe(sprintTableBody, { childList: true, subtree: true });

  const stories = sprintTableBody.querySelectorAll('tr.full-height');
  for (let i = 0; i < stories.length; i++) {
    addDoubleClickListenerToTasks(stories[i]);
  }

}

function addDoubleClickListenerToTasks(story) {
  let parent_story = story.querySelector('td.taskboard-parent-cell').querySelector('div.card-content');
  const parent_work_item_id = parent_story.querySelector('span.font-weight-semibold').textContent;

  // for each column, check tasks and create branch name
  const tdColumns = story.querySelectorAll('td.taskboard-expanded-cell');
  for (let i = 0; i < tdColumns.length; i++) {
    const column = tdColumns[i];
    let divTasks = column.querySelectorAll('div.taskboard-card');

    for (let j = 0; j < divTasks.length; j++) {
      // Task in Column
      const title = divTasks[j].querySelector('span.title-text').textContent;
      const gitTitle = replaceTaskTitle(title);
      const branchName = `feature/${parent_work_item_id}/${gitTitle}`;

      // Attach button
      const boltButton = divTasks[j].querySelector('button.bolt-icon-button');
      boltButton.addEventListener('dblclick', () => {
        navigator.clipboard.writeText(branchName).then(
          () => {
            loadSnackbar(`Branch name '${branchName}' copied to clipboard`);
          },
        ).finally();
      });


    }
  }
}

function replaceTaskTitle(title) {
  let replaced = title.replace(/[\s/]+/g, '-').toLowerCase();
  return replaced.substring(0, maxTitleLength);
}

function loadSnackbar(message) {
  // Load the snackbar.html
  console.log('Loading snackbar');
  fetch(chrome.runtime.getURL('./html/snackbar.html'))
    .then((response) => response.text())
    .then((html) => {
      // Inject the snackbar into the DOM
      let snackbarContainerWrapper = document.body.querySelector('div.dev-azure-utilities-snackbar-container-wrapper');
      if (snackbarContainerWrapper == null) {
        snackbarContainerWrapper = document.createElement('div');
        snackbarContainerWrapper.classList.add('dev-azure-utilities-snackbar-container-wrapper');
        document.body.appendChild(snackbarContainerWrapper);
      }
      snackbarContainerWrapper.innerHTML = html;

      // Dynamically load the CSS
      const snackbarCSS = document.head.querySelector('link.dev-azure-utilities-snackbar');
      if (snackbarCSS == null) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.className = 'dev-azure-utilities-snackbar';
        link.href = chrome.runtime.getURL('./html/snackbar.css');
        document.head.appendChild(link);
      }

      // Show the snackbar
      showSnackbar(message);
    });
}


function showSnackbar(message) {
  const snackbar = document.getElementById('snackbar');
  snackbar.textContent = message; // Set the message
  snackbar.className = 'show';

  // Hide the snackbar after 3 seconds
  setTimeout(() => {
    snackbar.className = snackbar.className.replace('show', '');
    // Optionally remove the snackbar from the DOM
    snackbar.remove();
  }, 3000);
}
