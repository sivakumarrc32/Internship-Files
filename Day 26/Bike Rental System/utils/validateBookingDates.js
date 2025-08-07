


module.exports = (models) => {
  const { Booking } = models;
  
  const validateBooking = async (pickupDate, dropDate, pickupTime, dropTime) => {
    console.log("Validating booking dates...");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      const pickup = new Date(pickupDate);
      const drop = new Date(dropDate);
    
      if (pickup < today) {
        return { valid: false, message: "Pickup date cannot be in the past" };
      }
    
      if (drop < today) {
        return { valid: false, message: "Drop date cannot be in the past" };
      }
    
      if (pickup > drop) {
        return { valid: false, message: "Drop date cannot be before pickup date" };
      }
    
    
      const pickupDateTime = parse12HourTime(pickupDate, pickupTime);
      const now = new Date();
  
      if (isNaN(pickupDateTime.getTime())) {
        return { valid: false, message: "Invalid pickup time format" };
      }
      if (pickupDateTime <= now) {
        return { valid: false, message: "Pickup time must be in the future" };
      }

      const dropDateTime = parse12HourTime(dropDate, dropTime);
      if (isNaN(dropDateTime.getTime())) {
        return { valid: false, message: "Invalid drop time format" };
      }
      if (dropDateTime <= now) {
        return { valid: false, message: "Drop time must be in the future" };
      }
    
      return { valid: true };
    };
    function parse12HourTime(pickupDate, pickupTime) {
      console.log("Parsing 12-hour time...");
      console.log("Pickup Date:", pickupDate);
      console.log("Pickup Time:", pickupTime);
      const [time, modifier] = pickupTime.trim().split(" ");
      let [hours, minutes] = time.split(":").map(Number);
    
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
    
      // Split date string to get year, month, day (to avoid timezone issues)
      const [year, month, day] = pickupDate.split("-").map(Number); // e.g. "2025-07-31"
    
      const date = new Date(year, month - 1, day, hours, minutes, 0); // Local time
      return date;
    }
    
  
  const checkAvailability = async (pickupDate, dropDate, bikeModel, bikeBrand) => {
    const newPickupDate = new Date(pickupDate);
    const newDropDate = new Date(dropDate);
  
  
    const existingBookings= await Booking.find({ bikeModel,bikeBrand });
    for (let booking of existingBookings){
  
      const existingPickupDate = new Date(booking.pickupDate);
      const existingDropDate = new Date(booking.returnDate);
  
      const isOverlap = (newPickupDate <= existingDropDate) && (newDropDate >= existingPickupDate);
      if (isOverlap) {
        return false; // Not available
      }
    }
  
    return true;
  }
  
  return {
    validateBooking,
    checkAvailability
  }
}




