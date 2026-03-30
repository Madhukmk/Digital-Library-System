const mockBooks = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        downloads: 120,
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf",
    },
    {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        category: "Technology",
        downloads: 85,
        cover: "https://eloquentjavascript.net/img/cover.jpg",
        pdfUrl: "https://eloquentjavascript.net/Eloquent_JavaScript.pdf",
    },
    {
        title: "1984",
        author: "George Orwell",
        category: "Dystopian",
        downloads: 150,
        cover: "https://images.unsplash.com/photo-1531901599143-df5010ab9438?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://www.planetebook.com/free-ebooks/1984.pdf",
    },
    {
        title: "Pro Git",
        author: "Scott Chacon",
        category: "Technology",
        downloads: 95,
        cover: "https://git-scm.com/images/progit2.png",
        pdfUrl: "https://github.com/progit/progit2/releases/download/2.1.428/progit.pdf",
    },
    {
        title: "Alice's Adventures in Wonderland",
        author: "Lewis Carroll",
        category: "Adventure",
        downloads: 300,
        cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://www.planetebook.com/free-ebooks/alices-adventures-in-wonderland.pdf",
    },
    {
        title: "SICP",
        author: "Harold Abelson",
        category: "Technology",
        downloads: 110,
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://web.mit.edu/6.001/6.037/sicp.pdf",
    },
    {
        title: "A Tale of Two Cities",
        author: "Charles Dickens",
        category: "Classic",
        downloads: 180,
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://www.planetebook.com/free-ebooks/a-tale-of-two-cities.pdf",
    },
    {
        title: "JavaScript Design Patterns",
        author: "Addy Osmani",
        category: "Technology",
        downloads: 130,
        cover: "https://addyosmani.com/resources/essentialjsdesignpatterns/cover/cover.jpg",
        pdfUrl: "https://addyosmani.com/resources/essentialjsdesignpatterns/book/",
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        downloads: 250,
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://www.planetebook.com/free-ebooks/pride-and-prejudice.pdf",
    },
];

const mockUsers = [
    { name: "John Doe", email: "john@example.com", password: "12345", role: "user" },
    { name: "Jane Smith", email: "jane@example.com", password: "12345", role: "admin" },
    { name: "Alice Johnson", email: "alice@example.com", password: "12345", role: "user" },
];

export { mockBooks, mockUsers };
