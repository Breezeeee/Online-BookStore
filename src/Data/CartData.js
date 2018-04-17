let CartData = [
    {Book: "The Lord of the Rings", Author: "J. R. R. Tolkien", Price: 9999, ID: "0001", Left: 20, num: 0},
    {Book: "Le Petit Prince (The Little Prince)", Author: "Antoine de Saint-Exupéry", Price: 13000, ID: "0002", Left: 30, num: 0},
    {Book: "Harry Potter and the Philosopher's Stone", Author: "J. K. Rowling", Price: 6000, ID: "0003", Left: 23, num: 0},
    {Book: "And Then There Were None", Author: "Agatha Christie", Price: 5000, ID: "0004", Left: 33, num: 0},
    {Book: "Dream of the Red Chamber", Author: "Cao Xueqin", Price: 12000, ID: "0005", Left: 35, num: 0},
    {Book: "The Hobbit", Author: "J. R. R. Tolkien", Price: 3000,  ID: "0006", Left: 18, num: 0},
    {Book: "She: A History of Adventure", Author: "H. Rider Haggard", Price: 9888, ID: "0007", Left: 6, num: 0},
];

let Want = function(BookID, num){
    CartData.forEach((book) => {
        if(book.ID === BookID) {
            book.num += num;
            if(book.num > book.Left)
                book.num = book.Left;
        }
    })
};

export {CartData, Want};