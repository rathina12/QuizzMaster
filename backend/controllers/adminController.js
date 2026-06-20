const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalQuizzes, totalAttempts, results, quizzes] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Quiz.countDocuments(),
      Result.countDocuments(),
      Result.find().select('percentage score totalMarks submittedAt quizId'),
      Quiz.find().select('title attemptCount category').sort({ attemptCount: -1 }).limit(5)
    ]);

    const avgScore = totalAttempts > 0
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalAttempts)
      : 0;

    // Category distribution
    const categoryData = await Quiz.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Attempts over last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyAttempts = await Result.aggregate([
      { $match: { submittedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$percentage' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Score distribution
    const scoreDistribution = [
      { range: '0-20%', count: results.filter(r => r.percentage <= 20).length },
      { range: '21-40%', count: results.filter(r => r.percentage > 20 && r.percentage <= 40).length },
      { range: '41-60%', count: results.filter(r => r.percentage > 40 && r.percentage <= 60).length },
      { range: '61-80%', count: results.filter(r => r.percentage > 60 && r.percentage <= 80).length },
      { range: '81-100%', count: results.filter(r => r.percentage > 80).length }
    ];

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalQuizzes,
        totalAttempts,
        avgScore,
        topQuizzes: quizzes,
        categoryData,
        dailyAttempts,
        scoreDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-password');

    // Add attempt count for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const attempts = await Result.countDocuments({ userId: user._id });
      const results = await Result.find({ userId: user._id }).select('percentage');
      const avgScore = results.length > 0
        ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
        : 0;
      return { ...user.toObject(), attempts, avgScore };
    }));

    res.json({
      success: true,
      users: usersWithStats,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
