const uid = () => // generate unique id
    String(
        Date.now().toString(32) +
        Math.random().toString(16)
    ).replace(/\./g, '')

function debounce(func, delay) { // avoid multiple requests to api
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}


export { uid, debounce }