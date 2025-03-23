const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const mongoose  = require('mongoose');
const User = require("./models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const CMC_API_KEY = process.env.CMC_API_KEY;
if (!CMC_API_KEY) {
    console.error("API ключ для CoinMarketCap відсутній. Перевірте файл .env.");
    process.exit(1);
}
mongoose
    .connect(process.env.MONGO_KEY)
    .then(() => console.log("Connect DB!😊"))
    .catch((err) => console.error("Failed connection to DB: ", err))

app.get('/', (req, res) => {
    res.json({ message: "Hello" });
});

app.get("/api/cryptos", async (req, res) => {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    try {
        const response = await axios.get(url, {
            headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
            params: { start: 1, limit: 100, convert: "USD" },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Помилка API:", error.message);
        res.status(500).json({ error: "Не вдалося отримати дані" });
    }
});

app.get("/api/cryptos/:id", async (req, res) => {
    const { id } = req.params;
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${id}`;

    try {
        const response = await axios.get(url, {
            headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
        });
        res.json(response.data);
    } catch (err) {
        console.error("Помилка API:", err.message);
        res.status(500).json({ error: "Не вдалося отримати дані" });
    }
});
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email і пароль обовʼязкові" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Такий користувач уже існує" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Реєстрація успішна" });
    } catch (err) {
        console.error("Помилка реєстрації:", err);
        res.status(500).json({ message: "Помилка сервера" });
    }
});
app.post("/login", async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email і пароль обовʼязкові" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Користувача не знайдено" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Неправильний пароль" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Вхід успішний" });

    } catch (err) {
        console.error("Помилка входу:", err);
        res.status(500).json({ message: "Помилка сервера" });
    }
});


const PORT = process.env.PORT || 5200;
app.listen(PORT, () => {
    console.log(`Server is running on port 5200`);
});