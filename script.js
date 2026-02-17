const bookElement = document.getElementById("book");

/* ADD COVER PAGE FIRST */
function addCover(){

    const cover = document.createElement("div");
    cover.className = "page cover";

    cover.innerHTML = `
        <div class="cover-content">
            <div class="cover-title">Unexpected Bond,<br>Unexpected Goodbye</div>
            <div class="cover-author">Ayush A.</div>
        </div>
    `;

    bookElement.appendChild(cover);
}

/* LOAD CHAPTER FILES */
async function loadChapters(){

    addCover();

    let chapterNumber = 1;
    let pageCount = 1;

    while(true){
        try{
            const res = await fetch(`chapter${chapterNumber}.txt`);
            if(!res.ok) break;

            const text = await res.text();
            const lines = text.split("\n");

            const chapterNum = lines[0];
            const chapterTitle = lines[1];

            const contentText = lines.slice(2).join("\n\n");

            const words = contentText.split(" ");
            let pageText = "";
            let counter = 0;
            let firstPage = true;

            for(let word of words){
                pageText += word + " ";
                counter++;

                if(counter >= 110){
                    createPage(pageText, chapterNum, chapterTitle, pageCount, firstPage);
                    pageText = "";
                    counter = 0;
                    pageCount++;
                    firstPage = false;
                }
            }

            if(pageText.trim() !== ""){
                createPage(pageText, chapterNum, chapterTitle, pageCount, firstPage);
                pageCount++;
            }

            chapterNumber++;

        }catch{
            break;
        }
    }

    initBook();
}

/* CREATE EACH PAGE */
function createPage(text, chapterNum, chapterTitle, pageNumber, firstPage){

    const page = document.createElement("div");
    page.className = "page";

    let html = `<div class="page-content">`;

    /* FIRST PAGE OF CHAPTER */
    if(firstPage){
        html += `<div class="chapter-number">${chapterNum}</div>`;
        html += `<div class="chapter-title">${chapterTitle}</div>`;
    }
    else{
        /* RUNNING HEADERS */
        if(pageNumber % 2 === 0){
            html += `<div class="header-right">${chapterTitle}</div>`;
        } else {
            html += `<div class="header-left">Ayush A.</div>`;
        }
    }

    html += `<p>${text}</p>`;
    html += `</div>`;

    /* PAGE NUMBER */
    html += `<div class="${pageNumber % 2 === 0 ? 'page-number-right':'page-number-left'}">${pageNumber}</div>`;

    page.innerHTML = html;
    bookElement.appendChild(page);
}

/* PAGE FLIP ENGINE */
function initBook(){

    const pageFlip = new St.PageFlip(bookElement,{
        width:520,
        height:680,
        size:"fixed",
        showCover:true,
        useMouseEvents:true,
        mobileScrollSupport:false,
        usePortrait:false,
        autoSize:false,
        maxShadowOpacity:0.7,
        showPageCorners:true
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    /* BOOKMARK SYSTEM */
    window.saveBookmark = function(){
        localStorage.setItem("bookmark", pageFlip.getCurrentPageIndex());
        alert("Page bookmarked!");
    };

    const saved = localStorage.getItem("bookmark");
    if(saved){
        pageFlip.flip(saved);
    }
}

/* START */
loadChapters();
