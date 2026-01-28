const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(String(userId));

    // 1. Total Income (Aggregation)
    const totalIncomePromise = Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 2. Total Expense (Aggregation)
    const totalExpensePromise = Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 3. Income last 60 days
    const last60DaysIncomePromise = Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 }).lean();

    // 4. Expense last 30 days
    const last30DaysExpensePromise = Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 }).lean();

    // 5. Recent 5 Incomes
    const last5IncomePromise = Income.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // 6. Recent 5 Expenses
    const last5ExpensesPromise = Expense.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Execute parallelly
    const [
      totalIncomeResult,
      totalExpenseResult,
      last60DaysIncomeTransactions,
      last30DaysExpenseTransactions,
      last5Income,
      last5Expenses
    ] = await Promise.all([
      totalIncomePromise,
      totalExpensePromise,
      last60DaysIncomePromise,
      last30DaysExpensePromise,
      last5IncomePromise,
      last5ExpensesPromise
    ]);

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const lastTransactions = [
      ...last5Income.map((txn) => ({ ...txn, type: "income" })),
      ...last5Expenses.map((txn) => ({ ...txn, type: "expense" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      totalBalance:
        (totalIncomeResult[0]?.total || 0) - (totalExpenseResult[0]?.total || 0),
      totalIncome: totalIncomeResult[0]?.total || 0,
      totalExpenses: totalExpenseResult[0]?.total || 0,

      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },

      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },

      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
