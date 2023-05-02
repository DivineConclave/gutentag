function processString(input) {
    // Remove unwanted BBCode tags
    let bbCodeRemoved = input.replace(/\[(?!spoiler|\/spoiler|title|\/title)[^[\]]*\]/g, '');

    // Remove bold/italics from Markdown headings and table headings
    let headingsFixed = bbCodeRemoved.replace(/^(?:(\*{1,2}))(#+)(\s*)([^*]+)(?:(\*{1,2}))(.*)$/gm, '$2$3$4$6');
    headingsFixed = headingsFixed.replace(/^(#+)(\s*[^*]*)((\*{1,2})([^*]+)(\*{1,2}))(.*)$/gm, '$1$2$5$7');

    let tableHeadingsFixed = headingsFixed.replace(/^\|(.*)\|$/gm, (_, row) => {
        return '|' + row.replace(/(\*{1,2}([^*]+)\*{1,2})/g, '$2') + '|';
    });

    // Normalize Markdown table formatting
    let tableFixed = tableHeadingsFixed.replace(/^\|(.*)\|$/gm, (_, row) => {
        let cells = row.split('|').map(cell => cell.trim());
        return '| ' + cells.join(' | ') + ' |';
    });

    return tableFixed;
}

async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

async function handleSubmit() {
    //DOM elements
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const copyMessage = document.getElementById('copyMessage');

    //Strings
    const inputString = input.value;
    const outputString = processString(inputString);

    //Logic
    output.value = outputString;
    output.select();
    output.setSelectionRange(0, outputString.length);
    await copyTextToClipboard(output.value);
    copyMessage.style.display = 'block';
    setTimeout(() => {
        copyMessage.style.display = 'none';
    }, 8000);
}
