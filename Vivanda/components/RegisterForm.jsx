import { useState } from "react";

export const RegisterForm = () => {
    const [formValue, setFormValue] = useState(
        {
            nombre: "",
            apellido: "",
            telefono: "",
            correo: "",
            password: "",
            repetir: ""
        }
        
    );
    const [errors, setErrors] = useState({})

    const handleChange = (e) =>{
        setFormValue({...formValue,[e.taget.name]:e.taget.formValue,})
    }
}