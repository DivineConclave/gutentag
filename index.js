function processString(input) {
    const removeUnwantedBBCode = (str) => {
        const spoilerTags = /(\[spoiler\]|\[\/spoiler\])/gi;
        const allBBCodeTags = /\[\/?(\w+)[^\]]*\]/gi;
        return str.replace(allBBCodeTags, (match) => spoilerTags.test(match) ? match : '');
    };

    const fixMarkdownTables = (str) => {
        const tableRow = /\|([^\n]*\|)+/g;
        return str.replace(tableRow, (match) => {
            const cells = match.split('|').filter(cell => cell.trim() !== '');
            return `| ${cells.join(' | ')} |`;
        });
    };

    const removeEmptyHeadings = (str) => {
        const emptyHeading = /^[\s]*#+[\s]*$/gm;
        return str.replace(emptyHeading, '');
    };

    const removeRedundantBold = (str) => {
        const boldInHeading = /^(#+[\s]*)(\*\*)/gm;
        const boldInTableHeading = /(\|[^\n]*?\|[\s]*)(\*\*)/g;
        return str.replace(boldInHeading, '$1').replace(boldInTableHeading, '$1');
    };

    let processed = input;
    processed = removeUnwantedBBCode(processed);
    processed = fixMarkdownTables(processed);
    processed = removeEmptyHeadings(processed);
    processed = removeRedundantBold(processed);

    return processed;
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
