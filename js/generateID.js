const uid = () =>
    String(
        Date.now().toString(32) +
        Math.random().toString(16)
    ).replace(/\./g, '')

// generate unique id

export default uid