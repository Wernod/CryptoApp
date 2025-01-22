import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();  // Хук для програмного перенаправлення

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post("http://localhost:5200/login", formData);

            localStorage.setItem("token", response.data.token);

            setSuccess("Ви успішно увійшли до облікового запису");
            setFormData({ email: "", password: "" });

            setTimeout(() => {
                navigate("/review");  
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Помилка входу");
        }
    };

    return (
        <>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Увійдіть у свій обліковий запис</h1>
                        <p className="py-6">
                            Поверніться до торгівлі криптовалютами за кілька секунд. Ваші дані під надійним захистом, а
                            можливості чекають на вас.
                        </p>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Введіть ваш email"
                                    className="input input-bordered"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Пароль</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Введіть пароль"
                                    className="input input-bordered"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <p className="mt-2">
                                    Ще не маєте акаунта?
                                    <a className="link link-primary" href="/register">
                                        {" "}
                                        Зареєструватися
                                    </a>
                                </p>
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">Увійти</button>
                            </div>
                        </form>
                        {success && <p className="text-green-500 mt-4">{success}</p>}
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
