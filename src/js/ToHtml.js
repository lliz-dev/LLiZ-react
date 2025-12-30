function toHtml(text){
    const htmlString = text;
    const container = document.createElement('div');
    container.innerHTML = htmlString;

// Now `container` contains the parsed HTML
    return container;  // Output: <div><p>Hello, world!</p></div>

}

export default toHtml;