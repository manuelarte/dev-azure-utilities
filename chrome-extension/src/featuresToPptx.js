import pptxgen from 'pptxgenjs';

const observer = new MutationObserver(mutationList => {
  mutationList.filter(m => m.type === 'childList').forEach(m => {
    m.addedNodes.forEach(x => {
      if (x.nodeName === 'DIV') {
        // add button to export to PPTx
        console.log(x);
      }

    });
  });
});
const fullSize = document.querySelector('div.full-size');
console.log('div.fullSize', fullSize);
observer.observe(fullSize, { childList: true, subtree: true });


const queryResultsCard = document.querySelector('div.query-results-card');
console.log('query result card', queryResultsCard);

let queryCommandBar = document.querySelector('div.query-command-bar');
// add new button here
if (queryCommandBar) {
  queryCommandBar = queryCommandBar.querySelector('div.query-command-bar');
  const exportToPptButton = createToPPTxButton();
  exportToPptButton.addEventListener('click', myFunction);
  const runQueryButton = queryCommandBar.querySelector('button.bolt-header-command-item-button');
  queryCommandBar.insertBefore(exportToPptButton, runQueryButton);
} else {
  console.log('div.query-command-ba');
}

function createToPPTxButton() {
  const exportToPptButton = document.createElement('button');
  exportToPptButton.classList.add('bolt-button');
  exportToPptButton.classList.add('bolt-icon-button');
  exportToPptButton.classList.add('bolt-focus-treatment');
  const t = document.createTextNode('To PPTx');
  exportToPptButton.appendChild(t);
  return exportToPptButton;
}

function myFunction() {
  console.log('to pptx');

  const table = document.querySelector('table.results-tree')
  if (table) {
    console.log('table found')
    // 1. Create a new Presentation
    let pres = new pptxgen();

    // 2. Add a Slide
    let slide = pres.addSlide();

    // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
    const thHeaders = [...table.querySelectorAll('th.bolt-table-header-cell')]
    const rowHeader = thHeaders.filter((thHeader) => thHeader.querySelector('span') != null)
      .map((thHeader) => {
        const span =  thHeader.querySelector('span');
        return {
          text: span.textContent,
          options: {align: 'left', border: {type:'all'}}
        }
      }
    )

    let rows = [rowHeader]
    const trRows = table.querySelectorAll('tr.bolt-tree-row');
    for (let i = 0; i < trRows.length; i++) {
      const tdColumns = [...trRows[i].querySelectorAll('td.bolt-list-cell')];
      const row = tdColumns.filter((tdColumn) => tdColumn.querySelector('span') != null)
        .map((tdColumn) => {
          const span =  tdColumn.querySelector('span');
          return {
            text: span.textContent,
            options: {align: 'left'}
          }
        })
      rows.push(row);
    }


    slide.addTable(rows)

    pres.writeFile().then(r => console.log('saved'));
  } else {
    console.log('no table found')
  }


}
