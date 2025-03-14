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

const formatDate = (dateString) => {
    console.log(dateString)
    if (dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }

    return ""

}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export { uid, debounce, formatDate, capitalize }