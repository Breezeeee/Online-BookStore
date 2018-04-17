
let BookData = [
    {Book: "The Lord of the Rings", Author: "J. R. R. Tolkien", Language: "English", Published: "1954-1955", Price: 9999, Sales: 150, Left: 20, ID: "0001"},
    {Book: "Le Petit Prince (The Little Prince)", Author: "Antoine de Saint-Exupéry", Language: "French", Published: "1943", Price: 13000, Sales: 140, Left: 30, ID: "0002"},
    {Book: "Harry Potter and the Philosopher's Stone", Author: "J. K. Rowling", Language: "English", Published: "1997", Price: 6000, Sales: 107, Left: 23, ID: "0003"},
    {Book: "And Then There Were None", Author: "Agatha Christie", Language: "English", Published: "1939", Price: 5000, Sales: 100, Left: 33, ID: "0004"},
    {Book: "Dream of the Red Chamber", Author: "Cao Xueqin", Language: "Chinese", Published: "1754-1791", Price: 12000, Sales: 100, Left: 35, ID: "0005"},
    {Book: "The Hobbit", Author: "J. R. R. Tolkien", Language: "English", Published: "1937", Price: 3000, Sales: 10, Left: 18,  ID: "0006"},
    {Book: "She: A History of Adventure", Author: "H. Rider Haggard", Language: "English", Published: "1887", Price: 9888, Sales: 50, Left: 6, ID: "0007"},
];

let Sell = function(BookID, num){
    BookData.forEach((book) => {
        if(book.ID === BookID) {
            book.Sales += num;
        }
    })
};

export {BookData, Sell};