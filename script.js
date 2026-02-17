const bookElement = document.getElementById("book");

/* ============================= */
/* ADD REAL BOOK OPENING PAGES   */
/* ============================= */

function addCover(){

    /* LEFT INSIDE BLANK */
    const insideBlank = document.createElement("div");
    insideBlank.className = "page";
    insideBlank.innerHTML = `<div class="page-content"></div>`;
    bookElement.appendChild(insideBlank);

    /* RIGHT PAGE = COVER */
    const cover = document.createElement("div");
    cover.className = "page cover";

    cover.innerHTML = `
        <div class="cover-content">
            <div class="cover-title">Unexpected Bond,<br>Unexpected Goodbye</div>
            <div class="cover-author">Ayush A.</div>
        </div>
    `;
    bookElement.appendChild(cover);

    /* BLANK PAGE AFTER COVER */
    const blankAfter = document.createElement("div");
    blankAfter.className = "page";
    blankAfter.innerHTML = `<div class="page-content"></div>`;
    bookElement.appendChild(blankAfter);
}

/* ============================= */
/* LOAD CHAPTER FILES            */
/* ============================= */

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

            const content = lines.slice(2).join("\n\n");

            const words = content.split(" ");
            let pageText = "";
            let counter = 0;
            let firstPage = true;

            for(let word of words){
                pageText += word + " ";
                counter++;

                if(counter >= 120){
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

/* ============================= */
/* CREATE BOOK PAGES             */
/* ============================= */

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

    /* PAGE NUMBERS */
    html += `<div class="${pageNumber % 2 === 0 ? 'page-number-right' : 'page-number-left'}">${pageNumber}</div>`;

    page.innerHTML = html;
    bookElement.appendChild(page);
}

/* ============================= */
/* PAGE FLIP ENGINE (OPTIMIZED)  */
/* ============================= */

function initBook(){

    const pageFlip = new St.PageFlip(bookElement,{
        width:500,
        height:660,
        size:"fixed",
        showCover:true,

        /* PERFORMANCE OPTIMIZATION */
        useMouseEvents:true,
        mobileScrollSupport:false,
        usePortrait:false,
        autoSize:false,
        maxShadowOpacity:0.3,
        showPageCorners:false,
        flippingTime:600
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

/* ============================= */
/* START BOOK                    */
/* ============================= */

loadChapters();
