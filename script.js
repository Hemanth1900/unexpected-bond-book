const bookElement = document.getElementById("book");

// PAGEFLIP INITIALIZATION (FAST + SMOOTH)
const pageFlip = new St.PageFlip(bookElement, {
    width:550,
    height:700,
    size:"stretch",
    maxShadowOpacity:0.25,
    showCover:true,
    mobileScrollSupport:true,
    swipeDistance:25,
    autoSize:true,
    clickEventForward:true,
    useMouseEvents:true
});

// LOAD CHAPTER FILES
async function loadChapters(){

    const chapters = [
        "chapter1.txt",
        "chapter2.txt"
    ];

    for(let file of chapters){

        const res = await fetch(file);
        const text = await res.text();

        const pages = splitIntoPages(text);

        pages.forEach(page=>{
            pageFlip.loadFromHTML(createPage(page));
        });
    }
}

// SPLIT TEXT INTO PAGE BLOCKS
function splitIntoPages(text){
    const words = text.split(" ");
    const pages = [];
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

// CREATE PAGE HTML
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

// ZOOM CONTROL SYSTEM
let zoomed = false;

bookElement.addEventListener("touchstart", ()=>{
    zoomed = false;
});

bookElement.addEventListener("gesturestart", ()=>{
    zoomed = true;
    pageFlip.disableFlipByClick(true);
});

bookElement.addEventListener("gestureend", ()=>{
    zoomed = false;
    pageFlip.disableFlipByClick(false);
});

// DOUBLE TAP RESET
let lastTap = 0;
bookElement.addEventListener("touchend", function(event){
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if(tapLength < 300 && tapLength > 0){
        location.reload();
    }
    lastTap = currentTime;
});

// LOAD EVERYTHING
loadChapters();
