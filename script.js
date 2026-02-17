const bookElement = document.getElementById("book");

async function loadChapters() {

    let chapterNumber = 1;
    let pageCount = 1;

    while (true) {
        try {
            const response = await fetch(`chapter${chapterNumber}.txt`);
            if (!response.ok) break;

            const text = await response.text();
            const lines = text.split("\n");

            const chapterHeading = `
                <div class="chapter-number">${lines[0]}</div>
                <div class="chapter-title">${lines[1]}</div>
            `;

            const contentText = lines.slice(2).join("\n\n");

            /* SPLIT TEXT INTO REAL BOOK PAGES */
            const words = contentText.split(" ");
            let pageText = "";
            let wordLimit = 110;
            let counter = 0;

            for (let word of words) {
                pageText += word + " ";
                counter++;

                if (counter >= wordLimit) {
                    createPage(pageText, chapterHeading, pageCount);
                    pageText = "";
                    counter = 0;
                    pageCount++;
                }
            }

            if (pageText.trim() !== "") {
                createPage(pageText, chapterHeading, pageCount);
                pageCount++;
            }

            chapterNumber++;

        } catch {
            break;
        }
    }

    initBook();
}

/* CREATE EACH PAGE */
function createPage(text, heading, pageNumber) {

    const page = document.createElement("div");
    page.className = "page";

    let html = "";

    /* Heading only on right page */
    if (pageNumber % 2 !== 0) {
        html += heading;
    }

    html += `<p>${text}</p>`;

    html += `<div class="${pageNumber % 2 === 0 ? 'page-number-right' : 'page-number-left'}">${pageNumber}</div>`;

    page.innerHTML = html;
    bookElement.appendChild(page);
}

/* REAL BOOK ENGINE */
function initBook() {

    const pageFlip = new St.PageFlip(bookElement, {
        width: 520,
        height: 680,
        minWidth: 520,
        maxWidth: 1200,
        minHeight: 680,
        maxHeight: 1400,

        size: "fixed",
        showCover: false,
        useMouseEvents: true,
        mobileScrollSupport: false,

        usePortrait: false,        // ALWAYS SPREAD MODE
        startZIndex: 0,
        autoSize: false,
        maxShadowOpacity: 0.6,
        showPageCorners: true
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    /* Bookmark */
    window.saveBookmark = function () {
        localStorage.setItem("bookmark", pageFlip.getCurrentPageIndex());
        alert("Page bookmarked!");
    };

    const savedPage = localStorage.getItem("bookmark");
    if (savedPage) {
        pageFlip.flip(savedPage);
    }
}

loadChapters();
