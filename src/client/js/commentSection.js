const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;

    const commentIcon = document.createElement("i");
    commentIcon.className = "fas fa-comment";

    const span = document.createElement("span");
    span.innerText = ` ${text} `;

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-can";

    newComment.appendChild(commentIcon);
    newComment.appendChild(span);
    newComment.appendChild(deleteIcon);

    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;

    if (text.trim() === "") {
        return;
    }

    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });

    if (response.status === 201) {
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
    textarea.value = "";
};

const handleDeleteComment = async (event) => {
    const videoComments = document.querySelector(".video__comments ul");
    const { target } = event;
    if (target.className !== "fas fa-trash-can") {
        return;
    }

    const comment = target.parentElement;
    const { id } = comment.dataset;

    const response = await fetch(`/api/comments/${id}/delete`, {
        method: "DELETE",
    });

    if (response.status === 200) {
        videoComments.removeChild(comment);
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}
document.addEventListener("click", handleDeleteComment);
