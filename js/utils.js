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
    if (dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC"
        })
    }

    return ""

}

const dateToUTC = (dateString) => new Date(dateString).toISOString()

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

const contentValidation = (content) => {
    const regex = /^(?=(.*[A-Za-z]){10,}).+$/
    return regex.test(content)

}

const autorValidation = (autor) => {
    const regex = /^[A-Z][a-zA-Z]{1,14}$/
    return regex.test(autor)
}

export { uid, debounce, formatDate, capitalize, dateToUTC, contentValidation, autorValidation }