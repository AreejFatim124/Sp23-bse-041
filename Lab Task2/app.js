document.addEventListener('DOMContentLoaded', () => {
  const postList = document.getElementById('postList');
  const postForm = document.getElementById('postForm');
  const titleInput = document.getElementById('title');
  const bodyInput = document.getElementById('body');

  const API_URL = 'https://jsonplaceholder.typicode.com/posts';

  // Function to fetch and display posts (READ)
  function fetchPosts() {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        postList.innerHTML = ''; // Clear the current list
        data.slice(0, 5).forEach(post => {
          const postDiv = document.createElement('div');
          postDiv.classList.add('post');
          postDiv.id = `post-${post.id}`;
          postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
            <button onclick="deletePost(${post.id})">Delete</button>
          `;
          postList.appendChild(postDiv);
        });
      });
  }

  // Function to create a new post (CREATE)
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPost = {
      title: titleInput.value,
      body: bodyInput.value,
      userId: 1,
    };

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(post => {
        // Immediately display the new post on the page
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.id = `post-${post.id}`;
        postDiv.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.body}</p>
          <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
          <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postList.prepend(postDiv);  // Add new post to the top of the list
        alert('Post created!');
        postForm.reset(); // Clear the form fields
      });
  });

  // Function to delete a post (DELETE)
  window.deletePost = function(id) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          // Remove the post from the DOM after deletion
          const postDiv = document.getElementById(`post-${id}`);
          postDiv.remove();
          alert('Post deleted!');
        } else {
          alert('Error deleting the post');
        }
      });
  };

  // Function to edit a post (UPDATE)
  window.editPost = function(id) {
    const postToEdit = prompt("Edit post title:");
    const bodyToEdit = prompt("Edit post body:");

    const updatedPost = {
      title: postToEdit,
      body: bodyToEdit,
      userId: 1
    };

    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPost)
    })
      .then(response => response.json())
      .then(updatedPost => {
        // Update the post's content on the page
        const postDiv = document.getElementById(`post-${id}`);
        postDiv.querySelector('h3').textContent = updatedPost.title;
        postDiv.querySelector('p').textContent = updatedPost.body;
        alert('Post updated!');
      });
  };

  // Initial fetch to load posts when the page loads
  fetchPosts();
});
