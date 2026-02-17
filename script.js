const bookElement = document.getElementById("book");

async function loadChapters() {

    // COVER PAGE
    const cover = document.createElement("div");
    cover.className = "page cover";
    cover.innerHTML = `
        <h1>The Journey From Unexpected Bond to Unexpected Goodbye</h1>
        <h2>Ayush A.</h2>
    `;
    bookElement.appendChild(cover);

    let chapterNumber = 1;

    while(true){
        try{
            const response = await fetch(`chapter${chapterNumber}.txt`);
            if(!response.ok) break;

            const text = await response.text();

            const page = document.createElement("div");
            page.className = "page";

            page.innerHTML = text
                .split("\n\n")
                .map(p => `<p>${p}</p>`)
                .join("");

            bookElement.appendChild(page);

            chapterNumber++;

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
            width: 450,
            height: 600,
            showCover: true,
            mobileScrollSupport: true
        }
    );

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    window.saveBookmark = function(){
        localStorage.setItem("bookmark", pageFlip.getCurrentPageIndex());
        alert("Bookmarked!");
    }

    const savedPage = localStorage.getItem("bookmark");
    if(savedPage){
        pageFlip.flip(savedPage);
    }
}

loadChapters();
