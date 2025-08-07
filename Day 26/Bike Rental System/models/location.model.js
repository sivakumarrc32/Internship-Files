module.exports = (mongoose) => {
    const locationSchema = new mongoose.Schema({
        city : String,
        address : String,
        mapLink : String
    });

    const Location = mongoose.model('Location', locationSchema);
    return {
        Location
    }
}