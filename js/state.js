const state = {
    isEditing: false,
    id: "",

    getIsEditing() {
        return this.isEditing
    },

    toggleIsEditing() {
        this.isEditing = !this.isEditing
    },

    getId() {
        return this.id
    },

    setId(id) {
        this.id = id
    }
}

export default state