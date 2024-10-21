"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A8E0FF', '#FF637D', '#FFB14E'];

const fakeExpensesForSeeds = [
    { date: "2024-01-01", category: "Seeds", amount: 500 },
    { date: "2024-01-05", category: "Seeds", amount: 600 },
    { date: "2024-01-10", category: "Seeds", amount: 550 },
    { date: "2024-01-15", category: "Seeds", amount: 620 },
    { date: "2024-01-20", category: "Seeds", amount: 480 },
    { date: "2024-01-25", category: "Seeds", amount: 530 },
    { date: "2024-02-01", category: "Seeds", amount: 700 },
    { date: "2024-02-05", category: "Seeds", amount: 750 },
];

const fakeExpensesForFertilizers = [
    { date: "2024-01-02", category: "Fertilizers", amount: 300 },
    { date: "2024-01-08", category: "Fertilizers", amount: 320 },
    { date: "2024-01-14", category: "Fertilizers", amount: 350 },
    { date: "2024-01-20", category: "Fertilizers", amount: 310 },
    { date: "2024-01-26", category: "Fertilizers", amount: 330 },
    { date: "2024-02-02", category: "Fertilizers", amount: 400 },
    { date: "2024-02-08", category: "Fertilizers", amount: 380 },
    { date: "2024-02-14", category: "Fertilizers", amount: 360 },
];

const fakeExpensesForLabor = [
    { date: "2024-01-03", category: "Labor", amount: 1000 },
    { date: "2024-01-09", category: "Labor", amount: 1050 },
    { date: "2024-01-15", category: "Labor", amount: 1100 },
    { date: "2024-01-21", category: "Labor", amount: 1200 },
    { date: "2024-01-27", category: "Labor", amount: 1150 },
    { date: "2024-02-03", category: "Labor", amount: 1250 },
    { date: "2024-02-09", category: "Labor", amount: 1300 },
    { date: "2024-02-15", category: "Labor", amount: 1400 },
];

const fakeExpensesForIrrigation = [
    { date: "2024-01-04", category: "Irrigation", amount: 600 },
    { date: "2024-01-12", category: "Irrigation", amount: 650 },
    { date: "2024-01-18", category: "Irrigation", amount: 700 },
    { date: "2024-01-24", category: "Irrigation", amount: 620 },
    { date: "2024-01-30", category: "Irrigation", amount: 640 },
    { date: "2024-02-06", category: "Irrigation", amount: 680 },
    { date: "2024-02-12", category: "Irrigation", amount: 720 },
    { date: "2024-02-18", category: "Irrigation", amount: 750 },
];

const fakeExpensesForPesticides = [
    { date: "2024-01-05", category: "Pesticides", amount: 200 },
    { date: "2024-01-13", category: "Pesticides", amount: 210 },
    { date: "2024-01-19", category: "Pesticides", amount: 230 },
    { date: "2024-01-25", category: "Pesticides", amount: 220 },
    { date: "2024-02-01", category: "Pesticides", amount: 240 },
    { date: "2024-02-07", category: "Pesticides", amount: 250 },
    { date: "2024-02-13", category: "Pesticides", amount: 260 },
    { date: "2024-02-19", category: "Pesticides", amount: 270 },
];

const fakeExpensesForEquipment = [
    { date: "2024-01-06", category: "Equipment", amount: 1500 },
    { date: "2024-01-14", category: "Equipment", amount: 1600 },
    { date: "2024-01-20", category: "Equipment", amount: 1550 },
    { date: "2024-01-28", category: "Equipment", amount: 1700 },
    { date: "2024-02-04", category: "Equipment", amount: 1800 },
    { date: "2024-02-10", category: "Equipment", amount: 1750 },
    { date: "2024-02-16", category: "Equipment", amount: 1850 },
    { date: "2024-02-22", category: "Equipment", amount: 1900 },
];

const fakeExpensesForTransport = [
    { date: "2024-01-07", category: "Transport", amount: 400 },
    { date: "2024-01-15", category: "Transport", amount: 450 },
    { date: "2024-01-23", category: "Transport", amount: 420 },
    { date: "2024-01-29", category: "Transport", amount: 470 },
    { date: "2024-02-06", category: "Transport", amount: 480 },
    { date: "2024-02-12", category: "Transport", amount: 490 },
    { date: "2024-02-18", category: "Transport", amount: 500 },
    { date: "2024-02-24", category: "Transport", amount: 510 },
];

// Pie chart component
const ExpensePieChart = ({ data }) => {
    const categoryData = Object.values(
        data.reduce((acc, { category, amount }) => {
            acc[category] = acc[category] || { category, amount: 0 };
            acc[category].amount += amount;
            return acc;
        }, {})
    );

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Bar chart component
const ExpenseBarChart = ({ data }) => {
    return (
        <BarResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <BarTooltip />
                <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
        </BarResponsiveContainer>
    );
};

const insertCategoryExpenses = async (categoryExpenses) => {
    try {
        const expensesCollection = collection(db, "expenses");
        for (const expense of categoryExpenses) {
            await addDoc(expensesCollection, expense);
        }
        console.log(`Inserted ${categoryExpenses.length} expenses for ${categoryExpenses[0].category}`);
    } catch (error) {
        console.error("Error inserting expenses:", error);
    }
};

export default function FinancialTracking() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            try {
                const expensesSnapshot = await getDocs(query(collection(db, "expenses")));
                const fetchedExpenses = expensesSnapshot.docs.map(doc => doc.data());
                console.log("Fetched expenses:", fetchedExpenses);
                setExpenses(fetchedExpenses);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
            setLoading(false);
        };

        fetchExpenses();
    }, []);

    const insertAllExpenses = async () => {
        setLoading(true);
        await Promise.all([
            insertCategoryExpenses(fakeExpensesForSeeds),
            insertCategoryExpenses(fakeExpensesForFertilizers),
            insertCategoryExpenses(fakeExpensesForLabor),
            insertCategoryExpenses(fakeExpensesForIrrigation),
            insertCategoryExpenses(fakeExpensesForPesticides),
            insertCategoryExpenses(fakeExpensesForEquipment),
            insertCategoryExpenses(fakeExpensesForTransport),
        ]);
        location.reload();
    };

    const calculateTotalExpensesByCategory = (category) => {
        const total = expenses
            .filter((expense) => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0);
        console.log(`Total for ${category}:`, total);
        return total;
    };

    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Farm Financial Tracking</h1>

            <Button onClick={insertAllExpenses} className="my-4 bg-blue-500 text-white">
                Insert Fake Expenses Data
            </Button>

            {!loading && (
                <>
                    <Card className="my-4">
                        <CardHeader>
                            <CardTitle>Total Expenses by Category</CardTitle>
                            <CardDescription>Total expenses for each category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className=" grid grid-cols-3 gap-3">
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses for Seed</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Seeds")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Fertilizers")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses for Labor</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Labour")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses for Irrigation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Irrigation")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses for Pesticides</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Pesticides")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses Equipment</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Equipment")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Monthly Expenses fot Transport</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <p className="text-3xl font-bold">${calculateTotalExpensesByCategory("Transport")}</p>
                                            <p className="text-sm text-muted-foreground">Total expenses this month</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                            </ul>
                            <h3 className="text-lg font-semibold">Total Expenses: ${totalExpenses}</h3>
                        </CardContent>
                    </Card>

                    <Card className="my-4">
                        <CardHeader>
                            <CardTitle>Expense Distribution by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpensePieChart data={expenses} />
                        </CardContent>
                    </Card>

                    <Card className="my-4">
                        <CardHeader>
                            <CardTitle>Expenses Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpenseBarChart data={expenses} />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}