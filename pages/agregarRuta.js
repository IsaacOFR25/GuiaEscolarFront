import React from "react";
import axios from "axios";
import Link from "next/link";
import { AiOutlineArrowLeft, AiFillEnvironment } from "react-icons/ai";
import { TextField, Select, MenuItem, Button } from "@mui/material";

const urlApi = process.env.NEXT_PUBLIC_API_URL;

export default function agregarTarjeta() {
  const [identificador, setIdentificador] = React.useState("");
  const [modelo, setModelo] = React.useState("ESP32");
  const [puntosLista, setPuntosLista] = React.useState([]);

  const handleChange = (e) => {
    setModelo(e.target.value);
  };

  React.useEffect(() => {
    axios
      .get(urlApi + "/admin/tarjetas")
      .then((res) => {
        // Si no hay tarjetas en la base de datos, asignarle el id 1
        if (res.data.length === 0) {
          setIdentificador(1);
        } else {
          // Obtener el id de la última tarjeta y sumarle uno
          const id = parseInt(res.data[res.data.length - 1].id, 10) + 1;
          setIdentificador(id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar que puntosLista no esté vacío
    if (puntosLista.length === 0) {
      alert("Debes agregar al menos un punto a la lista.");
      return; // Detener el envío del formulario
    }

    // Resto del código para enviar el formulario
    const identificador = e.target.identificador.value;
    const nombre = e.target.nombre.value;
    const modeloAgg = modelo;
    const descripcion = e.target.descripcion.value;
    const fecha = e.target.fecha.value;
    const estado = "0";
    const latitud = e.target.latitud.value;
    const longitud = e.target.longitud.value;
    const descripcionUbicacion = e.target.descripcionUbicacion.value;
    const codigoCpp = "TODO agregar codigo cpp";

    const nuevaTarjeta = {
      id: identificador,
      propiedades: {
        nombre: nombre,
        modelo: modeloAgg,
        decripcion: descripcion,
        fecha: fecha,
        estado: estado,
        ubicacion: {
          latitud: latitud,
          longitud: longitud,
          descripcion: descripcionUbicacion,
        },
        codigo: codigoCpp,
      },
    };

    axios
      .post(urlApi + "/admin/tarjetas/agregar", nuevaTarjeta)
      .then((res) => {
        console.log(res);
        //Si recibe un 200 de la api, redirecciona a la pagina de gestor de rutas y tarjetas
        if (res.status === 200) {
          window.location.href = "/gestorRutasTarjetas";
        }
      })
      .catch((err) => {
        console.log(err);
        //Si recibe un error de la api, muestra un mensaje de error en un alert
        alert("Error al agregar tarjeta " + err);
      });
  };

  return (
    <div>
      <div
        className="header"
        style={{
          padding: "0 20px",
          width: "100vw",
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#00B399",
          color: "#fff",
        }}
      >
        <Link href="/gestorRutasTarjetas">
          <div>
            <AiOutlineArrowLeft
              style={{ width: "40px", height: "30px", paddingRight: "10px" }}
            />
          </div>
        </Link>
        <h3>Agregar Tarjeta</h3>
        <div
          style={{ width: "30px", height: "30px", paddingLefth: "10px" }}
        ></div>
      </div>
      <p style={{ margin: "10px 0 0 0", padding: "10px" }}>
        En este apartado podrás agregar nuevas tarjetas a tu guía escolar.
        Asegúrate de flashear la tarjeta que vas a agregar con el identificador
        indicado aquí.
      </p>
      <div style={{ width: "100vw", padding: "30px 10px" }}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            id="identificador"
            name="identificador"
            label="Identificador"
            variant="outlined"
            value={identificador}
            type="number"
            style={{ marginBottom: "20px" }}
          />

          <TextField
            id="nombre"
            name="nombre"
            label="Nombre de la Ubicación"
            variant="outlined"
            type="text"
          />
          <p
            style={{
              margin: "0",
              marginBottom: "20px",
              padding: "0 10px",
              color: "#22222",
            }}
          >
            Ejemplo: Edificio A, Explanada, Cafetería
          </p>

          <Select
            labelId="modelo"
            id="modelo"
            value={modelo}
            label="Modelo"
            onChange={handleChange}
            style={{ marginBottom: "20px" }}
          >
            <MenuItem value="ESP32">ESP32</MenuItem>
            <MenuItem value="nodeMCU">nodeMCU</MenuItem>
          </Select>

          <TextField
            id="descripcion"
            name="descripcion"
            label="Descripción de la tarjeta"
            variant="outlined"
            type="text"
            style={{ marginBottom: "20px" }}
          />

          <TextField
            id="descripcionUbicacion"
            name="descripcionUbicacion"
            label="Descripción de la ubicación de la tarjeta"
            variant="outlined"
            type="text"
            style={{ marginBottom: "20px" }}
          />

          <label htmlFor="fecha">Fecha de registro</label>
          <input
            type="date"
            name="fecha"
            id="fecha"
            value={new Date().toISOString().slice(0, 10)}
            readOnly
            style={{ padding: "10px", margin: "0 5px 20px" }}
          />

          <Button
            variant="outlined"
            startIcon={<AiFillEnvironment />}
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  document.getElementById("latitud").value =
                    position.coords.latitude;
                  document.getElementById("longitud").value =
                    position.coords.longitude;
                });
              } else {
                alert("Geolocation is not supported by this browser.");
              }
            }}
            style={{ marginBottom: "20px" }}
          >
            Obtener ubicación actual
          </Button>
          <label htmlFor="latitud">Latitud</label>
          <input
            name ="latitud"
            id="latitud"
            style={{ padding: "10px", margin: "0 5px" }}
          />
          <label htmlFor="longitud">Longitud</label>
          <input
            name="longitud"
            id="longitud"
            style={{ padding: "10px", margin: "0 5px 20px" }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginBottom: "100px" }}
          >
            Agregar tarjeta
          </Button>
        </form>
      </div>
    </div>
  );
}

