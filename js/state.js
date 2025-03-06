const state = {
    isEditing: false,
    id: "",

    getIsEditing() {
        return this.isEditing
    },

    setIsEditing(boolean) {
        this.isEditing = boolean
    },

    getID() {
        return this.id
    },

    setID(id) {
        this.id = id
    },

    reset() {
        this.id = ""
        this.isEditing = false
    }
}

export default state