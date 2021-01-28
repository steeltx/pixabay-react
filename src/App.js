import { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

    // state de la app
    const [busqueda, guardarBusqueda] = useState('');
    const [imagenes, guardarImagenes] = useState([]);
    const [paginaactual, guardarPaginaActual] = useState(1);
    const [totalpaginas, guardarTotalPaginas] = useState(1);

    useEffect(() => {
        // al cargar por primera vez evitar la ejecucion, ya que viene vacio
        if (busqueda === '') return;

        const consultarAPI = async () => {
            const imagenesPorPagina = 30;
            const key = "";
            const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page${imagenesPorPagina}&page=${paginaactual}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            guardarImagenes(resultado.hits);

            // calcular el total de paginas
            const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
            guardarTotalPaginas(calcularTotalPaginas);

            // mover pantalla hacia arriba
            const jumbotron = document.querySelector('.jumbotron');
            jumbotron.scrollIntoView({ behavior: 'smooth' });
        }
        consultarAPI();
    }, [busqueda, paginaactual]);

    useEffect(() => {
        // cuando ocurra una nueva busqueda, regresar la pagina actual a 1
        guardarPaginaActual(1);
    }, [busqueda]);

    // definir la pagina anterior
    const paginaAnterior = () => {
        const nuevaPaginaActual = paginaactual - 1;
        // evitar retroceder a negativos
        if (nuevaPaginaActual === 0) return;
        guardarPaginaActual(nuevaPaginaActual);
    }

    // definir la pagina siguiente
    const paginaSiguiente = () => {
        const nuevaPaginaActual = paginaactual + 1;
        // evitar avanzar mas de las paginas totales
        if (nuevaPaginaActual > totalpaginas) return;
        guardarPaginaActual(nuevaPaginaActual);
    }

    return (
        <div className="container">
            <div className="jumbotron">
                <p className="lead text-center">Buscador de Imágenes <small>(steeltx)</small></p>
                <Formulario
                    guardarBusqueda={guardarBusqueda}
                />
            </div>
            <div className="row justify-content-center">
                <ListadoImagenes
                    imagenes={imagenes}
                />
                {
                    (paginaactual === 1) ? null :
                        <button
                            type="button"
                            className="btn btn-info mr-1"
                            onClick={paginaAnterior}
                        >&laquo; Anterior </button>
                }
                {
                    (totalpaginas === paginaactual) ? null :
                        <button
                            type="button"
                            className="btn btn-info"
                            onClick={paginaSiguiente}
                        >Siguiente &raquo;</button>
                }
            </div>
        </div>
    );
}

export default App;
