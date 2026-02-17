const bookElement = document.getElementById("book");

async function loadChapters() {

    let chapterNumber = 1;
    let pageCount = 1;

    while(true){
        try{
            const response = await fetch(`chapter${chapterNumber}.txt`);
            if(!response.ok) break;

            const text = await response.text();

            const lines = text.split("\n");

            const chapterHeading = `
                <div class="chapter-number">${lines[0]}</div>
                <div class="chapter-title">${lines[1]}</div>
            `;

            const contentText = lines.slice(2).join("\n\n");

            /* SPLIT TEXT INTO BOOK PAGES */
            const words = contentText.split(" ");
            let pageText = "";
            let pageWordLimit = 120; // controls how much text per page
            let wordCounter = 0;

            for(let word of words){

                pageText += word + " ";
                wordCounter++;

                if(wordCounter >= pageWordLimit){

                    createPage(pageText, chapterHeading, pageCount);

                    pageText = "";
                    wordCounter = 0;
                    pageCount++;
                }
            }

            /* Remaining words */
            if(pageText.trim() !== ""){
                createPage(pageText, chapterHeading, pageCount);
                pageCount++;
            }

            chapterNumber++;

        }catch{
            break;
        }
    }

    initBook();
}

/* CREATE EACH BOOK PAGE */
function createPage(text, heading, pageNumber){

    const page = document.createElement("div");
    page.className = "page";

    let html = "";

    if(pageNumber % 2 !== 0){
        html += heading;
    }

    html += `<p>${text}</p>`;

    html += `<div class="${pageNumber % 2 === 0 ? 'page-number-right':'page-number-left'}">${pageNumber}</div>`;

    page.innerHTML = html;

    bookElement.appendChild(page);
}

/* INIT PAGE FLIP */
function initBook(){

    const pageFlip = new St.PageFlip(
        bookElement,
        {
            width: 500,
            height: 650,
            size: "stretch",
            showCover: false,
            mobileScrollSupport: true,
            useMouseEvents: true
        }
    );

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    /* Bookmark */
    window.saveBookmark = function(){
        localStorage.setItem("bookmark", pageFlip.getCurrentPageIndex());
        alert("Page bookmarked!");
    }

    const savedPage = localStorage.getItem("bookmark");
    if(savedPage){
        pageFlip.flip(savedPage);
    }
}

loadChapters();
