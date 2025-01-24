const maxTitleLength = 60

const sprintTableBody = document.querySelector('tbody');

// `document.querySelector` may return null if the selector doesn't match anything.
if (sprintTableBody) {
    let stories = sprintTableBody.querySelectorAll('tr.full-height')

    for (let i = 0; i < stories.length; i++) {
        // Story
        let parent_story = stories[i].querySelector('td.taskboard-parent-cell').querySelector('div.card-content')
        const parent_work_item_id = parent_story.querySelector('span.font-weight-semibold').textContent

        // for each column, check tasks and create branch name
        const tdColumns = stories[i].querySelectorAll('td.taskboard-expanded-cell')
        for (let i = 0; i < tdColumns.length; i++) {
            const column = tdColumns[i]
            let divTasks = column.querySelectorAll('div.taskboard-card')

            for (let j = 0; j < divTasks.length; j++) {
                // Task in Column
                const title = divTasks[j].querySelector('span.title-text').textContent
                const gitTitle = replaceTaskTitle(title)
                const branchName = `feature/${parent_work_item_id}/${gitTitle}`

                // Attach button
                const boltButton = divTasks[j].querySelector('button.bolt-icon-button')
                boltButton.addEventListener('dblclick', () => {
                    navigator.clipboard.writeText(branchName).finally();
                })


            }
        }

    }

}

function replaceTaskTitle(title) {
    let replaced = title.replace(/\s+/g, '-').toLowerCase();
    return replaced.substring(0, maxTitleLength)
}