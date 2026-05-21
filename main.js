let todosLosPosts = [];

let postsGrid;
let searchInput;
let counter;
let loader;
let errorMsg;
let modal;
let modalClose;
let modalTitle;
let modalBody;
let modalUser;

document.addEventListener('DOMContentLoaded', init);

function init() {
  postsGrid   = document.getElementById('postsGrid');
  searchInput = document.getElementById('searchInput');
  counter     = document.getElementById('counter');
  loader      = document.getElementById('loader');
  errorMsg    = document.getElementById('errorMsg');
  modal       = document.getElementById('modal');
  modalClose  = document.getElementById('modalClose');
  modalTitle  = document.getElementById('modalTitle');
  modalBody   = document.getElementById('modalBody');
  modalUser   = document.getElementById('modalUser');

  if (!postsGrid || !searchInput || !counter || !loader || !errorMsg || !modal || !modalClose || !modalTitle || !modalBody || !modalUser) {
    console.error('No se encontraron uno o más elementos del DOM necesarios.');
    return;
  }

  modal.classList.add('hidden');
  loader.classList.remove('hidden');
  errorMsg.classList.add('hidden');

  searchInput.addEventListener('input', onSearchInput);
  modalClose.addEventListener('click', cerrarModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) cerrarModal();
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') cerrarModal();
  });

  cargarPosts();
}

async function cargarPosts() {
  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts     = await respuesta.json();

    if (!Array.isArray(posts)) {
      throw new Error('Respuesta inesperada: no se recibió un array de posts.');
    }

    todosLosPosts = posts;
    loader.classList.add('hidden');
    mostrarPosts(posts);
  } catch (error) {
    loader.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    console.error('Error al obtener posts:', error);
  }
}

function mostrarPosts(posts) {
  postsGrid.innerHTML = '';
  counter.textContent = `${posts.length} publicaciones`;

  if (posts.length === 0) {
    postsGrid.innerHTML = '<p class="empty">No se encontraron publicaciones.</p>';
    return;
  }

  posts.forEach(function(post) {
    const card = crearTarjeta(post);
    postsGrid.appendChild(card);
  });
}

function crearTarjeta(post) {
  const card = document.createElement('article');
  card.className = 'card';

  card.innerHTML = `
    <span class="card__badge">Usuario #${post.userId}</span>
    <h2 class="card__title">${post.title}</h2>
    <p class="card__body">${post.body}</p>
    <span class="card__footer">Post #${post.id}</span>
  `;

  card.addEventListener('click', function() {
    abrirModal(post);
  });

  return card;
}

function onSearchInput() {
  const texto = searchInput.value.toLowerCase().trim();
  const filtrados = todosLosPosts.filter(function(post) {
    return post.title.toLowerCase().includes(texto) || post.body.toLowerCase().includes(texto);
  });

  mostrarPosts(filtrados);
}

function abrirModal(post) {
  modalTitle.textContent = post.title;
  modalBody.textContent  = post.body;
  modalUser.textContent  = `Publicado por usuario #${post.userId} · Post #${post.id}`;
  modal.classList.remove('hidden');
}

function cerrarModal() {
  if (modal) {
    modal.classList.add('hidden');
  }
}
