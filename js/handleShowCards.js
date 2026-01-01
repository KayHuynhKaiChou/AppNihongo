
import listHiragana from './hiragana.js'
import listKanji from './kanji.js'
import toeic from './toeic.js';
import toeicv1 from './toeicv1.js';
import toeicv2 from './toeicv2.js';
import toeicv3 from './toeicv3.js';
import toeicv4 from './toeicv4.js';
import toeicIIG from './toeicIIG.js';

let listTuVung = []
let typeVolcabulary = [...location.href.split('/')].pop();

switch (typeVolcabulary) {
    case 'hiragana.html':
        listTuVung = listHiragana;
        break;
    case 'kanji.html':
        listTuVung = listKanji;
        break;
    case 'toeic.html':
        listTuVung = toeic;
        break;
    case 'toeicv1.html':
        listTuVung = toeicv1;
        break;
    case 'toeicv2.html':
        listTuVung = toeicv2;
        break;
    case 'toeicv3.html':
        listTuVung = toeicv3;
        break;
    case 'toeicv4.html':
        listTuVung = toeicv4;
        break;
    case 'toeicIIG.html':
        listTuVung = toeicIIG;
        break;
    default:
        break;
}

var flashContai = document.getElementById('flashcards-container');

// Tạo ô search
var searchContainer = document.createElement('div');
searchContainer.className = 'search-container';
searchContainer.innerHTML = `
    <input type="text" id="search-input" placeholder="Tìm kiếm từ vựng..." />
`;
flashContai.parentNode.insertBefore(searchContainer, flashContai);

var listPreviousIndex = [];

var prevCardSelect = null;

function renderCards(list) {
    listPreviousIndex = [];
    flashContai.innerHTML = list.map((item, index) => {
        return `
            <div class="col-md-3 flashcard">
                <div class="front">${item.tv}</div>
                <div class="back">${item.mean}</div>
            </div>
        `
    }).join('');

    // Gán lại sự kiện click cho các card mới
    prevCardSelect = null;
    document.querySelectorAll('.flashcard').forEach(card => {
        card.addEventListener('click', function () {
            flipCard(card, prevCardSelect);
            prevCardSelect = card;
        });
    });
}

// Render ban đầu với thứ tự ngẫu nhiên
var randomizedList = listTuVung.map((item, index) => {
    var validIndex = conductRandom();
    return listTuVung[validIndex];
});
renderCards(randomizedList);

// Xử lý tìm kiếm
document.getElementById('search-input').addEventListener('input', function(e) {
    var searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm === '') {
        // Reset về danh sách ngẫu nhiên ban đầu
        listPreviousIndex = [];
        var newRandomList = listTuVung.map((item, index) => {
            var validIndex = conductRandom();
            return listTuVung[validIndex];
        });
        renderCards(newRandomList);
    } else {
        // Lọc theo field tv
        var filteredList = listTuVung.filter(item =>
            item.tv.toLowerCase().includes(searchTerm)
        );
        renderCards(filteredList);
    }
});

function conductRandom(){
    do {
        var randomIndex = Math.floor(Math.random() * listTuVung.length);
    } while (checkRandomIndex(randomIndex));
    listPreviousIndex.push(randomIndex);
    // console.log(randomIndex)
    return randomIndex; 
}

function checkRandomIndex(randomIndex){
    if(listPreviousIndex.length==0) return false;
    return listPreviousIndex.some(pre => pre === randomIndex);
}