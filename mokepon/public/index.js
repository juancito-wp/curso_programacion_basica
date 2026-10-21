const express = require("express")
const path = require("path")

const app = express()

app.use(express.static(__dirname))
app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "mokepon.html"))
})

const jugadores = []

class Jugador {
  constructor(id) {
    this.id = id
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon
  }

  actualizarPosicion(x, y) {
    this.x = x
    this.y = y
  }

  asignarAtaques(ataques) {
    this.ataques = ataques
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre
  }
}

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`

  const jugador = new Jugador(id)

  jugadores.push(jugador)

  res.setHeader("Access-Control-Allow-Origin", "*")

  res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const nombre = req.body.mokepon || ""
  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex < 0) {
    return res.sendStatus(404)
  }

  const mokepon = new Mokepon(nombre)

  jugadores[jugadorIndex].asignarMokepon(mokepon)

  res.sendStatus(204)
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const x = Number(req.body.x)
  const y = Number(req.body.y)

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex < 0) {
    return res.sendStatus(404)
  }

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return res.status(400).send("La posición debe contener coordenadas válidas.")
  }

  jugadores[jugadorIndex].actualizarPosicion(x, y)

  const enemigos = jugadores.filter((jugador) =>
    jugadorId !== jugador.id &&
    jugador.mokepon &&
    Number.isFinite(jugador.x) &&
    Number.isFinite(jugador.y)
  )

  res.send({
    enemigos
  })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const ataques = req.body.ataques || []

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex < 0) {
    return res.sendStatus(404)
  }

  jugadores[jugadorIndex].asignarAtaques(ataques)

  res.sendStatus(204)
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId)

  if (!jugador) {
    return res.sendStatus(404)
  }

  res.send({
    ataques: jugador.ataques || []
  })
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`)
})