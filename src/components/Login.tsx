import styles from "../css/login.module.css"; // Importar como módulo CSS
import img from "../assets/logo.png";
import UsuariosService from "../services/UsuarioService";
import { Usuario } from "../types/Usuario";
import { useState } from "react";

interface LoginProps {
  onLoginSuccess: (user: Usuario) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ver, setVer] = useState(false); // Estado para controlar la visibilidad de la contraseña

  // Función para alternar la visibilidad de la contraseña
  const verPassword = () => {
    setVer((prevState) => !prevState); // Cambiar el valor de 'ver'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const user = await UsuariosService.login(nombre, password);
        if (user) {
          onLoginSuccess(user);
        }
      } catch (error) {
        const mensaje = document.getElementById("error");
        if (mensaje) {
          mensaje.style.display = "block"; // Mostrar el mensaje de error
        }
      } finally {
        setIsLoading(false); // Desactivar el estado de carga una vez terminada la validación
      }
    }, 1000); // Espera 2 segundos antes de hacer la validación
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
          
          <label htmlFor="user">Nombre de usuario:</label>
          <div className={styles.input}>
            <input
              type="text"
              name="user"
              id="user"
              value={nombre}
              placeholder="Usuario"
              onChange={(e) => setNombre(e.target.value)}
              required
              className={styles.input__field}
            />
            <i className={`bi bi-person ${styles.icono}`}></i>
          </div>

          <label htmlFor="password">Contraseña:</label>
          <div className={styles.input}>
            <input
              type={ver ? "text" : "password"} // Cambia el tipo según el estado 'ver'
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
              checked={ver} // Marca el checkbox si 'ver' es verdadero
              onChange={verPassword} // Llama a la función para alternar la visibilidad
            />
            <label htmlFor="ver">Ver contraseña</label>
          </div>

          {/* Mostrar el mensaje de "Cargando..." si está en proceso de carga */}
          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Iniciar Sesion"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
