module.exports = {
    /**
     * Returns a random number between two numeric values.
     * @param {Number} min - The minimum possible value (inclusive).
     * @param {Number} max - The maximum possible value (exclusive).
     * @returns {Number}
     */
    random: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Returns a random date between two dates values.
     * @param {Date|Number} min - The minimum possible date (inclusive).
     * @param {Date|Number} max - The maximum possible date (exclusive).
     * @returns {Date}
     */
    randomDate: function(min, max) {
        min = new Date(min).getTime();
        max = new Date(max).getTime();
        return new Date(this.random(min, max));
    },

    /**
     * Converts a string to title-case (each word capitalized).
     * @param {String} str - The string to convert.
     * @returns {String}
     */
    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
};