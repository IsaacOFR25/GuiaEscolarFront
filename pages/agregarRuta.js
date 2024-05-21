import React from "react";
import axios from "axios";
import Link from "next/link";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
} from "react-icons/ai";
import { TextField, Button } from "@mui/material";

const urlApi = process.env.NEXT_PUBLIC_API_URL;

export default function agregarRuta() {
  const [identificador, setIdentificador] = React.useState("");
  const [numeroPuntos, setNumeroPuntos] = React.useState(0);
  const [puntosLista, setPuntosLista] = React.useState([]);

  const [tarjetas, setTarjetas] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(urlApi + "/admin/rutas")
      .then((res) => {
        if (res.data.length === 0) {
          setIdentificador(1);
        } else {
          const id = res.data[res.data.length - 1].id;
          const nuevoId = parseInt(id, 10) + 1;
          setIdentificador(nuevoId);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(urlApi + "/admin/tarjetas")
      .then((res) => {
        setTarjetas(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        <h3>Agregar Ruta</h3>
        <div
          style={{ width: "30px", height: "30px", paddingLefth: "10px" }}
        ></div>
      </div>
      <p style={{ margin: "10px 0 0 0", padding: "10px" }}>
        En este apartado podrás agregar nuevas tarjetas a tu guía escolar.
        Asegúrate de flashar la tarjeta que vas a agregar con el identificador
        indicado aquí.
      </p>
      <div style={{ width: "100vw", padding: "30px 10px" }}>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => {
            e.preventDefault();

            if (puntosLista.length === 0) {
              alert("Debes seleccionar al menos un punto de control para la ruta.");
              return;
            }

            const identificador = e.target.identificador.value;
            const nombre = e.target.nombre.value;
            const descripcion = e.target.descripcion.value;
            const fecha = new Date().toLocaleDateString();

            puntosLista[puntosLista.length - 1][1] = "FIN";

            const nuevaRuta = {
              id: identificador,
              propiedades: {
                nombre: nombre,
                descripcion: descripcion,
                fecha: fecha,
                numeroPuntos: numeroPuntos,
                puntosLista: puntosLista,
              },
            };

            axios
              .post(urlApi + "/admin/rutas/agregar", nuevaRuta)
              .then((res) => {
                console.log(res);
                window.location.href = "/gestorRutasTarjetas";
              })
              .catch((err) => {
                console.log(err);
              });
          }}
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
            label="Nombre o destino de la ruta"
            variant="outlined"
            type="text"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            id="descripcion"
            name="descripcion"
            label="Descripción de la ruta"
            variant="outlined"
            type="text"
            style={{ marginBottom: "20px" }}
          />

          <div>
            <h3>Lista de puntos de control</h3>
            <p>
              Selecciona en orden los puntos de control que tendrá tu ruta.{" "}
              <br />
              Ejemplo: Tarjeta 1 - Izquierda, Tarjeta 2 - Derecha....
              <br />
              Nota: El último punto que selecciones mostrará AR de Llegada al
              lugar
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {tarjetas &&
                tarjetas.map((tarjeta) => {
                  return (
                    <>
                      <div
                        style={{
                          margin: "0 0",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <p>{tarjeta.propiedades.nombre}</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          alignItems: "stretch",
                        }}
                      >
                        <Button
                          startIcon={<AiOutlineArrowLeft />}
                          variant="outlined"
                          key={tarjeta.id}
                          onClick={() => {
                            setPuntosLista([
                              ...puntosLista,
                              [tarjeta.id, "IZQ"],
                            ]);
                            setNumeroPuntos(numeroPuntos + 1);
                          }}
                          style={{ margin: "5px", width: "33%" }}
                        ></Button>
                        <Button
                          endIcon={<AiOutlineArrowUp />}
                          variant="outlined"
                          key={tarjeta.id + 100}
                          onClick={() => {
                            setPuntosLista([
                              ...puntosLista,
                              [tarjeta.id, "REC"],
                            ]);
                            setNumeroPuntos(numeroPuntos + 1);
                          }}
                          style={{ margin: "5px", width: "33%" }}
                        ></Button>
                        <Button
                          endIcon={<AiOutlineArrowRight />}
                          variant="outlined"
                          key={tarjeta.id + 100}
                          onClick={() => {
                            setPuntosLista([
                              ...puntosLista,
                              [tarjeta.id, "DER"],
                            ]);
                            setNumeroPuntos(numeroPuntos + 1);
                          }}
                          style={{ margin: "5px", width: "33%" }}
                        ></Button>
                      </div>
                    </>
                  );
                })}
              <button
                onClick={() => {
                  setPuntosLista(puntosLista.slice(0, -1));
                  setNumeroPuntos(numeroPuntos > 0 ? numeroPuntos - 1 : 0);
                }}
                type="button"
                style={{
                  boxShadow: "inset 0px 1px 0px 0px #f29c93",
                  background:
                    "linear-gradient(to bottom, #fe1a00 5%, #ce0100 100%)",
                  backgroundColor: "#fe1a00",
                  borderRadius: "6px",
                  border: "1px solid #d83526",
                  display: "inline-block",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "Arial",
                  fontSize: "15px",
                  fontWeight: "bold",
                  padding: "6px 24px",
                  textDecoration: "none",
                  textShadow: "0px 1px 0px #b23e35",
                }}
              >
                Eliminar último punto agregado
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "stretch",
            }}
          >
            <TextField
              id="numeroPuntos"
              name="numeroPuntos"
              label="#Puntos"
              variant="outlined"
              type="text"
              value={numeroPuntos}
              readOnlys
              style={{ margin: "20px 2px", width: "30%" }}
            />
            <TextField
              id="puntosLista"
              name="puntosLista"
              label="Puntos de la ruta"
              variant="outlined"
              type="text"
              value={puntosLista}
              readOnly
              style={{ margin: "20px 2px", width: "70%" }}
            />
          </div>
          <Button type="submit" variant="contained">
            Agregar ruta
          </Button>
        </form>
      </div>
    </div>
  );
}
