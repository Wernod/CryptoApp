const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const mongoose  = require('mongoose')
const User = require("./models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
app.use(express.json())
require('dotenv').config();

app.use(cors());

const CMC_API_KEY = process.env.CMC_API_KEY;

if (!CMC_API_KEY) {
    console.error("API ключ для CoinMarketCap відсутній. Перевірте файл .env.");
    process.exit(1);
}



app.get('/', (req, res) => {
    res.json({ message: "Hello" });
});


app.get("/api/cryptos", async (req, res) => {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const params = {
        start: 1,
        limit: 100,
        convert: "USD",
    };

    try {
        const response = await axios.get(url, {
            headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
            params,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Помилка отримання даних з CoinMarketCap:", error.message);
        res.status(500).json({ error: "Не вдалося отримати дані з CoinMarketCap" });
    }
});

app.get("/api/cryptos/:id", async (req, res) => {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const params = {
        start: 1,
        limit: 100,
        convert: "USD",
    };

    try {
        const response = await axios.get(url, {
            headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
            params,
        });

        const { id } = req.params;
        const crypto = response.data.data.find((crypto) => crypto.id.toString() === id);

        if (!crypto) {
            return res.status(404).json({ message: "Cryptocurrency not found" });
        }
        res.json(crypto);
    } catch (err) {
        console.error("Помилка при отриманні API", err.message);
        res.status(500).json({ error: "Не вдалося отримати API" });
        console.log("Помилка при отриманні API", err.message);

    }
});
app.get("/", async (req, res) => {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const params = {
        start: 1,
        limit: 100,
        convert: "USD",
    };

    try {
        const response = await axios.get(url, {
            headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
            params,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Помилка отримання даних з CoinMarketCap:", error.message);
        res.status(500).json({ error: "Не вдалося отримати дані з CoinMarketCap" });
    }
});

app.post("/register", async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Email, Пароль обовʼязкові"})
    }

    try {
        const existinghUser = await User.findOne({email})
        if (existinghUser) {
            console.log("Такий користувач вже існує")
            return res.status(400).json({message: "Такий користувач уже існує"}, )
        }
        res.status(201).json({message: "Реєстрація успішна"})
        console.log("Реєстрація успішна")
    } catch (err) {
        console.error("Помилка реєстрації", err)
        res.status(500).json({message: "Помилка сервера"})
    }
})

app.post("/login", async (req,res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({message: "Пароль і Email є обовʼязковими"})
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({message: "Користувача не знайдено"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Неправильний пароль" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "2h"
        })

        res.status(201).json({message: "Вхід успішний", token})
    }catch (err) {
        console.error("Помилка входу", err)
        res.status(500).json({message: "Помилка сервера"})
    }

})

mongoose
    .connect(process.env.MONGO_KEY)
    .then(() => console.log("Connect DB!😊"))
    .catch((err) => console.error("Failed connection to DB: ", err))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port 5200`);
});
