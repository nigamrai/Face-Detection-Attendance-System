import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email.' });
        }
        console.log(user);
        // const isMatch = await user.comparePassword(password);
        // if (!isMatch) {
        //     return res.status(401).json({ message: 'Invalid credentials.' });
        // }
        if(user.password!==password){
            return res.status(401).json({ message: 'Invalid password.' });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );
        res.status(200).json({ token, user: { email: user.email, name: user.name, id: user._id,role:user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
