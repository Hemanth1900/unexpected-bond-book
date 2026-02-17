const chaptersContainer = document.getElementById("chapters");

async function loadChapters(){

    const res = await fetch("chapters.json");
    const chapterFiles = await res.json();

    for(let file of chapterFiles){

        const chapterRes = await fetch(file);
        const text = await chapterRes.text();

        renderChapter(text);
    }
}

function renderChapter(text){

    const lines = text.split("\n");

    const chapterNumber = lines[0];
    const chapterTitle = lines[1];
    const paragraphs = lines.slice(2);

    const page = document.createElement("section");
    page.className = "page";

    const content = document.createElement("div");
    content.className = "page-content";

    content.innerHTML += `<div class="chapter-number">${chapterNumber}</div>`;
    content.innerHTML += `<div class="chapter-title">${chapterTitle}</div>`;

    paragraphs.forEach(p=>{
        if(p.trim() !== ""){
            content.innerHTML += `<p>${p}</p>`;
        }
    });

    page.appendChild(content);
    chaptersContainer.appendChild(page);
}

loadChapters();
