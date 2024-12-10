import styles from "../css/login.module.css";
import img from "../assets/logo.png";
import { useState } from "react";
import { Empleado } from "../types/Empleado";
import AuthService from "../services/AuthService";

interface LoginProps {
  onLoginSuccess: (empleado: Empleado) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ver, setVer] = useState(false);

  const verPassword = () => {
    setVer((prevState) => !prevState); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

      try {
        const empleado = await AuthService.login(username, password);
        if (empleado) {
          onLoginSuccess(empleado);
        }
      } catch (error) {
        console.error('Error en la autenticación:', error); 
        const mensaje = document.getElementById("error");
        if (mensaje) {
          mensaje.style.display = "block"; 
        }
      } finally {
        setIsLoading(false); 
      }
  };

  return (
    <div className={styles.login__container}>
      <form onSubmit={handleSubmit} className={styles.container} id="loginForm">
        <div className={styles.img__container}>
          <img src={img} alt="Logo" />
        </div>
        <div className={styles.form__container}>
          <h1>Iniciar Sesion</h1>

          <span className={styles.error} id="error">Credenciales incorrectas</span>
          
          <label htmlFor="empleado">Nombre de usuario:</label>
          <div className={styles.input}>
            <input
              type="text"
              name="empleado"
              id="empleado"
              value={username}
              placeholder="Empleado"
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input__field}
            />
            <i className={`bi bi-person ${styles.icono}`}></i>
          </div>

          <label htmlFor="password">Contraseña:</label>
          <div className={styles.input}>
            <input
              type={ver ? "text" : "password"} 
              name="password"
              value={password}
              id="password"
              placeholder="Contraseña"
              className={styles.input__field}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className={`bi bi-key ${styles.icono}`}></i>
          </div>

          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="ver"
              id="ver"
              checked={ver} 
              onChange={verPassword} 
            />
            <label htmlFor="ver">Ver contraseña</label>
          </div>

          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Iniciar Sesion"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
