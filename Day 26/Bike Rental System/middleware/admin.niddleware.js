const jwt = require('jsonwebtoken');

module.exports =(models) => async (req, res, next) => {
    const {User,Session} = models;
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userId, sessionId, role} = decoded;

        if(role === 'customer' || role === 'agent'){

            return res.status(400).json({ message: 'Unauthorized' });
        }

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        const adminSession = await Session.findOne({_id : sessionId});

        if(!adminSession || adminSession.userId.toString() !== userId || adminSession.activeStatus === false){ 
            return res.status(400).json({ message: 'Session not found or Invalid token' }); 
        }

        const now = new Date();
        const diffInHours = (now - adminSession.lastActive) / (1000 * 60 * 60);
        if (diffInHours > 24) {
          adminSession.activeStatus = false;
          await adminSession.save();
          return res.status(400).json({ message: "Session expired due to inactivity" });
        }
        await adminSession.save();
    
        req.user = decoded; 
        next();


    }catch(e){
        return res.status(400).json({ message: e.message });

    }
}