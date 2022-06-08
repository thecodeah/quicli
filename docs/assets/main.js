const COPY_BUTTON_ID = "copy-to-clipboard";

var code = ""

document.addEventListener('DOMContentLoaded', () => {
    // Highlight.js initialization.
    hljs.highlightAll();

    // Fetch the code from Github when the page is opened and assign it
    // to a global variable for later use.
    fetch("https://raw.githubusercontent.com/thecodeah/quicli/master/lib/quicli.min.js")
        .then((res) => res.text())
        .then((text) => {
            code = text
        })

    // Initiate a confetti.js instance for the "Copy to clipboard!" button.
    let copyButtonConfetti = new Confetti(COPY_BUTTON_ID)
    copyButtonConfetti.setCount(20)
    copyButtonConfetti.setSize(1)
    copyButtonConfetti.setPower(20)
    copyButtonConfetti.setFade(true)
    copyButtonConfetti.destroyTarget(false)

    // Register the handler function to the "Copy to clipboard!" button.
    document.getElementById(COPY_BUTTON_ID).onclick = handleCopyToClipboard
})

function handleCopyToClipboard() {
    if(code === "") {
        alert("Something went wrong while fetching the code...")
        return
    }

    navigator.clipboard.writeText(code);
}