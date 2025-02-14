
//<script src="https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/libs/jszip.min.js"></script>
//<script src="https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.min.js"></script>

const observer = new MutationObserver(mutationList => {
    mutationList.filter(m => m.type === 'childList').forEach(m => {
        m.addedNodes.forEach(x => {
            if (x.nodeName === 'DIV') {
                // add button to export to PPTx
                console.log(x)
            }

        });
    });
});
const fullSize = document.querySelector('div.full-size')
console.log('div.fullSize', fullSize)
observer.observe(fullSize,{childList: true, subtree: true});


const queryResultsCard = document.querySelector('div.query-results-card')
console.log("query result card", queryResultsCard)

let queryCommandBar = document.querySelector('div.query-command-bar')
// add new button here
if (queryCommandBar) {
    queryCommandBar = queryCommandBar.querySelector('div.query-command-bar')
    const exportToPptButton = createToPPTxButton()
    exportToPptButton.addEventListener("click", myFunction);
    const runQueryButton = queryCommandBar.querySelector('button.bolt-header-command-item-button')
    queryCommandBar.insertBefore(exportToPptButton, runQueryButton)
} else {
    console.log("div.query-command-ba")
}

function createToPPTxButton() {
    const exportToPptButton = document.createElement("button")
    exportToPptButton.classList.add('bolt-button')
    exportToPptButton.classList.add('bolt-icon-button')
    exportToPptButton.classList.add('bolt-focus-treatment')
    const t = document.createTextNode("To PPTx");
    exportToPptButton.appendChild(t)
    return exportToPptButton
}

function myFunction() {
    console.log("to pptx")
}