const form = document.getElementById('bookmark-form');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const categoryInput = document.getElementById('category');
const searchInput = document.getElementById('search');
const bookmarkList = document.getElementById('bookmark-list');
const filterButtons = document.querySelectorAll('.filter-btn');

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let currentCategory = 'All';

function saveBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function renderBookmarks() {
  const searchTerm = searchInput.value.toLowerCase();
  bookmarkList.innerHTML = '';
  bookmarks
    .filter(bm => (currentCategory === 'All' || bm.category === currentCategory))
    .filter(bm => bm.title.toLowerCase().includes(searchTerm) || bm.url.toLowerCase().includes(searchTerm))
    .forEach((bookmark, index) => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center bg-gray-50 p-2 rounded border';
      li.innerHTML = `
        <div>
          <a href="${bookmark.url}" target="_blank" class="text-blue-600 underline">${bookmark.title}</a>
          <span class="text-sm text-gray-500 ml-2">[${bookmark.category}]</span>
        </div>
        <button onclick="deleteBookmark(${index})" class="text-red-500">Delete</button>
      `;
      bookmarkList.appendChild(li);
    });
}

function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  saveBookmarks();
  renderBookmarks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();
  const category = categoryInput.value;
  if (!/^https?:\/\//.test(url)) {
    alert('URL must start with http:// or https://');
    return;
  }
  bookmarks.push({ title, url, category });
  saveBookmarks();
  renderBookmarks();
  form.reset();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentCategory = button.dataset.category;
    renderBookmarks();
  });
});

searchInput.addEventListener('input', renderBookmarks);

renderBookmarks();