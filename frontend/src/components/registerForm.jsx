import {useState} from "react";
import axios from "axios";

function registerForm () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [err,setErr] = useState(null)
    const [success,setSuccess] = useState(null)

    const changeSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        setSuccess(null);

        // Перевірка збігу паролів
        if (password !== confirmPassword) {
            setErr("Паролі не співпадають");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5200/register", {
                email,
                password,
            });
            setSuccess(response.data.message);
        } catch (error) {
            setErr(error.response?.data?.message || "Помилка сервера");
        }
    };
    return (
        <>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Створіть обліковий запис та почніть торгувати вже сьогодні!</h1>
                        <p className="py-6">
                            Приєднуйтесь до нашої платформи, щоб відкрити доступ до найкращих криптовалют, безпечних транзакцій та унікальних інвестиційних можливостей. Зробіть перший крок до фінансової свободи!
                        </p>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form className="card-body" onSubmit={changeSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="Введіть ваш email" className="input input-bordered"
                                     value={email} onChange={(e) => setEmail(e.target.value)}  required/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Пароль</span>
                                </label>
                                <input id='password' type="password" placeholder="Введіть пароль" className="input input-bordered"
                                    value={password} onChange={(e) => setPassword(e.target.value)}   required/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Повторіть пароль</span>
                                </label>
                                <input id='confirm_password' type="password" placeholder="Повторіть пароль"
                                       className="input input-bordered" onChange={(e) => setConfirmPassword(e.target.value)}  required/>
                                {confirmPassword && password !== confirmPassword && (
                                    <p style={{ color: "red" }}>Паролі не співпадають!</p>
                                )}
                                <p className='mt-2'>Маєте акаунт?<a className='link link-primary' href="/login"> Увійти</a></p>

                            </div>
                            {err && <p style={{ color: "red" }}>{err}</p>}
                            {success && <p style={{ color: "green" }}>{success}</p>}

                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Зареєструватися</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default registerForm;