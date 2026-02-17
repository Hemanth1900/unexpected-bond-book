const bookElement = document.getElementById("book");

/* INITIALIZE PAGEFLIP */
const pageFlip = new St.PageFlip(bookElement, {
    width:520,
    height:680,
    size:"stretch",
    maxShadowOpacity:0.25,
    showCover:true,
    mobileScrollSupport:true,
    swipeDistance:30,
    autoSize:true,
    clickEventForward:true,
    useMouseEvents:true
});

/* LOAD CHAPTER FILES */
async function loadChapters(){

    const chapterFiles = [
        "chapter1.txt",
        "chapter2.txt"
    ];

    let allPages = [];

    for(let file of chapterFiles){

        const res = await fetch(file);
        const text = await res.text();

        const pages = splitIntoPages(text);

        pages.forEach(page=>{
            allPages.push(createPage(page));
        });
    }

    /* LOAD ALL PAGES AT ONCE */
    pageFlip.loadFromHTML(allPages);
}

/* SPLIT TEXT INTO BOOK PAGES */
function splitIntoPages(text){

    const words = text.split(" ");
    let pages = [];
    let current = "";

    words.forEach(word=>{
        current += word + " ";
        if(current.length > 1200){
            pages.push(current);
            current = "";
        }
    });

    pages.push(current);
    return pages;
}

/* CREATE PAGE HTML */
function createPage(content){

    const page = document.createElement("div");
    page.className = "page";

    page.innerHTML = `
        <div class="page-content">
            <p>${content}</p>
        </div>
    `;

    return page;
}

/* LOAD BOOK */
loadChapters();
