const bookElement = document.getElementById("book");

async function loadChapters() {

    let chapterNumber = 1;
    let pageCount = 1;

    while(true){
        try{
            const response = await fetch(`chapter${chapterNumber}.txt`);
            if(!response.ok) break;

            const text = await response.text();

            const page = document.createElement("div");
            page.className = "page";

            const lines = text.split("\n");

            let html = "";

            html += `<div class="chapter-number">${lines[0]}</div>`;
            html += `<div class="chapter-title">${lines[1]}</div>`;

            const content = lines.slice(2).join("\n\n");

            html += content
                .split("\n\n")
                .map(p => `<p>${p}</p>`)
                .join("");

            html += `<div class="${pageCount % 2 === 0 ? 'page-number-right':'page-number-left'}">${pageCount}</div>`;

            page.innerHTML = html;

            bookElement.appendChild(page);

            chapterNumber++;
            pageCount++;

        }catch{
            break;
        }
    }

    initBook();
}

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
