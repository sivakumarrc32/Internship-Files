module.exports = (mongoose) => {
    const orderSchema = new mongoose.Schema({
      orderId: { type: String, required: true },
      planType: {
        type: String,
        enum: ['basic', 'pro'],
        required: true,
      }, 
      tempPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TempPost',
        required: true
      },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['CREATED', 'COMPLETED'],
        default: 'CREATED'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
  
    return mongoose.model('Order', orderSchema);
  };
  